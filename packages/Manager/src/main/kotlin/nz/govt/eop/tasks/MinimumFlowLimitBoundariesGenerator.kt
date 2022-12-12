package nz.govt.eop.tasks

import java.util.Collections
import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import nz.govt.eop.si.jooq.tables.MinimumFlowLimitBoundaries.Companion.MINIMUM_FLOW_LIMIT_BOUNDARIES
import nz.govt.eop.si.jooq.tables.MinimumFlowLimits.Companion.MINIMUM_FLOW_LIMITS
import nz.govt.eop.si.jooq.tables.Rivers.Companion.RIVERS
import nz.govt.eop.si.jooq.tables.Watersheds.Companion.WATERSHEDS
import org.jooq.DSLContext
import org.jooq.impl.DSL.*
import org.jooq.impl.SQLDataType.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
class MinimumFlowLimitBoundariesGenerator(@Autowired val context: DSLContext) {

  private val logger = KotlinLogging.logger {}

  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.MINUTES)
  @SchedulerLock(name = "checkMinimumFlowLimitBoundaries")
  @Transactional
  fun checkMinimumFlowLimitBoundaries() {
    logger.debug { "Start task MinimumFlowLimitBoundariesGenerator" }
    val needsRefresh = doesDataNeedRefresh()
    if (needsRefresh) {
      refresh()
    }
    logger.debug { "End task MinimumFlowLimitBoundariesGenerator" }
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

    val lastCreatedMinimumFlowLimit =
        context
            .select(max(MINIMUM_FLOW_LIMITS.CREATED_AT))
            .from(MINIMUM_FLOW_LIMITS)
            .fetchOne(max(MINIMUM_FLOW_LIMITS.CREATED_AT))
            ?: return false

    val lastUpdatedDependency =
        Collections.max(listOf(lastCreatedRiver, lastCreatedWatershed, lastCreatedMinimumFlowLimit))

    val lastProcessedMinimumFlowLimitBoundary =
        context
            .select(max(MINIMUM_FLOW_LIMIT_BOUNDARIES.CREATED_AT))
            .from(MINIMUM_FLOW_LIMIT_BOUNDARIES)
            .fetchOne(max(MINIMUM_FLOW_LIMIT_BOUNDARIES.CREATED_AT))

    return lastProcessedMinimumFlowLimitBoundary == null ||
        lastProcessedMinimumFlowLimitBoundary.isBefore(lastUpdatedDependency)
  }

  private fun refresh() {
    logger.info {
      "Surface Water Management Boundary source data has been updated since last processed, re-processing now"
    }
    context.deleteFrom(MINIMUM_FLOW_LIMIT_BOUNDARIES).execute()

    val minimumFlowBoundariesToProcess =
        context
            .select(
                MINIMUM_FLOW_LIMITS.ID,
                MINIMUM_FLOW_LIMITS.HYDRO_ID,
                MINIMUM_FLOW_LIMITS.EXCLUDED_HYDRO_IDS)
            .from(MINIMUM_FLOW_LIMITS)
            .where(MINIMUM_FLOW_LIMITS.HYDRO_ID.isNotNull)
            .fetch()

    minimumFlowBoundariesToProcess.forEach {
      val id = it.get(MINIMUM_FLOW_LIMITS.ID)!!
      val hydroId = it.get(MINIMUM_FLOW_LIMITS.HYDRO_ID)!!
      val excludedHydroIds = it.get(MINIMUM_FLOW_LIMITS.EXCLUDED_HYDRO_IDS)!!
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
            MINIMUM_FLOW_LIMIT_BOUNDARIES,
            MINIMUM_FLOW_LIMIT_BOUNDARIES.ID,
            MINIMUM_FLOW_LIMIT_BOUNDARIES.HYDRO_ID,
            MINIMUM_FLOW_LIMIT_BOUNDARIES.EXCLUDED_HYDRO_IDS,
            MINIMUM_FLOW_LIMIT_BOUNDARIES.GEOM)
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
