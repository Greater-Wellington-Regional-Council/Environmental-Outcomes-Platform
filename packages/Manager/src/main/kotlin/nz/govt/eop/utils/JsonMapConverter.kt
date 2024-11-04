package nz.govt.eop.utils

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

@Converter
class JsonMapConverter : AttributeConverter<Map<String, Any>, String> {
  private val objectMapper = jacksonObjectMapper()

  override fun convertToDatabaseColumn(attribute: Map<String, Any>): String {
    return objectMapper.writeValueAsString(attribute)
  }

  @Suppress("UNCHECKED_CAST")
  override fun convertToEntityAttribute(dbData: String?): Map<String, Any>? {
    return if (dbData == null) null else (objectMapper.readValue(dbData, Map::class.java) as Map<String, Any>)
  }
}
