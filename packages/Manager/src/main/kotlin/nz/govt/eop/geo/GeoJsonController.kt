package nz.govt.eop.geo

import java.util.concurrent.TimeUnit
import org.jooq.*
import org.jooq.impl.DSL.*
import org.springframework.http.CacheControl
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class GeoJsonController(
    val context: DSLContext,
    val queries: GeoJsonQueries,
    val manifest: GeoJsonQueryManifest
) {

  @RequestMapping("/layers/councils", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getRegionalCouncils(): ResponseEntity<String> {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.councils())
  }

  @RequestMapping("/layers/whaitua", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getWhaitua(): ResponseEntity<String> {

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.whaitua())
  }

  @RequestMapping(
      "/layers/surface-water-management-units", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getSurfaceWaterManagementUnits(): ResponseEntity<String> {

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.surfaceWaterManagementUnits())
  }

  @RequestMapping(
      "/layers/surface-water-management-sub-units", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getSurfaceWaterManagementSubUnits(): ResponseEntity<String> {

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.surfaceWaterManagementSubUnits())
  }

  @RequestMapping("/layers/flow-management-sites", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getFlowManagementSites(): ResponseEntity<String> {

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.flowManagementSites())
  }

  @RequestMapping("/layers/flow-limits", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getFlowLimits(): ResponseEntity<String> {

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.flowLimits())
  }

  @RequestMapping("/layers/groundwater-zones", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getGroundwaterZones(): ResponseEntity<String> {

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.getGroundwaterZones())
  }

  @RequestMapping("/manifest", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getManifest(): ResponseEntity<Map<String, String>> {
    return ResponseEntity.ok().body(manifest.get())
  }
}
