package nz.govt.eop.tasks

import com.fasterxml.jackson.databind.ObjectMapper
import java.net.URI
import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import nz.govt.eop.utils.GeoJsonFetcher
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate

@Component
class CouncilPlanBoundariesGeoJsonFetcher(
    val jdbcTemplate: JdbcTemplate,
    restTemplate: RestTemplate,
) : GeoJsonFetcher(restTemplate) {
  private val logger = KotlinLogging.logger {}

  @Transactional
  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.DAYS)
  @SchedulerLock(name = "geoJsonPlanDataUpdate")
  fun updateGeoJsonPlanData() {
    processDataRefresh(
        logger,
        "updateCouncilPlanGeoJsonBoundaries",
        { true },
        ::updateCouncilPlanGeoJsonBoundaries,
    )
  }

  private fun updateCouncilPlanGeoJsonBoundaries() {
    // Expect multiple rows to pull from the same source URL, so cache the results for the length of
    // this execution
    jdbcTemplate.queryForList("SELECT * FROM council_plan_boundary_geojson_source").forEach {
      val councilId = it["council_id"] as Int
      val sourceId = it["source_id"] as String
      val url = it["url"] as String
      val featureId = it["feature_id"] as String

      fetchCache
          .computeIfAbsent(url) { fetchFeatureCollection(URI(url)) }
          .features
          .find { feature -> feature.id == featureId }
          ?.apply {
            val geoJsonGeometry = ObjectMapper().writeValueAsString(geometry)
            jdbcTemplate.update(
                """
                UPDATE
                    council_plan_boundaries
                SET boundary   = ST_GEOMFROMGEOJSON(?),
                    updated_at = NOW()
                WHERE council_id = ?
                  AND source_id = ?
                  AND (ST_GEOMFROMTEXT('POLYGON EMPTY', 4326) = boundary OR NOT ST_EQUALS(ST_GEOMFROMGEOJSON(?), boundary))
                """
                    .trimIndent(),
                geoJsonGeometry,
                councilId,
                sourceId,
                geoJsonGeometry,
            )
          }
    }
  }
}
