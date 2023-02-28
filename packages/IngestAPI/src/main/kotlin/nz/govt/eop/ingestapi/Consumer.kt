package nz.govt.eop.ingestapi

import mu.KotlinLogging
import nz.govt.eop.messages.WaterAllocationMessage
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

@Component
class Consumer {

  private val logger = KotlinLogging.logger {}

  @KafkaListener(topics = [WATER_ALLOCATION_TOPIC_NAME], groupId = "debug-consumer")
  fun processMessage(allocation: WaterAllocationMessage) {
    logger.info { "Consumed $allocation" }
  }
}
