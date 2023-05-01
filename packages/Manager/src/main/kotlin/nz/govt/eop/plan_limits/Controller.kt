package nz.govt.eop.plan_limits

import java.util.concurrent.TimeUnit
import org.jooq.*
import org.springframework.http.CacheControl
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class Controller(val context: DSLContext, val queries: Queries, val manifest: Manifest) {
  @RequestMapping("/plan-limits/manifest", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getManifest(
      @RequestParam(name = "councilId") councilId: Int
  ): ResponseEntity<Map<String, String>> {
    return ResponseEntity.ok().body(manifest.get(councilId))
  }

  @RequestMapping("/plan-limits/councils", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getlCouncils(): ResponseEntity<String> {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.councils())
  }

  @RequestMapping("/plan-limits/plan", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getPlan(@RequestParam(name = "councilId") councilId: Int): ResponseEntity<String> {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.plan(councilId))
  }

  @RequestMapping("/plan-limits/plan-regions", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getCouncilRegions(@RequestParam(name = "councilId") councilId: Int): ResponseEntity<String> {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.planRegions(councilId))
  }

  @RequestMapping(
      "/plan-limits/surface-water-limits", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun surfaceWaterLimits(@RequestParam(name = "councilId") councilId: Int): ResponseEntity<String> {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.surfaceWaterLimits(councilId))
  }

  @RequestMapping("/plan-limits/ground-water-limits", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun groundWaterLimits(@RequestParam(name = "councilId") councilId: Int): ResponseEntity<String> {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.groundwaterWaterLimits(councilId))
  }

  @RequestMapping(
      "/plan-limits/flow-measurement-sites", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun flowMeasurementSites(
      @RequestParam(name = "councilId") councilId: Int
  ): ResponseEntity<String> {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.flowMeasurementSites(councilId))
  }

  @RequestMapping("/plan-limits/flow-limits", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun flowLimits(@RequestParam(name = "councilId") councilId: Int): ResponseEntity<String> {
    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.flowLimits(councilId))
  }
}
