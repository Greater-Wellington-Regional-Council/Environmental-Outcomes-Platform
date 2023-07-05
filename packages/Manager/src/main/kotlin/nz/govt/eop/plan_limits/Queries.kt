package nz.govt.eop.plan_limits

import nz.govt.eop.si.jooq.tables.Councils.Companion.COUNCILS
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
