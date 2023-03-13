package nz.govt.eop.ingestapi

import java.time.Instant
import nz.govt.eop.messages.WaterAllocationMessage
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Component

@Component
class Producer(private val kafkaTemplate: KafkaTemplate<String, WaterAllocationMessage>) {

  fun produce(allocations: List<WaterAllocation>, ingestId: String, receivedAt: Instant) {
    for (allocation in allocations) {
      kafkaTemplate.send(
          WATER_ALLOCATION_TOPIC_NAME,
          allocation.areaId,
          WaterAllocationMessage(allocation, ingestId, receivedAt))
    }
  }
}
