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
import org.springframework.kafka.annotation.EnableKafka
import org.springframework.kafka.annotation.EnableKafkaStreams
import org.springframework.kafka.config.TopicBuilder
import org.springframework.kafka.core.DefaultKafkaProducerFactory
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.core.ProducerFactory
import org.springframework.kafka.support.serializer.JsonSerializer

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
          .partitions(16)
          .replicas(applicationConfiguration.topicReplicas)
          .config("max.message.bytes", "10485760")
          .compact()
          .build()

  @Bean
  fun outputDataTopic(): NewTopic =
      TopicBuilder.name(OUTPUT_DATA_TOPIC_NAME)
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
