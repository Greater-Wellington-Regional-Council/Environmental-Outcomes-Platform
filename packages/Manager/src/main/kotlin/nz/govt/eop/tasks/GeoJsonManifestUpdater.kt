package nz.govt.eop.tasks

import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import nz.govt.eop.geo.GeoJsonQueryManifest
import org.jooq.DSLContext
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class GeoJsonManifestUpdater(val context: DSLContext, val manifest: GeoJsonQueryManifest) {

  private val logger = KotlinLogging.logger {}

  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.MINUTES)
  fun updateManifest() {
    logger.info { "Updating manifest" }
    manifest.update()
    logger.info { "Done updating manifest" }
  }
}
