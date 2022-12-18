package nz.govt.eop.tasks

import java.util.Collections
import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import nz.govt.eop.si.jooq.tables.AllocationAmounts.Companion.ALLOCATION_AMOUNTS
import nz.govt.eop.si.jooq.tables.Rivers.Companion.RIVERS
import nz.govt.eop.si.jooq.tables.SurfaceWaterManagementBoundaries.Companion.SURFACE_WATER_MANAGEMENT_BOUNDARIES
import nz.govt.eop.si.jooq.tables.Watersheds.Companion.WATERSHEDS
import org.jooq.DSLContext
import org.jooq.impl.DSL.*
import org.jooq.impl.SQLDataType.*
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
    logger.debug { "Start task SurfaceWaterManagementBoundariesGenerator" }
    val needsRefresh = doesDataNeedRefresh()
    if (needsRefresh) {
      refresh()
    }
    logger.debug { "End task SurfaceWaterManagementBoundariesGenerator" }
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
                ALLOCATION_AMOUNTS.HYDRO_ID,
                ALLOCATION_AMOUNTS.EXCLUDED_HYDRO_IDS)
            .from(ALLOCATION_AMOUNTS)
            .where(ALLOCATION_AMOUNTS.HYDRO_ID.isNotNull)
            .fetch()

    allocationAmountsToProcess.forEach {
      val id = it.get(ALLOCATION_AMOUNTS.ID)!!
      val hydroId = it.get(ALLOCATION_AMOUNTS.HYDRO_ID)!!
      val excludedHydroIds = it.get(ALLOCATION_AMOUNTS.EXCLUDED_HYDRO_IDS)!!
      val catchmentTree = selectCatchmentTree(hydroId, excludedHydroIds.toSet())
      insertCatchmentFromWatersheds(id, hydroId, excludedHydroIds.toSet(), catchmentTree)
    }
  }

  fun selectCatchmentTree(hydroId: Int, excludedHydroIds: Set<Int?>): Set<Int> {
    val cte =
        name("r")
            .fields(
                "hydro_id",
            )
            .`as`(
                select(RIVERS.HYDRO_ID)
                    .from(RIVERS)
                    .where(
                        RIVERS.NEXT_HYDRO_ID.eq(hydroId), RIVERS.HYDRO_ID.notIn(excludedHydroIds))
                    .unionAll(
                        select(
                                RIVERS.HYDRO_ID,
                            )
                            .from(RIVERS)
                            .join(table(name("r")))
                            .on(field(name("r", "hydro_id"), INTEGER).eq(RIVERS.NEXT_HYDRO_ID))
                            .where(RIVERS.HYDRO_ID.notIn(excludedHydroIds))))

    return context
        .withRecursive(cte)
        .selectFrom(cte)
        .fetch { it.get("hydro_id") as Int }
        .toSet()
        .plus(hydroId)
  }

  fun insertCatchmentFromWatersheds(
      id: Int,
      startHydroId: Int,
      excludedHydroIds: Set<Int?>,
      segments: Set<Int>
  ) {
    context
        .insertInto(
            SURFACE_WATER_MANAGEMENT_BOUNDARIES,
            SURFACE_WATER_MANAGEMENT_BOUNDARIES.ID,
            SURFACE_WATER_MANAGEMENT_BOUNDARIES.HYDRO_ID,
            SURFACE_WATER_MANAGEMENT_BOUNDARIES.EXCLUDED_HYDRO_IDS,
            SURFACE_WATER_MANAGEMENT_BOUNDARIES.GEOM)
        .select(
            context
                .select(
                    inline(id),
                    inline(startHydroId),
                    inline(excludedHydroIds.toTypedArray()),
                    field("ST_UNION( geom )", ByteArray::class.java))
                .from(
                    context
                        .select(WATERSHEDS.GEOM)
                        .from(WATERSHEDS)
                        .where(WATERSHEDS.HYDRO_ID.`in`(segments))))
        .execute()
  }
}
