package nz.govt.eop.tasks

import nz.govt.eop.si.jooq.tables.Rivers
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.jooq.impl.SQLDataType

/**
 * Given a starting river segment(s) return all upstream connected segments to form the overall
 * catchment above that point. River segments can be passed in to be excluded, which will exclude
 * that segment and any branches above those segments.
 *
 * @param context
 * - The JOOQ context
 *
 * @param hydroIds
 * - The river segments to start from
 *
 * @param excludedHydroIds
 * - The river segments to indicate parts of the catchment which should be excluded
 */
fun selectRecCatchmentTree(
    context: DSLContext,
    hydroIds: Collection<Int>,
    excludedHydroIds: Collection<Int>
): Set<Int> {
  val cte =
      DSL.name("r")
          .fields(
              "hydro_id",
          )
          .`as`(
              DSL.select(Rivers.RIVERS.HYDRO_ID)
                  .from(Rivers.RIVERS)
                  .where(
                      Rivers.RIVERS.NEXT_HYDRO_ID.`in`(hydroIds),
                      Rivers.RIVERS.HYDRO_ID.notIn(excludedHydroIds))
                  .unionAll(
                      DSL.select(
                              Rivers.RIVERS.HYDRO_ID,
                          )
                          .from(Rivers.RIVERS)
                          .join(DSL.table(DSL.name("r")))
                          .on(
                              DSL.field(DSL.name("r", "hydro_id"), SQLDataType.INTEGER)
                                  .eq(Rivers.RIVERS.NEXT_HYDRO_ID))
                          .where(Rivers.RIVERS.HYDRO_ID.notIn(excludedHydroIds))))
  return context
      .withRecursive(cte)
      .selectFrom(cte)
      .fetch { it.get("hydro_id") as Int }
      .toSet()
      .plus(hydroIds)
}
