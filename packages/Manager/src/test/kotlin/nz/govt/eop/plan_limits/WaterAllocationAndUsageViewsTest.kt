package nz.govt.eop.plan_limits

import io.kotest.inspectors.forAll
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.shouldBe
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneOffset
import nz.govt.eop.messages.ConsentStatus
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.jdbc.core.DataClassRowMapper
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.query
import org.springframework.jdbc.support.GeneratedKeyHolder
import org.springframework.jdbc.support.KeyHolder
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*
import org.springframework.transaction.annotation.Transactional

data class WaterAllocationUsageRow(
    val areaId: String,
    val date: LocalDate,
    val allocation: BigDecimal,
    val allocationDaily: BigDecimal,
    val meteredAllocationYearly: BigDecimal,
    val dailyUsage: BigDecimal,
)

data class AllocationRow(
    val sourceId: String,
    val consentId: String,
    val status: ConsentStatus,
    val areaId: String,
    val allocation: BigDecimal,
    val isMetered: Boolean,
    val meteredAllocationDaily: BigDecimal,
    val meteredAllocationYearly: BigDecimal,
    val meters: List<String>,
    val ingestId: String,
    val effectiveFrom: Instant,
    val effectiveTo: Instant?
)

@ActiveProfiles("test")
@SpringBootTest
@Transactional
class WaterAllocationAndUsageViewsTest(@Autowired val jdbcTemplate: JdbcTemplate) {

  val testSiteId = 1
  val testAreaId = "test-area-id"
  val testEffectiveFrom: LocalDateTime = LocalDate.now().atStartOfDay().minusDays(100)
  val testAllocation =
      AllocationRow(
          "source-id",
          "consent-id",
          ConsentStatus.active,
          testAreaId,
          BigDecimal(100),
          true,
          BigDecimal(10),
          BigDecimal(10),
          listOf(testSiteId.toString()),
          "ingest-id",
          testEffectiveFrom.toInstant(ZoneOffset.UTC),
          null)
  @BeforeEach
  fun resetTestData() {
    truncateTestData()
  }

  @Test
  fun `should be empty with no allocations`() {
    truncateTestData()
    val result =
        jdbcTemplate.queryForObject(
            "select count(*) from water_allocation_and_usage_by_area", Int::class.java)
    result shouldBe 0
  }

  @Test
  fun `should include a year of data for each area`() {
    createTestAllocation(testAllocation)
    val result =
        jdbcTemplate.queryForMap(
            "select count(*) as count, min(date) as min_date, max(date) as max_date from water_allocation_and_usage_by_area where area_id = '${testAllocation.areaId}'")
    arrayOf(365L, 366L) shouldContain result["count"] as Long
    val min = LocalDate.parse(result["min_date"].toString())
    val max = LocalDate.parse(result["max_date"].toString())
    min.plusYears(1) shouldBe max
  }
  @Test
  fun `should use default allocation before the effective date`() {
    createTestAllocation(testAllocation)
    val dateFilter = testEffectiveFrom.toString()
    val result =
        jdbcTemplate.query(
            """select * from water_allocation_and_usage_by_area where date < '$dateFilter'""",
            DataClassRowMapper.newInstance(WaterAllocationUsageRow::class.java))
    result.forAll {
      it.areaId shouldBe testAllocation.areaId
      it.allocation shouldBe BigDecimal(0)
      it.allocationDaily shouldBe BigDecimal(0)
      it.meteredAllocationYearly shouldBe BigDecimal(0)
      it.dailyUsage shouldBe BigDecimal(0)
    }
  }

  @Test
  fun `should aggregate allocation from the effective date`() {
    createTestAllocation(testAllocation)
    val dateFilter = testEffectiveFrom.toString()
    val result =
        jdbcTemplate.query(
            """select * from water_allocation_and_usage_by_area where date >= '$dateFilter'""",
            DataClassRowMapper.newInstance(WaterAllocationUsageRow::class.java))
    result.forAll {
      it.areaId shouldBe testAllocation.areaId
      it.allocation shouldBe testAllocation.allocation
      it.allocationDaily shouldBe testAllocation.meteredAllocationDaily
      it.meteredAllocationYearly shouldBe testAllocation.meteredAllocationYearly
      it.dailyUsage shouldBe BigDecimal(0)
    }
  }

  fun `should aggregate observation data`() {}
  fun `should handle changes to allocations`() {}
  fun `should handle changes to allocations in the same day`() {}
  fun `should use null data before an allocation is effective`() {}
  fun `should handle an allocation being before the earliest time period`() {}
  fun `should not include allocation data when a consent status is not active`() {}
  fun `should not include an allocations observations when is_metered is false`() {}

  fun truncateTestData() {
    jdbcTemplate.execute("truncate water_allocations cascade")
    jdbcTemplate.execute("truncate observations cascade")
    jdbcTemplate.execute("truncate observation_sites_measurements cascade")
    jdbcTemplate.execute("truncate observation_sites cascade")
  }

  fun createTestAllocation(allocation: AllocationRow) {

    val effectiveTo = if (allocation.effectiveTo != null) "'${allocation.effectiveTo}'" else null
    val meters = allocation.meters.joinToString(",")

    jdbcTemplate.update(
        """
      INSERT INTO water_allocations (area_id, allocation, ingest_id, source_id, consent_id, status, is_metered, metered_allocation_daily, metered_allocation_yearly, meters, effective_from, effective_to, created_at, updated_at)
      VALUES (
          '${allocation.areaId}',
          '${allocation.allocation}',
          '${allocation.ingestId}',
          '${allocation.sourceId}',
          '${allocation.consentId}',
          '${allocation.status}',
          '${allocation.isMetered}',
          '${allocation.meteredAllocationDaily}',
          '${allocation.meteredAllocationYearly}',
          '{$meters}',
          '${allocation.effectiveFrom}',
          $effectiveTo,
          now(),
          now()
      )
      """)
  }

  fun createTestObservation(siteId: Int, amount: Int, timestamp: Instant) {

    val measurementId = createOrRetrieveSiteAndMeasurement(siteId)
    jdbcTemplate.update(
        """
        INSERT INTO observations (observation_measurement_id, amount, observed_at)
        VALUES ($measurementId, $amount, '$timestamp')
        """)
  }

  fun createOrRetrieveSiteAndMeasurement(siteId: Int): Int {
    val councilId = 9
    val measurementName = "Water Meter Reading"
    val keyHolder: KeyHolder = GeneratedKeyHolder()

    jdbcTemplate.update(
        """
        INSERT INTO observation_sites (id, council_id, name)
        VALUES ($siteId, $councilId, 'Test site')
        ON CONFLICT (id) DO NOTHING
        """)

    jdbcTemplate.update(
        { connection ->
          connection.prepareStatement(
              """
        INSERT INTO observation_sites_measurements (site_id, measurement_name, first_observation_at, last_observation_at, observation_count)
        VALUES ($siteId, '$measurementName', now(), now(), 0)
        ON CONFLICT(site_id, measurement_name) DO UPDATE SET measurement_name = '$measurementName'
        RETURNING id
        """,
              arrayOf("id"))
        },
        keyHolder)
    return keyHolder.keys?.get("id") as Int
  }
}
