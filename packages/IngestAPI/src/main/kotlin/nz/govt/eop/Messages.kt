package nz.govt.eop.messages

import nz.govt.eop.ingestapi.WaterAllocation

data class WaterAllocationMessage(
    val areaId: String,
    val amount: Int,
    val ingestId: String,
    val receivedAt: String
) {
  companion object {
    fun create(allocation: WaterAllocation, ingestId: String, receivedAt: String) =
        WaterAllocationMessage(allocation.areaId, allocation.amount, ingestId, receivedAt)
  }
}
