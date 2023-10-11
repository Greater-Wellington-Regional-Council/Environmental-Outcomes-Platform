package nz.govt.eop.hilltop_crawler.config

import com.fasterxml.jackson.databind.ObjectMapper
import nz.govt.eop.hilltop_crawler.ApplicationConfiguration
import nz.govt.eop.hilltop_crawler.HILLTOP_RAW_DATA_TOPIC_NAME
import nz.govt.eop.hilltop_crawler.OUTPUT_DATA_TOPIC_NAME
import nz.govt.eop.hilltop_crawler.fetcher.HilltopMessage
import nz.govt.eop.hilltop_crawler.fetcher.HilltopMessageKey
import org.apache.kafka.clients.admin.NewTopic
import org.springframework.boot.autoconfigure.kafka.KafkaProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.kafka.annotation.EnableKafka
import org.springframework.kafka.annotation.EnableKafkaStreams
import org.springframework.kafka.config.TopicBuilder
import org.springframework.kafka.core.DefaultKafkaProducerFactory
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.core.ProducerFactory
import org.springframework.kafka.support.serializer.JsonSerializer

@Profile("!test")
@EnableKafka
@EnableKafkaStreams
@Configuration
class KafkaConfig(
    val applicationConfiguration: ApplicationConfiguration,
    val properties: KafkaProperties,
    val objectMapper: ObjectMapper
) {

  @Bean
  fun hilltopRawDataTopic(): NewTopic =
      TopicBuilder.name(HILLTOP_RAW_DATA_TOPIC_NAME)
          // For the RAW data we keep the want to keep all messages from a single Hilltop server in
          // the
          // same partition so that they get consumed in the same order as they were created.
          // @see HilltopMessageClient
          // 16 partitions roughly equates to one per council. Which is a good starting point for
          // each council
          // having a Hilltop server.
          .partitions(16)
          .replicas(applicationConfiguration.topicReplicas)
          .config("max.message.bytes", "10485760")
          .compact()
          .build()

  @Bean
  fun outputDataTopic(): NewTopic =
      TopicBuilder.name(OUTPUT_DATA_TOPIC_NAME)
          // For the output data it is keyed by Council / Site Name so many more partitions are
          // needed.
          // 64 is just a random large-ish number but no real insight if this is a good value
          .partitions(64)
          .replicas(applicationConfiguration.topicReplicas)
          .config("max.message.bytes", "10485760")
          .build()

  @Bean
  fun jsonSerializer(): JsonSerializer<Any> {
    return JsonSerializer<Any>(objectMapper).noTypeInfo()
  }

  @Bean
  fun producerFactory(): ProducerFactory<HilltopMessageKey, HilltopMessage> {
    return DefaultKafkaProducerFactory(
        properties.buildProducerProperties(),
        JsonSerializer<HilltopMessageKey>(objectMapper).forKeys().noTypeInfo(),
        JsonSerializer<HilltopMessage>(objectMapper).noTypeInfo())
  }

  @Bean
  fun kafkaTemplate(): KafkaTemplate<HilltopMessageKey, HilltopMessage> {
    return KafkaTemplate(producerFactory())
  }
}
