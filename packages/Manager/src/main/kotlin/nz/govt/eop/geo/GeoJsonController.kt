package nz.govt.eop.geo

import java.util.concurrent.TimeUnit
import nz.govt.eop.si.jooq.ManagementUnitType
import nz.govt.eop.si.jooq.tables.AllocationAmounts.Companion.ALLOCATION_AMOUNTS
import nz.govt.eop.si.jooq.tables.CouncilBoundaries.Companion.COUNCIL_BOUNDARIES
import nz.govt.eop.si.jooq.tables.GroundwaterZones.Companion.GROUNDWATER_ZONES
import nz.govt.eop.si.jooq.tables.MinimumFlowLimitBoundaries.Companion.MINIMUM_FLOW_LIMIT_BOUNDARIES
import nz.govt.eop.si.jooq.tables.MinimumFlowLimits.Companion.MINIMUM_FLOW_LIMITS
import nz.govt.eop.si.jooq.tables.Sites.Companion.SITES
import nz.govt.eop.si.jooq.tables.SurfaceWaterManagementBoundaries.Companion.SURFACE_WATER_MANAGEMENT_BOUNDARIES
import nz.govt.eop.si.jooq.tables.WhaituaBoundaries.Companion.WHAITUA_BOUNDARIES
import org.jooq.*
import org.jooq.impl.DSL.*
import org.springframework.http.CacheControl
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class GeoJsonController(val context: DSLContext) {

  @RequestMapping("/layers/councils", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getRegionalCouncils(): ResponseEntity<String> {

    val innerQuery =
        select(
                COUNCIL_BOUNDARIES.ID,
                COUNCIL_BOUNDARIES.GEOM.`as`("geometry"),
                COUNCIL_BOUNDARIES.NAME)
            .from(COUNCIL_BOUNDARIES)

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS))
        .body(buildFeatureCollection(context, innerQuery))
  }

  @RequestMapping("/layers/whaitua", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getWhaitua(): ResponseEntity<String> {

    val innerQuery =
        select(
                WHAITUA_BOUNDARIES.ID,
                WHAITUA_BOUNDARIES.GEOM.`as`("geometry"),
                WHAITUA_BOUNDARIES.NAME)
            .from(WHAITUA_BOUNDARIES)

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(7, TimeUnit.DAYS))
        .body(buildFeatureCollection(context, innerQuery))
  }

  @RequestMapping("/layers/surface_water_mgmt", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getSurfaceWaterManagementUnits(): ResponseEntity<String> {
    val innerQuery =
        select(
                SURFACE_WATER_MANAGEMENT_BOUNDARIES.ID.`as`("id"),
                SURFACE_WATER_MANAGEMENT_BOUNDARIES.GEOM.`as`("geometry"),
                ALLOCATION_AMOUNTS.ALLOCATION_AMOUNT,
                ALLOCATION_AMOUNTS.SURFACEWATER_SUBUNIT_NAME.`as`("name"),
                ALLOCATION_AMOUNTS.CATCHMENT_MANAGEMENT_UNIT,
                ALLOCATION_AMOUNTS.AREA_DESCRIPTION,
                ALLOCATION_AMOUNTS.ALLOCATION_AMOUNT_UNIT)
            .from(SURFACE_WATER_MANAGEMENT_BOUNDARIES)
            .join(ALLOCATION_AMOUNTS)
            .on(ALLOCATION_AMOUNTS.ID.eq(SURFACE_WATER_MANAGEMENT_BOUNDARIES.ID))
            .where(ALLOCATION_AMOUNTS.MANAGEMENT_UNIT_TYPE.eq(ManagementUnitType.MANAGEMENT_UNIT))

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(buildFeatureCollection(context, innerQuery))
  }

  @RequestMapping("/layers/surface_water_mgmt_sub", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getSurfaceWaterManagementSubUnits(): ResponseEntity<String> {
    val innerQuery =
        select(
                SURFACE_WATER_MANAGEMENT_BOUNDARIES.ID.`as`("id"),
                SURFACE_WATER_MANAGEMENT_BOUNDARIES.GEOM.`as`("geometry"),
                ALLOCATION_AMOUNTS.ALLOCATION_AMOUNT,
                ALLOCATION_AMOUNTS.SURFACEWATER_SUBUNIT_NAME.`as`("name"),
                ALLOCATION_AMOUNTS.CATCHMENT_MANAGEMENT_UNIT,
                ALLOCATION_AMOUNTS.AREA_DESCRIPTION,
                ALLOCATION_AMOUNTS.ALLOCATION_AMOUNT_UNIT)
            .from(SURFACE_WATER_MANAGEMENT_BOUNDARIES)
            .join(ALLOCATION_AMOUNTS)
            .on(ALLOCATION_AMOUNTS.ID.eq(SURFACE_WATER_MANAGEMENT_BOUNDARIES.ID))
            .where(
                ALLOCATION_AMOUNTS.MANAGEMENT_UNIT_TYPE.eq(ManagementUnitType.MANAGEMENT_SUB_UNIT))

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(buildFeatureCollection(context, innerQuery))
  }

  @RequestMapping("/layers/flow_management_sites", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getFlowManagementSites(): ResponseEntity<String> {
    val innerQuery =
        select(
                SITES.ID.`as`("id"),
                SITES.GEOM.`as`("geometry"),
            )
            .from(SITES)

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(buildFeatureCollection(context, innerQuery))
  }

  @RequestMapping(
      "/layers/minimum_flow_limit_boundaries", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getMinimumFlowLimitBoundaries(): ResponseEntity<String> {
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

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(buildFeatureCollection(context, innerQuery))
  }

  @RequestMapping(
      "/layers/groundwater_zone_boundaries", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getGroundwaterZoneBoundaries(): ResponseEntity<String> {

    val allocationAmountsSurfaceWater = ALLOCATION_AMOUNTS.`as`("swa")
    val allocationAmountsGroundwater = ALLOCATION_AMOUNTS.`as`("gwa")

    val innerQuery =
        select(
                GROUNDWATER_ZONES.ID.`as`("id"),
                GROUNDWATER_ZONES.GEOM.`as`("geometry"),
                GROUNDWATER_ZONES.NAME,
                GROUNDWATER_ZONES.DEPTH,
                GROUNDWATER_ZONES.CATEGORY,
                allocationAmountsSurfaceWater.ALLOCATION_AMOUNT.`as`(
                    "surface_water_allocation_amount"),
                allocationAmountsSurfaceWater.ALLOCATION_AMOUNT_UNIT.`as`(
                    "surface_water_allocation_amount_unit"),
                allocationAmountsGroundwater.ALLOCATION_AMOUNT.`as`(
                    "groundwater_allocation_amount"),
                allocationAmountsGroundwater.ALLOCATION_AMOUNT_UNIT.`as`(
                    "groundwater_allocation_amount_unit"),
            )
            .from(GROUNDWATER_ZONES)
            .join(allocationAmountsGroundwater)
            .on(GROUNDWATER_ZONES.ALLOCATION_AMOUNT_ID.eq(allocationAmountsGroundwater.ID))
            .leftJoin(allocationAmountsSurfaceWater)
            .on(
                allocationAmountsGroundwater.PARENT_SURFACEWATERSUBUNIT_ID.eq(
                    allocationAmountsSurfaceWater.ID))

    return ResponseEntity.ok()
        .cacheControl(CacheControl.maxAge(365, TimeUnit.DAYS))
        .body(buildFeatureCollection(context, innerQuery))
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
