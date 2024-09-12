package nz.govt.eop.consumers

import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.shouldBe
import java.math.BigDecimal
import java.time.Duration
import java.time.Instant
import java.time.temporal.ChronoUnit
import nz.govt.eop.messages.ConsentStatus
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
    val message =
        WaterAllocationMessage(
            "sourceId",
            "consentId",
            ConsentStatus.valueOf("active"),
            "area-id-create",
            BigDecimal("100.11"),
            true,
            BigDecimal("10.0"),
            BigDecimal("10.0"),
            listOf("meter-0", "meter-1"),
            "firstIngestId",
            Instant.now(),
            "category")

    // WHEN
    template.send(WATER_ALLOCATION_TOPIC_NAME, message.sourceId, message)

    // THEN
    Awaitility.waitAtMost(Duration.ofSeconds(5)).untilAsserted {
      val records = fetchWaterAllocations(message.sourceId)
      records.size.shouldBe(1)

      val record = records.first()
      record.ingestId.shouldBe(record.ingestId)
      record.allocationPlan.shouldBe(record.allocationPlan)
      record.effectiveFrom
          ?.toInstant()
          ?.truncatedTo(ChronoUnit.MILLIS)
          .shouldBe(message.receivedAt.truncatedTo(ChronoUnit.MILLIS))
      record.effectiveTo.shouldBeNull()
    }
  }

  fun fetchWaterAllocations(sourceId: String): Result<WaterAllocationsRecord> {
    return context
        .selectFrom(WATER_ALLOCATIONS)
        .where(WATER_ALLOCATIONS.SOURCE_ID.eq(sourceId))
        .orderBy(WATER_ALLOCATIONS.EFFECTIVE_FROM.asc())
        .fetch()
  }
}
