package nz.govt.eop.geo

import nz.govt.eop.si.jooq.ManagementUnitType
import nz.govt.eop.si.jooq.tables.AllocationAmounts.Companion.ALLOCATION_AMOUNTS
import nz.govt.eop.si.jooq.tables.CouncilBoundaries.Companion.COUNCIL_BOUNDARIES
import nz.govt.eop.si.jooq.tables.GroundwaterZones.Companion.GROUNDWATER_ZONES
import nz.govt.eop.si.jooq.tables.MinimumFlowLimitBoundaries.Companion.MINIMUM_FLOW_LIMIT_BOUNDARIES
import nz.govt.eop.si.jooq.tables.MinimumFlowLimits.Companion.MINIMUM_FLOW_LIMITS
import nz.govt.eop.si.jooq.tables.Sites.Companion.SITES
import nz.govt.eop.si.jooq.tables.SurfaceWaterManagementBoundaries.Companion.SURFACE_WATER_MANAGEMENT_BOUNDARIES
import nz.govt.eop.si.jooq.tables.WaterAllocations.Companion.WATER_ALLOCATIONS
import nz.govt.eop.si.jooq.tables.WhaituaBoundaries.Companion.WHAITUA_BOUNDARIES
import org.jooq.*
import org.jooq.impl.DSL.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

@Component
class GeoJsonQueries(@Autowired val context: DSLContext) {
  fun councils(): String {
    val innerQuery =
        select(
                COUNCIL_BOUNDARIES.ID,
                COUNCIL_BOUNDARIES.GEOM.`as`("geometry"),
                COUNCIL_BOUNDARIES.NAME)
            .from(COUNCIL_BOUNDARIES)
    return buildFeatureCollection(context, innerQuery)
  }

  fun whaitua(): String {
    val innerQuery =
        select(
                WHAITUA_BOUNDARIES.ID,
                WHAITUA_BOUNDARIES.GEOM.`as`("geometry"),
                WHAITUA_BOUNDARIES.NAME)
            .from(WHAITUA_BOUNDARIES)
    return buildFeatureCollection(context, innerQuery)
  }

  fun surfaceWaterManagementUnitsQuery(unitType: ManagementUnitType) =
      select(
              SURFACE_WATER_MANAGEMENT_BOUNDARIES.ID.`as`("id"),
              SURFACE_WATER_MANAGEMENT_BOUNDARIES.GEOM.`as`("geometry"),
              ALLOCATION_AMOUNTS.ID.`as`("allocation_amount_id"),
              ALLOCATION_AMOUNTS.ALLOCATION_AMOUNT,
              ALLOCATION_AMOUNTS.SURFACEWATER_SUBUNIT_NAME.`as`("name"),
              ALLOCATION_AMOUNTS.CATCHMENT_MANAGEMENT_UNIT,
              ALLOCATION_AMOUNTS.AREA_DESCRIPTION,
              ALLOCATION_AMOUNTS.ALLOCATION_AMOUNT_UNIT,
              WATER_ALLOCATIONS.AMOUNT.`as`("allocated_amount"))
          .from(SURFACE_WATER_MANAGEMENT_BOUNDARIES)
          .join(ALLOCATION_AMOUNTS)
          .on(ALLOCATION_AMOUNTS.ID.eq(SURFACE_WATER_MANAGEMENT_BOUNDARIES.ID))
          .leftJoin(WATER_ALLOCATIONS)
          .on(ALLOCATION_AMOUNTS.AREA_ID.eq(WATER_ALLOCATIONS.AREA_ID))
          .where(ALLOCATION_AMOUNTS.MANAGEMENT_UNIT_TYPE.eq(unitType))

  fun surfaceWaterManagementUnits(): String {
    return buildFeatureCollection(
        context, surfaceWaterManagementUnitsQuery(ManagementUnitType.MANAGEMENT_UNIT))
  }

  fun surfaceWaterManagementSubUnits(): String {
    return buildFeatureCollection(
        context, surfaceWaterManagementUnitsQuery(ManagementUnitType.MANAGEMENT_SUB_UNIT))
  }

  fun flowManagementSites(): String {
    val innerQuery =
        select(
                SITES.ID.`as`("id"),
                SITES.GEOM.`as`("geometry"),
            )
            .from(SITES)

    return buildFeatureCollection(context, innerQuery)
  }

  fun flowLimits(): String {
    val innerQuery =
        select(
                MINIMUM_FLOW_LIMIT_BOUNDARIES.ID.`as`("id"),
                MINIMUM_FLOW_LIMIT_BOUNDARIES.GEOM.`as`("geometry"),
                MINIMUM_FLOW_LIMITS.PLAN_MANAGEMENT_POINT_NAME.`as`("name"),
                MINIMUM_FLOW_LIMITS.PLAN_MINIMUM_FLOW_VALUE,
                MINIMUM_FLOW_LIMITS.PLAN_MINIMUM_FLOW_UNIT,
                MINIMUM_FLOW_LIMITS.SITE_ID,
            )
            .from(MINIMUM_FLOW_LIMIT_BOUNDARIES)
            .join(MINIMUM_FLOW_LIMITS)
            .on(MINIMUM_FLOW_LIMITS.ID.eq(MINIMUM_FLOW_LIMIT_BOUNDARIES.ID))

    return buildFeatureCollection(context, innerQuery)
  }

  fun getGroundwaterZones(): String {

    val allocationAmountsSurfaceWaterUnit = ALLOCATION_AMOUNTS.`as`("swau")
    val waterAllocationsAmountSurfaceWater = WATER_ALLOCATIONS.`as`("waswau")
    val allocationAmountsSurfaceWaterSubUnit = ALLOCATION_AMOUNTS.`as`("swas")
    val waterAllocationsAmountSurfaceWaterSubUnit = WATER_ALLOCATIONS.`as`("waswas")
    val allocationAmountsGroundwater = ALLOCATION_AMOUNTS.`as`("gwa")
    val waterAllocationsAmountGroundwater = WATER_ALLOCATIONS.`as`("wagwa")

    val innerQuery =
        select(
                GROUNDWATER_ZONES.ID.`as`("id"),
                GROUNDWATER_ZONES.GEOM.`as`("geometry"),
                GROUNDWATER_ZONES.NAME,
                GROUNDWATER_ZONES.DEPTH,
                GROUNDWATER_ZONES.CATEGORY,
                allocationAmountsSurfaceWaterUnit.ID.`as`(
                    "surface_water_unit_allocation_amount_id"),
                allocationAmountsSurfaceWaterUnit.ALLOCATION_AMOUNT.`as`(
                    "surface_water_unit_allocation_amount"),
                allocationAmountsSurfaceWaterUnit.ALLOCATION_AMOUNT_UNIT.`as`(
                    "surface_water_unit_allocation_amount_unit"),
                waterAllocationsAmountSurfaceWater.AMOUNT.`as`(
                    "surface_water_unit_allocated_amount"),
                allocationAmountsSurfaceWaterSubUnit.ID.`as`(
                    "surface_water_sub_unit_allocation_amount_id"),
                allocationAmountsSurfaceWaterSubUnit.ALLOCATION_AMOUNT.`as`(
                    "surface_water_sub_unit_allocation_amount"),
                allocationAmountsSurfaceWaterSubUnit.ALLOCATION_AMOUNT_UNIT.`as`(
                    "surface_water_sub_unit_allocation_amount_unit"),
                waterAllocationsAmountSurfaceWaterSubUnit.AMOUNT.`as`(
                    "surface_water_sub_unit_allocated_amount"),
                allocationAmountsGroundwater.ID.`as`("groundwater_allocation_amount_id"),
                allocationAmountsGroundwater.ALLOCATION_AMOUNT.`as`(
                    "groundwater_allocation_amount"),
                allocationAmountsGroundwater.ALLOCATION_AMOUNT_UNIT.`as`(
                    "groundwater_allocation_amount_unit"),
                waterAllocationsAmountGroundwater.AMOUNT.`as`("groundwater_allocated_amount"))
            .from(GROUNDWATER_ZONES)
            .join(allocationAmountsGroundwater)
            .on(GROUNDWATER_ZONES.ALLOCATION_AMOUNT_ID.eq(allocationAmountsGroundwater.ID))
            .leftJoin(allocationAmountsSurfaceWaterUnit)
            .on(
                allocationAmountsGroundwater.PARENT_SURFACEWATER_UNIT_ID.eq(
                    allocationAmountsSurfaceWaterUnit.ID))
            .leftJoin(allocationAmountsSurfaceWaterSubUnit)
            .on(
                allocationAmountsGroundwater.PARENT_SURFACEWATERSUBUNIT_ID.eq(
                    allocationAmountsSurfaceWaterSubUnit.ID))
            .leftJoin(waterAllocationsAmountSurfaceWater)
            .on(
                allocationAmountsSurfaceWaterUnit.AREA_ID.eq(
                    waterAllocationsAmountSurfaceWater.AREA_ID))
            .leftJoin(waterAllocationsAmountSurfaceWaterSubUnit)
            .on(
                allocationAmountsSurfaceWaterSubUnit.AREA_ID.eq(
                    waterAllocationsAmountSurfaceWaterSubUnit.AREA_ID))
            .leftJoin(waterAllocationsAmountGroundwater)
            .on(allocationAmountsGroundwater.AREA_ID.eq(waterAllocationsAmountGroundwater.AREA_ID))

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
            field("geometry"),
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
