package nz.govt.eop.freshwater_management_units.controllers

import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.models.toFeatureCollection
import nz.govt.eop.freshwater_management_units.services.FreshwaterManagementUnitService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/freshwater-management-units")
class FreshwaterManagementUnitsController(
    @Autowired private val fmuService: FreshwaterManagementUnitService,
) {

  @GetMapping("/by-lng-and-lat", produces = [MediaType.APPLICATION_JSON_VALUE])
  fun getFreshwaterManagementUnitByLngAndLat(
      @RequestParam lng: Double,
      @RequestParam lat: Double,
      @RequestParam(required = false) srid: Int = FreshwaterManagementUnit.DEFAULT_SRID,
      @RequestParam(required = false, defaultValue = "true") includeTangataWhenuaSites: Boolean
  ): ResponseEntity<FreshwaterManagementUnit> {
    val fmu =
        fmuService.findFreshwaterManagementUnitByLatAndLng(
            lng, lat, srid, includeTangataWhenuaSites)
    return if (fmu == null) {
      ResponseEntity.notFound().build()
    } else {
      ResponseEntity.ok().body(fmu)
    }
  }

  @PostMapping(
      "/search-for-freshwater-managements-intersecting",
      produces = [MediaType.APPLICATION_JSON_VALUE])
  fun searchForFreshwaterManagementsIntersecting(
      @RequestBody geoJson: String,
      @RequestParam(required = false, defaultValue = "true") includeTangataWhenuaSites: Boolean
  ): ResponseEntity<List<FreshwaterManagementUnit>> {
    val fmus = fmuService.findFreshwaterManagementUnitsByShape(geoJson, includeTangataWhenuaSites)

    return if (fmus.isEmpty()) {
      ResponseEntity.notFound().build()
    } else {
      ResponseEntity.ok(fmus)
    }
  }

  @GetMapping("/{id}", produces = [MediaType.APPLICATION_JSON_VALUE])
  fun getFreshwaterManagementUnitById(
      @PathVariable id: Int,
      @RequestParam(required = false, defaultValue = "true") includeTangataWhenuaSites: Boolean
  ): ResponseEntity<FreshwaterManagementUnit> {
    val fmu = fmuService.findFreshwaterManagementUnitById(id, includeTangataWhenuaSites)
    return if (fmu == null) {
      ResponseEntity.notFound().build()
    } else {
      ResponseEntity.ok().body(fmu)
    }
  }

  @GetMapping(produces = [MediaType.APPLICATION_JSON_VALUE])
  fun getFreshwaterManagementUnits(
      @RequestParam(required = false, defaultValue = "true") includeTangataWhenuaSites: Boolean,
      @RequestParam(required = false) format: String? = null
  ): ResponseEntity<Any> {
    val fmus = fmuService.findAllFreshwaterManagementUnits(includeTangataWhenuaSites)

    return if (format == "features") {
      ResponseEntity.ok().body(fmus.toFeatureCollection())
    } else {
      ResponseEntity.ok().body(fmus)
    }
  }
}
