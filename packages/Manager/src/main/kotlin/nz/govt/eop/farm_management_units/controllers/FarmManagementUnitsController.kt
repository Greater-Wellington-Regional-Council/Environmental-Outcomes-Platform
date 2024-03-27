package nz.govt.eop.farm_management_units.controllers

import nz.govt.eop.farm_management_units.models.FarmManagementUnit
import nz.govt.eop.farm_management_units.services.FarmManagementUnitService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
class FarmManagementUnitsController
@Autowired
constructor(private val fmuService: FarmManagementUnitService) {

  @GetMapping("/farm-management-units", produces = [MediaType.APPLICATION_JSON_VALUE])
  fun getFeatures(
      @RequestParam lng: Double,
      @RequestParam lat: Double
  ): ResponseEntity<List<FarmManagementUnit>> {
    println("lng: $lng, lat: $lat")
    val fmus = fmuService.findFarmManagementUnitByLatAndLng(lng, lat)
    println(fmus)
    return ResponseEntity.ok().body(fmus)
  }
}
