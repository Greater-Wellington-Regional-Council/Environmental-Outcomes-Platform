package nz.govt.eop.tasks

import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import nz.govt.eop.freshwater_management_units.services.FreshwaterManagementUnitService
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import java.util.concurrent.TimeUnit

@Component
class FreshwaterManagementUnitFetcher(
    private val fmuService: FreshwaterManagementUnitService,
) {
    private val logger = KotlinLogging.logger {}

    @Transactional
    @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.DAYS)
    @SchedulerLock(name = "freshwaterManagementUnitsUpdate")
    fun updateFreshwaterManagementUnits() {
        processDataRefresh(
            logger,
            "fetchFreshwaterManagementUnits",
            { true },
            ::fetchFreshwaterManagementUnits,
        )
    }

    fun fetchFreshwaterManagementUnits() {
        fmuService.loadFromArcGIS()
    }
}