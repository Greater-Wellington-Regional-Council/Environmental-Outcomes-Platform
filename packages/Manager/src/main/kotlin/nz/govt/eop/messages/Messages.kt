package nz.govt.eop.messages

import com.fasterxml.jackson.databind.JavaType
import com.fasterxml.jackson.databind.type.TypeFactory
import java.math.BigDecimal
import java.time.Instant
import nz.govt.eop.consumers.WATER_ALLOCATION_TOPIC_NAME
import nz.govt.eop.consumers.hilltop_crawler.HILLTOP_RAW_DATA_TOPIC_NAME
import org.apache.kafka.common.header.Headers

enum class ConsentStatus {
  active,
  inactive
}

data class WaterAllocationMessage(
    val sourceId: String,
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
)

data class HilltopDataMessage(
    val councilId: Int,
    val hilltopUrl: String,
    val type: String,
    val xml: String,
    val at: Instant
)

object KafkaMessageTypes {

  private var waterAllocationMessageType: JavaType =
      TypeFactory.defaultInstance().constructType(WaterAllocationMessage::class.java)
  private var hilltopDataMessageType: JavaType =
      TypeFactory.defaultInstance().constructType(HilltopDataMessage::class.java)

  @JvmStatic
  fun determineTypeFromTopicName(topic: String, data: ByteArray, headers: Headers): JavaType? {
    return when (topic) {
      WATER_ALLOCATION_TOPIC_NAME -> waterAllocationMessageType
      HILLTOP_RAW_DATA_TOPIC_NAME -> hilltopDataMessageType
      else -> null
    }
  }
}
