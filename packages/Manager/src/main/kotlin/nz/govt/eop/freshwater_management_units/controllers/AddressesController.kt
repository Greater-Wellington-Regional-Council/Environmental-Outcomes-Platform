package nz.govt.eop.freshwater_management_units.controllers

import nz.govt.eop.freshwater_management_units.services.AddressFinderService
import nz.govt.eop.utils.LimitRequests
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/addresses")
class AddressesController(private val addressFinderService: AddressFinderService) {

  @LimitRequests("Referer")
  @GetMapping("/options")
  fun getAddressOptions(
      @RequestParam query: String?,
      @RequestParam regionCode: String? = AddressFinderService.DEFAULT_REGION_CODE
  ): ResponseEntity<List<Map<String, Any>>> {
    return try {
      val addressOptions =
          addressFinderService.getAddressOptions(query).map { option ->
            option.mapValues { (_, value: Any?) -> (value ?: "") }
          }
      ResponseEntity.ok(addressOptions)
    } catch (e: Exception) {
      ResponseEntity.status(500).body(listOf(mapOf("error" to (e.message ?: "Unknown error"))))
    }
  }

  @LimitRequests("Referer")
  @GetMapping("/{pxid}")
  fun getAddressByPxid(@PathVariable pxid: String): ResponseEntity<Map<String, Any>> {
    return try {
      val addressData =
          addressFinderService.getAddressByPxid(pxid).mapValues { (_, value: Any?) ->
              (value ?: "Unknown")
          }
      ResponseEntity.ok(addressData)
    } catch (e: Exception) {
      ResponseEntity.status(500).body(mapOf("error" to (e.message ?: "Unknown error")))
    }
  }
}
