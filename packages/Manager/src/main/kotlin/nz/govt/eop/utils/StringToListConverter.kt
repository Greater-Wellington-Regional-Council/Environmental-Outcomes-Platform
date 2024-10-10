package nz.govt.eop.utils

import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter

@Converter
class StringToListConverter : AttributeConverter<List<String>, String> {

  override fun convertToDatabaseColumn(attribute: List<String>?): String {
    return attribute?.joinToString(",", "(", ")") { "\"$it\"" } ?: ""
  }

  override fun convertToEntityAttribute(dbData: String?): List<String> {
    return dbData?.let {
      val trimmed = it.trim().removeSurrounding("(", ")")
      val regex = Regex("\"([^\"]*)\"|([^,]+)")
      regex
          .findAll(trimmed)
          .mapNotNull { matchResult ->
            matchResult.groups[1]?.value ?: matchResult.groups[2]?.value
          }
          .map { s -> s.trim() }
          .toList()
    } ?: emptyList()
  }
}
