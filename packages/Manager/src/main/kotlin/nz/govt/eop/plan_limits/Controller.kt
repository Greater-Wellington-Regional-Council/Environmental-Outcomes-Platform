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
}
