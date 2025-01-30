package nz.govt.eop.freshwater_management_units.controllers

import nz.govt.eop.freshwater_management_units.services.LinzDataService
import nz.govt.eop.utils.LimitRequests
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/ttw")
class LinzAddressDataController(private val linzDataService: LinzDataService) {

  @LimitRequests("Referer")
  @GetMapping("/address/{addressId}/unit-of-property-id")
  fun getUnitOfPropertyIdForAddressId(@PathVariable addressId: String): ResponseEntity<String> {
    return try {
      val unitOfPropertyId = linzDataService.getUnitOfPropertyIdForAddressId(addressId)
      ResponseEntity.ok(unitOfPropertyId)
    } catch (e: Exception) {
      ResponseEntity.status(500)
          .body("Failed to retrieve address data: ${e.message ?: "Unknown error"}")
    }
  }

  @LimitRequests("Referer")
  @GetMapping("/unit-of-property/{unitOfPropertyId}/geometry")
  fun getGeometryForUnitOfProperty(
      @PathVariable unitOfPropertyId: String,
      @RequestParam(defaultValue = "EPSG:4326") projection: String
  ): ResponseEntity<Map<String, Any>> {
    return try {
      val geometryData = linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection)
      ResponseEntity.ok(geometryData)
    } catch (e: Exception) {
      ResponseEntity.status(500)
          .body(mapOf("error" to (e.message ?: "Failed to retrieve geometry data")))
    }
  }

  @LimitRequests("Referer")
  @GetMapping("/address/{addressId}/geometry")
  fun getGeometryForAddressId(
      @PathVariable addressId: String,
      @RequestParam(defaultValue = "EPSG:4326") projection: String
  ): ResponseEntity<Map<String, Any>> {
    return try {
      val unitOfPropertyId = linzDataService.getUnitOfPropertyIdForAddressId(addressId)
      val geometryData = linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection)
      ResponseEntity.ok(geometryData)
    } catch (e: Exception) {
      ResponseEntity.status(500).body(mapOf("error" to (e.message ?: "Unknown error")))
    }
  }
}
