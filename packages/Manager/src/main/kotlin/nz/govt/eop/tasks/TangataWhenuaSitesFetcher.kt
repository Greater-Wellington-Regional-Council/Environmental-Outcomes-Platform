package nz.govt.eop.tasks

import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import nz.govt.eop.freshwater_management_units.services.TangataWhenuaSiteService
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class TangataWhenuaSitesFetcher(
    val twService: TangataWhenuaSiteService,
) {
  private val logger = KotlinLogging.logger {}

  @Transactional
  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.DAYS)
  @SchedulerLock(name = "geoJsonPlanDataUpdate")
  fun updateGeoJsonPlanData() {
    processDataRefresh(
        logger,
        "fetchTangataWhenuaSites",
        { true },
        ::updateTangataWhenuaSites,
    )
  }

  private fun updateTangataWhenuaSites() {
    twService.loadFromArcGIS()
  }
}
