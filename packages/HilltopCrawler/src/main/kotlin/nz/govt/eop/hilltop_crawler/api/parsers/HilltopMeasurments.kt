package nz.govt.eop.hilltop_crawler.api.parsers

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty

data class HilltopMeasurements(
    @JacksonXmlProperty(localName = "DataSource")
    @JacksonXmlElementWrapper(useWrapping = false)
    val datasources: List<HilltopDatasource>
)

data class HilltopDatasource(
    @JacksonXmlProperty(localName = "Name", isAttribute = true) val name: String,
    @JacksonXmlProperty(localName = "Site", isAttribute = true) val siteName: String,
    @JacksonXmlProperty(localName = "From") val from: String,
    @JacksonXmlProperty(localName = "To") val to: String,
    @JacksonXmlProperty(localName = "TSType") val type: String,
    @JacksonXmlProperty(localName = "Measurement")
    @JacksonXmlElementWrapper(useWrapping = false)
    val measurements: List<HilltopMeasurement> = emptyList()
)

data class HilltopMeasurement(
    @JacksonXmlProperty(localName = "Name", isAttribute = true) val name: String,
    @JacksonXmlProperty(localName = "RequestAs") val requestAs: String,
    @JacksonXmlProperty(localName = "Item") val itemNumber: Int,
    @JacksonXmlProperty(localName = "VM") val vm: Int? = null
)
