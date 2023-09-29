package nz.govt.eop.hilltop_crawler.api.parsers

import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty
import java.math.BigDecimal
import java.time.LocalDateTime
import java.time.OffsetDateTime
import java.time.ZoneOffset

data class HilltopMeasurementValues(
    @JacksonXmlProperty(localName = "Measurement") val measurement: Measurement?
)

data class Measurement(
    @JacksonXmlProperty(localName = "SiteName", isAttribute = true) val siteName: String,
    @JacksonXmlProperty(localName = "DataSource") val dataSource: DataSource,
    @JacksonXmlProperty(localName = "Data") val data: Data
)

data class DataSource(
    @JacksonXmlProperty(localName = "Name", isAttribute = true) val measurementName: String,
)

data class Data(
    @JacksonXmlProperty(localName = "DateFormat", isAttribute = true) val dateFormat: String,
    @JacksonXmlProperty(localName = "E")
    @JacksonXmlElementWrapper(useWrapping = false)
    val values: List<Value> = emptyList()
)

data class Value(
    @JacksonXmlProperty(localName = "T") val timestampString: String,
    @JacksonXmlProperty(localName = "I1") val value1String: String?,
    @JacksonXmlProperty(localName = "Value") val value2String: String?,
    @JacksonXmlProperty(localName = "Parameter")
    @JacksonXmlElementWrapper(useWrapping = false)
    val parameters: List<Parameter>? = null
) {
  val value: BigDecimal
    get() = BigDecimal(value1String ?: value2String)

  val timestamp: OffsetDateTime
    get() = LocalDateTime.parse(timestampString).atOffset(ZoneOffset.of("+12"))
}

data class Parameter(
    @JacksonXmlProperty(localName = "Name") val name: String,
    @JacksonXmlProperty(localName = "Value") val value: String
)
