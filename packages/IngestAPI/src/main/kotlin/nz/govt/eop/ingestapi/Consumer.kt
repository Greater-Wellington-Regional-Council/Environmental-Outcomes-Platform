package nz.govt.eop.ingestapi

import mu.KotlinLogging
import org.springframework.stereotype.Component

@Component
class Consumer {

  private val logger = KotlinLogging.logger {}

  @KafkaListener(topics = ["test-topic"], groupId = "test-consumer")
  fun processMessage(message: String) {
    logger.info { "Consumed $message" }
  }
}
