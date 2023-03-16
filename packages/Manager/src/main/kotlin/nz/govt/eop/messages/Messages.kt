package nz.govt.eop.messages

import java.math.BigDecimal
import java.time.Instant

data class WaterAllocationMessage(
    val areaId: String,
    val amount: BigDecimal,
    val ingestId: String,
    val receivedAt: Instant
)
