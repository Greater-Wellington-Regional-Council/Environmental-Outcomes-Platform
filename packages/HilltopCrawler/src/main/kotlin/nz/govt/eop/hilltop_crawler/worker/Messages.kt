package nz.govt.eop.hilltop_crawler.worker

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import java.time.Instant
import java.time.YearMonth

enum class HilltopMessageType {
  SITES_LIST,
  MEASUREMENTS_LIST,
  MEASUREMENT_DATA,
}

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = HilltopSitesMessageKey::class, name = "SITES_LIST"),
    JsonSubTypes.Type(value = HilltopMeasurementListMessageKey::class, name = "MEASUREMENTS_LIST"),
    JsonSubTypes.Type(value = HilltopMeasurementsMessageKey::class, name = "MEASUREMENT_DATA"))
abstract class HilltopMessageKey(
    val type: HilltopMessageType,
) {
  abstract val councilId: Int
  abstract val hilltopBaseUrl: String
  abstract val at: Instant
}

data class HilltopSitesMessageKey(
    override val councilId: Int,
    override val hilltopBaseUrl: String,
    override val at: Instant
) : HilltopMessageKey(HilltopMessageType.SITES_LIST)

data class HilltopMeasurementListMessageKey(
    override val councilId: Int,
    override val hilltopBaseUrl: String,
    override val at: Instant,
    val siteName: String
) : HilltopMessageKey(HilltopMessageType.MEASUREMENTS_LIST)

data class HilltopMeasurementsMessageKey(
    override val councilId: Int,
    override val hilltopBaseUrl: String,
    override val at: Instant,
    val siteName: String,
    val measurementName: String,
    val yearMonth: YearMonth
) : HilltopMessageKey(HilltopMessageType.MEASUREMENT_DATA)

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = HilltopSitesMessage::class, name = "SITES_LIST"),
    JsonSubTypes.Type(value = HilltopMeasurementListMessage::class, name = "MEASUREMENTS_LIST"),
    JsonSubTypes.Type(value = HilltopMeasurementsMessage::class, name = "MEASUREMENT_DATA"))
abstract class HilltopMessage(val type: HilltopMessageType) {
  abstract val councilId: Int
  abstract val hilltopBaseUrl: String
  abstract val at: Instant
  abstract val hilltopUrl: String
  abstract val xml: String

  abstract fun toKey(): HilltopMessageKey
}

data class HilltopSitesMessage(
    override val councilId: Int,
    override val hilltopBaseUrl: String,
    override val at: Instant,
    override val hilltopUrl: String,
    override val xml: String
) : HilltopMessage(HilltopMessageType.SITES_LIST) {
  override fun toKey(): HilltopMessageKey = HilltopSitesMessageKey(councilId, hilltopBaseUrl, at)
}

data class HilltopMeasurementListMessage(
    override val councilId: Int,
    override val hilltopBaseUrl: String,
    override val at: Instant,
    val siteName: String,
    override val hilltopUrl: String,
    override val xml: String
) : HilltopMessage(HilltopMessageType.MEASUREMENTS_LIST) {
  override fun toKey(): HilltopMessageKey =
      HilltopMeasurementListMessageKey(councilId, hilltopBaseUrl, at, siteName)
}

data class HilltopMeasurementsMessage(
    override val councilId: Int,
    override val hilltopBaseUrl: String,
    override val at: Instant,
    val siteName: String,
    val measurementName: String,
    val yearMonth: YearMonth,
    override val hilltopUrl: String,
    override val xml: String
) : HilltopMessage(HilltopMessageType.MEASUREMENT_DATA) {
  override fun toKey(): HilltopMessageKey =
      HilltopMeasurementsMessageKey(
          councilId, hilltopBaseUrl, at, siteName, measurementName, yearMonth)
}
