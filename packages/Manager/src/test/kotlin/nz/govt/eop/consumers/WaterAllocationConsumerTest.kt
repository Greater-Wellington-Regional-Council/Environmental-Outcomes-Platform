package nz.govt.eop.consumers

import io.kotest.matchers.shouldBe
import java.math.BigDecimal
import java.time.Instant
import java.time.temporal.ChronoUnit
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
    val message = WaterAllocationMessage("area-id-create", BigDecimal("100.11"), "ingest-id", Instant.now())

    // WHEN
    consumer.processMessage(message)

    // THEN
    val records = fetchWaterAllocations(message.areaId)
    records.size.shouldBe(1)
    val record = records.first()
    record.amount.shouldBe(message.amount)
    record.lastUpdatedIngestId.shouldBe(message.ingestId)
  }

  @Test
  fun `Should update an allocations if exists`() {
    // GIVEN
    val firstMessage =
        WaterAllocationMessage("area-id-update", BigDecimal("100.11"), "ingest-id-1", Instant.now())
    val secondMessage =
        WaterAllocationMessage("area-id-update", BigDecimal("200.22"), "ingest-id-2", Instant.now())

    // WHEN
    consumer.processMessage(firstMessage)
    consumer.processMessage(secondMessage)

    // THEN
    val records = fetchWaterAllocations(firstMessage.areaId)
    records.size.shouldBe(1)
    val record = records.first()
    record.amount.shouldBe(secondMessage.amount)
    record.lastUpdatedIngestId.shouldBe(secondMessage.ingestId)
  }

  @Test
  fun `Should not update an allocations if older data received `() {
    // GIVEN
    val firstMessage =
        WaterAllocationMessage("area-id-no-update", BigDecimal("100.11"), "ingest-id-1", Instant.now())
    val yesterday = Instant.now().minus(1, ChronoUnit.DAYS)
    val secondMessage =
        WaterAllocationMessage("area-id-no-update", BigDecimal("200.22"), "ingest-id-2", yesterday)

    // WHEN
    consumer.processMessage(firstMessage)
    consumer.processMessage(secondMessage)

    // THEN
    val records = fetchWaterAllocations(firstMessage.areaId)
    records.size.shouldBe(1)
    val record = records.first()
    record.amount.shouldBe(firstMessage.amount)
    record.lastUpdatedIngestId.shouldBe(firstMessage.ingestId)
  }

  fun fetchWaterAllocations(areaId: String): Result<WaterAllocationsRecord> {
    return context.selectFrom(WATER_ALLOCATIONS).where(WATER_ALLOCATIONS.AREA_ID.eq(areaId)).fetch()
  }
}
