package nz.govt.eop.rainfall

import java.sql.Timestamp
import java.time.Instant
import java.time.OffsetDateTime
import java.time.ZoneOffset
import nz.govt.eop.si.jooq.tables.Councils.Companion.COUNCILS
import nz.govt.eop.si.jooq.tables.ObservationSites.Companion.OBSERVATION_SITES
import nz.govt.eop.si.jooq.tables.ObservationSitesMeasurements.Companion.OBSERVATION_SITES_MEASUREMENTS
import nz.govt.eop.si.jooq.tables.Observations.Companion.OBSERVATIONS
import org.jooq.*
import org.jooq.impl.DSL.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component

const val RAINFALL_MEASUREMENT_NAME = "Rainfall"

@Component
class RainfallQueries(
    @Autowired val context: DSLContext,
    @Autowired val jdbcTemplate: JdbcTemplate
) {

  fun rainfall(councilId: Int, from: Instant, to: Instant): String {
    //
    val fromUTC = from.atOffset(ZoneOffset.UTC)
    val toUTC = to.atOffset(ZoneOffset.UTC)
    val innerQuery =
        select(
                OBSERVATION_SITES.ID,
                OBSERVATION_SITES.COUNCIL_ID,
                COUNCILS.NAME.`as`("council_name"),
                OBSERVATION_SITES.NAME,
                OBSERVATION_SITES.LOCATION.`as`("geometry"),
                OBSERVATION_SITES_MEASUREMENTS.FIRST_OBSERVATION_AT,
                OBSERVATION_SITES_MEASUREMENTS.LAST_OBSERVATION_AT,
                OBSERVATION_SITES_MEASUREMENTS.OBSERVATION_COUNT,
                field("amount", OBSERVATIONS.AMOUNT.dataType))
            .from(OBSERVATION_SITES)
            .join(COUNCILS)
            .on(OBSERVATION_SITES.COUNCIL_ID.eq(COUNCILS.ID))
            .join(OBSERVATION_SITES_MEASUREMENTS)
            .on(OBSERVATION_SITES.ID.eq(OBSERVATION_SITES_MEASUREMENTS.SITE_ID))
            .leftJoin(
                select(
                        OBSERVATIONS.OBSERVATION_MEASUREMENT_ID,
                        sum(OBSERVATIONS.AMOUNT).`as`("amount"))
                    .from(OBSERVATIONS)
                    .where(OBSERVATIONS.OBSERVED_AT.greaterOrEqual(fromUTC))
                    .and(OBSERVATIONS.OBSERVED_AT.lessThan(toUTC))
                    .groupBy(OBSERVATIONS.OBSERVATION_MEASUREMENT_ID)
                    .asTable("totals"))
            .on(
                OBSERVATION_SITES_MEASUREMENTS.ID.eq(
                    field(
                        "totals.OBSERVATION_MEASUREMENT_ID",
                        OBSERVATION_SITES_MEASUREMENTS.ID.dataType)))
            .where(OBSERVATION_SITES_MEASUREMENTS.MEASUREMENT_NAME.eq(RAINFALL_MEASUREMENT_NAME))
            .and(
                OBSERVATION_SITES_MEASUREMENTS.LAST_OBSERVATION_AT.ge(
                    OffsetDateTime.parse("2024-01-01T00:00:00Z")))
            .orderBy(field("amount", OBSERVATIONS.AMOUNT.dataType).desc())

    return buildFeatureCollection(context, innerQuery)
  }

  fun rainfallAccumulation(from: Instant, to: Instant): String {
    return jdbcTemplate.queryForObject(
        """
        WITH times AS (
            SELECT GENERATE_SERIES(?, ?::TIMESTAMPTZ - INTERVAL '1 HOUR', INTERVAL '1 HOUR') AS hour
        ),
        site_ids AS (
            SELECT DISTINCT observation_measurement_id AS id
            FROM observations
            WHERE observed_at >= ? AND observed_at < ?
        ),
        full_series AS (
            SELECT
                observation_measurement_id,
                DATE_TRUNC('hour', observed_at) AS hour,
                COALESCE(SUM(amount), 0) AS amount
            FROM (
                SELECT observation_measurement_id, observed_at, amount
                FROM observations
                WHERE observed_at >= ? AND observed_at < ?
                UNION ALL
                SELECT id, hour, 0 AS amount
                FROM site_ids
                CROSS JOIN times
            ) AS full_series
            GROUP BY observation_measurement_id, hour
        ),
        hourly_accumulations AS (
            SELECT
                observation_measurement_id,
                hour + '1 HOUR' as hour,
                SUM(amount) OVER (PARTITION BY observation_measurement_id ORDER BY hour) AS amount
            FROM full_series
        ),
        hourly_data AS (
            SELECT observation_measurement_id,
                JSONB_AGG(JSONB_BUILD_OBJECT('hour', hour, 'amount', amount) ORDER BY hour) AS hourly_data
            FROM hourly_accumulations
            GROUP BY observation_measurement_id
        ),
        json_data AS (
            SELECT observation_sites.id,
                observation_sites.name,
                observation_sites.council_id,
                councils.name AS council_name,
                councils.id AS council_id,
                observation_sites_measurements.first_observation_at,
                observation_sites_measurements.last_observation_at,
                hourly_data.hourly_data,
                st_asgeojson(st_transform(observation_sites.location, 4326), 6, 2)::jsonb AS geometry
            FROM observation_sites
                INNER JOIN councils ON observation_sites.council_id = councils.id
                INNER JOIN observation_sites_measurements ON observation_sites.id = observation_sites_measurements.site_id
                INNER JOIN hourly_data ON observation_measurement_id = observation_sites_measurements.id
                WHERE observation_sites_measurements.measurement_name = ? AND observation_sites_measurements.last_observation_at >= ?
        )
    SELECT JSONB_BUILD_OBJECT(
        'type', 'FeatureCollection',
        'features', COALESCE(JSONB_AGG("feature"), JSONB_BUILD_ARRAY())
    )
    FROM (
        SELECT JSONB_BUILD_OBJECT(
            'type', 'Feature',
            'id', id,
            'geometry', geometry,
            'properties', TO_JSONB(inputs) - 'geometry'
        ) AS "feature"
        FROM json_data AS inputs
     ) AS "json";
      """
            .trimIndent(),
        String::class.java,
        Timestamp.from(from),
        Timestamp.from(to),
        Timestamp.from(from),
        Timestamp.from(to),
        Timestamp.from(from),
        Timestamp.from(to),
        RAINFALL_MEASUREMENT_NAME,
        Timestamp.from(Instant.parse("2024-01-01T00:00:00Z")))
  }

  private fun <R : Record> buildFeatureCollection(
      dslContext: DSLContext,
      innerQuery: Select<R>,
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
            // sdads
            field("ST_AsGeoJSON(ST_Transform(geometry, 4326), 6 ,2)::jsonb"),
            inline("properties"),
            field("to_jsonb(inputs) - 'geometry'"))

    val result =
        dslContext
            .select(featureCollection)
            .from(select(feature.`as`("feature")).from(innerQuery.asTable("inputs")))
            .fetch()
    return result.firstNotNullOf { it.value1().toString() }
  }
}
