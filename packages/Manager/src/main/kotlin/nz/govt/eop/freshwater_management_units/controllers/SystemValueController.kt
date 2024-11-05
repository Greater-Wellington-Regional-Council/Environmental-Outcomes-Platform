package nz.govt.eop.freshwater_management_units.controllers

import nz.govt.eop.freshwater_management_units.services.SystemValueService
//import nz.govt.eop.utils.LimitRequests
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/system-values")
class SystemValueController(private val service: SystemValueService) {

  @GetMapping("/{councilId}/{valueName}", produces = [MediaType.APPLICATION_JSON_VALUE])
//  @LimitRequests("Referer")
  fun getValueWithCouncilId(
      @PathVariable councilId: Int,
      @PathVariable valueName: String
  ): ResponseEntity<Map<String, Any>> {
    val value = service.getValue(valueName, councilId)
    return if (value != null) {
      ResponseEntity.ok(value)
    } else {
      ResponseEntity.notFound().build()
    }
  }

  @GetMapping("/{valueName}", produces = [MediaType.APPLICATION_JSON_VALUE])
  // @LimitRequests("Referer")
  fun getValueWithoutCouncilId(@PathVariable valueName: String): ResponseEntity<Map<String, Any>> {
    val value = service.getValue(valueName, null)
    return if (value != null) {
      ResponseEntity.ok(value)
    } else {
      ResponseEntity.notFound().build()
    }
  }
}
