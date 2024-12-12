package nz.govt.eop.plan_limits

import java.time.LocalDate
import nz.govt.eop.si.jooq.tables.Councils.Companion.COUNCILS
import nz.govt.eop.si.jooq.tables.FlowLimits.Companion.FLOW_LIMITS
import nz.govt.eop.si.jooq.tables.FlowMeasurementSites.Companion.FLOW_MEASUREMENT_SITES
import nz.govt.eop.si.jooq.tables.GroundwaterAllocationLimitsByAreaAndCategory.Companion.GROUNDWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY
import nz.govt.eop.si.jooq.tables.GroundwaterAreas.Companion.GROUNDWATER_AREAS
import nz.govt.eop.si.jooq.tables.GroundwaterLimits.Companion.GROUNDWATER_LIMITS
import nz.govt.eop.si.jooq.tables.PlanRegions.Companion.PLAN_REGIONS
import nz.govt.eop.si.jooq.tables.Plans.Companion.PLANS
import nz.govt.eop.si.jooq.tables.SurfaceWaterLimits.Companion.SURFACE_WATER_LIMITS
import nz.govt.eop.si.jooq.tables.SurfacewaterAllocationLimitsByAreaAndCategory.Companion.SURFACEWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY
import nz.govt.eop.si.jooq.tables.WaterAllocationAndUsageByArea.Companion.WATER_ALLOCATION_AND_USAGE_BY_AREA
import nz.govt.eop.si.jooq.tables.WaterAllocationsByArea.Companion.WATER_ALLOCATIONS_BY_AREA
import org.jooq.*
import org.jooq.impl.DSL
import org.jooq.impl.DSL.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class Queries(@Autowired val context: DSLContext) {

  fun councils(): String {
    val innerQuery =
        select(COUNCILS.ID, COUNCILS.NAME, COUNCILS.BOUNDARY.`as`("geometry")).from(COUNCILS)
    return buildFeatureCollection(context, innerQuery)
  }

  fun plan(councilId: Int): String {
    val innerQuery =
        select(
                PLANS.ID,
                PLANS.COUNCIL_ID,
                PLANS.NAME,
                PLANS.DEFAULT_SURFACE_WATER_LIMIT,
                PLANS.DEFAULT_GROUNDWATER_LIMIT,
                PLANS.DEFAULT_FLOW_MANAGEMENT_SITE,
                PLANS.DEFAULT_FLOW_MANAGEMENT_LIMIT)
            .from(PLANS)
            .where(PLANS.COUNCIL_ID.eq(councilId))

    val featureCollection: Field<JSONB> =
        function("to_jsonb", JSONB::class.java, field("to_jsonb(inputs)"))

    val result = context.select(featureCollection).from(innerQuery.asTable("inputs")).fetch()
    return result.firstNotNullOf { it.value1().toString() }
  }

  fun planRegions(councilId: Int): String {
    val innerQuery =
        select(
                PLAN_REGIONS.ID,
                PLAN_REGIONS.PLAN_ID,
                PLAN_REGIONS.NAME,
                PLAN_REGIONS.REFERENCE_URL,
                PLAN_REGIONS.SOURCE_ID,
                PLAN_REGIONS.BOUNDARY.`as`("geometry"),
                PLAN_REGIONS.DEFAULT_SURFACE_WATER_LIMIT,
                PLAN_REGIONS.DEFAULT_GROUNDWATER_LIMIT,
                PLAN_REGIONS.DEFAULT_FLOW_MANAGEMENT_SITE,
                PLAN_REGIONS.DEFAULT_FLOW_MANAGEMENT_LIMIT)
            .from(PLAN_REGIONS)
            .join(PLANS)
            .on(PLAN_REGIONS.PLAN_ID.eq(PLANS.ID))
            .where(PLANS.COUNCIL_ID.eq(councilId))

    return buildFeatureCollection(context, innerQuery)
  }

  fun surfaceWaterLimits(councilId: Int): String {
    val innerQuery =
        select(
                SURFACE_WATER_LIMITS.ID,
                SURFACE_WATER_LIMITS.PLAN_REGION_ID,
                SURFACE_WATER_LIMITS.SOURCE_ID,
                SURFACE_WATER_LIMITS.PARENT_SURFACE_WATER_LIMIT_ID,
                SURFACE_WATER_LIMITS.NAME,
                SURFACE_WATER_LIMITS.ALLOCATION_LIMIT,
                WATER_ALLOCATIONS_BY_AREA.ALLOCATION_AMOUNT,
                SURFACE_WATER_LIMITS.BOUNDARY.`as`("geometry"))
            .from(SURFACE_WATER_LIMITS)
            .leftJoin(WATER_ALLOCATIONS_BY_AREA)
            .on(SURFACE_WATER_LIMITS.SOURCE_ID.eq(WATER_ALLOCATIONS_BY_AREA.AREA_ID))
            .where(
                SURFACE_WATER_LIMITS.PLAN_REGION_ID.`in`(
                    select(PLAN_REGIONS.ID)
                        .from(PLAN_REGIONS)
                        .join(PLANS)
                        .on(PLAN_REGIONS.PLAN_ID.eq(PLANS.ID))
                        .where(PLANS.COUNCIL_ID.eq(councilId))))
    return buildFeatureCollection(context, innerQuery)
  }

  fun groundwaterWaterLimits(councilId: Int): String {
    val innerQuery =
        select(
                GROUNDWATER_AREAS.ID,
                GROUNDWATER_AREAS.CATEGORY,
                GROUNDWATER_AREAS.DEPTH,
                GROUNDWATER_AREAS.DEPLETION_LIMIT_ID,
                GROUNDWATER_AREAS.BOUNDARY.`as`("geometry"),
                GROUNDWATER_LIMITS.ID.`as`("limit_id"),
                GROUNDWATER_LIMITS.SOURCE_ID,
                GROUNDWATER_LIMITS.PLAN_REGION_ID,
                GROUNDWATER_LIMITS.NAME,
                GROUNDWATER_LIMITS.ALLOCATION_LIMIT,
                WATER_ALLOCATIONS_BY_AREA.ALLOCATION_AMOUNT)
            .from(GROUNDWATER_LIMITS)
            .join(GROUNDWATER_AREAS)
            .on(GROUNDWATER_LIMITS.ID.eq(GROUNDWATER_AREAS.GROUNDWATER_LIMIT_ID))
            .leftJoin(WATER_ALLOCATIONS_BY_AREA)
            .on(GROUNDWATER_LIMITS.SOURCE_ID.eq(WATER_ALLOCATIONS_BY_AREA.AREA_ID))
            .where(
                GROUNDWATER_LIMITS.PLAN_REGION_ID.`in`(
                    select(PLAN_REGIONS.ID)
                        .from(PLAN_REGIONS)
                        .join(PLANS)
                        .on(PLAN_REGIONS.PLAN_ID.eq(PLANS.ID))
                        .where(PLANS.COUNCIL_ID.eq(councilId))))
    return buildFeatureCollection(context, innerQuery)
  }

  fun surfaceWaterPNRP(councilId: Int): String {
      val innerQuery =
          select(
              SURFACEWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.AREA_ID,
              SURFACEWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.PLAN_REGION_ID,
              SURFACEWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.CATEGORY_A,
              SURFACEWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.CATEGORY_B,
              SURFACEWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.SURFACE_TAKE,
              SURFACEWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.TOTAL_ALLOCATION,
              SURFACEWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.ALLOCATION_LIMIT,
              SURFACEWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.PNRP_ALLOCATION_PERCENTAGE,
              SURFACEWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.NAME
          )
              .from(SURFACEWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY)
              .where(
                  SURFACEWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.PLAN_REGION_ID.`in`(
                      select(PLAN_REGIONS.ID)
                          .from(PLAN_REGIONS)
                          .join(PLANS)
                          .on(PLAN_REGIONS.PLAN_ID.eq(PLANS.ID))
                          .where(PLANS.COUNCIL_ID.eq(councilId))
                  )
              )
      return buildFeatureCollection(context, innerQuery)
  }

  fun groundWaterPNRP(councilId: Int): String {
      val innerQuery =
          select(
              GROUNDWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.AREA_ID,
              GROUNDWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.PLAN_REGION_ID,
              GROUNDWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.CATEGORY_B,
              GROUNDWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.CATEGORY_BC,
              GROUNDWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.CATEGORY_C,
              GROUNDWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.TOTAL_ALLOCATION,
              GROUNDWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.ALLOCATION_LIMIT,
              GROUNDWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.PNRP_ALLOCATION_PERCENTAGE,
              GROUNDWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.NAME
          )
              .from(GROUNDWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY)
              .where(
                  GROUNDWATER_ALLOCATION_LIMITS_BY_AREA_AND_CATEGORY.PLAN_REGION_ID.`in`(
                      select(PLAN_REGIONS.ID)
                          .from(PLAN_REGIONS)
                          .join(PLANS)
                          .on(PLAN_REGIONS.PLAN_ID.eq(PLANS.ID))
                          .where(PLANS.COUNCIL_ID.eq(councilId))
                  )
              )
      return buildFeatureCollection(context, innerQuery)
  }
  
  fun flowMeasurementSites(councilId: Int): String {
    val innerQuery =
        select(
                FLOW_MEASUREMENT_SITES.ID,
                FLOW_MEASUREMENT_SITES.NAME,
                FLOW_MEASUREMENT_SITES.LOCATION.`as`("geometry"))
            .from(FLOW_MEASUREMENT_SITES)
            .where(
                FLOW_MEASUREMENT_SITES.PLAN_REGION_ID.`in`(
                    select(PLAN_REGIONS.ID)
                        .from(PLAN_REGIONS)
                        .join(PLANS)
                        .on(PLAN_REGIONS.PLAN_ID.eq(PLANS.ID))
                        .where(PLANS.COUNCIL_ID.eq(councilId))))

    return buildFeatureCollection(context, innerQuery)
  }

  fun flowLimits(councilId: Int): String {
    val innerQuery =
        select(
                FLOW_LIMITS.ID,
                FLOW_LIMITS.MINIMUM_FLOW,
                FLOW_LIMITS.BOUNDARY.`as`("geometry"),
                FLOW_LIMITS.MEASURED_AT_SITE_ID)
            .from(FLOW_LIMITS)
            .where(
                FLOW_LIMITS.PLAN_REGION_ID.`in`(
                    select(PLAN_REGIONS.ID)
                        .from(PLAN_REGIONS)
                        .join(PLANS)
                        .on(PLAN_REGIONS.PLAN_ID.eq(PLANS.ID))
                        .where(PLANS.COUNCIL_ID.eq(councilId))))

    return buildFeatureCollection(context, innerQuery)
  }

  fun waterUsage(councilId: Int, from: LocalDate, to: LocalDate, areaId: String? = null): String {
    var whereCondition = DSL.noCondition()
    if (areaId != null) {
      whereCondition = whereCondition.and(WATER_ALLOCATION_AND_USAGE_BY_AREA.AREA_ID.eq(areaId))
    }

    val innerQuery =
        select(
                WATER_ALLOCATION_AND_USAGE_BY_AREA.AREA_ID.`as`("areaId"),
                WATER_ALLOCATION_AND_USAGE_BY_AREA.DATE,
                sum(WATER_ALLOCATION_AND_USAGE_BY_AREA.ALLOCATION_PLAN).`as`("allocationPlan"),
                sum(WATER_ALLOCATION_AND_USAGE_BY_AREA.ALLOCATION_DAILY).`as`("allocationDaily"),
                sum(WATER_ALLOCATION_AND_USAGE_BY_AREA.ALLOCATION_DAILY_USED)
                    .`as`("allocationDailyUsed"),
                sum(WATER_ALLOCATION_AND_USAGE_BY_AREA.DAILY_USAGE).`as`("dailyUsage"))
            .from(WATER_ALLOCATION_AND_USAGE_BY_AREA)
            .where(whereCondition)
            .and(WATER_ALLOCATION_AND_USAGE_BY_AREA.DATE.ge(from))
            .and(WATER_ALLOCATION_AND_USAGE_BY_AREA.DATE.le(to))
            .groupBy(
                WATER_ALLOCATION_AND_USAGE_BY_AREA.AREA_ID, WATER_ALLOCATION_AND_USAGE_BY_AREA.DATE)

    val featureCollection: Field<JSONB> =
        coalesce(function("json_agg", JSONB::class.java, field("inputs")), jsonArray())

    val result = context.select(featureCollection).from(innerQuery.asTable("inputs")).fetch()
    return result.firstNotNullOf { it.value1().toString() }
  }

  private fun <R : Record> buildFeatureCollection(
      dslContext: DSLContext,
      innerQuery: Select<R>
  ): String {

    val featureCollection: Field<JSONB> =
        function(
            "jsonb_build_object",
            JSONB::class.java,
            inline("type"),
            inline("FeatureCollection"),
            inline("features"),
            coalesce(jsonbArrayAgg(field("feature")), jsonbArray()))

    val feature: Field<JSONB> =
        function(
            "jsonb_build_object",
            JSONB::class.java,
            inline("type"),
            inline("Feature"),
            inline("id"),
            field("id"),
            inline("geometry"),
            field("ST_AsGeoJSON(ST_Transform(geometry, 4326), 6 ,2)::jsonb"),
            inline("properties"),
            field("to_jsonb(inputs) - 'id' - 'geometry'"))

    val result =
        dslContext
            .select(featureCollection)
            .from(select(feature.`as`("feature")).from(innerQuery.asTable("inputs")))
            .fetch()
    return result.firstNotNullOf { it.value1().toString() }
  }
}
