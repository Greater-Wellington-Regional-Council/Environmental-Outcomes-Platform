package nz.govt.eop.messages

import java.time.Instant

data class WaterAllocationMessage(
    val areaId: String,
    val amount: Int,
    val ingestId: String,
    val receivedAt: Instant
)
