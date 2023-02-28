package nz.govt.eop.consumers

import java.time.LocalDateTime
import mu.KotlinLogging
import nz.govt.eop.messages.WaterAllocationMessage
import nz.govt.eop.si.jooq.tables.WaterAllocations.Companion.WATER_ALLOCATIONS
import org.jooq.*
import org.jooq.impl.DSL.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.stereotype.Component

const val WATER_ALLOCATION_TOPIC_NAME = "water.allocation"

@Component
class Consumer(@Autowired val context: DSLContext) {

  private val logger = KotlinLogging.logger {}

  @KafkaListener(topics = [WATER_ALLOCATION_TOPIC_NAME], groupId = "manager-allocations-consumer")
  fun processMessage(allocation: WaterAllocationMessage) {
    context
        .insertInto(WATER_ALLOCATIONS)
        .columns(
            WATER_ALLOCATIONS.AREA_ID,
            WATER_ALLOCATIONS.AMOUNT,
            WATER_ALLOCATIONS.LAST_UPDATED_INGEST_ID,
            WATER_ALLOCATIONS.UPDATED_AT)
        .values(allocation.areaId, allocation.amount, allocation.ingestId, LocalDateTime.now())
        .execute()
    logger.info { "Consumed $allocation" }
  }
}
