package nz.govt.eop.hilltop_crawler.api.parsers

import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test

class HilltopXmlParsersTest {

  val underTest = HilltopXmlParsers()

  @Nested
  inner class SitesResponse {
    @Test
    fun `should parse a site locations XML`() {
      // GIVEN
      val input = this.javaClass.getResource("/hilltop-xml/SitesResponse-list.xml")!!.readText()

      // WHEN
      val result = underTest.parseSitesResponse(input)

      // THEN
      result.agency shouldBe "Horizons"
      result.projection shouldBe "NZMG"
      result.sites shouldBe
          arrayListOf(
              HilltopSite("Wrens Creek at Graham Road", 2764950, 6100940),
              HilltopSite("X Forest Rd Drain at Drop Structure", null, null))
    }

    @Test
    fun `should parse a site locations XML content when there are no sites`() {
      // GIVEN
      val input = this.javaClass.getResource("/hilltop-xml/SitesResponse-empty.xml")!!.readText()

      // WHEN
      val result = underTest.parseSitesResponse(input)

      // THEN
      result.agency shouldBe "Horizons"
      result.projection shouldBe "NZMG"
      result.sites shouldBe arrayListOf()
    }

    @Test
    fun `should parse a site locations XML content when there is no projection`() {
      // GIVEN
      val input =
          this.javaClass.getResource("/hilltop-xml/SitesResponse-no-projection.xml")!!.readText()

      // WHEN
      val result = underTest.parseSitesResponse(input)

      // THEN
      result.agency shouldBe "Horizons"
      result.projection shouldBe null
      result.sites shouldBe
          arrayListOf(
              HilltopSite("Wrens Creek at Graham Road", 2764950, 6100940),
              HilltopSite("X Forest Rd Drain at Drop Structure", null, null))
    }
  }

  @Nested
  inner class MeasurementsResponse {
    @Test
    fun `should parse a site measurements response XML`() {
      // GIVEN
      val input =
          this.javaClass.getResource("/hilltop-xml/MeasurementsResponse-list.xml")!!.readText()

      // WHEN
      val result = underTest.parseMeasurementsResponse(input)

      // THEN
      result.datasources.size shouldBe 18
      result.datasources.map { it.name } shouldBe
          arrayListOf(
              "Rainfall",
              "Voltage",
              "SCADA Rainfall",
              "SCADA Rainfall (backup)",
              "Air Temperature (1.5m)",
              "Relative Humidity",
              "Campbell Signature",
              "Campbell Software Version",
              "Rainfall",
              "Voltage",
              "SCADA Rainfall",
              "SCADA Rainfall (backup)",
              "Air Temperature (1.5m)",
              "Relative Humidity",
              "Campbell Signature",
              "Campbell Software Version",
              "Rainfall",
              "SCADA Rainfall")

      result.datasources.map { it.type } shouldBe
          arrayListOf(
              "StdSeries",
              "StdSeries",
              "StdSeries",
              "StdSeries",
              "StdSeries",
              "StdSeries",
              "StdSeries",
              "StdSeries",
              "StdQualSeries",
              "StdQualSeries",
              "StdQualSeries",
              "StdQualSeries",
              "StdQualSeries",
              "StdQualSeries",
              "StdQualSeries",
              "StdQualSeries",
              "CheckSeries",
              "CheckSeries")

      result.datasources[0].measurements.size shouldBe 9

      result.datasources[0].measurements[0].name shouldBe "Rainfall"
      result.datasources[0].measurements[0].requestAs shouldBe "Rainfall [Rainfall]"
      result.datasources[0].measurements[0].itemNumber shouldBe 1
      result.datasources[0].measurements[0].vm shouldBe null

      result.datasources[0].measurements[8].name shouldBe "Precipitation Total (Gap Series)"
      result.datasources[0].measurements[8].requestAs shouldBe "Precipitation Total (Gap Series)"
      result.datasources[0].measurements[8].itemNumber shouldBe 1
      result.datasources[0].measurements[8].vm shouldBe 1

      result.datasources[17].measurements[3].name shouldBe "Comment"
      result.datasources[17].measurements[3].requestAs shouldBe "Comment [SCADA Rainfall]"
      result.datasources[17].measurements[3].itemNumber shouldBe 4
      result.datasources[17].measurements[3].vm shouldBe null
    }
  }

  @Nested
  inner class MeasurementValuesResponse {
    @Test
    fun `should parse a site measurement values response XML`() {
      // GIVEN
      val input =
          this.javaClass.getResource("/hilltop-xml/MeasurementValuesResponse.xml")!!.readText()

      // WHEN
      val result = underTest.parseMeasurementValuesResponse(input)

      // THEN
      result.measurement!!.siteName shouldBe "R26/6804"
      result.measurement!!.dataSource.measurementName shouldBe "Water Meter Volume"
    }
  }

  @Nested
  inner class ErrorResponse {
    @Test
    fun `should parse a error response XML`() {
      // GIVEN
      val input = this.javaClass.getResource("/hilltop-xml/ErrorResponse.xml")!!.readText()

      // WHEN
      val result = underTest.isHilltopErrorXml(input)

      // THEN
      result shouldBe true
    }

    @Test
    fun `should parse a non-error response XML`() {
      // GIVEN
      val input =
          this.javaClass.getResource("/hilltop-xml/MeasurementsResponse-list.xml")!!.readText()

      // WHEN
      val result = underTest.isHilltopErrorXml(input)

      // THEN
      result shouldBe false
    }
  }
}
