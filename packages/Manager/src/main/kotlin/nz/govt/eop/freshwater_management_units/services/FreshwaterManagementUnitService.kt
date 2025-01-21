package nz.govt.eop.freshwater_management_units.services

import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.models.toFeatureCollection
import nz.govt.eop.freshwater_management_units.repositories.FreshwaterManagementUnitRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class FreshwaterManagementUnitService
@Autowired
constructor(
    private val repository: FreshwaterManagementUnitRepository,
    private val twsService:
        TangataWhenuaSiteService // Include this service to get tangataWhenuaSites
) {
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

  fun findFreshwaterManagementUnitsByShape(
      geoJson: String,
      includeTangataWhenuaSites: Boolean = true
  ): List<FreshwaterManagementUnit> {
    val fmus = repository.findAllByGeoJson(geoJson)

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
