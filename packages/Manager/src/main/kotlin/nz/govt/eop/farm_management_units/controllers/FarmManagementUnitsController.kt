package nz.govt.eop.farm_management_units.controllers

import nz.govt.eop.farm_management_units.models.FarmManagementUnit
import nz.govt.eop.farm_management_units.models.FarmManagementUnitFeatureCollection
import nz.govt.eop.farm_management_units.models.toFeatureCollection
import nz.govt.eop.farm_management_units.services.FarmManagementUnitService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
class FarmManagementUnitsController(@Autowired private val fmuService: FarmManagementUnitService) {

  @GetMapping("/farm-management-units", produces = [MediaType.APPLICATION_JSON_VALUE])
  fun getFarmManagementUnitByLngAndLat(
      @RequestParam lng: Double,
      @RequestParam lat: Double,
      @RequestParam(required = false) srid: Int = FarmManagementUnit.DEFAULT_SRID
  ): ResponseEntity<Any> {
    val fmu = fmuService.findFarmManagementUnitByLatAndLng(lng, lat, srid)
    println(fmu)
    return if (fmu == null) ResponseEntity.notFound().build() else ResponseEntity.ok().body(fmu)
  }

  @GetMapping("/farm-management-units/as-features", produces = [MediaType.APPLICATION_JSON_VALUE])
  fun getFarmManagementUnits(): ResponseEntity<FarmManagementUnitFeatureCollection> =
      ResponseEntity.ok().body(fmuService.findAllFarmManagementUnits().toFeatureCollection())
}
