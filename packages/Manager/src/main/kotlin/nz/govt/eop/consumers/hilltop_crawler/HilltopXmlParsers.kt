package nz.govt.eop.consumers.hilltop_crawler

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.dataformat.xml.XmlMapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlElementWrapper
import com.fasterxml.jackson.dataformat.xml.annotation.JacksonXmlProperty
import com.fasterxml.jackson.module.kotlin.KotlinModule

data class HilltopMeasurementDataXml(
    @JacksonXmlProperty(localName = "Measurement")
    val measurement: HilltopMeasurementDataMeasurement
)

data class HilltopMeasurementDataMeasurement(
    @JacksonXmlProperty(localName = "SiteName", isAttribute = true) val siteId: String,
    @JacksonXmlProperty(localName = "DataSource") val dataSource: DataSource,
    @JacksonXmlProperty(localName = "Data") val data: Data
)

data class DataSource(@JacksonXmlProperty(localName = "Name", isAttribute = true) val name: String)

data class Data(
    @JacksonXmlProperty(localName = "DateFormat", isAttribute = true) val dateFormat: String,
    @JacksonXmlProperty(localName = "E")
    @JacksonXmlElementWrapper(useWrapping = false)
    val values: List<Value>
)

data class Value(
    @JacksonXmlProperty(localName = "T") val timestamp: String,
    @JacksonXmlProperty(localName = "I1") val value1: String?,
    @JacksonXmlProperty(localName = "Value") val value2: String?,
    @JacksonXmlProperty(localName = "Parameter")
    @JacksonXmlElementWrapper(useWrapping = false)
    val parameters: List<Parameter>?
)

data class Parameter(
    @JacksonXmlProperty(localName = "Name") val name: String,
    @JacksonXmlProperty(localName = "Value") val value: String
)

data class Measurement(
    val timestamp: String,
    val value: String?,
    val parameters: Map<String, String>?
)

data class MeasurementData(
    val siteId: String,
    val measurementName: String,
    val measurements: List<Measurement>
)

object HilltopXmlParsers {

  val xmlMapper =
      XmlMapper.builder()
          .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
          .addModule(KotlinModule.Builder().build())
          .build()

  fun parseSiteMeasurementData(data: ByteArray): MeasurementData {
    val hilltopXML = xmlMapper.readValue(data, HilltopMeasurementDataXml::class.java)

    return MeasurementData(
        hilltopXML.measurement.siteId,
        hilltopXML.measurement.dataSource.name,
        hilltopXML.measurement.data.values.map {
          val value: String? = it.value1 ?: it.value2
          Measurement(
              it.timestamp,
              value,
              if (it.parameters != null)
                  it.parameters.map { param -> Pair(param.name, param.value) }.toMap()
              else null)
        })
  }
}
