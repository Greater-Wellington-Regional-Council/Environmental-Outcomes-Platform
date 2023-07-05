package nz.govt.eop.hilltop_crawler.support

import org.junit.jupiter.api.Test

class HilltopMeasurementListParserTest {

  @Test
  fun `should parse a site locations XML content`() {
    // GIVEN
    val input = this.javaClass.getResource("/hilltop-xml/measurementlist.xml")!!.readText()

    // WHEN
    HilltopXmlParsers.parseMeasurementNames(input)

    // THEN
    //    result.size shouldBe 10
  }
}
