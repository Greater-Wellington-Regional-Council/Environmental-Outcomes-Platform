package nz.govt.eop.plan_limits

import java.time.LocalDate
import java.time.temporal.ChronoUnit.YEARS
import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import org.jooq.*
import org.springframework.http.CacheControl
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class Controller(val context: DSLContext, val queries: Queries, val manifest: Manifest) {
  private val logger = KotlinLogging.logger {}

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

  @GetMapping("/plan-limits/surface-water-pnrp", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun surfaceWaterPNRP(
      @RequestParam(name = "councilId") councilId: Int,
      @RequestParam(name = "dates") dates: String?
  ): ResponseEntity<String> {
    return try {
      val dateList =
          dates
              ?.split(",") // Split the dates by comma
              ?.map { LocalDate.parse(it.trim()) } // Convert each date to LocalDate
              ?.toList() // Convert to a List<LocalDate>

      // Call the service method with the parsed list
      val result = queries.surfaceWaterPNRP(councilId, dateList)

      // Check if the result is empty or null and handle it
      if (result.isEmpty()) {
        ResponseEntity.status(HttpStatus.NOT_FOUND).body("No data found for the given council ID.")
      } else {
        ResponseEntity.ok().cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS)).body(result)
      }
    } catch (e: Exception) {
      logger.error("Error //fetching surface water PNRP data", e)
      // Return a generic Internal Server Error
      ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(
              "An unexpected error occurred while processing your request. Please try again later.")
    }
  }

  @GetMapping("/plan-limits/ground-water-pnrp", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun groundWaterPNRP(
      @RequestParam(name = "councilId") councilId: Int,
      @RequestParam(name = "dates") dates: String?
  ): ResponseEntity<String> {
    return try {
      val dateList =
          dates
              ?.split(",") // Split the dates by comma
              ?.map { LocalDate.parse(it.trim()) } // Convert each date to LocalDate
              ?.toList() // Convert to a List<LocalDate>

      // Call the service method with the parsed list
      val result = queries.groundWaterPNRP(councilId, dateList)
      // Check if the result is empty or null and handle it
      if (result.isEmpty()) {
        ResponseEntity.status(HttpStatus.NOT_FOUND).body("No data found for the given council ID.")
      } else {
        ResponseEntity.ok().cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS)).body(result)
      }
    } catch (e: Exception) {
      logger.error("Error fetching ground water PNRP data", e)
      // Return a generic Internal Server Error
      ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(
              "An unexpected error occurred while processing your request. Please try again later.")
    }
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
  fun waterUsage(
      @RequestParam(name = "councilId") councilId: Int,
      @RequestParam("from") from: LocalDate,
      @RequestParam("to") to: LocalDate,
      @RequestParam("areaId") areaId: String?
  ): ResponseEntity<String> {
    if (from >= to) {
      return ResponseEntity.badRequest().body("The parameter \"to\" must be after \"from\"")
    }
    if (YEARS.between(from, to) > 0) {
      return ResponseEntity.badRequest()
          .body(
              "The duration between \"from\" and \"to\" should be more than one day and at most one year")
    }

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(queries.waterUsage(councilId, from, to, areaId))
  }
}
