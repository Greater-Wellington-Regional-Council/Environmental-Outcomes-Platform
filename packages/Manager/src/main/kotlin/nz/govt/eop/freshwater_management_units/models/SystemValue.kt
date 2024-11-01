package nz.govt.eop.freshwater_management_units.models

import jakarta.persistence.*
import java.time.LocalDateTime
import nz.govt.eop.utils.JsonMapConverter

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
