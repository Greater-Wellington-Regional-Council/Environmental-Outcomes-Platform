package nz.govt.eop.messages

import java.math.BigDecimal
import java.time.Instant
import nz.govt.eop.ingest.api.WaterAllocation

enum class ConsentStatus {
  active,
  inactive
}

data class WaterAllocationMessage(
    val sourceId: String,
    val consentId: String,
    val status: ConsentStatus,
    val areaId: String,
    val allocationPlan: BigDecimal,
    val allocationDaily: BigDecimal?,
    val allocationYearly: BigDecimal?,
    val isMetered: Boolean,
    val meters: List<String>,
    val ingestId: String,
    val receivedAt: Instant
) {
  constructor(
      allocation: WaterAllocation,
      ingestId: String,
      receivedAt: Instant
  ) : this(
      allocation.sourceId,
      allocation.consentId,
      allocation.status,
      allocation.areaId,
      allocation.allocationPlan,
      allocation.allocationDaily,
      allocation.allocationYearly,
      allocation.isMetered,
      allocation.meters,
      ingestId,
      receivedAt,
  ) {}
}
