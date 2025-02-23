package nz.govt.eop.utils

import org.geojson.FeatureCollection
import org.springframework.http.HttpStatus
import org.springframework.web.client.RestTemplate
import java.net.URI

open class GeoJsonFetcher(
    private val restTemplate: RestTemplate,
    val fetchCache: MutableMap<String, FeatureCollection> =
        mutableMapOf<String, FeatureCollection>(),
) {
  fun fetchFeatureCollection(url: URI): FeatureCollection {
    val resp = restTemplate.getForEntity(url, FeatureCollection::class.java)
    if (resp.statusCode == HttpStatus.OK && resp.body != null) {
      return resp.body!!
    } else {
      throw RuntimeException("Request failed with status: ${resp.statusCode} or body is null")
    }
  }
}
