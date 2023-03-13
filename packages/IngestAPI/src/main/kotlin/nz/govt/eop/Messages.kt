package nz.govt.eop.messages

import java.time.Instant
import nz.govt.eop.ingestapi.WaterAllocation

data class WaterAllocationMessage(
    val areaId: String,
    val amount: Int,
    val ingestId: String,
    val receivedAt: Instant
) {
  constructor(
      allocation: WaterAllocation,
      ingestId: String,
      receivedAt: Instant
  ) : this(allocation.areaId, allocation.amount, ingestId, receivedAt) {}
}
