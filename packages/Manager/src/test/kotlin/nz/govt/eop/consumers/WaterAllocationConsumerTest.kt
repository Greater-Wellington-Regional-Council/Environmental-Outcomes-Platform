package nz.govt.eop.consumers

import io.kotest.matchers.shouldBe
import java.time.Instant
import java.time.temporal.ChronoUnit
import nz.govt.eop.messages.WaterAllocationMessage
import nz.govt.eop.si.jooq.tables.WaterAllocations.Companion.WATER_ALLOCATIONS
import nz.govt.eop.si.jooq.tables.records.WaterAllocationsRecord
import org.jooq.DSLContext
import org.jooq.Result
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.test.context.EmbeddedKafka
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles("test")
@SpringBootTest
@EmbeddedKafka(
    partitions = 1,
    bootstrapServersProperty = "spring.kafka.bootstrap-servers",
    topics = [WATER_ALLOCATION_TOPIC_NAME])
class WaterAllocationConsumerTest(
    @Autowired val template: KafkaTemplate<String, WaterAllocationMessage>,
    @Autowired val context: DSLContext
) {
  @Test
  fun `Should create an allocation if it does not exist`() {
    // GIVEN
    val message = WaterAllocationMessage("area-id-create", 100, "ingest-id", Instant.now())

    // WHEN
    template.send(WATER_ALLOCATION_TOPIC_NAME, message.areaId, message)

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
    val firstMessage = WaterAllocationMessage("area-id-update", 100, "ingest-id-1", Instant.now())
    val secondMessage = WaterAllocationMessage("area-id-update", 200, "ingest-id-2", Instant.now())

    // WHEN
    template.send(WATER_ALLOCATION_TOPIC_NAME, firstMessage.areaId, firstMessage)
    template.send(WATER_ALLOCATION_TOPIC_NAME, secondMessage.areaId, secondMessage)

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
        WaterAllocationMessage("area-id-no-update", 100, "ingest-id-1", Instant.now())
    val yesterday = Instant.now().minus(1, ChronoUnit.DAYS)
    val secondMessage = WaterAllocationMessage("area-id-no-update", 200, "ingest-id-2", yesterday)

    // WHEN
    template.send(WATER_ALLOCATION_TOPIC_NAME, firstMessage.areaId, firstMessage)
    template.send(WATER_ALLOCATION_TOPIC_NAME, secondMessage.areaId, secondMessage)

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