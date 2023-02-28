package nz.govt.eop.messages

data class WaterAllocationMessage(
    val areaId: String,
    val amount: Int,
    val ingestId: String,
    val receivedAt: String
)
