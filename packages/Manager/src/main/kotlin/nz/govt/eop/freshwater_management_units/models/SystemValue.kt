package nz.govt.eop.freshwater_management_units.models

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import jakarta.persistence.*
import jakarta.persistence.AttributeConverter
import jakarta.persistence.Converter
import java.time.LocalDateTime

@Entity
@Table(
    name = "system_values",
    uniqueConstraints = [UniqueConstraint(columnNames = ["council_id", "value_name"])])
data class SystemValue(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long = 0,
    @Column(name = "council_id") val councilId: Int? = null,
    @Column(name = "value_name", nullable = false) val valueName: String = "",
    @Column(name = "value_as_json", columnDefinition = "jsonb")
    @Convert(converter = JsonMapConverter::class)
    var valueAsJson: Map<String, Any> = emptyMap(),
    @Column(name = "created_at", updatable = false)
    val createdAt: LocalDateTime = LocalDateTime.now(),
    @Column(name = "updated_at") var updatedAt: LocalDateTime = LocalDateTime.now()
)

@Converter
class JsonMapConverter : AttributeConverter<Map<String, Any>, String> {
  private val objectMapper = jacksonObjectMapper()

  override fun convertToDatabaseColumn(attribute: Map<String, Any>): String {
    return objectMapper.writeValueAsString(attribute)
  }

  @Suppress("UNCHECKED_CAST")
  override fun convertToEntityAttribute(dbData: String): Map<String, Any> {
    return objectMapper.readValue(dbData, Map::class.java) as Map<String, Any>
  }
}
