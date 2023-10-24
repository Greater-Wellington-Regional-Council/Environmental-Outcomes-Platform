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
  fun materializeView() {
    jdbcTemplate.execute("REFRESH MATERIALIZED VIEW water_allocation_and_usage_by_area;")
  }
  @Test
  fun `should be empty with no allocations`() {
    // GIVEN
    // WHEN
    val result =
        jdbcTemplate.queryForObject(
            "select count(*) from water_allocation_and_usage_by_area", Int::class.java)

    // THEN
    result shouldBe 0
  }

  @Test
  fun `should include a year of data for an area`() {
    // GIVEN
    createTestAllocation(testAllocation)

    // WHEN
    val result =
        jdbcTemplate.queryForMap(
            "select count(*) as count, min(date) as min_date, max(date) as max_date from water_allocation_and_usage_by_area where area_id = '${testAllocation.areaId}'")

    // THEN
    arrayOf(365L, 366L) shouldContain result["count"] as Long
    val min = LocalDate.parse(result["min_date"].toString())
    val max = LocalDate.parse(result["max_date"].toString())
    min.plusYears(1).plusDays(-1) shouldBe max
  }
  @Test
  fun `should use default allocation data before the effective date`() {
    // GIVEN
    createTestAllocation(testAllocation)

    // WHEN
    val dateFilter = testEffectiveFrom.toString()
    val results =
        queryAllocationsAndUsage(
            "where area_id = '${testAllocation.areaId}' and date < '$dateFilter'")

    // THEN
    checkResults(results, testAreaId, BigDecimal(0), BigDecimal(0), BigDecimal(0))
  }

  @Test
  fun `should aggregate allocation data from the effective date`() {
    // GIVEN
    createTestAllocation(testAllocation)

    // WHEN
    val dateFilter = testEffectiveFrom.toString()
    val results =
        queryAllocationsAndUsage(
            "where area_id = '${testAllocation.areaId}' and date >= '$dateFilter'")

    // THEN
    checkResults(
        results,
        testAllocation.areaId,
        testAllocation.allocation,
        testAllocation.meteredAllocationDaily,
        testAllocation.meteredAllocationYearly)
  }
  @Test
  fun `should handle an allocation being effective before the earliest time period`() {
    // GIVEN
    val dateOlderThanAYear = LocalDate.now().atStartOfDay().minusYears(2).toInstant(ZoneOffset.UTC)
    val oldAllocation = testAllocation.copy(effectiveFrom = dateOlderThanAYear)
    createTestAllocation(oldAllocation)

    // WHEN
    val results =
        queryAllocationsAndUsage(
            "where area_id = '${oldAllocation.areaId}' and date >= '$dateOlderThanAYear'")

    // THEN
    checkResults(
        results,
        oldAllocation.areaId,
        oldAllocation.allocation,
        oldAllocation.meteredAllocationDaily,
        oldAllocation.meteredAllocationYearly)
  }

  @Test
  fun `should aggregate observation data`() {
    // GIVEN
    val observationDate = LocalDate.now().atStartOfDay().minusDays(10)
    createTestAllocation(testAllocation)
    createTestObservation(testSiteId, 10, observationDate.toInstant(ZoneOffset.UTC))

    // WHEN
    val whereClause = "where area_id = '${testAllocation.areaId}' and date = '${observationDate}'"

    // THEN
    val result = queryAllocationsAndUsage(whereClause)
    result.size shouldBe 1
    result[0].dailyUsage.compareTo(BigDecimal(864)) shouldBe 0

    // GIVEN
    createTestObservation(testSiteId, 5, observationDate.plusHours(1).toInstant(ZoneOffset.UTC))

    // WHEN
    val secondResult = queryAllocationsAndUsage(whereClause)

    // THEN
    secondResult[0].dailyUsage.compareTo(BigDecimal(648)) shouldBe 0
  }

  @Test
  fun `should handle changes to allocation data`() {
    // GIVEN
    val allocationUpdatedAt = LocalDate.now().atStartOfDay().minusDays(10)
    val initialAllocation =
        testAllocation.copy(effectiveTo = allocationUpdatedAt.toInstant(ZoneOffset.UTC))
    createTestAllocation(initialAllocation)
    val updateAllocation =
        testAllocation.copy(
            allocation = BigDecimal(200),
            meteredAllocationDaily = BigDecimal(20),
            meteredAllocationYearly = BigDecimal(20),
            meters = listOf(),
            effectiveFrom = allocationUpdatedAt.toInstant(ZoneOffset.UTC))
    createTestAllocation(updateAllocation)
    createTestObservation(testSiteId, 10, allocationUpdatedAt.toInstant(ZoneOffset.UTC))

    // WHEN
    val resultBeforeUpdate =
        queryAllocationsAndUsage(
            "where area_id = '${initialAllocation.areaId}' and date >= '${initialAllocation.effectiveFrom}' and date < '${allocationUpdatedAt}'")

    // THEN
    checkResults(
        resultBeforeUpdate,
        initialAllocation.areaId,
        initialAllocation.allocation,
        initialAllocation.meteredAllocationDaily,
        initialAllocation.meteredAllocationYearly,
        BigDecimal(0))

    // WHEN
    val resultAfterUpdate =
        queryAllocationsAndUsage(
            "where area_id = '${updateAllocation.areaId}' and date >= '${allocationUpdatedAt}'")

    // THEN
    checkResults(
        resultAfterUpdate,
        updateAllocation.areaId,
        updateAllocation.allocation,
        updateAllocation.meteredAllocationDaily,
        updateAllocation.meteredAllocationYearly,
        BigDecimal(0))
  }

  @Test
  fun `should handle changes to allocation data in the same day`() {
    // GIVEN
    val firstAllocationUpdatedAt = LocalDate.now().atStartOfDay().minusDays(10)
    val secondAllocationUpdatedAt = firstAllocationUpdatedAt.plusHours(2)
    createTestAllocation(
        testAllocation.copy(effectiveTo = firstAllocationUpdatedAt.toInstant(ZoneOffset.UTC)))
    createTestAllocation(
        testAllocation.copy(
            allocation = BigDecimal(20),
            effectiveFrom = firstAllocationUpdatedAt.toInstant(ZoneOffset.UTC),
            effectiveTo = secondAllocationUpdatedAt.toInstant(ZoneOffset.UTC)))
    createTestAllocation(
        testAllocation.copy(
            allocation = BigDecimal(30),
            effectiveFrom = secondAllocationUpdatedAt.toInstant(ZoneOffset.UTC)))

    // WHEN
    val results =
        queryAllocationsAndUsage(
            "where area_id = '${testAllocation.areaId}' and date = '${secondAllocationUpdatedAt}'")

    // THEN
    checkResults(results, testAreaId, allocation = BigDecimal(30))
  }
  @Test
  fun `should not include allocation data when a consent status is not active`() {
    // GIVEN
    val allocationUpdatedAt = LocalDate.now().atStartOfDay().minusDays(10)
    val initialAllocation =
        testAllocation.copy(effectiveTo = allocationUpdatedAt.toInstant(ZoneOffset.UTC))
    createTestAllocation(initialAllocation)
    val updatedAllocation =
        testAllocation.copy(
            effectiveFrom = allocationUpdatedAt.toInstant(ZoneOffset.UTC),
            status = ConsentStatus.inactive)
    createTestAllocation(updatedAllocation)

    // WHEN
    val results =
        queryAllocationsAndUsage(
            "where area_id = '${updatedAllocation.areaId}' and date >= '${allocationUpdatedAt}'")

    // THEN
    checkResults(results, updatedAllocation.areaId, BigDecimal(0), BigDecimal(0), BigDecimal(0))
  }

  @Test
  fun `should not include an allocations observations when is_metered is false`() {
    // GIVEN
    val allocationWithIsMeteredFalse = testAllocation.copy(isMetered = false)
    createTestAllocation(allocationWithIsMeteredFalse)
    val observationDate = LocalDate.now().atStartOfDay().minusDays(10)
    createTestObservation(testSiteId, 10, observationDate.toInstant(ZoneOffset.UTC))

    // WHEN
    val result =
        queryAllocationsAndUsage(
            "where area_id = '${testAllocation.areaId}' and date = '${observationDate}'")

    // THEN
    result[0].dailyUsage.compareTo(BigDecimal(0)) shouldBe 0
  }

  @Test
  fun `should aggregate allocation data for different areas separately`() {
    // GIVEN
    createTestAllocation(testAllocation)
    val secondAllocationInSameArea =
        testAllocation.copy(sourceId = "another-source-same-area", meters = listOf("2", "3"))
    createTestAllocation(secondAllocationInSameArea)

    val allocationInDifferentArea =
        testAllocation.copy(
            areaId = "different-area-id",
            sourceId = "another-source-different-area",
            meters = listOf("4"))
    createTestAllocation(allocationInDifferentArea)

    val observationDate = LocalDate.now().atStartOfDay().minusDays(10)
    createTestObservation(testSiteId, 10, observationDate.toInstant(ZoneOffset.UTC))
    createTestObservation(
        secondAllocationInSameArea.meters[0].toInt(), 5, observationDate.toInstant(ZoneOffset.UTC))
    createTestObservation(
        secondAllocationInSameArea.meters[1].toInt(), 5, observationDate.toInstant(ZoneOffset.UTC))
    createTestObservation(
        allocationInDifferentArea.meters.first().toInt(),
        30,
        observationDate.toInstant(ZoneOffset.UTC))

    // WHEN
    val results =
        queryAllocationsAndUsage(
            "where area_id = '${testAllocation.areaId}' and date = '$observationDate'")

    // THEN
    results.size shouldBe 1
    checkResults(
        results,
        testAllocation.areaId,
        testAllocation.allocation + secondAllocationInSameArea.allocation,
        testAllocation.meteredAllocationDaily + secondAllocationInSameArea.meteredAllocationDaily,
        testAllocation.meteredAllocationYearly + secondAllocationInSameArea.meteredAllocationYearly,
        BigDecimal(1728))

    // WHEN
    val resultsInADifferentArea =
        queryAllocationsAndUsage(
            "where area_id = '${allocationInDifferentArea.areaId}' and date = '$observationDate'")

    // THEN
    resultsInADifferentArea[0].dailyUsage.compareTo(BigDecimal(2592)) shouldBe 0
  }

  fun queryAllocationsAndUsage(whereClause: String): MutableList<WaterAllocationUsageRow> =
      jdbcTemplate.query(
          """select * from water_allocation_and_usage_by_area $whereClause""",
          DataClassRowMapper.newInstance(WaterAllocationUsageRow::class.java))

  fun checkResults(
      results: List<WaterAllocationUsageRow>,
      areaId: String? = null,
      allocation: BigDecimal? = null,
      meteredAllocationDaily: BigDecimal? = null,
      meteredAllocationYearly: BigDecimal? = null,
      dailyUsage: BigDecimal? = null
  ) {
    results.forAll {
      if (areaId != null) it.areaId shouldBe areaId
      if (allocation != null) it.allocation.compareTo(allocation) shouldBe 0
      if (meteredAllocationDaily != null)
          it.allocationDaily.compareTo(meteredAllocationDaily) shouldBe 0
      if (meteredAllocationYearly != null)
          it.meteredAllocationYearly.compareTo(meteredAllocationYearly) shouldBe 0
      if (dailyUsage != null) it.dailyUsage.compareTo(dailyUsage) shouldBe 0
    }
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
    val measurementName = "Water Meter Volume"
    val keyHolder: KeyHolder = GeneratedKeyHolder()

    jdbcTemplate.update(
        """
        INSERT INTO observation_sites (id, council_id, name)
        VALUES ($siteId, $councilId, '$siteId')
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
