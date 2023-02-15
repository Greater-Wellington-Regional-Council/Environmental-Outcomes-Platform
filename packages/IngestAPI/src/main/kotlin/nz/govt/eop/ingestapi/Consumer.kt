package nz.govt.eop.ingestapi

import mu.KotlinLogging
import org.springframework.stereotype.Component
import org.springframework.kafka.annotation.KafkaListener

@Component
class Consumer {

  private val logger = KotlinLogging.logger {}

  @KafkaListener(topics = ["test-topic"], groupId = "debug-consumer")
  fun processMessage(message: String) {
    logger.info { "Consumed $message" }
  }
}
