package nz.govt.eop.consumers

import io.kotest.matchers.shouldBe
import java.math.BigDecimal
import java.time.Duration
import java.time.Instant
import nz.govt.eop.messages.WaterAllocationMessage
import nz.govt.eop.si.jooq.tables.WaterAllocations.Companion.WATER_ALLOCATIONS
import nz.govt.eop.si.jooq.tables.records.WaterAllocationsRecord
import org.awaitility.Awaitility
import org.jooq.DSLContext
import org.jooq.Result
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.test.context.EmbeddedKafka
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles("test", "allocations-consumer")
@SpringBootTest
@EmbeddedKafka(
    partitions = 1,
    bootstrapServersProperty = "spring.kafka.bootstrap-servers",
    topics = [WATER_ALLOCATION_TOPIC_NAME])
class WaterAllocationConsumerIntegrationTest(
    @Autowired val template: KafkaTemplate<String, WaterAllocationMessage>,
    @Autowired val context: DSLContext
) {

  @BeforeEach
  fun setup() {
    context.truncate(WATER_ALLOCATIONS).execute()
  }

  @Test
  fun `Should process message from topic and store in DB`() {
    // GIVEN
    val message = WaterAllocationMessage("area-id-create", BigDecimal("100.11"), "ingest-id", Instant.now())

    // WHEN
    template.send(WATER_ALLOCATION_TOPIC_NAME, message.areaId, message)

    // THEN
    Awaitility.waitAtMost(Duration.ofSeconds(5)).untilAsserted {
      val records = fetchWaterAllocations(message.areaId)
      records.size.shouldBe(1)
      val record = records.first()
      record.amount.shouldBe(message.amount)
      record.lastUpdatedIngestId.shouldBe(message.ingestId)
    }
  }

  fun fetchWaterAllocations(areaId: String): Result<WaterAllocationsRecord> {
    return context.selectFrom(WATER_ALLOCATIONS).where(WATER_ALLOCATIONS.AREA_ID.eq(areaId)).fetch()
  }
}
