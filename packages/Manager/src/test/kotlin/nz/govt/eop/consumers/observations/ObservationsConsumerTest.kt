package nz.govt.eop.consumers.observations

import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import java.math.BigDecimal
import java.sql.Timestamp
import java.time.OffsetDateTime
import java.util.Properties
import net.postgis.jdbc.PGgeometry
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.TestInputTopic
import org.apache.kafka.streams.TopologyTestDriver
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Nested
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase
import org.springframework.boot.test.autoconfigure.jdbc.JdbcTest
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.kafka.support.serializer.JsonSerde
import org.springframework.test.context.ActiveProfiles
import org.springframework.transaction.annotation.Propagation
import org.springframework.transaction.annotation.Transactional

@ActiveProfiles("test")
@JdbcTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
class ObservationsConsumerTest(@Autowired private val jdbcTemplate: JdbcTemplate) {

  private final val inputTopic: TestInputTopic<ObservationMessageKey, ObservationMessage>

  init {
    val streamsBuilder = StreamsBuilder()

    // Class under test
    ObservationsConsumer(ObservationStore(jdbcTemplate)).buildPipeline(streamsBuilder)

    inputTopic =
        TopologyTestDriver(streamsBuilder.build(), Properties())
            .createInputTopic(
                "observations",
                JsonSerde(ObservationMessageKey::class.java).noTypeInfo().serializer(),
                JsonSerde(ObservationMessage::class.java).noTypeInfo().serializer())
  }

  @BeforeEach
  fun cleanDb() {
    jdbcTemplate.execute("TRUNCATE TABLE observations CASCADE")
    jdbcTemplate.execute("TRUNCATE TABLE observation_sites_measurements CASCADE")
    jdbcTemplate.execute("TRUNCATE TABLE observation_sites CASCADE")
  }

  @Nested
  open inner class SiteDetailsMessageHandling {
    @Test
    fun `should create site when none exists`() {

      // GIVEN
      val message = SiteDetailsMessage(1, "A", Location(1, 2))

      // WHEN
      inputTopic.pipeInput(message.toKey(), message)

      // THEN
      val result = jdbcTemplate.queryForMap("SELECT * FROM observation_sites")
      result["council_id"] shouldBe 1
      result["name"] shouldBe "A"
      result["location"] shouldBe PGgeometry(createPoint(1, 2))
    }

    @Test
    fun `should create site with no location when none exists`() {

      // GIVEN
      val message = SiteDetailsMessage(1, "B", null)

      // WHEN
      inputTopic.pipeInput(message.toKey(), message)

      // THEN
      val result = jdbcTemplate.queryForMap("SELECT * FROM observation_sites")
      result["council_id"] shouldBe 1
      result["name"] shouldBe "B"
      result["location"] shouldBe null
    }

    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    @Test
    open fun `should update site when one exists`() {

      // GIVEN
      val firstMessage = SiteDetailsMessage(1, "C", null)
      val secondMessage = SiteDetailsMessage(1, "C", Location(1, 2))

      // WHEN
      inputTopic.pipeInput(firstMessage.toKey(), firstMessage)
      inputTopic.pipeInput(secondMessage.toKey(), secondMessage)

      // THEN
      val result = jdbcTemplate.queryForMap("SELECT * FROM observation_sites")
      result["council_id"] shouldBe 1
      result["name"] shouldBe "C"
      result["location"] shouldBe PGgeometry(createPoint(1, 2))
      result["created_at"] shouldNotBe result["updated_at"]
    }

    @Test
    fun `should store correct council link for site`() {
      // Know that id 18 is Marlborough District Council, it maps to 16 on the councils table
      // and its a good example because 18 isn't an id on the councils table.

      // GIVEN
      val message = SiteDetailsMessage(18, "SITE", null)

      // WHEN
      inputTopic.pipeInput(message.toKey(), message)

      // THEN
      val result = jdbcTemplate.queryForMap("SELECT * FROM observation_sites")
      result["council_id"] shouldBe 16
    }

    @Test
    @Transactional(propagation = Propagation.NOT_SUPPORTED)
    open fun `should process messages after an error`() {
      // GIVEN
      val messageThatWillFail = SiteDetailsMessage(365, "SITE", null)
      val message2 = SiteDetailsMessage(1, "SITE", null)

      // WHEN
      inputTopic.pipeInput(messageThatWillFail.toKey(), messageThatWillFail)
      inputTopic.pipeInput(message2.toKey(), message2)

      // THEN
      val result = jdbcTemplate.queryForMap("SELECT * FROM observation_sites")
      result["council_id"] shouldBe 1
    }
  }

  @Nested
  inner class ObservationDataMessageHandling {

    @Test
    fun `should not throw error when site doesn't exist`() {
      // GIVEN
      val observationMessage =
          ObservationDataMessage(
              1,
              "SITE",
              "RAIN",
              listOf(
                  Observation(
                      OffsetDateTime.parse("2020-01-01T00:00:00Z"), BigDecimal.valueOf(1.0))))

      // WHEN / THEN
      inputTopic.pipeInput(observationMessage.toKey(), observationMessage)
    }

    @Test
    fun `should store observation data when measurement record does not exist`() {
      // GIVEN
      val siteMessage = SiteDetailsMessage(1, "SITE", null)
      inputTopic.pipeInput(siteMessage.toKey(), siteMessage)

      val observationMessage =
          ObservationDataMessage(
              1,
              "SITE",
              "RAIN",
              listOf(
                  Observation(
                      OffsetDateTime.parse("2020-01-01T00:00:00Z"), BigDecimal.valueOf(6.6))))

      // WHEN
      inputTopic.pipeInput(observationMessage.toKey(), observationMessage)

      // THEN
      val measurementRecord =
          jdbcTemplate.queryForMap("SELECT * FROM observation_sites_measurements")
      measurementRecord["measurement_name"] shouldBe "RAIN"

      val observationsResult = jdbcTemplate.queryForMap("SELECT * FROM observations")
      observationsResult["observation_measurement_id"] shouldBe measurementRecord["id"]
      observationsResult["observed_at"] shouldBe
          Timestamp.from(OffsetDateTime.parse("2020-01-01T00:00:00Z").toInstant())
      observationsResult["amount"] shouldBe BigDecimal.valueOf(6.6)
    }

    @Test
    fun `should store observation data when measurement record already exists`() {
      // GIVEN
      val siteMessage = SiteDetailsMessage(1, "SITE", null)
      inputTopic.pipeInput(siteMessage.toKey(), siteMessage)

      val firstObservationMessage =
          ObservationDataMessage(
              1,
              "SITE",
              "RAIN",
              listOf(
                  Observation(
                      OffsetDateTime.parse("2020-01-01T00:00:00Z"), BigDecimal.valueOf(1.0))))
      inputTopic.pipeInput(firstObservationMessage.toKey(), firstObservationMessage)

      val secondObservationMessage =
          ObservationDataMessage(
              1,
              "SITE",
              "RAIN",
              listOf(
                  Observation(
                      OffsetDateTime.parse("2021-01-01T00:00:00Z"), BigDecimal.valueOf(2.0))))

      // WHEN
      inputTopic.pipeInput(secondObservationMessage.toKey(), secondObservationMessage)

      // THEN
      val observationsResult =
          jdbcTemplate.queryForMap(
              "SELECT * FROM observations WHERE observed_at > '2020-01-01T00:00:00Z'")
      observationsResult["observed_at"] shouldBe
          Timestamp.from(OffsetDateTime.parse("2021-01-01T00:00:00Z").toInstant())
      observationsResult["amount"] shouldBe BigDecimal.valueOf(2.0)
    }

    @Test
    fun `should update observation data when data already exists`() {
      // GIVEN
      val siteMessage = SiteDetailsMessage(1, "SITE", null)
      inputTopic.pipeInput(siteMessage.toKey(), siteMessage)

      val firstObservationMessage =
          ObservationDataMessage(
              1,
              "SITE",
              "RAIN",
              listOf(
                  Observation(
                      OffsetDateTime.parse("2020-01-01T00:00:00Z"), BigDecimal.valueOf(1.0))))
      inputTopic.pipeInput(firstObservationMessage.toKey(), firstObservationMessage)

      val secondObservationMessage =
          ObservationDataMessage(
              1,
              "SITE",
              "RAIN",
              listOf(
                  Observation(
                      OffsetDateTime.parse("2020-01-01T00:00:00Z"), BigDecimal.valueOf(2.0))))

      // WHEN
      inputTopic.pipeInput(secondObservationMessage.toKey(), secondObservationMessage)

      // THEN
      val observationsResult = jdbcTemplate.queryForMap("SELECT * FROM observations")
      observationsResult["observed_at"] shouldBe
          Timestamp.from(OffsetDateTime.parse("2020-01-01T00:00:00Z").toInstant())
      observationsResult["amount"] shouldBe BigDecimal.valueOf(2.0)
    }
  }
}
