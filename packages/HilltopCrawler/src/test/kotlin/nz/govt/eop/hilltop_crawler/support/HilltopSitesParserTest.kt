package nz.govt.eop.hilltop_crawler.support

import io.kotest.matchers.shouldBe
import org.junit.jupiter.api.Test

class HilltopSitesParserTest {

  @Test
  fun `should parse a site locations XML content`() {
    // GIVEN
    val input = this.javaClass.getResource("/hilltop-xml/sitelist.xml")!!.readText()

    // WHEN
    val result = HilltopSitesParser.parseSites(input)

    // THEN
    result.agency shouldBe "Horizons"
    result.projection shouldBe "NZMG"
    result.sites shouldBe
        arrayListOf(
            HilltopSiteXml("Wrens Creek at Graham Road", 2764950, 6100940),
            HilltopSiteXml("X Forest Rd Drain at Drop Structure", null, null))

    result.validSites() shouldBe
        arrayListOf(HilltopSiteXml("Wrens Creek at Graham Road", 2764950, 6100940))
  }

  @Test
  fun `should parse a site locations XML content when there are no sites`() {
    // GIVEN
    val input = this.javaClass.getResource("/hilltop-xml/sitelist-empty.xml")!!.readText()

    // WHEN
    val result = HilltopSitesParser.parseSites(input)

    // THEN
    result.agency shouldBe "Horizons"
    result.projection shouldBe "NZMG"
    result.sites shouldBe arrayListOf()
    result.validSites() shouldBe arrayListOf()
  }

  @Test
  fun `should parse a site locations XML content when there is no projection`() {
    // GIVEN
    val input = this.javaClass.getResource("/hilltop-xml/sitelist-no-projection.xml")!!.readText()

    // WHEN
    val result = HilltopSitesParser.parseSites(input)

    // THEN
    result.agency shouldBe "Horizons"
    result.projection shouldBe null
    result.sites shouldBe
        arrayListOf(
            HilltopSiteXml("Wrens Creek at Graham Road", 2764950, 6100940),
            HilltopSiteXml("X Forest Rd Drain at Drop Structure", null, null))

    result.validSites() shouldBe
        arrayListOf(HilltopSiteXml("Wrens Creek at Graham Road", 2764950, 6100940))
  }
}
