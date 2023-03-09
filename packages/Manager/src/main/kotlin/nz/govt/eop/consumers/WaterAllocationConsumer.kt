package nz.govt.eop.consumers

import java.time.LocalDateTime
import mu.KotlinLogging
import mu.withLoggingContext
import nz.govt.eop.messages.WaterAllocationMessage
import nz.govt.eop.si.jooq.tables.WaterAllocations.Companion.WATER_ALLOCATIONS
import org.jooq.*
import org.jooq.impl.DSL.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.autoconfigure.kafka.KafkaProperties
import org.springframework.context.annotation.Bean
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.listener.DeadLetterPublishingRecoverer
import org.springframework.kafka.listener.DefaultErrorHandler
import org.springframework.stereotype.Component
import org.springframework.util.backoff.ExponentialBackOff

const val WATER_ALLOCATION_TOPIC_NAME = "water.allocation"

@Component
class WaterAllocationConsumer(
    @Autowired val context: DSLContext,
    private val kafkaTemplate: KafkaTemplate<String, WaterAllocationMessage>
) {

  private val logger = KotlinLogging.logger {}

  @KafkaListener(
      topics = [WATER_ALLOCATION_TOPIC_NAME], id = "nz.govt.eop.consumers.water-allocation")
  fun processMessage(allocation: WaterAllocationMessage) {
    withLoggingContext("ingestId" to allocation.ingestId) {
      logger.info { "Consuming water allocation for area_id:${allocation.areaId}" }
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

  @Bean
  fun errorHandler(kafkaProperties: KafkaProperties): DefaultErrorHandler = run {
    val backOff = ExponentialBackOff(1000, 2.0)
    backOff.maxElapsedTime = 10000
    DefaultErrorHandler(DeadLetterPublishingRecoverer(kafkaTemplate), backOff)
  }
}
