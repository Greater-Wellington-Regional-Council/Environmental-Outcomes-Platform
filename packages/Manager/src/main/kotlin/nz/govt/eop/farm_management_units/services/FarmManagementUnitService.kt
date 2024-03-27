package nz.govt.eop.farm_management_units.services

import nz.govt.eop.farm_management_units.models.FarmManagementUnit
import nz.govt.eop.farm_management_units.repositories.FarmManagementUnitRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class FarmManagementUnitService
@Autowired
constructor(private val repository: FarmManagementUnitRepository) {
  fun findFarmManagementUnitByLatAndLng(
      lng: Double,
      lat: Double,
      srid: Int = FarmManagementUnit.DEFAULT_SRID
  ): List<FarmManagementUnit>  {
    val fmus = repository.findAllByLngLat(lng, lat, srid)
    return fmus
  }
}
