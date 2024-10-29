package nz.govt.eop.freshwater_management_units.services

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder

@Service
class LinzDataService(
    private val restTemplate: RestTemplate,
    @Value("\${linz.koord.api.key}") private val linzApiKey: String
) {

  @Suppress("UNCHECKED_CAST")
  fun getUnitOfPropertyIdForAddressId(addressId: String): String {
    val url =
        UriComponentsBuilder.fromHttpUrl("https://data.linz.govt.nz/services;key=$linzApiKey")
            .queryParam("service", "WFS")
            .queryParam("version", "2.0.0")
            .queryParam("request", "GetFeature")
            .queryParam("typeNames", "table-115638")
            .queryParam("cql_filter", "address_id=$addressId")
            .queryParam("PropertyName", "(id,unit_of_property_id,address_id)")
            .queryParam("outputFormat", "json")
            .toUriString()

    val response = restTemplate.getForEntity(url, Map::class.java)
    val body = response.body as? Map<String, Any>
    if (!response.statusCode.is2xxSuccessful || body == null) {
      throw RuntimeException("Failed to retrieve address data for address $addressId")
    }

    val features =
        body["features"] as? List<Map<String, Any>> ?: throw RuntimeException("Features not found")
    return features.firstOrNull()?.get("properties")?.let {
      (it as Map<*, *>)["unit_of_property_id"] as? String
    } ?: throw RuntimeException("unit_of_property_id not found for address $addressId")
  }

  @Suppress("UNCHECKED_CAST")
  fun getGeometryForUnitOfProperty(unitOfPropertyId: String, projection: String): Map<String, Any> {
    val url =
        UriComponentsBuilder.fromHttpUrl("https://data.linz.govt.nz/services;key=$linzApiKey")
            .queryParam("service", "WFS")
            .queryParam("version", "2.0.0")
            .queryParam("request", "GetFeature")
            .queryParam("typeNames", "layer-113968")
            .queryParam("cql_filter", "unit_of_property_id='$unitOfPropertyId'")
            .queryParam("PropertyName", "(unit_of_property_id,geom)")
            .queryParam("SRSName", projection)
            .queryParam("outputFormat", "json")
            .toUriString()

    val response = restTemplate.getForEntity(url, Map::class.java)
    val body = response.body as? Map<String, Any>
    if (!response.statusCode.is2xxSuccessful || body == null) {
      throw RuntimeException(
          "Failed to retrieve geometry data for unit of property $unitOfPropertyId")
    }

    return body
  }
}
