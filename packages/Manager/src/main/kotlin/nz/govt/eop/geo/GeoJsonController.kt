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
        .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS))
        .body(queries.councils())
  }

  @RequestMapping("/layers/whaitua", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getWhaitua(): ResponseEntity<String> {

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS))
        .body(queries.whaitua())
  }

  @RequestMapping("/layers/surface_water_mgmt", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getSurfaceWaterManagementUnits(): ResponseEntity<String> {

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.surfaceWaterManagementUnits())
  }

  @RequestMapping("/layers/surface_water_mgmt_sub", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getSurfaceWaterManagementSubUnits(): ResponseEntity<String> {

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.surfaceWaterManagementSubUnits())
  }

  @RequestMapping("/layers/flow_management_sites", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getFlowManagementSites(): ResponseEntity<String> {

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.flowManagementSites())
  }

  @RequestMapping(
      "/layers/minimum_flow_limit_boundaries", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getMinimumFlowLimitBoundaries(): ResponseEntity<String> {

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.minimumFlowLimitBoundaries())
  }

  @RequestMapping(
      "/layers/groundwater_zone_boundaries", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getGroundwaterZoneBoundaries(): ResponseEntity<String> {

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.groundwaterZoneBoundaries())
  }

  @RequestMapping("/manifest", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getManifest(): ResponseEntity<Map<String, String>> {
    return ResponseEntity.ok().body(manifest.get())
  }
}
