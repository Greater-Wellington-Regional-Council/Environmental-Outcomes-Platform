package nz.govt.eop.tasks

import com.fasterxml.jackson.databind.ObjectMapper
import java.net.URI
import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import org.geojson.FeatureCollection
import org.springframework.http.HttpStatus
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate

@Component
class CouncilPlanBoundariesGeoJsonFetcher(
    val jdbcTemplate: JdbcTemplate,
    val restTemplate: RestTemplate
) {

  private val logger = KotlinLogging.logger {}

  @Transactional
  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.DAYS)
  @SchedulerLock(name = "geoJsonPlanDataUpdate")
  fun updateGeoJsonPlanData() {
    processDataRefresh(
        logger,
        "updateCouncilPlanGeoJsonBoundaries",
        { true },
        ::updateCouncilPlanGeoJsonBoundaries)
  }

  private fun updateCouncilPlanGeoJsonBoundaries() {

    // Expect multiple rows to pull from the same source URL, so cache the results for the length of
    // this execution
    val fetchCache = mutableMapOf<String, FeatureCollection>()

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
                INSERT INTO council_plan_boundary_geojson_data (council_id, source_id, boundary) VALUES (?, ?, st_geomfromgeojson(?)) ON CONFLICT (council_id, source_id) DO UPDATE SET boundary = st_geomfromgeojson(?), updated_at = NOW()
                """
                    .trimIndent(),
                councilId,
                sourceId,
                geoJsonGeometry,
                geoJsonGeometry)
          }
    }
  }

  private fun fetchFeatureCollection(url: URI): FeatureCollection {
    val resp = restTemplate.getForEntity(url, FeatureCollection::class.java)
    if (resp.statusCode == HttpStatus.OK) {
      return resp.body!!
    } else {
      throw RuntimeException("Request failed with status: ${resp.statusCode} ")
    }
  }
}
