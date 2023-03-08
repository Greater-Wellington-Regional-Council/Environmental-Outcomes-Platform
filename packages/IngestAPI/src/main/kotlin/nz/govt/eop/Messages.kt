package nz.govt.eop.messages

import nz.govt.eop.ingestapi.WaterAllocation

data class WaterAllocationMessage(
    val areaId: String,
    val amount: Int,
    val ingestId: String,
    val receivedAt: String
) {
  constructor(
      allocation: WaterAllocation,
      ingestId: String,
      receivedAt: String
  ) : this(allocation.areaId, allocation.amount, ingestId, receivedAt) {}
}
