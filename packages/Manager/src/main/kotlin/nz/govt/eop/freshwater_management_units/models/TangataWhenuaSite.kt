package nz.govt.eop.freshwater_management_units.models

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.persistence.*
import nz.govt.eop.utils.StringToListConverter
import org.geojson.Feature
import org.geojson.FeatureCollection
import org.geojson.Geometry
import org.hibernate.annotations.Formula

@Entity
@Table(name = "tangata_whenua_sites")
data class TangataWhenuaSite(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) var id: Int? = null,
    @Column(name = "location") val location: String? = "",
    @Convert(converter = StringToListConverter::class)
    @Column(name = "location_values")
    val locationValues: List<String> = emptyList(),
    @Formula("ST_AsGeoJSON(ST_Transform(geom, 4326), 6, 2)") var geomGeoJson: String? = null,
)

fun List<TangataWhenuaSite>.toFeatureCollection(): FeatureCollection {
  val mapper = ObjectMapper()
  val featureCollection = FeatureCollection()

  this.forEach { site ->
    site.geomGeoJson?.let { geomString ->
      val geometry = mapper.readValue(geomString, Geometry::class.java)
      val feature = Feature()
      feature.geometry = geometry
      feature.properties["id"] = site.id
      feature.properties["location"] = site.location ?: ""
      feature.properties["locationValues"] = site.locationValues.joinToString(",")
      feature.properties["Values_"] = site.locationValues.joinToString(",")
      featureCollection.add(feature)
    }
  }

  return featureCollection
}
