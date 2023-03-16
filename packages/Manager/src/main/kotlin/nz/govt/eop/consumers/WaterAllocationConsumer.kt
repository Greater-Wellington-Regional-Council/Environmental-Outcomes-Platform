package nz.govt.eop.consumers

import java.time.OffsetDateTime
import java.time.ZoneOffset
import mu.KotlinLogging
import mu.withLoggingContext
import nz.govt.eop.messages.WaterAllocationMessage
import nz.govt.eop.si.jooq.tables.WaterAllocations.Companion.WATER_ALLOCATIONS
import org.jooq.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Profile
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

const val WATER_ALLOCATION_TOPIC_NAME = "water.allocation"

@Profile("allocations-consumer")
@Component
class WaterAllocationConsumer(@Autowired val context: DSLContext) {

  private val logger = KotlinLogging.logger {}

  @KafkaListener(
      topics = [WATER_ALLOCATION_TOPIC_NAME], id = "nz.govt.eop.consumers.water-allocation")
  fun processMessage(allocation: WaterAllocationMessage) {

    val receivedAtUTC = allocation.receivedAt.atOffset(ZoneOffset.UTC)
    val now = OffsetDateTime.now(ZoneOffset.UTC)

    withLoggingContext("ingestId" to allocation.ingestId) {
      logger.info { "Consuming allocation for area_id:${allocation.areaId}" }
      val result =
          context
              .insertInto(WATER_ALLOCATIONS)
              .columns(
                  WATER_ALLOCATIONS.AREA_ID,
                  WATER_ALLOCATIONS.AMOUNT,
                  WATER_ALLOCATIONS.LAST_UPDATED_INGEST_ID,
                  WATER_ALLOCATIONS.CREATED_AT,
                  WATER_ALLOCATIONS.UPDATED_AT,
                  WATER_ALLOCATIONS.RECEIVED_AT)
              .values(
                  allocation.areaId,
                  allocation.amount,
                  allocation.ingestId,
                  now,
                  now,
                  receivedAtUTC)
              .onConflict(WATER_ALLOCATIONS.AREA_ID)
              .doUpdate()
              .set(WATER_ALLOCATIONS.AMOUNT, allocation.amount)
              .set(WATER_ALLOCATIONS.LAST_UPDATED_INGEST_ID, allocation.ingestId)
              .set(WATER_ALLOCATIONS.UPDATED_AT, now)
              .set(WATER_ALLOCATIONS.RECEIVED_AT, receivedAtUTC)
              .where(WATER_ALLOCATIONS.RECEIVED_AT.lt(receivedAtUTC))
              .execute()

      if (result == 0) {
        logger.warn {
          "Old water allocation received for area_id:${allocation.areaId}, not updated."
        }
      }
      logger.info { "Consumed allocation for area_id:${allocation.areaId}" }
    }
  }
}
