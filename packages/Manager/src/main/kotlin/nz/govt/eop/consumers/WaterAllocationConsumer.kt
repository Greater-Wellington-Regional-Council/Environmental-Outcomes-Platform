package nz.govt.eop.consumers

import java.time.LocalDateTime
import mu.KotlinLogging
import mu.withLoggingContext
import nz.govt.eop.messages.WaterAllocationMessage
import nz.govt.eop.si.jooq.tables.WaterAllocations.Companion.WATER_ALLOCATIONS
import org.jooq.*
import org.jooq.impl.DSL.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

const val WATER_ALLOCATION_TOPIC_NAME = "water.allocation"

@Component
class WaterAllocationConsumer(@Autowired val context: DSLContext) {

  private val logger = KotlinLogging.logger {}

  @KafkaListener(
      topics = [WATER_ALLOCATION_TOPIC_NAME], groupId = "nz.govt.eop.consumers.water-allocation")
  fun processMessage(allocation: WaterAllocationMessage) {
    withLoggingContext("ingestId" to allocation.ingestId) {
      context
          .insertInto(WATER_ALLOCATIONS)
          .columns(
              WATER_ALLOCATIONS.AREA_ID,
              WATER_ALLOCATIONS.AMOUNT,
              WATER_ALLOCATIONS.LAST_UPDATED_INGEST_ID,
              WATER_ALLOCATIONS.UPDATED_AT)
          .values(allocation.areaId, allocation.amount, allocation.ingestId, LocalDateTime.now())
          .onConflict(WATER_ALLOCATIONS.AREA_ID)
          .doUpdate()
          .set(WATER_ALLOCATIONS.AMOUNT, allocation.amount)
          .set(WATER_ALLOCATIONS.LAST_UPDATED_INGEST_ID, allocation.ingestId)
          .set(WATER_ALLOCATIONS.UPDATED_AT, LocalDateTime.now())
          .execute()
      logger.info { "Consumed water allocation for area_id:${allocation.areaId}" }
    }
  }
}
