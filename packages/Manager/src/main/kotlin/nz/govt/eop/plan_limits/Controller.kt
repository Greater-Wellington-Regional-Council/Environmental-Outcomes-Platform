package nz.govt.eop.plan_limits

import java.time.LocalDate
import java.time.temporal.ChronoUnit.DAYS
import java.util.concurrent.TimeUnit
import org.jooq.*
import org.springframework.http.CacheControl
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.server.ResponseStatusException

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
  fun getCouncils(): ResponseEntity<String> {
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

  @RequestMapping("/plan-limits/water-usage", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun weeklyUsage(
      @RequestParam(name = "councilId") councilId: Int,
      @RequestParam("from") from: LocalDate,
      @RequestParam("to") to: LocalDate,
      @RequestParam("areaId") areaId: String?
  ): ResponseEntity<String> {
    if (from >= to) {
      throw ResponseStatusException(
          HttpStatus.BAD_REQUEST, "The parameter \"to\" must be after \"from\"")
    }
    val difference = DAYS.between(from, to)
    if (difference < 1 || difference >= 366) {
      throw ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "The duration between \"from\" and \"to\" should be more than one day and at most one year")
    }

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.waterUsage(councilId, from, to, areaId))
  }
}
