package nz.govt.eop.farm_management_units.models

import com.fasterxml.jackson.databind.JsonNode
import com.fasterxml.jackson.databind.ObjectMapper

data class FarmManagementUnitFeatureCollection(
    val type: String = "FeatureCollection",
    val features: List<FarmManagementUnitFeature>
)

data class FarmManagementUnitFeature(
    val id: Int?,
    val type: String = "Feature",
    val geometry: JsonNode?,
    val properties: Map<String, Any>
)

fun FarmManagementUnit.toFeature(): FarmManagementUnitFeature {
  val objectMapper = ObjectMapper()

  return FarmManagementUnitFeature(
      id = this.id, geometry = objectMapper.readTree(this.geom), properties = mapOf())
}

fun List<FarmManagementUnit>.toFeatureCollection(): FarmManagementUnitFeatureCollection {
  return FarmManagementUnitFeatureCollection(features = this.map { it.toFeature() })
}
