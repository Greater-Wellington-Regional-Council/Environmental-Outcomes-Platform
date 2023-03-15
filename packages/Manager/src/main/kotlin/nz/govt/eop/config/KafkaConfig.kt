package nz.govt.eop.config

import java.util.function.BiFunction
import org.apache.kafka.clients.consumer.ConsumerRecord
import org.apache.kafka.common.TopicPartition
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.kafka.KafkaProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer
import org.springframework.kafka.listener.DefaultErrorHandler
import org.springframework.util.backoff.ExponentialBackOff

@Configuration
class KafkaConfig(@Autowired val kafkaTemplate: KafkaTemplate<*, *>) {

  @Bean
  fun errorHandler(kafkaProperties: KafkaProperties): DefaultErrorHandler {
    val backOff = ExponentialBackOff(1000, 2.0)
    backOff.maxElapsedTime = 10000

    val destinationResolver =
        BiFunction<ConsumerRecord<*, *>, Exception, TopicPartition> { record, _ ->
          TopicPartition(record.topic() + ".manager-consumer.DLT", -1)
        }

    val deadLetterPublishingRecoverer =
        DeadLetterPublishingRecoverer(kafkaTemplate, destinationResolver)
    return DefaultErrorHandler(deadLetterPublishingRecoverer, backOff)
  }
}
