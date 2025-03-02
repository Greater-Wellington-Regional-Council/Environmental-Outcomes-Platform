package nz.govt.eop.utils

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

@Converter
class JsonMapConverter : AttributeConverter<Map<String, Any?>, String> {
  private val objectMapper = ObjectMapper()

  override fun convertToDatabaseColumn(attribute: Map<String, Any?>?): String? {
    return if (attribute == null) null else objectMapper.writeValueAsString(attribute)
  }

  @Suppress("UNCHECKED_CAST")
  override fun convertToEntityAttribute(dbData: String?): Map<String, Any?> {
    return if (dbData.isNullOrEmpty() || dbData == "{}") emptyMap()
    else objectMapper.readValue(dbData, Map::class.java) as Map<String, Any?>
  }
}
