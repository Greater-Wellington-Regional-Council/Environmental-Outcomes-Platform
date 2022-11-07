package nz.govt.eop.tasks

import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import nz.govt.eop.si.jooq.tables.RawRecFeaturesRivers.Companion.RAW_REC_FEATURES_RIVERS
import nz.govt.eop.si.jooq.tables.Rivers.Companion.RIVERS
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class RecRiversUpdater(val context: DSLContext) {

  private val logger = KotlinLogging.logger {}

  @Scheduled(fixedDelay = 5, timeUnit = TimeUnit.MINUTES)
  @Transactional
  fun checkRec() {
    logger.info { "Start task RecRiversUpdater" }

    val lastIngestedRiver =
        context
            .selectFrom(RAW_REC_FEATURES_RIVERS)
            .orderBy(RAW_REC_FEATURES_RIVERS.INGESTED_AT.desc())
            .limit(1)
            .fetchAny()
            ?: return

    val lastProcessedRiver =
        context.selectFrom(RIVERS).orderBy(RIVERS.CREATED_AT.desc()).limit(1).fetchAny()

    if (lastProcessedRiver == null ||
        lastProcessedRiver.createdAt!!.isBefore(lastIngestedRiver.ingestedAt)) {

      logger.info { "RAW Rivers data has been updated since last processed, re-processing now" }
      context.deleteFrom(RIVERS).execute()

      context
          .insertInto(RIVERS)
          .columns(
              RIVERS.HYDRO_ID,
              RIVERS.NEXT_HYDRO_ID,
              RIVERS.NZ_SEGMENT,
              RIVERS.IS_HEADWATER,
              RIVERS.STREAM_ORDER,
              RIVERS.GEOM)
          .select(
              context
                  .select(
                      DSL.field("(data -> 'properties' -> 'HydroID')::INT", Int::class.java)
                          .`as`("hydro_id"),
                      DSL.field(
                              "NULLIF((data -> 'properties' -> 'NextDownID')::INT, -1)",
                              Int::class.java)
                          .`as`("next_hydro_id"),
                      DSL.field("(data -> 'properties' -> 'nzsegment')::INT", Int::class.java)
                          .`as`("nz_segment"),
                      DSL.field(
                              "(data -> 'properties' -> 'Headwater')::INT::BOOLEAN",
                              Boolean::class.java)
                          .`as`("is_headwater"),
                      DSL.field("(data -> 'properties' -> 'StreamOrde')::INT", Int::class.java)
                          .`as`("stream_order"),
                      DSL.field("st_geomfromgeojson(data -> 'geometry')", ByteArray::class.java)
                          .`as`("path"))
                  .from(RAW_REC_FEATURES_RIVERS))
          .execute()
    }

    logger.info { "End task RecRiversUpdater" }
  }
}
