package nz.govt.eop.hilltop_crawler.config

import nz.govt.eop.hilltop_crawler.ApplicationConfiguration
import nz.govt.eop.hilltop_crawler.HILLTOP_RAW_DATA_TOPIC_NAME
import org.apache.kafka.clients.admin.NewTopic
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.config.TopicBuilder

@Configuration
class KafkaConfig(val applicationConfiguration: ApplicationConfiguration) {

  @Bean
  fun hilltopRawDataTopic(): NewTopic =
      TopicBuilder.name(HILLTOP_RAW_DATA_TOPIC_NAME)
          .partitions(16)
          .replicas(applicationConfiguration.topicReplicas)
          .config("max.message.bytes", "134217728")
          .config("retention.ms", "-1")
          .config("retention.bytes", "-1")
          .build()
}
