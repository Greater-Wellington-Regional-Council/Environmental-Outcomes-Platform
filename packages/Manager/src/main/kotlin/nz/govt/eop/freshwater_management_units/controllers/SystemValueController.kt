package nz.govt.eop.freshwater_management_units.controllers

import nz.govt.eop.freshwater_management_units.services.SystemValueService
import nz.govt.eop.utils.LimitRequests
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/system-values")
class SystemValueController(private val service: SystemValueService) {

  @GetMapping("/{valueName}")
  @LimitRequests("Referer")
  fun getValue(
      @PathVariable valueName: String,
      @RequestParam(required = false) councilId: Int?
  ): ResponseEntity<Map<String, Any>> {
    val value = service.getValue(valueName, councilId)
    return if (value != null) {
      ResponseEntity.ok(value)
    } else {
      ResponseEntity.notFound().build()
    }
  }
}
