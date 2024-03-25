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
      logger.info { "Consuming allocation for source_id:${allocation.sourceId}" }

      val updateResult =
          context
              .update(WATER_ALLOCATIONS)
              .set(WATER_ALLOCATIONS.EFFECTIVE_TO, receivedAtUTC)
              .where(WATER_ALLOCATIONS.SOURCE_ID.eq(allocation.sourceId))
              .and(WATER_ALLOCATIONS.EFFECTIVE_TO.isNull())
              .execute()
      logger.info { "Set effective_to for existing allocation. Rows affected:${updateResult}" }

      val insertResult =
          context
              .insertInto(WATER_ALLOCATIONS)
              .columns(
                  WATER_ALLOCATIONS.SOURCE_ID,
                  WATER_ALLOCATIONS.CONSENT_ID,
                  WATER_ALLOCATIONS.STATUS,
                  WATER_ALLOCATIONS.AREA_ID,
                  WATER_ALLOCATIONS.ALLOCATION_PLAN,
                  WATER_ALLOCATIONS.IS_METERED,
                  WATER_ALLOCATIONS.ALLOCATION_DAILY,
                  WATER_ALLOCATIONS.ALLOCATION_YEARLY,
                  WATER_ALLOCATIONS.METERS,
                  WATER_ALLOCATIONS.EFFECTIVE_FROM,
                  WATER_ALLOCATIONS.INGEST_ID,
                  WATER_ALLOCATIONS.CREATED_AT,
                  WATER_ALLOCATIONS.UPDATED_AT)
              .values(
                  allocation.sourceId,
                  allocation.consentId,
                  allocation.status.toString(),
                  allocation.areaId,
                  allocation.allocationPlan,
                  allocation.isMetered,
                  allocation.allocationDaily,
                  allocation.allocationYearly,
                  allocation.meters.toTypedArray(),
                  receivedAtUTC,
                  allocation.ingestId,
                  now,
                  now)
              .execute()

      logger.info { "Consumed allocation for source_id:${allocation.sourceId}" }
    }
  }
}
