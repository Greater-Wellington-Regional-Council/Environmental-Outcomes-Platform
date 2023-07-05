package nz.govt.eop.hilltop_crawler.support

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.dataformat.xml.XmlMapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty
import com.fasterxml.jackson.module.kotlin.KotlinModule

data class HilltopSitesXml(
    @JacksonXmlProperty(localName = "Agency") val agency: String,
    @JacksonXmlProperty(localName = "Projection") val projection: String?,
    @JacksonXmlProperty(localName = "Site")
    @JacksonXmlElementWrapper(useWrapping = false)
    val sites: List<HilltopSiteXml> = arrayListOf()
) {
  fun validSites(): List<HilltopSiteXml> = sites.filter { it.isValidSite() }
}

data class HilltopSiteXml(
    @JacksonXmlProperty(localName = "Name", isAttribute = true) val name: String,
    @JacksonXmlProperty(localName = "Easting") val easting: Int?,
    @JacksonXmlProperty(localName = "Northing") val northing: Int?
) {
  fun isValidSite(): Boolean = name != "HY Maitai at Forks" && easting != null && northing != null
}

object HilltopSitesParser {

  val xmlMapper =
      XmlMapper.builder()
          .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
          .addModule(KotlinModule.Builder().build())
          .build()

  fun parseSites(data: String): HilltopSitesXml {
    return xmlMapper.readValue(data, HilltopSitesXml::class.java)
  }
}
