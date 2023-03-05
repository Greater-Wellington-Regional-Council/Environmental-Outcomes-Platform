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
      "Minimum Flow Boundary source data has been updated since last processed, re-processing now"
    }
    context.deleteFrom(MINIMUM_FLOW_LIMIT_BOUNDARIES).execute()

    val minimumFlowBoundariesToProcess =
        context
            .select(
                MINIMUM_FLOW_LIMITS.ID,
                MINIMUM_FLOW_LIMITS.HYDRO_IDS,
                MINIMUM_FLOW_LIMITS.EXCLUDED_HYDRO_IDS)
            .from(MINIMUM_FLOW_LIMITS)
            .where(MINIMUM_FLOW_LIMITS.HYDRO_ID.isNotNull)
            .fetch()

    minimumFlowBoundariesToProcess.forEach {
      val id = it.get(MINIMUM_FLOW_LIMITS.ID)!!
      val hydroIds = it.get(MINIMUM_FLOW_LIMITS.HYDRO_IDS)!!.filterNotNull()
      val excludedHydroIds = it.get(MINIMUM_FLOW_LIMITS.EXCLUDED_HYDRO_IDS)!!.filterNotNull()
      val catchmentTree =
          selectRecCatchmentTree(context, hydroIds.toSet(), excludedHydroIds.toSet())
      insertCatchmentFromWatersheds(id, catchmentTree)
    }
  }

  fun insertCatchmentFromWatersheds(id: Int, segments: Set<Int>) {
    context
        .insertInto(
            MINIMUM_FLOW_LIMIT_BOUNDARIES,
            MINIMUM_FLOW_LIMIT_BOUNDARIES.ID,
            MINIMUM_FLOW_LIMIT_BOUNDARIES.GEOM)
        .select(
            context
                .select(inline(id), field("ST_UNION( geom )", ByteArray::class.java))
                .from(
                    context
                        .select(WATERSHEDS.GEOM)
                        .from(WATERSHEDS)
                        .where(WATERSHEDS.HYDRO_ID.`in`(segments))))
        .execute()
  }
}
