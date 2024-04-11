package nz.govt.eop.farm_management_units.services

import mu.KotlinLogging
import nz.govt.eop.farm_management_units.models.FarmManagementUnit
import nz.govt.eop.farm_management_units.repositories.FarmManagementUnitRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class FarmManagementUnitService
@Autowired
constructor(private val repository: FarmManagementUnitRepository) {
  private val logger = KotlinLogging.logger {}

  fun findFarmManagementUnitByLatAndLng(
      lng: Double,
      lat: Double,
      srid: Int = FarmManagementUnit.DEFAULT_SRID
  ): FarmManagementUnit? {
    val fmus = repository.findAllByLngLat(lng, lat, srid)

    if (fmus.count() > 1) {
      logger.warn { "More than 1 FMUs found for lat: $lat, lng: $lng" }
    }

    return fmus.firstOrNull()
  }

  fun findAllFarmManagementUnits(): List<FarmManagementUnit> {
    return repository.findAll()
  }
}
