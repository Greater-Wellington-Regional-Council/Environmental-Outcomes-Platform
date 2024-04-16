package nz.govt.eop.tasks

import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.jooq.DSLContext
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
    processDataRefresh(
        logger, "updateCouncilPlanRecBoundaries", { true }, ::updateCouncilPlanRecBoundaries)
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
