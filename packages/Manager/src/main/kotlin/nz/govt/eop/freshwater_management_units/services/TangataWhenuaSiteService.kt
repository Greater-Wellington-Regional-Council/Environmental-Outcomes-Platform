package nz.govt.eop.freshwater_management_units.services

import com.fasterxml.jackson.databind.ObjectMapper
import jakarta.annotation.PostConstruct
import java.net.URI
import mu.KotlinLogging
import nz.govt.eop.TangataWhenuaSitesSource
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

  @Autowired lateinit var tangataWhenuaSitesSource: TangataWhenuaSitesSource

  @PostConstruct
  fun init() {
    logger.debug { "Loaded URLs: ${tangataWhenuaSitesSource.urls.joinToString()}" }
  }

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

    tangataWhenuaSitesSource.urls.forEach { fetchAndSave(it) }
  }

  private fun fetchAndSave(url: String) {
    logger.info { "Fetching and saving from $url" }
    fetchCache
    fetchCache
        .computeIfAbsent(url) { fetchFeatureCollection(URI.create(it)) }
        .features
        .forEach { feature ->
          val location = feature.properties["Location"] as String?
          val locationValues = feature.properties["Values_"]?.toString()?.split(", ")?.toList()
          val geometry = ObjectMapper().writeValueAsString(feature.geometry)
          repository.saveWithGeom(location, locationValues, geometry)
        }
  }

  fun findTangataWhenuaInterestSitesForFMU(fmu: FreshwaterManagementUnit): List<TangataWhenuaSite> =
      repository.findAllIntersectingWith(fmu.boundary!!)
}
