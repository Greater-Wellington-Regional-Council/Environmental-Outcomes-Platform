package nz.govt.eop.freshwater_management_units.models

import jakarta.persistence.*

@Entity
@Table(name = "tangata_whenua_sites")
data class TangataWhenuaSite(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Int? = null,
    @Column(name = "location") val location: String? = "",
    @Column(name = "geom") var geom: String? = null,
)

data class TangataWhenuaSiteSummary(
    val location: String,
)