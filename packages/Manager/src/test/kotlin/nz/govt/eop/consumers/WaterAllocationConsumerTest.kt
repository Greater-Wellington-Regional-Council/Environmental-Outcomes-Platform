package nz.govt.eop.consumers

import io.kotest.matchers.nulls.shouldBeNull
import io.kotest.matchers.shouldBe
import java.math.BigDecimal
import java.time.Instant
import java.time.OffsetDateTime
import java.time.temporal.ChronoUnit
import nz.govt.eop.messages.ConsentStatus
import nz.govt.eop.messages.WaterAllocationMessage
import nz.govt.eop.si.jooq.tables.WaterAllocations.Companion.WATER_ALLOCATIONS
import nz.govt.eop.si.jooq.tables.records.WaterAllocationsRecord
import org.jooq.DSLContext
import org.jooq.Result
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jooq.JooqTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.transaction.annotation.Transactional

fun OffsetDateTime.truncateToMillis(): Instant = this.truncatedTo(ChronoUnit.MILLIS).toInstant()

@ActiveProfiles("test")
@JooqTest
@Transactional
class WaterAllocationConsumerTest(@Autowired val context: DSLContext) {

  private val consumer = WaterAllocationConsumer(context)

  @BeforeEach
  fun setup() {
    context.truncate(WATER_ALLOCATIONS).execute()
  }

  @Test
  fun `Should create an allocation if it does not exist`() {
    // GIVEN
    val message = createWaterAllocationMessage()

    // WHEN
    consumer.processMessage(message)

    // THEN
    val records = fetchWaterAllocations(message.sourceId)
    records.size.shouldBe(1)
    val record = records.first()
    record.allocation.shouldBe(message.allocation)
    record.ingestId.shouldBe(message.ingestId)
  }

  @Test
  fun `Should create a new allocation with updated data`() {
    // GIVEN
    val firstMessage = createWaterAllocationMessage()
    val secondMessage =
        firstMessage.copy(
            allocation = BigDecimal("200.11"),
            ingestId = "secondIngestId",
            receivedAt = firstMessage.receivedAt.plusSeconds(3600))

    // WHEN
    consumer.processMessage(firstMessage)
    consumer.processMessage(secondMessage)

    // THEN
    val records = fetchWaterAllocations(firstMessage.sourceId)
    records.size.shouldBe(2)

    val firstRecordReceivedAtTruncated = firstMessage.receivedAt.truncatedTo(ChronoUnit.MILLIS)
    val secondRecordReceivedAtTruncated = secondMessage.receivedAt.truncatedTo(ChronoUnit.MILLIS)

    val firstRecord = records.first()
    firstRecord.allocation.shouldBe(firstRecord.allocation)
    firstRecord.ingestId.shouldBe(firstRecord.ingestId)
    firstRecord.effectiveFrom!!.truncateToMillis().shouldBe(firstRecordReceivedAtTruncated)
    firstRecord.effectiveTo!!.truncateToMillis().shouldBe(secondRecordReceivedAtTruncated)

    val secondRecord = records[1]
    secondRecord.ingestId.shouldBe(secondRecord.ingestId)
    secondRecord.allocation.shouldBe(secondRecord.allocation)
    secondRecord.effectiveFrom!!.truncateToMillis().shouldBe(secondRecordReceivedAtTruncated)
    secondRecord.effectiveTo.shouldBeNull()
  }

  fun createWaterAllocationMessage(): WaterAllocationMessage {
    return WaterAllocationMessage(
        "sourceId",
        "consentId",
        ConsentStatus.valueOf("active"),
        "area-id",
        BigDecimal("100.11"),
        true,
        BigDecimal("10.0"),
        BigDecimal("10.0"),
        listOf("meter-0", "meter-1"),
        "firstIngestId",
        Instant.now())
  }

  fun fetchWaterAllocations(sourceId: String): Result<WaterAllocationsRecord> {
    return context
        .selectFrom(WATER_ALLOCATIONS)
        .where(WATER_ALLOCATIONS.SOURCE_ID.eq(sourceId))
        .fetch()
  }
}
