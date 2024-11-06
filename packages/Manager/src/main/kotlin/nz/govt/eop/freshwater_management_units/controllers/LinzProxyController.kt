package nz.govt.eop.freshwater_management_units.controllers

import nz.govt.eop.freshwater_management_units.services.LinzDataService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/linz")
class LinzProxyController(private val linzDataService: LinzDataService) {

  @GetMapping("/unitOfPropertyId")
  fun getUnitOfPropertyIdForAddressId(@RequestParam addressId: String): ResponseEntity<String> {
    return try {
      val unitOfPropertyId = linzDataService.getUnitOfPropertyIdForAddressId(addressId)
      ResponseEntity.ok(unitOfPropertyId)
    } catch (e: Exception) {
      ResponseEntity.status(500)
          .body("Failed to retrieve address data: ${e.message ?: "Unknown error"}")
    }
  }

  @GetMapping("/geometry")
  fun getGeometryForUnitOfProperty(
      @RequestParam unitOfPropertyId: String,
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

  @GetMapping("/geometryByAddressId")
  fun getGeometryForAddressId(
      @RequestParam addressId: String,
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
