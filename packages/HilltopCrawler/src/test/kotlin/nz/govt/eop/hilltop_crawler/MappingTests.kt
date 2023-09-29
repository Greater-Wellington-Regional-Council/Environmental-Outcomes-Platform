package nz.govt.eop.hilltop_crawler

import io.kotest.matchers.shouldBe
import java.time.LocalDate
import java.time.YearMonth
import java.time.format.DateTimeFormatter
import java.time.temporal.Temporal
import nz.govt.eop.hilltop_crawler.api.parsers.HilltopDatasource
import nz.govt.eop.hilltop_crawler.api.parsers.HilltopMeasurement
import org.junit.jupiter.api.Test
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles("test")
class MappingTests {

  @Test
  fun `should map a measurement list`() {

    // GIVEN
    val input =
        HilltopDatasource(
            name = "Test",
            siteName = "123",
            from = "2020-01-01T15:30:00",
            to = "2020-12-31T09:50:55",
            type = "Test",
            measurements =
                listOf(HilltopMeasurement(name = "Test", requestAs = "Test", itemNumber = 1)))

    // WHEN
    val result =
        generateMonthSequence(
            LocalDate.parse(
                input.from.subSequence(0, 10), DateTimeFormatter.ofPattern("yyyy-MM-dd")),
            LocalDate.parse(input.to.subSequence(0, 10), DateTimeFormatter.ofPattern("yyyy-MM-dd")))

    // THEN
    result shouldBe
        listOf(
            YearMonth.of(2020, 1),
            YearMonth.of(2020, 2),
            YearMonth.of(2020, 3),
            YearMonth.of(2020, 4),
            YearMonth.of(2020, 5),
            YearMonth.of(2020, 6),
            YearMonth.of(2020, 7),
            YearMonth.of(2020, 8),
            YearMonth.of(2020, 9),
            YearMonth.of(2020, 10),
            YearMonth.of(2020, 11),
            YearMonth.of(2020, 12),
        )
  }

  /** Generates a sequence of `YearMonth` from `startDate` to `endDate` inclusively. */
  private fun <T : Temporal> generateMonthSequence(startDate: T, endDate: T): List<YearMonth> {
    val firstElement = YearMonth.from(startDate)
    val lastElement = YearMonth.from(endDate)
    return generateSequence(firstElement) { it.plusMonths(1) }
        .takeWhile { it <= lastElement }
        .toList()
  }
}
