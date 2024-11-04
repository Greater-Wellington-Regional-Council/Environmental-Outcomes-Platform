package nz.govt.eop.freshwater_management_units.models

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.persistence.*
import nz.govt.eop.utils.JsonMapConverter
import nz.govt.eop.utils.StringToListConverter
import org.geojson.Feature
import org.geojson.FeatureCollection
import org.hibernate.annotations.Formula
import org.geojson.Geometry
import org.geojson.Point

@Entity
@Table(name = "tangata_whenua_sites")
data class TangataWhenuaSite(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Int? = null,
    @Column(name = "location") val location: String? = "",
    @Convert(converter = StringToListConverter::class)
    @ElementCollection
    @CollectionTable(name = "location_values", joinColumns = [JoinColumn(name = "tangata_whenua_site_id")])
    @Column(name = "location_value")
    val locationValues: List<String> = emptyList(),
    @Column(name = "source_name")
    val sourceName: String? = null,
    @Column(name = "properties", columnDefinition = "jsonb")
    @Convert(converter = JsonMapConverter::class)
    var properties: Map<String, Any?> = emptyMap(),
    @Formula("ST_AsGeoJSON(ST_Transform(geom, 4326), 6, 2)") var geomGeoJson: String? = null

) {
    @get:Transient
    val significantSites: List<String>
        get() = locationValues.ifEmpty {
            listOf(
                "Te_Mahi_Kai", "Wāhi_Mahara", "Te_Hā_o_te_Ora",
                "Wāhi_Whakarite", "Te_Mana_o_te_Wai", "Te_Mana_o_te_Tangata",
                "Te_Manawaroa_o_te_Wai", "Ngā_Mahi_a_ngā_Tūpuna"
            ).filter { properties[it] !== null }
        }
}

fun List<TangataWhenuaSite>.toFeatureCollection(): FeatureCollection {
    val mapper = ObjectMapper()
    val featureCollection = FeatureCollection()

    this.forEach { site ->
        site.geomGeoJson?.let { geomString ->
            val geometryNode: JsonNode = mapper.readTree(geomString)
            val feature = Feature()

            feature.geometry = when (geometryNode.get("type").asText()) {
                "Point" -> mapper.treeToValue(geometryNode, Point::class.java)
                else -> mapper.treeToValue(geometryNode, Geometry::class.java)
            }

            feature.properties["id"] = site.id
            feature.properties["location"] =
                site.location.takeUnless { it.isNullOrBlank() } ?: site.properties["Name"] ?: ""
            feature.properties["sites"] = site.significantSites
            feature.properties["source"] = site.sourceName ?: "Not given - check application.yml on backend service"

            // Add other properties
            site.properties.filterValues { it !== null }.forEach { (key, value) ->
                feature.properties[key] = value
            }

            featureCollection.add(feature)
        }
    }

    return featureCollection
}
