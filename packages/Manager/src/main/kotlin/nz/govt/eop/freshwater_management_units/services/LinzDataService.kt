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
class LinzDataWebClientConfig {

  @Value("\${linz.koord.api.base-url}") private lateinit var baseUrl: String

  @Bean
  fun linzDataWebClient(): WebClient {
    return WebClient.builder()
        .baseUrl(baseUrl)
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .build()
  }
}

@Service
class LinzDataService(
    private val linzDataWebClient: WebClient,
    @Value("\${linz.koord.api.key}") private val linzApiKey: String
) {

  fun getUnitOfPropertyIdForAddressId(addressId: String): String = runBlocking {
    val body =
        linzDataWebClient
            .get()
            .uri {
              it.path("/services;key=$linzApiKey/wfs")
                  .queryParam("service", "WFS")
                  .queryParam("version", "2.0.0")
                  .queryParam("request", "GetFeature")
                  .queryParam("typeNames", "table-115638")
                  .queryParam("cql_filter", "address_id=$addressId")
                  .queryParam("PropertyName", "(id,unit_of_property_id,address_id)")
                  .queryParam("outputFormat", "json")
                  .build()
            }
            .retrieve()
            .awaitBody<Map<String, Any>>()

    @Suppress("UNCHECKED_CAST")
    val features =
        body["features"] as? List<Map<String, Any>> ?: throw RuntimeException("Features not found")

    features.firstOrNull()?.get("properties")?.let {
      (it as Map<*, *>)["unit_of_property_id"] as? String
    } ?: throw RuntimeException("unit_of_property_id not found for address $addressId")
  }

  fun getGeometryForUnitOfProperty(unitOfPropertyId: String, projection: String): Map<String, Any> =
      runBlocking {
        val body =
            linzDataWebClient
                .get()
                .uri {
                  it.path("/services;key=$linzApiKey/wfs")
                      .queryParam("service", "WFS")
                      .queryParam("version", "2.0.0")
                      .queryParam("request", "GetFeature")
                      .queryParam("typeNames", "layer-113968")
                      .queryParam("cql_filter", "unit_of_property_id='$unitOfPropertyId'")
                      .queryParam("PropertyName", "(unit_of_property_id,geom)")
                      .queryParam("SRSName", projection)
                      .queryParam("outputFormat", "json")
                      .build()
                }
                .retrieve()
                .awaitBody<Map<String, Any>>()

        if (body.isEmpty()) {
          throw RuntimeException(
              "Failed to retrieve geometry data for unit of property $unitOfPropertyId")
        }

        body
      }
}
