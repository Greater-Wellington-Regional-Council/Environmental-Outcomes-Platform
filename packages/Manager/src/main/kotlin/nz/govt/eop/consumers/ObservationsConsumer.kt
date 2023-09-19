package nz.govt.eop.consumers

import java.sql.PreparedStatement
import java.sql.Timestamp
import java.sql.Types
import net.postgis.jdbc.geometry.Geometry
import net.postgis.jdbc.geometry.Point
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.kstream.Consumed
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.annotation.Profile
import org.springframework.dao.EmptyResultDataAccessException
import org.springframework.jdbc.core.*
import org.springframework.jdbc.support.GeneratedKeyHolder
import org.springframework.jdbc.support.KeyHolder
import org.springframework.kafka.annotation.EnableKafkaStreams
import org.springframework.kafka.support.serializer.JsonSerde
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Profile("hilltop-consumer")
@EnableKafkaStreams
@Component
class ObservationsConsumer(val store: ObservationStore) {
  @Autowired
  fun buildPipeline(streamsBuilder: StreamsBuilder) {

    val messageStream =
        streamsBuilder.stream(
            "observations",
            Consumed.with(
                JsonSerde(ObservationMessageKey::class.java),
                JsonSerde(ObservationMessage::class.java)))

    messageStream.foreach { _, value ->
      when (value) {
        is SiteDetailsMessage -> {
          store.storeSite(value.councilId, value.siteName, value.location)
        }
        is ObservationDataMessage -> {
          store.storeObservations(
              value.councilId, value.siteName, value.measurementName, value.observations)
        }
      }
    }
  }
}

fun createPoint(easting: Int, northing: Int): Point {
  val point = Point(easting.toDouble(), northing.toDouble())
  point.setSrid(2193)
  return point
}

@Component
class ObservationStore(private val jdbcTemplate: JdbcTemplate) {

  val SELECT_SITE_QUERY =
      "SELECT id FROM observation_sites WHERE council_id = (SELECT id FROM councils WHERE stats_nz_id = ?) AND name = ? FOR UPDATE"

  val UPDATE_SITE_QUERY =
      "UPDATE observation_sites SET location = ?, updated_at = NOW() WHERE id = ?"

  val INSERT_SITE_QUERY =
      "INSERT INTO observation_sites (council_id, name, location)    VALUES ((SELECT id FROM councils WHERE stats_nz_id = ?), ?, ?)"

  val SELECT_MEASUREMENT_ID_QUERY =
      """
    SELECT id FROM observation_sites_measurements 
    WHERE site_id = (SELECT id FROM observation_sites WHERE council_id = (
    SELECT id FROM councils WHERE stats_nz_id = ?) AND name = ?) 
    AND measurement_name = ?
        """

  val INSERT_MEASUREMENT_QUERY =
      """
    INSERT INTO observation_sites_measurements(site_id, measurement_name, first_observation_at, last_observation_at, observation_count) 
    VALUES ((SELECT id FROM observation_sites WHERE council_id = (SELECT id FROM councils WHERE stats_nz_id = ?) AND name = ?), ?, ?, ?, ?) 
    RETURNING id
        """

  val BATCH_OBSERVATION_QUERY =
      """
    INSERT INTO observations (observation_measurement_id, observed_at, amount) 
    VALUES (?, ?, ?) 
    ON CONFLICT (observation_measurement_id, observed_at) 
    DO UPDATE SET amount = EXCLUDED.amount, updated_at = NOW()
        """

  @Transactional
  fun storeSite(councilStatsId: Int, siteName: String, location: Location?) {
    val point = location?.let { createPoint(it.easting, it.northing) }

    val existingSiteId = fetchExistingSiteId(councilStatsId, siteName)
    existingSiteId?.let { updateSite(it, point) } ?: insertSite(councilStatsId, siteName, point)
  }

  @Transactional
  fun storeObservations(
      councilStatsId: Int,
      siteName: String,
      measurementName: String,
      observations: List<Observation>
  ) {
    var measurementId = getMeasurementId(councilStatsId, siteName, measurementName)

    measurementId =
        measurementId ?: insertMeasurement(councilStatsId, siteName, measurementName, observations)

    insertObservations(measurementId, observations)
  }

  private fun getMeasurementId(
      councilStatsId: Int,
      siteName: String,
      measurementName: String
  ): Int? {
    return try {
      jdbcTemplate.queryForObject(
          SELECT_MEASUREMENT_ID_QUERY, Int::class.java, councilStatsId, siteName, measurementName)
    } catch (ex: EmptyResultDataAccessException) {
      null
    }
  }

  private fun insertMeasurement(
      councilStatsId: Int,
      siteName: String,
      measurementName: String,
      observations: List<Observation>
  ): Int {
    val keyHolder: KeyHolder = GeneratedKeyHolder()

    jdbcTemplate.update(
        { connection ->
          val ps = connection.prepareStatement(INSERT_MEASUREMENT_QUERY, arrayOf("id"))
          ps.setInt(1, councilStatsId)
          ps.setString(2, siteName)
          ps.setString(3, measurementName)
          ps.setTimestamp(4, Timestamp.from(observations.first().observedAt.toInstant()))
          ps.setTimestamp(5, Timestamp.from(observations.last().observedAt.toInstant()))
          ps.setInt(6, observations.size)
          ps
        },
        keyHolder)

    return keyHolder.keys?.get("id") as Int?
        ?: throw IllegalStateException("No key found in KeyHolder after insert operation.")
  }

  private fun insertObservations(measurementId: Int, observations: List<Observation>) {
    jdbcTemplate.batchUpdate(
        BATCH_OBSERVATION_QUERY,
        object : BatchPreparedStatementSetter {
          override fun setValues(ps: PreparedStatement, i: Int) {
            val observation = observations[i]
            ps.setInt(1, measurementId)
            ps.setTimestamp(2, Timestamp.from(observation.observedAt.toInstant()))
            ps.setBigDecimal(3, observation.value)
          }

          override fun getBatchSize() = observations.size
        })
  }

  private fun fetchExistingSiteId(councilStatsId: Int, siteName: String): Int? {
    return try {
      jdbcTemplate.queryForObject(
          SELECT_SITE_QUERY, SingleColumnRowMapper(), councilStatsId, siteName)
    } catch (ex: EmptyResultDataAccessException) {
      null
    }
  }

  private fun insertSite(councilStatsId: Int, siteName: String, point: Geometry?) {
    jdbcTemplate.update(INSERT_SITE_QUERY) { ps: PreparedStatement ->
      ps.setInt(1, councilStatsId)
      ps.setString(2, siteName)
      ps.setObject(3, point, Types.OTHER)
    }
  }

  private fun updateSite(existingSiteId: Int, point: Geometry?) {
    jdbcTemplate.update(UPDATE_SITE_QUERY) { ps: PreparedStatement ->
      ps.setObject(1, point, Types.OTHER)
      ps.setInt(2, existingSiteId)
    }
  }
}
