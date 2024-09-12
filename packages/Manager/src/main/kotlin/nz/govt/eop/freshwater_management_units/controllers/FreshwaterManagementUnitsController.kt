package nz.govt.eop.freshwater_management_units.controllers

import nz.govt.eop.freshwater_management_units.models.FmuCccvDetails
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnitFeatureCollection
import nz.govt.eop.freshwater_management_units.models.toFeatureCollection
import nz.govt.eop.freshwater_management_units.services.FreshwaterManagementUnitService
import nz.govt.eop.freshwater_management_units.services.TangataWhenuaSiteService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/freshwater-management-units")
class FreshwaterManagementUnitsController(
    @Autowired private val fmuService: FreshwaterManagementUnitService,
    @Autowired private val twsService: TangataWhenuaSiteService,
) {
  @GetMapping("", "/", produces = [MediaType.APPLICATION_JSON_VALUE])
  fun getFreshwaterManagementUnitByLngAndLat(
      @RequestParam lng: Double,
      @RequestParam lat: Double,
      @RequestParam(required = false) srid: Int = FreshwaterManagementUnit.DEFAULT_SRID,
  ): ResponseEntity<FmuCccvDetails> {
    val fmu = fmuService.findFreshwaterManagementUnitByLatAndLng(lng, lat, srid)
    val tws = if (fmu == null) null else twsService.findTangataWhenuaInterestSitesForFMU(fmu)
    return if (fmu == null) {
      ResponseEntity.notFound().build()
    } else {
      ResponseEntity.ok().body(FmuCccvDetails.fromFmuAndTws(fmu, tws ?: emptySet()))
    }
  }

  @GetMapping("/{id}", "/{id}/", produces = [MediaType.APPLICATION_JSON_VALUE])
  fun getFreshwaterManagementUnitById(
      @PathVariable id: Int,
  ): ResponseEntity<FmuCccvDetails> {
    val fmu = fmuService.findFreshwaterManagementUnitById(id)
    val tws = if (fmu == null) null else twsService.findTangataWhenuaInterestSitesForFMU(fmu)
    return if (fmu == null) {
      ResponseEntity.notFound().build()
    } else {
      ResponseEntity.ok().body(FmuCccvDetails.fromFmuAndTws(fmu, tws ?: emptySet()))
    }
  }

  @GetMapping(
      "/as-features",
      produces = [MediaType.APPLICATION_JSON_VALUE],
  )
  fun getFreshwaterManagementUnits(): ResponseEntity<FreshwaterManagementUnitFeatureCollection> =
      ResponseEntity.ok().body(fmuService.findAllFreshwaterManagementUnits().toFeatureCollection())
}
