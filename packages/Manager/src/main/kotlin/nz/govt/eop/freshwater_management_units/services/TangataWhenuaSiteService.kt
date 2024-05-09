package nz.govt.eop.freshwater_management_units.services

import com.fasterxml.jackson.databind.ObjectMapper
import java.net.URI
import mu.KotlinLogging
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.models.TangataWhenuaSite
import nz.govt.eop.freshwater_management_units.repositories.TangataWhenuaSiteRepository
import nz.govt.eop.utils.GeoJsonFetcher
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate

@Service
class TangataWhenuaSiteService(
    restTemplate: RestTemplate,
    @Autowired private val repository: TangataWhenuaSiteRepository,
) : GeoJsonFetcher(restTemplate) {
  private val logger = KotlinLogging.logger {}

  @Value("\${arcgis.tangata_whenua_sites.url}") private lateinit var url: String

  @Transactional
  fun deleteAll() {
    repository.deleteAll()
  }

  @Transactional
  fun loadFromArcGIS() {
    deleteAll()
    logger.info(
        "Loading from ArcGIS URL: $url",
    ) // Log the URL to check if it's correctly initialized
    fetchCache
        .computeIfAbsent(url) {
          fetchFeatureCollection(URI.create(url)) // Ensure URL is converted to URI
        }
        .features
        .forEach { feature ->
          val location = feature.properties["Location"] as String
          val geometry = ObjectMapper().writeValueAsString(feature.geometry)
          repository.saveWithGeom(location, geometry)
        }
  }

  fun findTangataWhenuaInterestSitesForFMU(fmu: FreshwaterManagementUnit): Set<TangataWhenuaSite> {
    return repository.findAllIntersectingWith(fmu.boundary!!)
  }
}
