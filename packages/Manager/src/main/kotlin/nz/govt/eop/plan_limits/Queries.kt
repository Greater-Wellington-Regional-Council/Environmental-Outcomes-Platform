package nz.govt.eop.plan_limits

import nz.govt.eop.si.jooq.tables.CouncilRegions.Companion.COUNCIL_REGIONS
import nz.govt.eop.si.jooq.tables.Councils.Companion.COUNCILS
import nz.govt.eop.si.jooq.tables.FlowLimits.Companion.FLOW_LIMITS
import nz.govt.eop.si.jooq.tables.FlowMeasurementSites.Companion.FLOW_MEASUREMENT_SITES
import nz.govt.eop.si.jooq.tables.GroundwaterAreas.Companion.GROUNDWATER_AREAS
import nz.govt.eop.si.jooq.tables.GroundwaterLimits.Companion.GROUNDWATER_LIMITS
import nz.govt.eop.si.jooq.tables.PlanRegions.Companion.PLAN_REGIONS
import nz.govt.eop.si.jooq.tables.Plans.Companion.PLANS
import nz.govt.eop.si.jooq.tables.SurfaceWaterLimits.Companion.SURFACE_WATER_LIMITS
import org.jooq.*
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

  fun councilRegions(councilId: Int): String {
    val innerQuery =
        select(
                COUNCIL_REGIONS.ID,
                COUNCIL_REGIONS.NAME.`as`("name"),
                COUNCIL_REGIONS.BOUNDARY.`as`("geometry"),
                PLAN_REGIONS.DEFAULT_SURFACE_WATER_LIMIT,
                PLAN_REGIONS.DEFAULT_GROUNDWATER_LIMIT,
                PLAN_REGIONS.DEFAULT_FLOW_MANAGEMENT_SITE,
                PLAN_REGIONS.DEFAULT_FLOW_MANAGEMENT_LIMIT)
            .from(COUNCIL_REGIONS)
            .join(PLAN_REGIONS)
            .on(COUNCIL_REGIONS.ID.eq(PLAN_REGIONS.COUNCIL_REGION_ID))
            .where(COUNCIL_REGIONS.COUNCIL_ID.eq(councilId))
    return buildFeatureCollection(context, innerQuery)
  }

  fun surfaceWaterLimits(councilId: Int): String {
    val innerQuery =
        select(
                SURFACE_WATER_LIMITS.ID,
                SURFACE_WATER_LIMITS.PLAN_REGION_ID,
                SURFACE_WATER_LIMITS.PARENT_SURFACE_WATER_LIMIT,
                SURFACE_WATER_LIMITS.NAME,
                SURFACE_WATER_LIMITS.ALLOCATION_LIMIT,
                SURFACE_WATER_LIMITS.BOUNDARY.`as`("geometry"))
            .from(SURFACE_WATER_LIMITS)
            .where(
                SURFACE_WATER_LIMITS.PLAN_REGION_ID.`in`(
                    select(PLAN_REGIONS.ID)
                        .from(PLAN_REGIONS)
                        .join(COUNCIL_REGIONS)
                        .on(PLAN_REGIONS.COUNCIL_REGION_ID.eq(COUNCIL_REGIONS.ID))
                        .where(COUNCIL_REGIONS.COUNCIL_ID.eq(councilId))))
    return buildFeatureCollection(context, innerQuery)
  }

  fun groundwaterWaterLimits(councilId: Int): String {
    val innerQuery =
        select(
                GROUNDWATER_LIMITS.ID,
                GROUNDWATER_LIMITS.PLAN_REGION_ID,
                GROUNDWATER_LIMITS.NAME,
                GROUNDWATER_LIMITS.ALLOCATION_LIMIT,
                GROUNDWATER_AREAS.BOUNDARY.`as`("geometry"))
            .from(GROUNDWATER_LIMITS)
            .join(GROUNDWATER_AREAS)
            .on(GROUNDWATER_LIMITS.ID.eq(GROUNDWATER_AREAS.GROUNDWATER_LIMIT_ID))
            .where(
                GROUNDWATER_LIMITS.PLAN_REGION_ID.`in`(
                    select(PLAN_REGIONS.ID)
                        .from(PLAN_REGIONS)
                        .join(COUNCIL_REGIONS)
                        .on(PLAN_REGIONS.COUNCIL_REGION_ID.eq(COUNCIL_REGIONS.ID))
                        .where(COUNCIL_REGIONS.COUNCIL_ID.eq(councilId))))
    return buildFeatureCollection(context, innerQuery)
  }

  fun flowMeasurementSites(councilId: Int): String {
    val innerQuery =
        select(
                FLOW_MEASUREMENT_SITES.ID,
                FLOW_MEASUREMENT_SITES.NAME,
                FLOW_MEASUREMENT_SITES.LOCATION.`as`("geometry"))
            .from(FLOW_MEASUREMENT_SITES)
            .where(FLOW_MEASUREMENT_SITES.COUNCIL_ID.eq(councilId))

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
            .where(FLOW_LIMITS.COUNCIL_ID.eq(councilId))
    return buildFeatureCollection(context, innerQuery)
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
            jsonbArrayAgg(field("feature")))

    val feature: Field<JSONB> =
        function(
            "jsonb_build_object",
            JSONB::class.java,
            inline("type"),
            inline("Feature"),
            inline("id"),
            field("id"),
            inline("geometry"),
            // sdads
            field("ST_AsGeoJSON(geometry, 6 ,2)::jsonb"),
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
