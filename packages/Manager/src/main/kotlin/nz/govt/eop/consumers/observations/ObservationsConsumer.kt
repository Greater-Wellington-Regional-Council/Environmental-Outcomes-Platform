package nz.govt.eop.consumers.observations

import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.kstream.Consumed
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Profile
import org.springframework.kafka.annotation.EnableKafkaStreams
import org.springframework.kafka.support.serializer.JsonSerde
import org.springframework.stereotype.Component

@Profile("hilltop-consumer")
@EnableKafkaStreams
@Component
class ObservationsConsumer(val store: ObservationStore) {
  @Autowired
  fun buildPipeline(streamsBuilder: StreamsBuilder) {

    val messageStream =
        streamsBuilder.stream(
            "observations",
            Consumed.with(
                JsonSerde(ObservationMessageKey::class.java),
                JsonSerde(ObservationMessage::class.java)))

    messageStream.foreach { _, value ->
      when (value) {
        is SiteDetailsMessage -> {
          store.storeSite(value.councilId, value.siteName, value.location)
        }
        is ObservationDataMessage -> {
          store.storeObservations(
              value.councilId, value.siteName, value.measurementName, value.observations)
        }
      }
    }
  }
}
