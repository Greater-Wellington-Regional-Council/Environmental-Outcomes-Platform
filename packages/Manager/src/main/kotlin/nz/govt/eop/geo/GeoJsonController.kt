package nz.govt.eop.geo

import java.util.concurrent.TimeUnit
import nz.govt.eop.si.jooq.tables.CouncilBoundaries.Companion.COUNCIL_BOUNDARIES
import nz.govt.eop.si.jooq.tables.Rivers.Companion.RIVERS
import nz.govt.eop.si.jooq.tables.WhaituaBoundaries.Companion.WHAITUA_BOUNDARIES
import org.jooq.*
import org.jooq.impl.DSL.*
import org.springframework.cache.annotation.Cacheable
import org.springframework.http.CacheControl
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.stereotype.Controller
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseBody

@Controller
class GeoJsonController(val context: DSLContext) {

  @Cacheable("layers_councils")
  @RequestMapping("/layers/councils", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getLayerRegionalCouncils(): ResponseEntity<String> {

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

  @Cacheable("layers_whaitua")
  @RequestMapping("/layers/whaitua", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getLayerWhaitua(): ResponseEntity<String> {

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

  @Cacheable("layers_rivers")
  @RequestMapping("/layers/rivers", produces = [MediaType.APPLICATION_JSON_VALUE])
  @ResponseBody
  fun getLayerRivers(): ResponseEntity<String> {
    val innerQuery =
        select(RIVERS.HYDRO_ID.`as`("id"), RIVERS.GEOM.`as`("geometry"), RIVERS.STREAM_ORDER)
            .from(RIVERS)
            .where(RIVERS.STREAM_ORDER.ge(3))

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
