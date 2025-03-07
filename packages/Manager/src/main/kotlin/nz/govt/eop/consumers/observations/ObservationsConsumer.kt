package nz.govt.eop.consumers.observations

import mu.KotlinLogging
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.kstream.Consumed
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Profile
import org.springframework.dao.NonTransientDataAccessException
import org.springframework.kafka.annotation.EnableKafkaStreams
import org.springframework.kafka.support.serializer.JsonSerde
import org.springframework.stereotype.Component

@Profile("hilltop-consumer")
@EnableKafkaStreams
@Component
class ObservationsConsumer(val store: ObservationStore) {
  private val logger = KotlinLogging.logger {}

  @Autowired
  fun buildPipeline(streamsBuilder: StreamsBuilder) {

    val messageStream =
        streamsBuilder.stream(
            "observations",
            Consumed.with(
                JsonSerde(ObservationMessageKey::class.java),
                JsonSerde(ObservationMessage::class.java)))

    messageStream.foreach { _, value ->
      try {
        when (value) {
          is SiteDetailsMessage -> {
            store.storeSite(value.councilId, value.siteName, value.location)
          }
          is ObservationDataMessage -> {
            store.storeObservations(
                value.councilId, value.siteName, value.measurementName, value.observations)
          }
        }
      } catch (e: NonTransientDataAccessException) {
        logger.error(e) {
          "Exception processing ${value.type} message ${value.councilId} / ${value.siteName}"
        }
      }
    }
  }
}
