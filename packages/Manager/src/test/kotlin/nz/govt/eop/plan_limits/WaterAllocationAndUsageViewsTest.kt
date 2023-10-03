package nz.govt.eop.plan_limits

import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.shouldBe
import java.time.LocalDate
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.transaction.annotation.Transactional

@ActiveProfiles("test")
@SpringBootTest
@Transactional
class WaterAllocationAndUsageViewsTest(@Autowired val jdbcTemplate: JdbcTemplate) {

  @BeforeEach
  fun resetTestData() {
    truncateTestData()
    createTestData()
  }

  @Test
  fun `should be empty with no data`() {
    truncateTestData()
    val result =
        jdbcTemplate.queryForObject(
            "select count(*) from water_allocation_and_usage_by_area", Int::class.java)
    result shouldBe 0
  }

  @Test
  fun `should include a year of data`() {
    val result =
        jdbcTemplate.queryForMap(
            "select count(*) as count, min(date) as min_date, max(date) as max_date from water_allocation_and_usage_by_area")
    arrayOf(365L, 366L) shouldContain result["count"] as Long
    val min = LocalDate.parse(result["min_date"].toString())
    val max = LocalDate.parse(result["max_date"].toString())
    min.plusYears(1) shouldBe max
  }

  // Pending tests
  // Single consent
  fun `should not include data before a consent was effective`() {}
  fun `should data once a consent is active`() {}
  fun `should handle changes in consent data`() {}
  fun `should not include data when a consent status is not active`() {}
  fun `should not include observations when is_metered is false`() {}

  // Multiple consents
  // Multiple meters

  fun truncateTestData() {
    jdbcTemplate.execute("truncate water_allocations cascade")
    jdbcTemplate.execute("truncate observations cascade")
    jdbcTemplate.execute("truncate observation_sites_measurements cascade")
    jdbcTemplate.execute("truncate observation_sites cascade")
  }

  fun createTestData() {
    val siteId = 1
    val councilId = 9
    val measurementId = 1
    val measurementName = "Water Meter Reading"
    val observationTimestamp = "2023-09-10 06:00:00+00"
    val consentAreaId = "area-id"
    val consentSourceId = "source-id"
    val consentAllocation = 10
    val consentEffectiveFrom = "2023-09-01 06:00:00+00"
    jdbcTemplate.update(
        """INSERT INTO observation_sites (id, council_id, name) VALUES ($siteId, $councilId, 'Test site')""")
    jdbcTemplate.update(
        """
      INSERT INTO observation_sites_measurements (id, site_id, measurement_name, first_observation_at, last_observation_at, observation_count)
      VALUES ($measurementId, $siteId, '$measurementName', now(), now(), 0)"""
            .trimIndent())
    jdbcTemplate.update(
        """INSERT INTO observations (observation_measurement_id, amount, observed_at) VALUES ($measurementId, 1, '$observationTimestamp')""")
    jdbcTemplate.update(
        """
      INSERT INTO water_allocations (area_id, allocation, ingest_id, source_id, consent_id, status, is_metered, metered_allocation_daily, metered_allocation_yearly, meters, effective_from, effective_to, created_at, updated_at)
      VALUES ('$consentAreaId', '$consentAllocation', 'ingest-id', '$consentSourceId', 'consent-id', 'active', true, 10, 100, '{$siteId}', '$consentEffectiveFrom', null, now(), now())"""
            .trimIndent())
  }
}
