package nz.govt.eop.tasks

import java.util.Collections
import java.util.concurrent.TimeUnit
import mu.KotlinLogging
import net.javacrumbs.shedlock.spring.annotation.SchedulerLock
import nz.govt.eop.si.jooq.tables.AllocationAmounts.Companion.ALLOCATION_AMOUNTS
import nz.govt.eop.si.jooq.tables.Catchments.Companion.CATCHMENTS
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
class RecCatchmentGenerator(@Autowired val context: DSLContext) {

  private val logger = KotlinLogging.logger {}

  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.MINUTES)
  @SchedulerLock(name = "checkCatchments")
  @Transactional
  fun checkCatchments() {
    logger.debug { "Start task RecCatchmentGenerator" }
    val needsRefresh = doesDataNeedRefresh()
    if (needsRefresh) {
      refresh()
    }
    logger.debug { "End task RecCatchmentGenerator" }
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

    val lastProcessedCatchment =
        context
            .select(max(CATCHMENTS.CREATED_AT))
            .from(CATCHMENTS)
            .fetchOne(max(CATCHMENTS.CREATED_AT))

    return lastProcessedCatchment == null || lastProcessedCatchment.isBefore(lastUpdatedDependency)
  }

  private fun refresh() {
    logger.info { "Catchment source data has been updated since last processed, re-processing now" }
    context.deleteFrom(CATCHMENTS).execute()

    val catchmentHydroIds =
        context
            .selectDistinct(ALLOCATION_AMOUNTS.HYDRO_ID)
            .from(ALLOCATION_AMOUNTS)
            .where(ALLOCATION_AMOUNTS.HYDRO_ID.isNotNull)
            .fetch { it.get("hydro_id") as Int }
            .toSet()

    catchmentHydroIds.forEach {
      val catchmentTree = selectCatchmentTree(it)
      insertCatchmentFromWatersheds(it, catchmentTree)
    }
  }

  fun selectCatchmentTree(hydroId: Int): Set<Int> {
    val cte =
        name("r")
            .fields(
                "hydro_id",
            )
            .`as`(
                select(RIVERS.HYDRO_ID)
                    .from(RIVERS)
                    .where(RIVERS.NEXT_HYDRO_ID.eq(hydroId))
                    .unionAll(
                        select(
                                RIVERS.HYDRO_ID,
                            )
                            .from(RIVERS)
                            .join(table(name("r")))
                            .on(field(name("r", "hydro_id"), INTEGER).eq(RIVERS.NEXT_HYDRO_ID))))

    return context
        .withRecursive(cte)
        .selectFrom(cte)
        .fetch { it.get("hydro_id") as Int }
        .toSet()
        .plus(hydroId)
  }

  fun insertCatchmentFromWatersheds(root: Int, segments: Set<Int>) {
    context
        .insertInto(CATCHMENTS, CATCHMENTS.HYDRO_ID, CATCHMENTS.GEOM)
        .select(
            context
                .select(inline(root), field("ST_UNION( geom )", ByteArray::class.java))
                .from(
                    context
                        .select(WATERSHEDS.GEOM)
                        .from(WATERSHEDS)
                        .where(WATERSHEDS.HYDRO_ID.`in`(segments))))
        .execute()
  }
}
