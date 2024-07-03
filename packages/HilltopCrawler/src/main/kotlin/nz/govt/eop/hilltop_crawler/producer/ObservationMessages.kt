package nz.govt.eop.hilltop_crawler.producer

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import java.math.BigDecimal
import java.time.OffsetDateTime
import java.time.YearMonth

enum class ObservationMessageType {
  SITE_DETAILS,
  OBSERVATION_DATA,
}

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = SiteMessageKey::class, name = "SITE_DETAILS"),
    JsonSubTypes.Type(value = ObservationDataMessageKey::class, name = "OBSERVATION_DATA"),
)
abstract class ObservationMessageKey(val type: ObservationMessageType) {
  abstract val councilId: Int
  abstract val siteName: String
}

data class SiteMessageKey(
    override val councilId: Int,
    override val siteName: String,
) : ObservationMessageKey(ObservationMessageType.SITE_DETAILS)

data class ObservationDataMessageKey(
    override val councilId: Int,
    override val siteName: String,
    val measurementName: String,
    val yearMonth: YearMonth
) : ObservationMessageKey(ObservationMessageType.OBSERVATION_DATA)

@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = SiteDetailsMessage::class, name = "SITE_DETAILS"),
    JsonSubTypes.Type(value = ObservationDataMessage::class, name = "OBSERVATION_DATA"),
)
abstract class ObservationMessage(val type: ObservationMessageType) {
  abstract val councilId: Int
  abstract val siteName: String

  abstract fun toKey(): ObservationMessageKey
}

data class SiteDetailsMessage(
    override val councilId: Int,
    override val siteName: String,
    val location: Location?,
    val projection: String?
) : ObservationMessage(ObservationMessageType.SITE_DETAILS) {
  override fun toKey() =
      SiteMessageKey(
          councilId,
          siteName,
      )
}

data class Location(val easting: Int, val northing: Int)

data class ObservationDataMessage(
    override val councilId: Int,
    override val siteName: String,
    val measurementName: String,
    val observations: List<Observation>
) : ObservationMessage(ObservationMessageType.OBSERVATION_DATA) {
  override fun toKey() =
      ObservationDataMessageKey(
          councilId, siteName, measurementName, YearMonth.from(observations.first().observedAt))
}

data class Observation(val observedAt: OffsetDateTime, val value: BigDecimal)
