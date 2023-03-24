package nz.govt.eop.tasks

import java.util.Collections
import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import net.postgis.jdbc.geometry.Geometry
import nz.govt.eop.si.jooq.tables.AllocationAmounts.Companion.ALLOCATION_AMOUNTS
import nz.govt.eop.si.jooq.tables.Rivers.Companion.RIVERS
import nz.govt.eop.si.jooq.tables.SurfaceWaterManagementBoundaries.Companion.SURFACE_WATER_MANAGEMENT_BOUNDARIES
import nz.govt.eop.si.jooq.tables.Watersheds.Companion.WATERSHEDS
import org.jooq.DSLContext
import org.jooq.impl.DSL.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class SurfaceWaterManagementBoundariesGenerator(@Autowired val context: DSLContext) {

  private val logger = KotlinLogging.logger {}

  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.MINUTES)
  @SchedulerLock(name = "checkSurfaceWaterManagementBoundaries")
  @Transactional
  fun checkSurfaceWaterManagementBoundaries() {
    processDataRefresh(
        logger, "checkSurfaceWaterManagementBoundaries", ::doesDataNeedRefresh, ::refresh)
  }

  private fun doesDataNeedRefresh(): Boolean {
    val lastCreatedRiver =
        context.select(max(RIVERS.CREATED_AT)).from(RIVERS).fetchOne(max(RIVERS.CREATED_AT))
            ?: return false

    val lastCreatedWatershed =
        context
            .select(max(WATERSHEDS.CREATED_AT))
            .from(WATERSHEDS)
            .fetchOne(max(WATERSHEDS.CREATED_AT))
            ?: return false

    val lastCreatedAllocationAmount =
        context
            .select(max(ALLOCATION_AMOUNTS.CREATED_AT))
            .from(ALLOCATION_AMOUNTS)
            .fetchOne(max(ALLOCATION_AMOUNTS.CREATED_AT))
            ?: return false

    val lastUpdatedDependency =
        Collections.max(listOf(lastCreatedRiver, lastCreatedWatershed, lastCreatedAllocationAmount))

    val lastProcessedSurfaceWaterManagementBoundary =
        context
            .select(max(SURFACE_WATER_MANAGEMENT_BOUNDARIES.CREATED_AT))
            .from(SURFACE_WATER_MANAGEMENT_BOUNDARIES)
            .fetchOne(max(SURFACE_WATER_MANAGEMENT_BOUNDARIES.CREATED_AT))

    return lastProcessedSurfaceWaterManagementBoundary == null ||
        lastProcessedSurfaceWaterManagementBoundary.isBefore(lastUpdatedDependency)
  }

  private fun refresh() {
    logger.info {
      "Surface Water Management Boundary source data has been updated since last processed, re-processing now"
    }
    context.deleteFrom(SURFACE_WATER_MANAGEMENT_BOUNDARIES).execute()

    val allocationAmountsToProcess =
        context
            .select(
                ALLOCATION_AMOUNTS.ID,
                ALLOCATION_AMOUNTS.HYDRO_IDS,
                ALLOCATION_AMOUNTS.EXCLUDED_HYDRO_IDS)
            .from(ALLOCATION_AMOUNTS)
            .where(ALLOCATION_AMOUNTS.HYDRO_IDS.isNotNull)
            .fetch()

    allocationAmountsToProcess.forEach {
      val id = it.get(ALLOCATION_AMOUNTS.ID)!!
      val hydroIds = it.get(ALLOCATION_AMOUNTS.HYDRO_IDS)!!.filterNotNull()
      val excludedHydroIds = it.get(ALLOCATION_AMOUNTS.EXCLUDED_HYDRO_IDS)!!.filterNotNull()
      val catchmentTree = selectRecCatchmentTree(context, hydroIds, excludedHydroIds)
      insertCatchmentFromWatersheds(id, catchmentTree)
    }
  }

  fun insertCatchmentFromWatersheds(id: Int, segments: Set<Int>) {
    context
        .insertInto(
            SURFACE_WATER_MANAGEMENT_BOUNDARIES,
            SURFACE_WATER_MANAGEMENT_BOUNDARIES.ID,
            SURFACE_WATER_MANAGEMENT_BOUNDARIES.GEOM)
        .select(
            context
                .select(inline(id), field("ST_UNION( geom )", Geometry::class.java))
                .from(
                    context
                        .select(WATERSHEDS.GEOM)
                        .from(WATERSHEDS)
                        .where(WATERSHEDS.HYDRO_ID.`in`(segments))))
        .execute()
  }
}
