package nz.govt.eop.messages

import java.math.BigDecimal
import java.time.Instant
import nz.govt.eop.ingest.api.WaterAllocation

enum class ConsentStatus {
  active,
  inactive
}

data class WaterAllocationMessage(
    val consentId: String,
    val status: ConsentStatus,
    val areaId: String,
    val allocation: BigDecimal,
    val isMetered: Boolean,
    val meteredAllocationDaily: BigDecimal,
    val meteredAllocationYearly: BigDecimal,
    val meters: List<String>,
    val ingestId: String,
    val receivedAt: Instant
) {
  constructor(
      allocation: WaterAllocation,
      ingestId: String,
      receivedAt: Instant
  ) : this(
      allocation.consentId,
      allocation.status,
      allocation.areaId,
      allocation.allocation,
      allocation.isMetered,
      allocation.meteredAllocationDaily,
      allocation.meteredAllocationYearly,
      allocation.meters,
      ingestId,
      receivedAt,
  ) {}
}
