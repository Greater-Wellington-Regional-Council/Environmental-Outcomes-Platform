package nz.govt.eop.freshwater_management_units.models

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper
import kotlin.reflect.full.memberProperties

data class FreshwaterManagementUnitFeature(
    val id: Int?,
    val type: String = "Feature",
    val geometry: JsonNode?,
    val properties: Map<String, Any>,
)

data class FreshwaterManagementUnitFeatureCollection(
    val type: String = "FeatureCollection",
    val features: List<FreshwaterManagementUnitFeature>,
)

fun FreshwaterManagementUnit.toFeature(): FreshwaterManagementUnitFeature {
  val objectMapper = ObjectMapper()

  return FreshwaterManagementUnitFeature(
      id = this.id,
      geometry = objectMapper.readTree(this.boundary),
      properties =
          this::class
              .memberProperties
              .filter { it.name != "geom" && it.name != "boundary" }
              .mapNotNull { prop -> prop.getter.call(this)?.let { prop.name to it } }
              .toMap(),
  )
}

fun List<FreshwaterManagementUnit>.toFeatureCollection():
    FreshwaterManagementUnitFeatureCollection {
  return FreshwaterManagementUnitFeatureCollection(features = this.map { it.toFeature() })
}

fun FreshwaterManagementUnitFeatureCollection.toGeoJson(): String {
  val objectMapper = ObjectMapper()
  return objectMapper.writeValueAsString(this)
}
