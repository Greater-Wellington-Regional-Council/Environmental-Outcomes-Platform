package nz.govt.eop.freshwater_management_units.controllers

import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnitFeatureCollection
import nz.govt.eop.freshwater_management_units.models.toFeatureCollection
import nz.govt.eop.freshwater_management_units.services.ArcGISService
import nz.govt.eop.freshwater_management_units.services.FreshwaterManagementUnitService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class FreshwaterManagementUnitsController(
    @Autowired private val fmuService: FreshwaterManagementUnitService,
    @Autowired private val arcGISService: ArcGISService,
) {
  @GetMapping("/freshwater-management-units", produces = [MediaType.APPLICATION_JSON_VALUE])
  fun getFreshwaterManagementUnitByLngAndLat(
      @RequestParam lng: Double,
      @RequestParam lat: Double,
      @RequestParam(required = false) srid: Int = FreshwaterManagementUnit.DEFAULT_SRID,
  ): ResponseEntity<Any> {
    val fmu = fmuService.findFreshwaterManagementUnitByLatAndLng(lng, lat, srid)
    //    if (fmu != null) {
    //      fmu.tangataWhenua = fmuService.fetchTangataWhenuaInterestSitesForFMU(fmu)
    //    }
    return if (fmu == null) ResponseEntity.notFound().build() else ResponseEntity.ok().body(fmu)
  }

  @GetMapping(
      "/freshwater-management-units/as-features",
      produces = [MediaType.APPLICATION_JSON_VALUE],
  )
  fun getFreshwaterManagementUnits(): ResponseEntity<FreshwaterManagementUnitFeatureCollection> =
      ResponseEntity.ok().body(fmuService.findAllFreshwaterManagementUnits().toFeatureCollection())
}
