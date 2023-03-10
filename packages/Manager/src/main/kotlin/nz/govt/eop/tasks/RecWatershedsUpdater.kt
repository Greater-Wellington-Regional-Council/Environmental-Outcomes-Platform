package nz.govt.eop.tasks

import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import nz.govt.eop.si.jooq.tables.RawRecFeaturesWatersheds.Companion.RAW_REC_FEATURES_WATERSHEDS
import nz.govt.eop.si.jooq.tables.RecWatershedsModifications.Companion.REC_WATERSHEDS_MODIFICATIONS
import nz.govt.eop.si.jooq.tables.Watersheds.Companion.WATERSHEDS
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class RecWatershedsUpdater(val context: DSLContext) {

  private val logger = KotlinLogging.logger {}

  @Scheduled(fixedDelay = 5, timeUnit = TimeUnit.MINUTES)
  @SchedulerLock(name = "watershedsUpdater")
  @Transactional
  fun checkWatersheds() {
    processDataRefresh(logger, "watershedsUpdater", ::doesDataNeedRefresh, ::refresh)
  }

  private fun doesDataNeedRefresh(): Boolean {
    val lastIngestedWatershed =
        context
            .select(DSL.max(RAW_REC_FEATURES_WATERSHEDS.INGESTED_AT))
            .from(RAW_REC_FEATURES_WATERSHEDS)
            .fetchOne(DSL.max(RAW_REC_FEATURES_WATERSHEDS.INGESTED_AT))
            ?: return false

    val lastCreatedWatershedModification =
        context
            .select(DSL.max(REC_WATERSHEDS_MODIFICATIONS.CREATED_AT))
            .from(REC_WATERSHEDS_MODIFICATIONS)
            .fetchOne(DSL.max(REC_WATERSHEDS_MODIFICATIONS.CREATED_AT))

    val lastCreatedWatershed =
        context
            .select(DSL.max(WATERSHEDS.CREATED_AT))
            .from(WATERSHEDS)
            .fetchOne(DSL.max(WATERSHEDS.CREATED_AT))

    return lastCreatedWatershed == null ||
        lastCreatedWatershed.isBefore(lastIngestedWatershed) ||
        (lastCreatedWatershedModification != null &&
            lastCreatedWatershed.isBefore(lastCreatedWatershedModification))
  }

  private fun refresh() {
    logger.info { "RAW Watersheds data has been updated since last processed, re-processing now" }
    context.deleteFrom(WATERSHEDS).execute()

    context
        .insertInto(WATERSHEDS)
        .select(
            context
                .select(
                    REC_WATERSHEDS_MODIFICATIONS.HYDRO_ID,
                    REC_WATERSHEDS_MODIFICATIONS.NZ_SEGMENT,
                    REC_WATERSHEDS_MODIFICATIONS.GEOM,
                    DSL.field("NOW()"))
                .from(REC_WATERSHEDS_MODIFICATIONS))
        .execute()

    context
        .insertInto(WATERSHEDS)
        .columns(WATERSHEDS.HYDRO_ID, WATERSHEDS.NZ_SEGMENT, WATERSHEDS.GEOM)
        .select(
            context
                .select(
                    DSL.field("(data -> 'properties' -> 'HydroID')::INT", Int::class.java)
                        .`as`("hydro_id"),
                    DSL.field("(data -> 'properties' -> 'nzsegment')::INT", Int::class.java)
                        .`as`("nz_segment"),
                    DSL.field("st_geomfromgeojson(data -> 'geometry')", ByteArray::class.java)
                        .`as`("path"))
                .from(RAW_REC_FEATURES_WATERSHEDS)
                .where(
                    DSL.field("(data -> 'properties' -> 'HydroID')::INT", Int::class.java)
                        .notIn(context.select(WATERSHEDS.HYDRO_ID).from(WATERSHEDS))))
        .execute()
  }
}
