package nz.govt.eop.tasks

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

  @Scheduled(fixedDelay = 86400000)
  @Transactional
  fun checkRec() {
    logger.info { "Start task RecWatershedsUpdater" }

    val lastIngestedWatershed =
        context
            .selectFrom(RAW_REC_FEATURES_WATERSHEDS)
            .orderBy(RAW_REC_FEATURES_WATERSHEDS.INGESTED_AT.desc())
            .limit(1)
            .fetchAny()
            ?: return

    val lastProcessedWatershed =
        context.selectFrom(WATERSHEDS).orderBy(WATERSHEDS.CREATED_AT.desc()).limit(1).fetchAny()

    if (lastProcessedWatershed == null ||
        lastProcessedWatershed.createdAt!!.isBefore(lastIngestedWatershed.ingestedAt)) {

      context.deleteFrom(WATERSHEDS).execute()

      context
          .insertInto(WATERSHEDS)
          .columns(WATERSHEDS.HYDRO_ID, WATERSHEDS.NZ_SEGMENT, WATERSHEDS.PATH)
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

    logger.info { "End task RecWatershedsUpdater" }
  }
}
