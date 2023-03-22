package nz.govt.eop.tasks

import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import net.postgis.jdbc.geometry.Geometry
import nz.govt.eop.si.jooq.tables.RawRecFeaturesRivers.Companion.RAW_REC_FEATURES_RIVERS
import nz.govt.eop.si.jooq.tables.RecRiversModifications.Companion.REC_RIVERS_MODIFICATIONS
import nz.govt.eop.si.jooq.tables.Rivers.Companion.RIVERS
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class RecRiversUpdater(val context: DSLContext) {

  private val logger = KotlinLogging.logger {}

  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.MINUTES)
  @SchedulerLock(name = "riversUpdater")
  @Transactional
  fun checkRivers() {
    processDataRefresh(logger, "riversUpdater", ::doesDataNeedRefresh, ::refresh)
  }

  private fun doesDataNeedRefresh(): Boolean {
    val lastIngestedRiver =
        context
            .select(DSL.max(RAW_REC_FEATURES_RIVERS.INGESTED_AT))
            .from(RAW_REC_FEATURES_RIVERS)
            .fetchOne(DSL.max(RAW_REC_FEATURES_RIVERS.INGESTED_AT))
            ?: return false

    val lastCreatedRiverModification =
        context
            .select(DSL.max(REC_RIVERS_MODIFICATIONS.CREATED_AT))
            .from(REC_RIVERS_MODIFICATIONS)
            .fetchOne(DSL.max(REC_RIVERS_MODIFICATIONS.CREATED_AT))

    val lastCreatedRiver =
        context.select(DSL.max(RIVERS.CREATED_AT)).from(RIVERS).fetchOne(DSL.max(RIVERS.CREATED_AT))

    return lastCreatedRiver == null ||
        lastCreatedRiver.isBefore(lastIngestedRiver) ||
        (lastCreatedRiverModification != null &&
            lastCreatedRiver.isBefore(lastCreatedRiverModification))
  }

  private fun refresh() {
    logger.info { "RAW Rivers data has been updated since last processed, re-processing now" }
    context.deleteFrom(RIVERS).execute()

    context
        .insertInto(RIVERS)
        .select(
            context
                .select(
                    REC_RIVERS_MODIFICATIONS.HYDRO_ID,
                    REC_RIVERS_MODIFICATIONS.NEXT_HYDRO_ID,
                    REC_RIVERS_MODIFICATIONS.NZ_SEGMENT,
                    REC_RIVERS_MODIFICATIONS.IS_HEADWATER,
                    REC_RIVERS_MODIFICATIONS.STREAM_ORDER,
                    REC_RIVERS_MODIFICATIONS.GEOM,
                    DSL.field("NOW()"))
                .from(REC_RIVERS_MODIFICATIONS))
        .execute()

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
                    DSL.field("st_geomfromgeojson(data -> 'geometry')", Geometry::class.java)
                        .`as`("path"))
                .from(RAW_REC_FEATURES_RIVERS)
                .where(
                    DSL.field("(data -> 'properties' -> 'HydroID')::INT", Int::class.java)
                        .notIn(context.select(RIVERS.HYDRO_ID).from(RIVERS))))
        .execute()
  }
}
