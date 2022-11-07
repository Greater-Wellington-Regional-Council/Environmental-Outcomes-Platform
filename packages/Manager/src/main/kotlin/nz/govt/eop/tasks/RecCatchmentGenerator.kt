package nz.govt.eop.tasks

import java.util.Collections
import java.util.concurrent.TimeUnit
import mu.KotlinLogging
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
class RecCatchmentGenerator(@Autowired val create: DSLContext) {

  private val logger = KotlinLogging.logger {}

  @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.MINUTES)
  @Transactional
  fun checkCatchments() {
    logger.info { "Start task RecCatchmentGenerator" }

    val lastIngestedRiver =
        create.selectFrom(RIVERS).orderBy(RIVERS.CREATED_AT.desc()).limit(1).fetchAny() ?: return

    val lastIngestedWatershed =
        create.selectFrom(WATERSHEDS).orderBy(WATERSHEDS.CREATED_AT.desc()).limit(1).fetchAny()
            ?: return

    val lastCreatedAllocationAmount =
        create
            .selectFrom(ALLOCATION_AMOUNTS)
            .orderBy(ALLOCATION_AMOUNTS.CREATED_AT.desc())
            .limit(1)
            .fetchAny()
            ?: return

    val lastUpdatedDependency =
        Collections.max(
            listOf(
                lastIngestedRiver.createdAt,
                lastIngestedWatershed.createdAt,
                lastCreatedAllocationAmount.createdAt))

    val lastProcessedCatchment =
        create.selectFrom(CATCHMENTS).orderBy(CATCHMENTS.CREATED_AT.desc()).limit(1).fetchAny()

    if (lastProcessedCatchment == null ||
        lastProcessedCatchment.createdAt!!.isBefore(lastUpdatedDependency)) {

      logger.info {
        "Catchment source data has been updated since last processed, re-processing now"
      }
      create.deleteFrom(CATCHMENTS).execute()

      val catchmentHydroIds =
          create
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
    logger.info { "End task RecCatchmentGenerator" }
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

    return create
        .withRecursive(cte)
        .selectFrom(cte)
        .fetch { it.get("hydro_id") as Int }
        .toSet()
        .plus(hydroId)
  }

  fun insertCatchmentFromWatersheds(root: Int, segments: Set<Int>) {
    create
        .insertInto(CATCHMENTS, CATCHMENTS.HYDRO_ID, CATCHMENTS.GEOM)
        .select(
            create
                .select(inline(root), field("ST_UNION( geom )", ByteArray::class.java))
                .from(
                    create
                        .select(WATERSHEDS.GEOM)
                        .from(WATERSHEDS)
                        .where(WATERSHEDS.HYDRO_ID.`in`(segments))))
        .execute()
  }
}
