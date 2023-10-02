package nz.govt.eop.hilltop_crawler.fetcher

import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.date.shouldBeAfter
import io.kotest.matchers.date.shouldBeBefore
import io.kotest.matchers.shouldBe
import java.net.URI
import java.time.Instant
import java.time.YearMonth
import java.time.ZoneOffset
import nz.govt.eop.hilltop_crawler.api.parsers.*
import nz.govt.eop.hilltop_crawler.db.DB
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles("test")
class TaskMappersTests {

  @Nested
  inner class SitesListTaskMapperTests {

    private fun createRecordForTesting(sites: List<HilltopSite> = emptyList()) =
        SitesListTaskMapper(
            DB.HilltopSourcesRow(
                1,
                1,
                "http://some.url",
                DB.HilltopSourceConfig(emptyList(), listOf("some ignored site"))),
            URI("http://some.uri?foo=bar"),
            Instant.parse("2000-01-01T00:00:00Z"),
            "some content",
            HilltopSites("some agency", "some projection", sites))

    @Test
    fun `should return empty ist of tasks when there are no sites for determine next tasks`() {
      // GIVEN
      val underTest = createRecordForTesting()

      // WHEN
      val result = underTest.buildNewTasksList()

      // THEN
      result shouldHaveSize 0
    }

    @Test
    fun `should return list of tasks mapped from sites for determine next tasks`() {
      // GIVEN
      val underTest = createRecordForTesting(listOf(HilltopSite("Some Site", null, null)))

      // WHEN
      val result = underTest.buildNewTasksList()

      // THEN
      result shouldBe
          listOf(
              DB.HilltopFetchTaskCreate(
                  1,
                  HilltopMessageType.MEASUREMENTS_LIST,
                  "http://some.uri?Service=Hilltop&Request=MeasurementList&Site=Some%20Site",
              ))
    }

    @Test
    fun `should ignore sites listed in config for determine next tasks`() {
      // GIVEN
      val underTest = createRecordForTesting(listOf(HilltopSite("some ignored site", null, null)))

      // WHEN
      val result = underTest.buildNewTasksList()

      // THEN
      result shouldHaveSize 0
    }

    @Test
    fun `should return Kafka message`() {

      // GIVEN
      val underTest = createRecordForTesting()

      // WHEN
      val result = underTest.buildKafkaMessage()

      // THEN
      result shouldBe
          HilltopSitesMessage(
              1,
              "http://some.uri",
              Instant.parse("2000-01-01T00:00:00Z"),
              "http://some.uri?foo=bar",
              "some content",
          )
    }

    @Test
    fun `should return next fetch at in next month`() {
      // GIVEN
      val underTest = createRecordForTesting()

      // WHEN
      val result = underTest.determineNextFetchAt()

      // THEN
      result shouldBeAfter Instant.parse("2000-01-01T00:00:00Z")
      result shouldBeBefore Instant.parse("2000-01-31T00:00:00Z")
    }
  }

  @Nested
  inner class MeasurementsListTaskMapperTests {

    private fun createRecordForTesting() =
        createRecordForTesting(
            listOf(
                HilltopDatasource(
                    "some datasource name",
                    "some site name",
                    "2000-01-01T00:00:00Z",
                    "2000-01-01T00:00:00Z",
                    "StdSeries",
                    listOf(HilltopMeasurement("some measurement name", "some request as", 1, 1)))))

    private fun createRecordForTesting(dataSources: List<HilltopDatasource>) =
        MeasurementsListTaskMapper(
            DB.HilltopSourcesRow(
                1,
                1,
                "http://some.url",
                DB.HilltopSourceConfig(
                    listOf("some datasource name", "another datasource name"), emptyList())),
            URI("http://some.uri?foo=bar"),
            Instant.parse("2000-01-01T00:00:00Z"),
            "some content",
            HilltopMeasurements(dataSources))

    @Test
    fun `should return list of tasks mapped from measurements for determine next tasks`() {
      // GIVEN
      val underTest =
          createRecordForTesting(
              listOf(
                  HilltopDatasource(
                      "some datasource name",
                      "some site name",
                      "2000-01-01T00:00:00Z",
                      "2000-01-01T00:00:00Z",
                      "StdSeries",
                      listOf(
                          HilltopMeasurement("some datasource name", "some datasource name", 1)))))

      // WHEN
      val result = underTest.buildNewTasksList()

      // THEN
      result shouldBe
          listOf(
              DB.HilltopFetchTaskCreate(
                  1,
                  HilltopMessageType.MEASUREMENT_DATA,
                  "http://some.uri?Service=Hilltop&Request=GetData&Site=some%20site%20name&Measurement=some%20datasource%20name&from=2000-01-01T00:00&to=2000-01-31T23:59:59",
              ))
    }

    @Test
    fun `should return list of tasks mapped from all measurements for determine next tasks`() {
      // GIVEN
      val underTest =
          createRecordForTesting(
              listOf(
                  HilltopDatasource(
                      "some datasource name",
                      "some site name",
                      "2000-01-01T00:00:00Z",
                      "2000-01-01T00:00:00Z",
                      "StdSeries",
                      listOf(
                          HilltopMeasurement("some datasource name", "some datasource name", 1))),
                  HilltopDatasource(
                      "another datasource name",
                      "some site name",
                      "2000-01-01T00:00:00Z",
                      "2000-01-01T00:00:00Z",
                      "StdSeries",
                      listOf(
                          HilltopMeasurement(
                              "another datasource name", "another datasource name", 1))),
              ))

      // WHEN
      val result = underTest.buildNewTasksList()

      // THEN
      result shouldBe
          listOf(
              DB.HilltopFetchTaskCreate(
                  1,
                  HilltopMessageType.MEASUREMENT_DATA,
                  "http://some.uri?Service=Hilltop&Request=GetData&Site=some%20site%20name&Measurement=some%20datasource%20name&from=2000-01-01T00:00&to=2000-01-31T23:59:59",
              ),
              DB.HilltopFetchTaskCreate(
                  1,
                  HilltopMessageType.MEASUREMENT_DATA,
                  "http://some.uri?Service=Hilltop&Request=GetData&Site=some%20site%20name&Measurement=another%20datasource%20name&from=2000-01-01T00:00&to=2000-01-31T23:59:59",
              ))
    }

    @Test
    fun `should return list of tasks mapped from measurements split by month for determine next tasks`() {
      // GIVEN
      val underTest =
          createRecordForTesting(
              listOf(
                  HilltopDatasource(
                      "some datasource name",
                      "some site name",
                      "2000-01-01T00:00:00Z",
                      "2000-06-01T00:00:00Z",
                      "StdSeries",
                      listOf(
                          HilltopMeasurement("some datasource name", "some datasource name", 1))),
              ))

      // WHEN
      val result = underTest.buildNewTasksList()

      // THEN
      result shouldBe
          listOf(
              DB.HilltopFetchTaskCreate(
                  1,
                  HilltopMessageType.MEASUREMENT_DATA,
                  "http://some.uri?Service=Hilltop&Request=GetData&Site=some%20site%20name&Measurement=some%20datasource%20name&from=2000-01-01T00:00&to=2000-01-31T23:59:59",
              ),
              DB.HilltopFetchTaskCreate(
                  1,
                  HilltopMessageType.MEASUREMENT_DATA,
                  "http://some.uri?Service=Hilltop&Request=GetData&Site=some%20site%20name&Measurement=some%20datasource%20name&from=2000-02-01T00:00&to=2000-02-29T23:59:59",
              ),
              DB.HilltopFetchTaskCreate(
                  1,
                  HilltopMessageType.MEASUREMENT_DATA,
                  "http://some.uri?Service=Hilltop&Request=GetData&Site=some%20site%20name&Measurement=some%20datasource%20name&from=2000-03-01T00:00&to=2000-03-31T23:59:59",
              ),
              DB.HilltopFetchTaskCreate(
                  1,
                  HilltopMessageType.MEASUREMENT_DATA,
                  "http://some.uri?Service=Hilltop&Request=GetData&Site=some%20site%20name&Measurement=some%20datasource%20name&from=2000-04-01T00:00&to=2000-04-30T23:59:59",
              ),
              DB.HilltopFetchTaskCreate(
                  1,
                  HilltopMessageType.MEASUREMENT_DATA,
                  "http://some.uri?Service=Hilltop&Request=GetData&Site=some%20site%20name&Measurement=some%20datasource%20name&from=2000-05-01T00:00&to=2000-05-31T23:59:59",
              ),
              DB.HilltopFetchTaskCreate(
                  1,
                  HilltopMessageType.MEASUREMENT_DATA,
                  "http://some.uri?Service=Hilltop&Request=GetData&Site=some%20site%20name&Measurement=some%20datasource%20name&from=2000-06-01T00:00&to=2000-06-30T23:59:59",
              ),
          )
    }

    @Test
    fun `should return list of tasks mapped from measurements for determine next tasks using the requestAs name in the URL`() {
      // GIVEN
      val underTest =
          createRecordForTesting(
              listOf(
                  HilltopDatasource(
                      "some datasource name",
                      "some site name",
                      "2000-01-01T00:00:00Z",
                      "2000-01-01T00:00:00Z",
                      "StdSeries",
                      listOf(
                          HilltopMeasurement("some datasource name", "check me out like this", 1))),
              ))

      // WHEN
      val result = underTest.buildNewTasksList()

      // THEN
      result shouldBe
          listOf(
              DB.HilltopFetchTaskCreate(
                  1,
                  HilltopMessageType.MEASUREMENT_DATA,
                  "http://some.uri?Service=Hilltop&Request=GetData&Site=some%20site%20name&Measurement=check%20me%20out%20like%20this&from=2000-01-01T00:00&to=2000-01-31T23:59:59",
              ),
          )
    }

    @Test
    fun `should handle when message no Measurements which are not Virtual and have the same name as the datasource`() {
      // GIVEN
      val underTest =
          createRecordForTesting(
              listOf(
                  HilltopDatasource(
                      "some datasource name",
                      "some site name",
                      "2000-01-01T00:00:00Z",
                      "2000-01-01T00:00:00Z",
                      "StdSeries",
                      listOf(
                          HilltopMeasurement(
                              "some datasource name", "check me out like this", 1, 1))),
              ))

      // WHEN
      val result = underTest.buildNewTasksList()

      // THEN
      result shouldHaveSize 0
    }

    @Test
    fun `should ignore measurement names that are excluded via source config for determine next tasks`() {
      // GIVEN
      val underTest =
          createRecordForTesting(
              listOf(
                  HilltopDatasource(
                      "some ignored name",
                      "some site name",
                      "2000-01-01T00:00:00Z",
                      "2000-01-01T00:00:00Z",
                      "StdSeries",
                      listOf(HilltopMeasurement("some name", "some request as", 1, 1)))))

      // WHEN
      val result = underTest.buildNewTasksList()

      // THEN
      result shouldHaveSize 0
    }

    @Test
    fun `should return Kafka message`() {

      // GIVEN
      val underTest = createRecordForTesting()

      // WHEN
      val result = underTest.buildKafkaMessage()

      // THEN
      result shouldBe
          HilltopMeasurementListMessage(
              1,
              "http://some.uri",
              Instant.parse("2000-01-01T00:00:00Z"),
              "some site name",
              "http://some.uri?foo=bar",
              "some content",
          )
    }

    @Test
    fun `should return next fetch at in next month`() {
      // GIVEN
      val underTest = createRecordForTesting()

      // WHEN
      val result = underTest.determineNextFetchAt()

      // THEN
      result shouldBeAfter Instant.parse("2000-01-01T00:00:00Z")
      result shouldBeBefore Instant.parse("2000-01-31T00:00:00Z")
    }
  }

  @Nested
  inner class MeasurementDataTaskMapperTests {

    private fun createRecordForTesting(
        fetchedAtString: String,
        lastValueAtString: String
    ): MeasurementDataTaskMapper {

      val fetchedAt = Instant.parse(fetchedAtString)
      val timestampInPlus12Time =
          Instant.parse(lastValueAtString)
              .atOffset(ZoneOffset.of("+12"))
              .toString()
              .substring(0, 16)

      return MeasurementDataTaskMapper(
          DB.HilltopSourcesRow(
              1, 1, "http://some.url", DB.HilltopSourceConfig(emptyList(), emptyList())),
          URI("http://some.uri?foo=bar"),
          fetchedAt,
          "some content",
          HilltopMeasurementValues(
              Measurement(
                  "some site name",
                  DataSource("some measurement name"),
                  Data(
                      "some name",
                      listOf(
                          Value(timestampInPlus12Time, "1.0", null),
                      )))))
    }

    @Test
    fun `should return empty list for determine next tasks`() {
      // GIVEN
      val underTest = createRecordForTesting("2000-01-01T00:00:00Z", "2000-01-01T00:00:00Z")

      // WHEN
      val result = underTest.buildNewTasksList()

      // THEN
      result shouldHaveSize 0
    }

    @Test
    fun `should return null for Kafka message when there are no measurements`() {
      // GIVEN
      val fetchedAt = Instant.parse("2000-01-01T00:00:00Z")

      val underTest =
          MeasurementDataTaskMapper(
              DB.HilltopSourcesRow(
                  1, 1, "http://some.url", DB.HilltopSourceConfig(emptyList(), emptyList())),
              URI("http://some.uri"),
              fetchedAt,
              "some content",
              HilltopMeasurementValues(null))

      // WHEN
      val result = underTest.buildKafkaMessage()

      // THEN
      result shouldBe null
    }

    @Test
    fun `should return Kafka message when there are measurements`() {
      // GIVEN
      val underTest = createRecordForTesting("2000-01-01T00:20:00Z", "2000-01-01T00:00:00Z")

      // WHEN
      val result = underTest.buildKafkaMessage()

      // THEN
      result shouldBe
          HilltopMeasurementsMessage(
              1,
              "http://some.uri",
              Instant.parse("2000-01-01T00:20:00Z"),
              "some site name",
              "some measurement name",
              YearMonth.of(2000, 1),
              "http://some.uri?foo=bar",
              "some content",
          )
    }

    @Test
    fun `should return next fetch at in the next 30 minutes when last value was recent`() {
      // GIVEN
      val underTest = createRecordForTesting("2000-01-01T00:20:00Z", "2000-01-01T00:00:00Z")

      // WHEN
      val result = underTest.determineNextFetchAt()

      // THEN
      result shouldBeAfter Instant.parse("2000-01-01T00:20:00Z")
      result shouldBeBefore Instant.parse("2000-01-01T00:50:00Z")
    }

    @Test
    fun `should return next fetch at least 15 minutes after last value`() {
      // GIVEN
      val underTest = createRecordForTesting("2000-01-01T00:05:00Z", "2000-01-01T00:00:00Z")

      // WHEN
      val result = underTest.determineNextFetchAt()

      // THEN
      result shouldBeAfter Instant.parse("2000-01-01T00:15:00Z")
      result shouldBeBefore Instant.parse("2000-01-01T00:45:00Z")
    }

    @Test
    fun `should return next fetch at in the next hour when last value was within a day`() {
      // GIVEN
      val underTest = createRecordForTesting("2000-01-01T23:00:00Z", "2000-01-01T00:00:00Z")

      // WHEN
      val result = underTest.determineNextFetchAt()

      // THEN
      result shouldBeAfter Instant.parse("2000-01-01T23:00:00Z")
      result shouldBeBefore Instant.parse("2000-01-02T00:00:00Z")
    }

    @Test
    fun `should return next fetch at in the next day when last value was within a week`() {
      // GIVEN
      val underTest = createRecordForTesting("2000-01-07T00:00:00Z", "2000-01-01T00:00:00Z")

      // WHEN
      val result = underTest.determineNextFetchAt()

      // THEN
      result shouldBeAfter Instant.parse("2000-01-07T00:00:00Z")
      result shouldBeBefore Instant.parse("2000-01-08T00:00:00Z")
    }

    @Test
    fun `should return next fetch at in the next week when last value was within a month`() {
      // GIVEN
      val underTest = createRecordForTesting("2000-01-27T00:00:00Z", "2000-01-01T00:00:00Z")

      // WHEN
      val result = underTest.determineNextFetchAt()

      // THEN
      result shouldBeAfter Instant.parse("2000-01-27T00:00:00Z")
      result shouldBeBefore Instant.parse("2000-02-03T00:00:00Z")
    }

    @Test
    fun `should return next fetch at in next month when the last measurement is a long time ago`() {
      // GIVEN
      val underTest = createRecordForTesting("2020-01-01T00:00:00Z", "2000-01-01T00:00:00Z")

      // WHEN
      val result = underTest.determineNextFetchAt()

      // THEN
      result shouldBeAfter Instant.parse("2020-01-01T00:00:00Z")
      result shouldBeBefore Instant.parse("2020-01-31T00:00:00Z")
    }

    @Test
    fun `should return next fetch at in next month when there is no measurements`() {
      // GIVEN
      val fetchedAt = Instant.parse("2000-01-01T00:00:00Z")

      val underTest =
          MeasurementDataTaskMapper(
              DB.HilltopSourcesRow(
                  1, 1, "http://some.url", DB.HilltopSourceConfig(emptyList(), emptyList())),
              URI("http://some.uri"),
              fetchedAt,
              "some content",
              HilltopMeasurementValues(null))

      // WHEN
      val result = underTest.determineNextFetchAt()

      // THEN
      result shouldBeAfter Instant.parse("2000-01-01T00:00:00Z")
      result shouldBeBefore Instant.parse("2000-01-31T00:00:00Z")
    }
  }
}
