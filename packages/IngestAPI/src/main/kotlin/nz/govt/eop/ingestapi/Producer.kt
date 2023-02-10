package nz.govt.eop.ingestapi

import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Component

@Component
class Producer(private val kafkaTemplate: KafkaTemplate<String, String>) {

  fun produce(message: String) {
    kafkaTemplate.send("test-topic", message)
  }
}
