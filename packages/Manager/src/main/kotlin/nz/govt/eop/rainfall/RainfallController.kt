package nz.govt.eop.rainfall

import java.time.Duration
import java.time.Instant
import org.jooq.*
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.ResponseBody
import org.springframework.web.server.ResponseStatusException

data class RainfallPeriod(val from: Instant, val to: Instant)

@Controller
class RainfallController(val context: DSLContext, val queries: RainfallQueries) {

  @RequestMapping("/rainfall", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getRainfall(
      @RequestParam("from") from: Instant,
      @RequestParam("to") to: Instant
  ): ResponseEntity<String> {
    if (from >= to) {
      throw ResponseStatusException(
          HttpStatus.BAD_REQUEST, "The parameter \"to\" must be after \"from\"")
    }

    val difference = Duration.between(from, to)
    if (difference < Duration.ofMinutes(1) || difference > Duration.ofDays(365)) {
      throw ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "The duration between \"from\" and \"to\" should be more than one minute and less than one year")
    }

    return ResponseEntity.ok().body(queries.rainfall(5, from, to))
  }

  @RequestMapping("/rainfall-accumulation", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getRainfallAccumulation(
      @RequestParam("from") from: Instant,
      @RequestParam("to") to: Instant
  ): ResponseEntity<String> {
    if (from >= to) {
      throw ResponseStatusException(
          HttpStatus.BAD_REQUEST, "The parameter \"to\" must be after \"from\"")
    }

    val difference = Duration.between(from, to)
    if (difference < Duration.ofMinutes(1) || difference > Duration.ofDays(365)) {
      throw ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          "The duration between \"from\" and \"to\" should be more than one minute and less than one year")
    }

    return ResponseEntity.ok().body(queries.rainfallAccumulation(from, to))
  }
}
