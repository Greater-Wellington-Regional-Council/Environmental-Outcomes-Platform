package nz.govt.eop.tasks

import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import net.postgis.jdbc.geometry.Geometry
import nz.govt.eop.si.jooq.tables.*
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class CouncilPlanBoundariesRec2Generator(
    val context: DSLContext,
    val parameterJdbcTemplate: NamedParameterJdbcTemplate
) {

  private val logger = KotlinLogging.logger {}

  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.HOURS)
  @SchedulerLock(name = "recPlanDataUpdate")
  @Transactional
  fun updateRecPlanData() {
    processDataRefresh(logger, "updateRecRivers", ::checkRecRivers, ::updateRecRivers)
    processDataRefresh(logger, "updateRecWatersheds", ::checkRecWatersheds, ::updateRecWatersheds)
    processDataRefresh(
        logger, "updateCouncilPlanRecBoundaries", { true }, ::updateCouncilPlanRecBoundaries)
  }

  private fun checkRecRivers(): Boolean {
    val lastIngestedRiver =
        context
            .select(DSL.max(RawRecFeaturesRivers.RAW_REC_FEATURES_RIVERS.INGESTED_AT))
            .from(RawRecFeaturesRivers.RAW_REC_FEATURES_RIVERS)
            .fetchOne(DSL.max(RawRecFeaturesRivers.RAW_REC_FEATURES_RIVERS.INGESTED_AT))
            ?: return false

    val lastCreatedRiverModification =
        context
            .select(DSL.max(RecRiversModifications.REC_RIVERS_MODIFICATIONS.CREATED_AT))
            .from(RecRiversModifications.REC_RIVERS_MODIFICATIONS)
            .fetchOne(DSL.max(RecRiversModifications.REC_RIVERS_MODIFICATIONS.CREATED_AT))

    val lastCreatedRiver =
        context
            .select(DSL.max(Rivers.RIVERS.CREATED_AT))
            .from(Rivers.RIVERS)
            .fetchOne(DSL.max(Rivers.RIVERS.CREATED_AT))

    return lastCreatedRiver == null ||
        lastCreatedRiver.isBefore(lastIngestedRiver) ||
        (lastCreatedRiverModification != null &&
            lastCreatedRiver.isBefore(lastCreatedRiverModification))
  }

  private fun updateRecRivers() {
    logger.info { "RAW Rivers data has been updated since last processed, re-processing now" }
    context.deleteFrom(Rivers.RIVERS).execute()

    context
        .insertInto(Rivers.RIVERS)
        .select(
            context
                .select(
                    RecRiversModifications.REC_RIVERS_MODIFICATIONS.HYDRO_ID,
                    RecRiversModifications.REC_RIVERS_MODIFICATIONS.NEXT_HYDRO_ID,
                    RecRiversModifications.REC_RIVERS_MODIFICATIONS.NZ_SEGMENT,
                    RecRiversModifications.REC_RIVERS_MODIFICATIONS.IS_HEADWATER,
                    RecRiversModifications.REC_RIVERS_MODIFICATIONS.STREAM_ORDER,
                    RecRiversModifications.REC_RIVERS_MODIFICATIONS.GEOM,
                    DSL.field("NOW()"))
                .from(RecRiversModifications.REC_RIVERS_MODIFICATIONS))
        .execute()

    context
        .insertInto(Rivers.RIVERS)
        .columns(
            Rivers.RIVERS.HYDRO_ID,
            Rivers.RIVERS.NEXT_HYDRO_ID,
            Rivers.RIVERS.NZ_SEGMENT,
            Rivers.RIVERS.IS_HEADWATER,
            Rivers.RIVERS.STREAM_ORDER,
            Rivers.RIVERS.GEOM)
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
                .from(RawRecFeaturesRivers.RAW_REC_FEATURES_RIVERS)
                .where(
                    DSL.field("(data -> 'properties' -> 'HydroID')::INT", Int::class.java)
                        .notIn(context.select(Rivers.RIVERS.HYDRO_ID).from(Rivers.RIVERS))))
        .execute()
  }

  private fun checkRecWatersheds(): Boolean {
    val lastIngestedWatershed =
        context
            .select(DSL.max(RawRecFeaturesWatersheds.RAW_REC_FEATURES_WATERSHEDS.INGESTED_AT))
            .from(RawRecFeaturesWatersheds.RAW_REC_FEATURES_WATERSHEDS)
            .fetchOne(DSL.max(RawRecFeaturesWatersheds.RAW_REC_FEATURES_WATERSHEDS.INGESTED_AT))
            ?: return false

    val lastCreatedWatershedModification =
        context
            .select(DSL.max(RecWatershedsModifications.REC_WATERSHEDS_MODIFICATIONS.CREATED_AT))
            .from(RecWatershedsModifications.REC_WATERSHEDS_MODIFICATIONS)
            .fetchOne(DSL.max(RecWatershedsModifications.REC_WATERSHEDS_MODIFICATIONS.CREATED_AT))

    val lastCreatedWatershed =
        context
            .select(DSL.max(Watersheds.WATERSHEDS.CREATED_AT))
            .from(Watersheds.WATERSHEDS)
            .fetchOne(DSL.max(Watersheds.WATERSHEDS.CREATED_AT))

    return lastCreatedWatershed == null ||
        lastCreatedWatershed.isBefore(lastIngestedWatershed) ||
        (lastCreatedWatershedModification != null &&
            lastCreatedWatershed.isBefore(lastCreatedWatershedModification))
  }

  private fun updateRecWatersheds() {
    logger.info { "RAW Watersheds data has been updated since last processed, re-processing now" }
    context.deleteFrom(Watersheds.WATERSHEDS).execute()

    context
        .insertInto(Watersheds.WATERSHEDS)
        .select(
            context
                .select(
                    RecWatershedsModifications.REC_WATERSHEDS_MODIFICATIONS.HYDRO_ID,
                    RecWatershedsModifications.REC_WATERSHEDS_MODIFICATIONS.NZ_SEGMENT,
                    RecWatershedsModifications.REC_WATERSHEDS_MODIFICATIONS.GEOM,
                    DSL.field("NOW()"))
                .from(RecWatershedsModifications.REC_WATERSHEDS_MODIFICATIONS))
        .execute()

    context
        .insertInto(Watersheds.WATERSHEDS)
        .columns(
            Watersheds.WATERSHEDS.HYDRO_ID,
            Watersheds.WATERSHEDS.NZ_SEGMENT,
            Watersheds.WATERSHEDS.GEOM)
        .select(
            context
                .select(
                    DSL.field("(data -> 'properties' -> 'HydroID')::INT", Int::class.java)
                        .`as`("hydro_id"),
                    DSL.field("(data -> 'properties' -> 'nzsegment')::INT", Int::class.java)
                        .`as`("nz_segment"),
                    DSL.field("st_geomfromgeojson(data -> 'geometry')", Geometry::class.java)
                        .`as`("path"))
                .from(RawRecFeaturesWatersheds.RAW_REC_FEATURES_WATERSHEDS)
                .where(
                    DSL.field("(data -> 'properties' -> 'HydroID')::INT", Int::class.java)
                        .notIn(
                            context
                                .select(Watersheds.WATERSHEDS.HYDRO_ID)
                                .from(Watersheds.WATERSHEDS))))
        .execute()
  }

  private fun updateCouncilPlanRecBoundaries() {
    parameterJdbcTemplate.jdbcTemplate
        .queryForList("SELECT * FROM council_plan_boundary_rec2_source")
        .forEach {
          val councilId = it["council_id"] as Int
          val sourceId = it["source_id"] as String
          val hydroIds = (it["hydro_ids"] as java.sql.Array).array as Array<Int>
          val excludedHydroIds = (it["excluded_hydro_ids"] as java.sql.Array).array as Array<Int>

          val result = selectRecCatchmentTree(context, hydroIds.toSet(), excludedHydroIds.toSet())

          if (result.isEmpty()) {
            return@forEach
          }

          parameterJdbcTemplate.update(
              """
                          WITH new_boundary AS (SELECT ST_UNION(geom) AS geom
                                                FROM watersheds
                                                WHERE hydro_id IN (:hydroIds))
                          UPDATE council_plan_boundaries
                          SET boundary   = new_boundary.geom,
                              updated_at = NOW()
                          FROM new_boundary
                          WHERE council_id = :councilId
                            AND source_id = :sourceId
                            AND (ST_GEOMFROMTEXT('POLYGON EMPTY', 4326) = boundary OR NOT ST_EQUALS(new_boundary.geom, boundary))
              """
                  .trimIndent(),
              mapOf(
                  "councilId" to councilId,
                  "sourceId" to sourceId,
                  "hydroIds" to result,
              ))
        }
  }

}
