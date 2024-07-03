package nz.govt.eop.hilltop_crawler.producer

import com.fasterxml.jackson.databind.ObjectMapper
import nz.govt.eop.hilltop_crawler.api.parsers.HilltopXmlParsers
import nz.govt.eop.hilltop_crawler.fetcher.*
import nz.govt.eop.hilltop_crawler.fetcher.HilltopMessageType.*
import org.apache.kafka.clients.admin.NewTopic
import org.apache.kafka.clients.producer.internals.BuiltInPartitioner
import org.apache.kafka.streams.KeyValue
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.kstream.Consumed
import org.apache.kafka.streams.kstream.Produced
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.context.annotation.Profile
import org.springframework.kafka.support.serializer.JsonSerde
import org.springframework.stereotype.Component

@Profile("!test")
@Component
class ObservationProducer(
    val parsers: HilltopXmlParsers,
    val objectMapper: ObjectMapper,
    @Qualifier("hilltopRawDataTopic") val rawDataTopic: NewTopic,
    @Qualifier("outputDataTopic") val outputDataTopic: NewTopic,
) {

  @Autowired
  fun buildPipeline(streamsBuilder: StreamsBuilder) {
    val messageStream =
        streamsBuilder.stream(
            rawDataTopic.name(),
            Consumed.with(
                JsonSerde(HilltopMessageKey::class.java, objectMapper),
                JsonSerde(HilltopMessage::class.java, objectMapper)))

    messageStream
        .flatMap { _, value ->
          when (value.type) {
            SITES_LIST -> {
              val parsedXml = parsers.parseSitesResponse(value.xml)

              val siteMessages =
                  parsedXml.sites.map {
                    val location =
                        if (it.easting != null && it.northing != null) {
                          Location(it.easting, it.northing)
                        } else {
                          null
                        }
                    val projection = parsedXml.projection
                    SiteDetailsMessage(value.councilId, it.name, location, projection)
                  }

              return@flatMap siteMessages.map { KeyValue.pair(it.toKey(), it) }
            }
            MEASUREMENT_DATA -> {
              val parsedXml = parsers.parseMeasurementValuesResponse(value.xml)

              val observations =
                  parsedXml.measurement!!.data.values.map { Observation(it.timestamp, it.value) }

              val message =
                  ObservationDataMessage(
                      value.councilId,
                      parsedXml.measurement.siteName,
                      parsedXml.measurement.dataSource.measurementName,
                      observations)
              return@flatMap listOf(
                  KeyValue.pair(message.toKey(), message),
              )
            }
            else -> {
              return@flatMap listOf()
            }
          }
        }
        .to(
            outputDataTopic.name(),
            Produced.with(
                JsonSerde<ObservationMessageKey>(objectMapper).noTypeInfo(),
                JsonSerde<ObservationMessage>(objectMapper).noTypeInfo()) { _, key, _, numPartitions
                  ->
                  BuiltInPartitioner.partitionForKey(
                      "${key.councilId}#${key.siteName}".toByteArray(), numPartitions)
                })
  }
}
