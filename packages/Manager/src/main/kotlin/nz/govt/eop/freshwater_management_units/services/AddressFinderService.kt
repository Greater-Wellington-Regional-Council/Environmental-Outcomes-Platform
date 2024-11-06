package nz.govt.eop.freshwater_management_units.services

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate
import org.springframework.web.util.UriComponentsBuilder

@Service
class AddressFinderService(
    private val restTemplate: RestTemplate,
    @Value("\${addressfinder.api.key}") private val addressFinderApiKey: String
) {
  companion object {
    private const val DEFAULT_REGION_CODE = "F" // Wellington
  }

  @Suppress("UNCHECKED_CAST")
  fun getAddressOptions(query: String?): List<Map<String, Any>> {
    val url =
        UriComponentsBuilder.fromHttpUrl(
                "https://api.addressfinder.io/api/nz/address/autocomplete/")
            .queryParam("key", addressFinderApiKey)
            .queryParam("q", query)
            .queryParam("format", "json")
            .queryParam("post_box", "0")
            .queryParam("strict", "2")
            .queryParam("region_code", DEFAULT_REGION_CODE)
            .queryParam("highlight", "1")
            .toUriString()

    val response = restTemplate.getForEntity(url, Map::class.java)
    val body =
        response.body as? Map<String, Any>
            ?: throw RuntimeException(
                "Failed to get matching addresses. The AddressFinder service may be unavailable.")

    // Cast completions to List<Map<String, Any?>> and remove nullable entries
    val completions = body["completions"] as? List<Map<String, Any?>> ?: emptyList()
    return completions.map { completion ->
      mapOf(
          "label" to (completion["a"] ?: ""), // Provide a default value for nullable entries
          "value" to (completion["pxid"] ?: ""))
    }
  }

  @Suppress("UNCHECKED_CAST")
  fun getAddressByPxid(pxid: String): Map<String, Any> {
    val url =
        UriComponentsBuilder.fromHttpUrl("https://api.addressfinder.io/api/nz/address/metadata/")
            .queryParam("key", addressFinderApiKey)
            .queryParam("format", "json")
            .queryParam("pxid", pxid)
            .toUriString()

    val response = restTemplate.getForEntity(url, Map::class.java)
    val body =
        response.body as? Map<String, Any>
            ?: throw RuntimeException(
                "Failed to retrieve address data. The AddressFinder service may be unavailable.")

    // Safely extract required fields, providing default values where needed
    val aimsAddressId =
        body["aims_address_id"] ?: throw RuntimeException("aims_address_id not found")
    val address = body["a"] ?: "Unknown Address"
    val x = body["x"] ?: throw RuntimeException("X coordinate not found")
    val y = body["y"] ?: throw RuntimeException("Y coordinate not found")

    return mapOf(
        "id" to aimsAddressId,
        "address" to address,
        "location" to
            mapOf(
                "type" to "Feature",
                "geometry" to mapOf("type" to "Point", "coordinates" to listOf(x, y)),
                "properties" to emptyMap<String, Any>()))
  }
}
