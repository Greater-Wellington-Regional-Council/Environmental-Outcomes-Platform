package nz.govt.eop.freshwater_management_units.services

import java.net.URI
import mu.KotlinLogging
import nz.govt.eop.FreshwaterManagementUnitsDataSources
import nz.govt.eop.freshwater_management_units.mappers.FreshwaterManagementUnitMapper
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.models.toFeatureCollection
import nz.govt.eop.freshwater_management_units.repositories.FreshwaterManagementUnitRepository
import nz.govt.eop.utils.GeoJsonFetcher
import org.locationtech.jts.io.WKTReader
import org.locationtech.jts.io.geojson.GeoJsonWriter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate

@Service
class FreshwaterManagementUnitService
@Autowired
constructor(
    private val mapper: FreshwaterManagementUnitMapper,
    private val repository: FreshwaterManagementUnitRepository,
    private val freshwaterManagementUnitsDataSources: FreshwaterManagementUnitsDataSources,
    private val twsService: TangataWhenuaSiteService,
    restTemplate: RestTemplate
) : GeoJsonFetcher(restTemplate) {

  private val logger = KotlinLogging.logger {}

  @Transactional
  fun deleteAll() {
    repository.deleteAll()
  }

  @Transactional
  fun loadFromArcGIS() {
    logger.info("Loading Freshwater Management Units from ArcGIS sources")

    freshwaterManagementUnitsDataSources.sources.forEach { source ->
      source.urls.forEach { fetchAndSave(it, source.name) }
    }
  }

  fun saveFMU(fmu: FreshwaterManagementUnit) {
    repository.save(fmu)
  }

  @Transactional
  fun fetchAndSave(url: String, sourceName: String? = null) {
    var deleted = false

    logger.debug { "Fetching and saving FMUs from $url" }

    fetchCache
        .computeIfAbsent(url) { fetchFeatureCollection(URI.create(it)) }
        .features
        .forEach { feature ->
          if (!deleted) {
            deleteAll()
            deleted = true
          }

          val fmu = mapper.fromFeature(feature)
          saveFMU(fmu)
        }
  }

  fun findFreshwaterManagementUnitByLatAndLng(
      lng: Double,
      lat: Double,
      srid: Int = FreshwaterManagementUnit.DEFAULT_SRID,
      includeTangataWhenuaSites: Boolean = true
  ): FreshwaterManagementUnit? {
    val fmu = repository.findAllByLngLat(lng, lat, srid).firstOrNull()

    if (includeTangataWhenuaSites && fmu != null) {
      fmu.tangataWhenuaSites =
          twsService.findTangataWhenuaInterestSitesForFMU(fmu).toFeatureCollection()
    }

    return fmu
  }

  fun findFreshwaterManagementUnitById(
      id: Int,
      includeTangataWhenuaSites: Boolean = true
  ): FreshwaterManagementUnit? {
    val fmu = repository.findById(id).orElse(null)

    if (includeTangataWhenuaSites && fmu != null) {
      fmu.tangataWhenuaSites =
          twsService.findTangataWhenuaInterestSitesForFMU(fmu).toFeatureCollection()
    }

    return fmu
  }

  fun wktToGeoJson(wkt: String): String {
    return GeoJsonWriter().write(WKTReader().read(wkt))
  }

  fun String.toGeoJsonIfWkt(): String {
    return when {
      this.trim().startsWith("POLYGON") ||
          this.trim().startsWith("MULTIPOLYGON") ||
          this.trim().startsWith("POINT") ||
          this.trim().startsWith("LINESTRING") -> {
        wktToGeoJson(this)
      }
      else -> this
    }
  }

  fun String.findFMUsByShape(): List<FreshwaterManagementUnit> {
    if (this.trim().isEmpty()) return emptyList()
    return repository.findAllByGeoJson(this.toGeoJsonIfWkt())
  }

  fun org.locationtech.jts.geom.Geometry.findFMUsByShape(): List<FreshwaterManagementUnit> {
    val writer = GeoJsonWriter()
    val geoJson = writer.write(this)
    return repository.findAllByGeoJson(geoJson)
  }

  fun findFreshwaterManagementUnitsByShape(
      shape: Any,
      includeTangataWhenuaSites: Boolean = true
  ): List<FreshwaterManagementUnit> {
    val fmus =
        when (shape) {
          is String -> shape.findFMUsByShape()
          is org.locationtech.jts.geom.Geometry -> shape.findFMUsByShape()
          else -> throw IllegalArgumentException("Unsupported shape format: $shape")
        }

    if (includeTangataWhenuaSites) {
      fmus.forEach { fmu: FreshwaterManagementUnit ->
        fmu.tangataWhenuaSites =
            twsService.findTangataWhenuaInterestSitesForFMU(fmu).toFeatureCollection()
      }
    }

    return fmus
  }

  fun findAllFreshwaterManagementUnits(
      includeTangataWhenuaSites: Boolean = true
  ): List<FreshwaterManagementUnit> {
    val fmus = repository.findAll()

    if (includeTangataWhenuaSites) {
      fmus.forEach { fmu: FreshwaterManagementUnit ->
        fmu.tangataWhenuaSites =
            twsService.findTangataWhenuaInterestSitesForFMU(fmu).toFeatureCollection()
      }
    }
    return fmus
  }
}
