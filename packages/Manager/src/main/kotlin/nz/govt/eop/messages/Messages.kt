package nz.govt.eop.messages

import com.fasterxml.jackson.databind.JavaType
import com.fasterxml.jackson.databind.type.TypeFactory
import java.math.BigDecimal
import java.time.Instant
import nz.govt.eop.consumers.WATER_ALLOCATION_TOPIC_NAME
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
    val allocationPlan: BigDecimal,
    val isMetered: Boolean,
    val allocationDaily: BigDecimal,
    val allocationYearly: BigDecimal,
    val meters: List<String>,
    val ingestId: String,
    val receivedAt: Instant,
    val category: String
)

object KafkaMessageTypes {

  private var waterAllocationMessageType: JavaType =
      TypeFactory.defaultInstance().constructType(WaterAllocationMessage::class.java)

  @JvmStatic
  fun determineTypeFromTopicName(topic: String, data: ByteArray, headers: Headers): JavaType? {
    return when (topic) {
      WATER_ALLOCATION_TOPIC_NAME -> waterAllocationMessageType
      else -> null
    }
  }
}
