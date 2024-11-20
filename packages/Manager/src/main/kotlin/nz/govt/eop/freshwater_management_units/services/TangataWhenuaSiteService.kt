package nz.govt.eop.freshwater_management_units.services

import com.fasterxml.jackson.databind.ObjectMapper
import java.net.URI
import mu.KotlinLogging
import nz.govt.eop.TangataWhenuaSitesSources
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.models.TangataWhenuaSite
import nz.govt.eop.freshwater_management_units.repositories.TangataWhenuaSiteRepository
import nz.govt.eop.utils.GeoJsonFetcher
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate

@Service
class TangataWhenuaSiteService(
    restTemplate: RestTemplate,
    @Autowired private val repository: TangataWhenuaSiteRepository,
) : GeoJsonFetcher(restTemplate) {
  private val logger = KotlinLogging.logger {}

  @Autowired lateinit var tangataWhenuaSitesSources: TangataWhenuaSitesSources

  @Transactional
  fun deleteAll() {
    repository.deleteAll()
  }

  @Transactional
  fun loadFromArcGIS() {
    deleteAll()
    logger.info(
        "Loading from ArcGIS URL",
    )

    tangataWhenuaSitesSources.sources.forEach { source ->
      source.urls.forEach { fetchAndSave(it, source.name) }
    }
  }

  private fun fetchAndSave(url: String, sourceName: String? = null) {
    logger.info { "Fetching and saving from $url" }

    fetchCache
        .computeIfAbsent(url) { fetchFeatureCollection(URI.create(it)) }
        .features
        .forEach { feature ->
          val location = feature.properties["Location"] as String?
          val locationValues =
              feature.properties["Values_"]?.toString()?.split(", ")?.toList() ?: emptyList()
          val geometry = ObjectMapper().writeValueAsString(feature.geometry)

          val properties = feature.properties as Map<String, Any>

          val tangataWhenuaSite =
              TangataWhenuaSite(
                  location = location ?: properties["Name"] as? String,
                  locationValues = locationValues,
                  geomGeoJson = geometry,
                  sourceName = sourceName,
                  properties = properties)

          saveTangataWhenuaSite(tangataWhenuaSite)
        }
  }

  private val objectMapper = ObjectMapper()

  fun saveTangataWhenuaSite(site: TangataWhenuaSite) {
    val propertiesJson = objectMapper.writeValueAsString(site.properties)

    repository.saveWithGeom(
        location = site.location,
        locationValues = site.locationValues,
        geom = site.geomGeoJson ?: "",
        sourceName = site.sourceName,
        properties = propertiesJson)
  }

  fun findTangataWhenuaInterestSitesForFMU(fmu: FreshwaterManagementUnit): List<TangataWhenuaSite> {
    return repository.findAllIntersectingWith(fmu.boundary!!)
  }
}
