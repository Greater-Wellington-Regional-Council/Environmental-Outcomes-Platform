package nz.govt.eop.ingestapi

import org.springframework.kafka.core.KafkaTemplate
import org.springframework.stereotype.Component

data class IngestedWaterAllocation(
    val areaId: String,
    val amount: Int,
    val ingestId: String,
    val receivedAt: String
) {
  companion object {
    fun create(allocation: WaterAllocation, ingestId: String, receivedAt: String) =
        IngestedWaterAllocation(allocation.areaId, allocation.amount, ingestId, receivedAt)
  }
}

@Component
class Producer(private val kafkaTemplate: KafkaTemplate<String, IngestedWaterAllocation>) {

  fun produce(allocations: List<WaterAllocation>, ingestId: String, receivedAt: String) {
    for (allocation in allocations) {
      kafkaTemplate.send(
          WATER_ALLOCATION_TOPIC_NAME,
          allocation.areaId,
          IngestedWaterAllocation.create(allocation, ingestId, receivedAt))
    }
  }
}
