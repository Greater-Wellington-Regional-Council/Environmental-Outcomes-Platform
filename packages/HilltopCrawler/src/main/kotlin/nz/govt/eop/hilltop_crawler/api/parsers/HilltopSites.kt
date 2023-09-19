package nz.govt.eop.hilltop_crawler.api.parsers

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty

data class HilltopSites(
    @JacksonXmlProperty(localName = "Agency") val agency: String,
    @JacksonXmlProperty(localName = "Projection") val projection: String?,
    @JacksonXmlProperty(localName = "Site")
    @JacksonXmlElementWrapper(useWrapping = false)
    val sites: List<HilltopSite> = arrayListOf()
)

data class HilltopSite(
    @JacksonXmlProperty(localName = "Name", isAttribute = true) val name: String,
    @JacksonXmlProperty(localName = "Easting") val easting: Int?,
    @JacksonXmlProperty(localName = "Northing") val northing: Int?
)
