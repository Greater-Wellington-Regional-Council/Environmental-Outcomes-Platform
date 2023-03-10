package nz.govt.eop.tasks

import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import nz.govt.eop.geo.GeoJsonQueryManifest
import org.jooq.DSLContext
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class GeoJsonManifestUpdater(val context: DSLContext, val manifest: GeoJsonQueryManifest) {

  private val logger = KotlinLogging.logger {}

  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.MINUTES)
  @SchedulerLock(name = "geoJsonManifestUpdater")
  fun updateManifest() {
    logger.debug { startTaskMessage("geoJsonManifestUpdater") }
    manifest.update()
    logger.debug { endTaskMessage("geoJsonManifestUpdater") }
  }
}
