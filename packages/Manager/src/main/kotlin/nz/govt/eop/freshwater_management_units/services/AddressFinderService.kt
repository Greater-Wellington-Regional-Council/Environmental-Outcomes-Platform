package nz.govt.eop.freshwater_management_units.services

import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.reactive.function.client.WebClient
import org.springframework.web.reactive.function.client.awaitBody

@Configuration
class AddressFinderWebClientConfig {

  @Value("\${addressfinder.api.base-url}") private lateinit var baseUrl: String

  @Value("\${addressfinder.api.secret}") private lateinit var apiSecret: String

  @Bean
  fun addressFinderWebClient(): WebClient {
    return WebClient.builder()
        .baseUrl(baseUrl)
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .defaultHeader(HttpHeaders.AUTHORIZATION, apiSecret)
        .build()
  }
}

@Suppress("UNCHECKED_CAST")
@Service
class AddressFinderService(
    private val addressFinderWebClient: WebClient,
    @Value("\${addressfinder.api.key}") private val addressFinderApiKey: String
) {
  companion object {
    const val DEFAULT_REGION_CODE = "F"
  }

  fun getAddressOptions(
      query: String?,
      regionCode: String? = DEFAULT_REGION_CODE
  ): List<Map<String, Any>> = runBlocking {
    if (query == null) return@runBlocking emptyList()

    val body =
        addressFinderWebClient
            .get()
            .uri {
              it.path("/autocomplete/")
                  .queryParam("key", addressFinderApiKey)
                  .queryParam("q", query)
                  .queryParam("format", "json")
                  .queryParam("post_box", 0)
                  .queryParam("strict", 2)
                  .queryParam("region_code", regionCode ?: DEFAULT_REGION_CODE)
                  .queryParam("highlight", 1)
                  .build()
            }
            .retrieve()
            .awaitBody<Map<String, Any>>()

    val completions = body["completions"] as? List<Map<String, Any?>> ?: emptyList()

    return@runBlocking completions.map { completion ->
      mapOf(
          "label" to (completion["a"] ?: ""), // Provide a default value for nullable entries
          "value" to (completion["pxid"] ?: ""))
    }
  }

  fun getAddressByPxid(pxid: String): Map<String, Any> = runBlocking {
    val body =
        addressFinderWebClient
            .get()
            .uri {
              it.path("/metadata/")
                  .queryParam("key", addressFinderApiKey)
                  .queryParam("format", "json")
                  .queryParam("pxid", pxid)
                  .build()
            }
            .retrieve()
            .awaitBody<Map<String, Any>>()

    val aimsAddressId =
        body["aims_address_id"] ?: throw RuntimeException("aims_address_id not found")

    val address = body["a"] ?: "Unknown Address"

    val x = body["x"] ?: throw RuntimeException("X coordinate not found")
    val y = body["y"] ?: throw RuntimeException("Y coordinate not found")

    return@runBlocking mapOf(
        "id" to aimsAddressId,
        "address" to address,
        "location" to
            mapOf(
                "type" to "Feature",
                "geometry" to mapOf("type" to "Point", "coordinates" to listOf(x, y)),
                "properties" to emptyMap<String, Any>()))
  }
}
