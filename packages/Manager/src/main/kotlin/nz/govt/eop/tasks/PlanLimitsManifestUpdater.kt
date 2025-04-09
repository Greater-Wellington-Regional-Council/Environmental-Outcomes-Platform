package nz.govt.eop.tasks

import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import nz.govt.eop.plan_limits.Manifest
import org.jooq.DSLContext
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import java.util.concurrent.TimeUnit

@Component
class PlanLimitsManifestUpdater(val context: DSLContext, val manifest: Manifest) {

  private val logger = KotlinLogging.logger {}

  @Scheduled(fixedDelay = 5, timeUnit = TimeUnit.MINUTES)
  @SchedulerLock(name = "planLimitsManifestUpdater")
  fun updateManifest() {
    logger.info { startTaskMessage("planLimitsManifestUpdater") }

    if (!manifest.tablesExistAndPopulated()) {
      logger.info { "Manifest data tables do not yet exist." }
        return
    }

    //  Hard coded to just Wellington until we have more data since empty results
    //  for individual queries cause errors
    manifest.update(9)

    logger.info { endTaskMessage("planLimitsManifestUpdater") }
  }
}
