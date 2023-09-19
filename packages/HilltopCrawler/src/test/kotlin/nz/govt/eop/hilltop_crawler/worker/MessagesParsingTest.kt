package nz.govt.eop.hilltop_crawler.worker

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import io.kotest.assertions.json.shouldEqualJson
import io.kotest.matchers.shouldBe
import java.time.Instant
import java.time.YearMonth
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder

class MessagesParsingTest {
  val objectMapper =
      Jackson2ObjectMapperBuilder()
          .featuresToDisable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS)
          .build<ObjectMapper>()
  @Nested
  inner class HilltopMessageKeyParsing {

    @Test
    fun `Should parse a HilltopSitesMessageKey from JSON`() {
      // GIVEN
      val json =
          """
                        {
	                        "councilId": 9,
	                        "hilltopBaseUrl": "https://hilltop.gw.govt.nz/WaterUse.hts",
	                        "type": "SITES_LIST",
	                        "at": "2023-09-11T21:10:17.594098Z"
                        }
                        """
              .trimIndent()

      // WHEN
      val result = objectMapper.readValue(json, HilltopMessageKey::class.java)

      // THEN
      result shouldBe
          HilltopSitesMessageKey(
              9,
              "https://hilltop.gw.govt.nz/WaterUse.hts",
              Instant.parse("2023-09-11T21:10:17.594098Z"))
    }

    @Test
    fun `Should parse a HilltopMeasurementListMessageKey from JSON`() {
      // GIVEN
      val json =
          """
                        {
	                        "councilId": 9,
	                        "hilltopBaseUrl": "https://hilltop.gw.govt.nz/WaterUse.hts",
	                        "type": "MEASUREMENTS_LIST",
	                        "at": "2023-09-11T21:10:18.034236Z",
	                        "siteName": "259250/2"
                        }
                        """
              .trimIndent()

      // WHEN
      val result = objectMapper.readValue(json, HilltopMessageKey::class.java)

      // THEN
      result shouldBe
          HilltopMeasurementListMessageKey(
              9,
              "https://hilltop.gw.govt.nz/WaterUse.hts",
              Instant.parse("2023-09-11T21:10:18.034236Z"),
              "259250/2")
    }

    @Test
    fun `Should parse a HilltopMeasurementsMessageKey from JSON`() {
      // GIVEN
      val json =
          """
                        {
                            "councilId": 9,
                            "hilltopBaseUrl": "https://hilltop.gw.govt.nz/WaterUse.hts",
                            "type": "MEASUREMENT_DATA",
                            "at": "2023-09-11T21:11:56.876507Z",
                            "siteName": "292019/18",
                            "measurementName": "Water Meter Volume",
                            "yearMonth": "2022-01"
                        }
                        """
              .trimIndent()

      // WHEN
      val result = objectMapper.readValue(json, HilltopMessageKey::class.java)

      // THEN
      result shouldBe
          HilltopMeasurementsMessageKey(
              9,
              "https://hilltop.gw.govt.nz/WaterUse.hts",
              Instant.parse("2023-09-11T21:11:56.876507Z"),
              "292019/18",
              "Water Meter Volume",
              YearMonth.of(2022, 1))
    }
  }

  @Nested
  inner class HilltopMessageKeySerialization {

    @Test
    fun `Should write a HilltopSitesMessageKey to JSON`() {
      // GIVEN
      val message =
          HilltopSitesMessageKey(
              9,
              "https://hilltop.gw.govt.nz/WaterUse.hts",
              Instant.parse("2023-09-11T21:10:17.594098Z"))

      // WHEN
      val result = objectMapper.writeValueAsString(message)

      // THEN
      val json =
          """
                        {
	                        "councilId": 9,
	                        "hilltopBaseUrl": "https://hilltop.gw.govt.nz/WaterUse.hts",
	                        "type": "SITES_LIST",
	                        "at": "2023-09-11T21:10:17.594098Z"
                        }
                        """
              .trimIndent()

      result shouldEqualJson json
    }

    @Test
    fun `Should write a HilltopMeasurementListMessageKey to JSON`() {
      // GIVEN
      val message =
          HilltopMeasurementListMessageKey(
              9,
              "https://hilltop.gw.govt.nz/WaterUse.hts",
              Instant.parse("2023-09-11T21:10:18.034236Z"),
              "259250/2")

      // WHEN
      val result = objectMapper.writeValueAsString(message)

      // THEN
      val json =
          """
                        {
	                        "councilId": 9,
	                        "hilltopBaseUrl": "https://hilltop.gw.govt.nz/WaterUse.hts",
	                        "type": "MEASUREMENTS_LIST",
	                        "at": "2023-09-11T21:10:18.034236Z",
	                        "siteName": "259250/2"
                        }
                        """
              .trimIndent()
      result shouldEqualJson json
    }

    @Test
    fun `Should write a HilltopMeasurementsMessageKey to JSON`() {
      // GIVEN
      val message =
          HilltopMeasurementsMessageKey(
              9,
              "https://hilltop.gw.govt.nz/WaterUse.hts",
              Instant.parse("2023-09-11T21:11:56.876507Z"),
              "292019/18",
              "Water Meter Volume",
              YearMonth.of(2022, 1))

      // WHEN
      val result = objectMapper.writeValueAsString(message)
      // THEN
      val json =
          """
                        {
                            "councilId": 9,
                            "hilltopBaseUrl": "https://hilltop.gw.govt.nz/WaterUse.hts",
                            "type": "MEASUREMENT_DATA",
                            "at": "2023-09-11T21:11:56.876507Z",
                            "siteName": "292019/18",
                            "measurementName": "Water Meter Volume",
                            "yearMonth": "2022-01"
                        }
                        """
              .trimIndent()
      result shouldEqualJson json
    }
  }

  @Nested
  inner class HilltopMessageParsing {

    @Test
    fun `Should parse a HilltopSitesMessage from JSON`() {
      // GIVEN
      val json =
          """
                    {
                        "councilId": 9,
                        "hilltopBaseUrl": "https://hilltop.gw.govt.nz/WaterUse.hts",
                        "type": "SITES_LIST",
                        "at": "2023-09-11T21:10:17.594098Z",
                        "hilltopUrl": "https://hilltop.gw.govt.nz/WaterUse.hts?Service=Hilltop&Request=SiteList&Location=Yes",
                        "xml": "<xml></xml>"
                    }
                        """
              .trimIndent()

      // WHEN
      val result = objectMapper.readValue(json, HilltopMessage::class.java)

      // THEN
      result shouldBe
          HilltopSitesMessage(
              9,
              "https://hilltop.gw.govt.nz/WaterUse.hts",
              Instant.parse("2023-09-11T21:10:17.594098Z"),
              "https://hilltop.gw.govt.nz/WaterUse.hts?Service=Hilltop&Request=SiteList&Location=Yes",
              "<xml></xml>")
    }

    @Test
    fun `Should parse a HilltopMeasurementListMessage from JSON`() {
      // GIVEN
      val json =
          """
                    {
                        "councilId": 9,
                        "hilltopBaseUrl": "https://hilltop.gw.govt.nz/WaterUse.hts",
                        "type": "MEASUREMENTS_LIST",
                        "at": "2023-09-11T21:10:19.965935Z",
                        "siteName": "292068/12",
                        "hilltopUrl": "https://hilltop.gw.govt.nz/WaterUse.hts?Service=Hilltop&Request=MeasurementList&Site=292068/12",
                        "xml": "<xml></xml>"
                    }
                        """
              .trimIndent()

      // WHEN
      val result = objectMapper.readValue(json, HilltopMessage::class.java)

      // THEN
      result shouldBe
          HilltopMeasurementListMessage(
              9,
              "https://hilltop.gw.govt.nz/WaterUse.hts",
              Instant.parse("2023-09-11T21:10:19.965935Z"),
              "292068/12",
              "https://hilltop.gw.govt.nz/WaterUse.hts?Service=Hilltop&Request=MeasurementList&Site=292068/12",
              "<xml></xml>")
    }

    @Test
    fun `Should parse a HilltopMeasurementsMessage from JSON`() {
      // GIVEN
      val json =
          """
                    {
                        "councilId": 9,
                        "hilltopBaseUrl": "https://hilltop.gw.govt.nz/WaterUse.hts",
                        "type": "MEASUREMENT_DATA",
                        "at": "2023-09-11T21:11:56.973761Z",
                        "siteName": "292019/18",
                        "measurementName": "Water Meter Volume",
                        "yearMonth": "2022-03",
                        "hilltopUrl": "https://hilltop.gw.govt.nz/WaterUse.hts?Service=Hilltop&Request=GetData&Site=292019/18&Measurement=Water%20Meter%20Volume&from=2022-03-01T00:00&to=2022-03-31T23:59:59",
                        "xml": "<xml></xml>"
                    }
                        """
              .trimIndent()

      // WHEN
      val result = objectMapper.readValue(json, HilltopMessage::class.java)

      // THEN
      result shouldBe
          HilltopMeasurementsMessage(
              9,
              "https://hilltop.gw.govt.nz/WaterUse.hts",
              Instant.parse("2023-09-11T21:11:56.973761Z"),
              "292019/18",
              "Water Meter Volume",
              YearMonth.of(2022, 3),
              "https://hilltop.gw.govt.nz/WaterUse.hts?Service=Hilltop&Request=GetData&Site=292019/18&Measurement=Water%20Meter%20Volume&from=2022-03-01T00:00&to=2022-03-31T23:59:59",
              "<xml></xml>")
    }
  }

  @Nested
  inner class HilltopMessageSerialization {

    @Test
    fun `Should write a HilltopSitesMessage to JSON`() {
      // GIVEN
      val message =
          HilltopSitesMessage(
              9,
              "https://hilltop.gw.govt.nz/WaterUse.hts",
              Instant.parse("2023-09-11T21:10:17.594098Z"),
              "https://hilltop.gw.govt.nz/WaterUse.hts?Service=Hilltop&Request=SiteList&Location=Yes",
              "<xml></xml>")

      // WHEN
      val result = objectMapper.writeValueAsString(message)

      // THEN
      val json =
          """
                    {
                        "councilId": 9,
                        "hilltopBaseUrl": "https://hilltop.gw.govt.nz/WaterUse.hts",
                        "type": "SITES_LIST",
                        "at": "2023-09-11T21:10:17.594098Z",
                        "hilltopUrl": "https://hilltop.gw.govt.nz/WaterUse.hts?Service=Hilltop&Request=SiteList&Location=Yes",
                        "xml": "<xml></xml>"
                    }
                        """
              .trimIndent()

      result shouldEqualJson json
    }

    @Test
    fun `Should write a HilltopMeasurementListMessage to JSON`() {
      // GIVEN
      val message =
          HilltopMeasurementListMessage(
              9,
              "https://hilltop.gw.govt.nz/WaterUse.hts",
              Instant.parse("2023-09-11T21:10:19.965935Z"),
              "292068/12",
              "https://hilltop.gw.govt.nz/WaterUse.hts?Service=Hilltop&Request=MeasurementList&Site=292068/12",
              "<xml></xml>")
      // WHEN
      val result = objectMapper.writeValueAsString(message)

      // THEN
      val json =
          """
                    {
                        "councilId": 9,
                        "hilltopBaseUrl": "https://hilltop.gw.govt.nz/WaterUse.hts",
                        "type": "MEASUREMENTS_LIST",
                        "at": "2023-09-11T21:10:19.965935Z",
                        "siteName": "292068/12",
                        "hilltopUrl": "https://hilltop.gw.govt.nz/WaterUse.hts?Service=Hilltop&Request=MeasurementList&Site=292068/12",
                        "xml": "<xml></xml>"
                    }
                        """
              .trimIndent()

      result shouldEqualJson json
    }

    @Test
    fun `Should write a HilltopMeasurementsMessage to JSON`() {
      // GIVEN
      val message =
          HilltopMeasurementsMessage(
              9,
              "https://hilltop.gw.govt.nz/WaterUse.hts",
              Instant.parse("2023-09-11T21:11:56.973761Z"),
              "292019/18",
              "Water Meter Volume",
              YearMonth.of(2022, 3),
              "https://hilltop.gw.govt.nz/WaterUse.hts?Service=Hilltop&Request=GetData&Site=292019/18&Measurement=Water%20Meter%20Volume&from=2022-03-01T00:00&to=2022-03-31T23:59:59",
              "<xml></xml>")

      // WHEN
      val result = objectMapper.writeValueAsString(message)

      // THEN
      val json =
          """
                    {
                        "councilId": 9,
                        "hilltopBaseUrl": "https://hilltop.gw.govt.nz/WaterUse.hts",
                        "type": "MEASUREMENT_DATA",
                        "at": "2023-09-11T21:11:56.973761Z",
                        "siteName": "292019/18",
                        "measurementName": "Water Meter Volume",
                        "yearMonth": "2022-03",
                        "hilltopUrl": "https://hilltop.gw.govt.nz/WaterUse.hts?Service=Hilltop&Request=GetData&Site=292019/18&Measurement=Water%20Meter%20Volume&from=2022-03-01T00:00&to=2022-03-31T23:59:59",
                        "xml": "<xml></xml>"
                    }
                        """
              .trimIndent()
      result shouldEqualJson json
    }
  }
}
