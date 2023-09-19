package nz.govt.eop.hilltop_crawler.api.parsers

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.dataformat.xml.XmlMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import org.springframework.stereotype.Component

@Component
class HilltopXmlParsers() {

  private final val xmlMapper: XmlMapper =
      XmlMapper.builder()
          .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
          .addModule(KotlinModule.Builder().build())
          .build()

  fun isHilltopErrorXml(data: String): Boolean {
    return xmlMapper.readTree(data).has("Error")
  }

  fun parseSitesResponse(data: String): HilltopSites {
    return xmlMapper.readValue(data, HilltopSites::class.java)
  }

  fun parseMeasurementsResponse(data: String): HilltopMeasurements {
    return xmlMapper.readValue(data, HilltopMeasurements::class.java)
  }

  fun parseMeasurementValuesResponse(data: String): HilltopMeasurementValues {
    return xmlMapper.readValue(data, HilltopMeasurementValues::class.java)
  }
}
