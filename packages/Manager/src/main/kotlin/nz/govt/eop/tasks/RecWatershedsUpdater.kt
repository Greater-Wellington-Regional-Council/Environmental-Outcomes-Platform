package nz.govt.eop.tasks

import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import nz.govt.eop.si.jooq.tables.RawRecFeaturesWatersheds.Companion.RAW_REC_FEATURES_WATERSHEDS
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
  @Transactional
  fun checkRec() {
    logger.debug { "Start task RecWatershedsUpdater" }
    val needsRefresh = doesDataNeedRefresh()
    if (needsRefresh) {
      refresh()
    }
    logger.debug { "End task RecWatershedsUpdater" }
  }

  private fun doesDataNeedRefresh(): Boolean {
    val lastIngestedWatershed =
        context
            .select(DSL.max(RAW_REC_FEATURES_WATERSHEDS.INGESTED_AT))
            .from(RAW_REC_FEATURES_WATERSHEDS)
            .fetchOne(DSL.max(RAW_REC_FEATURES_WATERSHEDS.INGESTED_AT))
            ?: return false

    val lastCreatedWatershed =
        context
            .select(DSL.max(WATERSHEDS.CREATED_AT))
            .from(WATERSHEDS)
            .fetchOne(DSL.max(WATERSHEDS.CREATED_AT))

    return lastCreatedWatershed == null || lastCreatedWatershed.isBefore(lastIngestedWatershed)
  }

  private fun refresh() {
    logger.info { "RAW Watersheds data has been updated since last processed, re-processing now" }
    context.deleteFrom(WATERSHEDS).execute()

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
                .from(RAW_REC_FEATURES_WATERSHEDS))
        .execute()
  }
}
