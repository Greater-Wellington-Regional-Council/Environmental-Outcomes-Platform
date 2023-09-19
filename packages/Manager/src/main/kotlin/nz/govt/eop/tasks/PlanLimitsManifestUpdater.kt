package nz.govt.eop.tasks

import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import nz.govt.eop.plan_limits.Manifest
import org.jooq.DSLContext
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component

@Component
class PlanLimitsManifestUpdater(val context: DSLContext, val manifest: Manifest) {

  private val logger = KotlinLogging.logger {}
  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.MINUTES)
  @SchedulerLock(name = "planLimitsManifestUpdater")
  fun updateManifest() {
    logger.debug { startTaskMessage("planLimitsManifestUpdater") }
    manifest.updateAll()
    logger.debug { endTaskMessage("planLimitsManifestUpdater") }
  }
}
