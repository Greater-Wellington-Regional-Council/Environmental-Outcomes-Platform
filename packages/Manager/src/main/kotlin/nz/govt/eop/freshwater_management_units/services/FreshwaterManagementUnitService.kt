package nz.govt.eop.freshwater_management_units.services

import mu.KotlinLogging
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.repositories.FreshwaterManagementUnitRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class FreshwaterManagementUnitService
@Autowired
constructor(
    private val repository: FreshwaterManagementUnitRepository,
) {
  private val logger = KotlinLogging.logger {}

  fun findFreshwaterManagementUnitByLatAndLng(
      lng: Double,
      lat: Double,
      srid: Int = FreshwaterManagementUnit.DEFAULT_SRID,
  ): FreshwaterManagementUnit? {
    val fmus = repository.findAllByLngLat(lng, lat, srid)

    if (fmus.count() > 1) {
      logger.warn { "More than 1 FMUs found for lat: $lat, lng: $lng" }
    }

    return fmus.firstOrNull()
  }

  fun findFreshwaterManagementUnitById(id: Int): FreshwaterManagementUnit? =
      repository.findById(id).orElse(null)

  fun findAllFreshwaterManagementUnits(): List<FreshwaterManagementUnit> {
    return repository.findAll()
  }

  fun findFreshwaterManagementUnitsByShape(geoJson: String): List<FreshwaterManagementUnit> {
    return repository.findAllByGeoJson(geoJson)
  }
}
