package nz.govt.eop.ingestapi

import mu.KotlinLogging
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

@Component
class Consumer {

  private val logger = KotlinLogging.logger {}

  @KafkaListener(topics = [WATER_ALLOCATION_TOPIC_NAME], groupId = "debug-consumer")
  fun processMessage(message: String) {
    logger.info { "Consumed $message" }
  }
}
