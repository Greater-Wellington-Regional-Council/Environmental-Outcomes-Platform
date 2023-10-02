package nz.govt.eop.hilltop_crawler.fetcher

import io.kotest.inspectors.forExactly
import io.kotest.inspectors.forOne
import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.date.shouldBeAfter
import io.kotest.matchers.date.shouldBeBefore
import io.kotest.matchers.shouldBe
import java.net.URI
import java.time.Instant
import nz.govt.eop.hilltop_crawler.HilltopCrawlerTestConfiguration
import nz.govt.eop.hilltop_crawler.db.DB
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import org.mockito.kotlin.argumentCaptor
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.http.HttpMethod
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.support.GeneratedKeyHolder
import org.springframework.jdbc.support.KeyHolder
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.client.MockRestServiceServer
import org.springframework.test.web.client.match.MockRestRequestMatchers.method
import org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo
import org.springframework.test.web.client.response.MockRestResponseCreators.*
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.client.RestTemplate

@ActiveProfiles("test")
@SpringBootTest
@Import(HilltopCrawlerTestConfiguration::class)
@Transactional
class FetchTaskProcessorIntegrationTest(
    @Autowired val underTest: FetchTaskProcessor,
    @Autowired val restTemplate: RestTemplate,
    @Autowired val jdbcTemplate: JdbcTemplate,
    @Autowired val mockKafka: HilltopMessageClient
) {

  private final val mockServer = MockRestServiceServer.createServer(restTemplate)

  @BeforeEach
  fun resetMocks() {
    reset(mockKafka)
  }

  @Test
  fun `should return false when no work to do`() {
    // GIVEN
    // The DB table empty

    // WHEN
    val result = underTest.runNextTask()

    // THEN
    result shouldBe false
  }

  @Test
  fun `should process most recent in the queue first`() {
    // GIVEN
    val sourceId = createDefaultSource(jdbcTemplate)

    createFetchTask(
        jdbcTemplate, sourceId, "SITES_LIST", "http://example.com/1", "2021-01-01 00:10:00")
    createFetchTask(
        jdbcTemplate, sourceId, "SITES_LIST", "http://example.com/2", "2021-01-01 00:00:00")

    val input = this.javaClass.getResource("/hilltop-xml/SitesResponse-empty.xml")!!.readText()

    mockServer
        .expect(requestTo("http://example.com/2"))
        .andExpect(method(HttpMethod.GET))
        .andRespond(withSuccess(input, null))

    // WHEN
    val result = underTest.runNextTask()

    // THEN
    mockServer.verify()

    result shouldBe true

    val tasks = listTasksToProcess(jdbcTemplate)

    tasks shouldHaveSize 2

    // Has updated the row we just fetched
    tasks.forOne {
      it.fetchUri shouldBe URI("http://example.com/2")
      it.previousDataHash shouldBe
          "035676f636972e925c822016c1fd88fc179a7f2d6a8798144e186de833f12fc5"
      it.nextFetchAt shouldBeAfter Instant.now()
    }

    // Has created rows for the new sites
    tasks.forOne {
      it.fetchUri shouldBe URI("http://example.com/1")
      it.previousDataHash shouldBe null
      it.nextFetchAt shouldBeBefore Instant.now()
    }
  }

  @Test
  fun `should requeue a failed HTTP request for later`() {
    // GIVEN
    val sourceId = createDefaultSource(jdbcTemplate)

    createFetchTask(
        jdbcTemplate, sourceId, "SITES_LIST", "http://example.com", "2021-01-01 00:00:00")

    mockServer
        .expect(requestTo("http://example.com"))
        .andExpect(method(HttpMethod.GET))
        .andRespond(withUnauthorizedRequest())

    // WHEN
    val result = underTest.runNextTask()

    // THEN
    mockServer.verify()

    result shouldBe true

    val tasks = listTasksToProcess(jdbcTemplate)
    tasks shouldHaveSize 1
    // Has updated the row we just fetched
    tasks.forOne {
      it.fetchUri shouldBe URI("http://example.com")
      it.previousDataHash shouldBe null
      it.nextFetchAt shouldBeAfter Instant.now()
    }
  }

  @Test
  fun `should requeue a hilltop error response for later`() {
    // GIVEN
    val sourceId = createDefaultSource(jdbcTemplate)

    createFetchTask(
        jdbcTemplate, sourceId, "SITES_LIST", "http://example.com", "2021-01-01 00:00:00")

    val input = this.javaClass.getResource("/hilltop-xml/ErrorResponse.xml")!!.readText()

    mockServer
        .expect(requestTo("http://example.com"))
        .andExpect(method(HttpMethod.GET))
        .andRespond(withSuccess(input, null))

    // WHEN
    val result = underTest.runNextTask()

    // THEN
    mockServer.verify()

    result shouldBe true

    val tasks = listTasksToProcess(jdbcTemplate)
    tasks shouldHaveSize 1

    // Has updated the row we just fetched
    tasks.forOne {
      it.fetchUri shouldBe URI("http://example.com")
      it.previousDataHash shouldBe null
      it.nextFetchAt shouldBeAfter Instant.now()
    }
  }

  @Test
  fun `should requeue a invalid XML for later`() {
    // GIVEN
    val sourceId = createDefaultSource(jdbcTemplate)

    createFetchTask(
        jdbcTemplate, sourceId, "SITES_LIST", "http://example.com", "2021-01-01 00:00:00")

    mockServer
        .expect(requestTo("http://example.com"))
        .andExpect(method(HttpMethod.GET))
        .andRespond(withSuccess("<HilltopServer><Agency>Horizons</Agency>", null))

    // WHEN
    val result = underTest.runNextTask()

    // THEN
    mockServer.verify()

    result shouldBe true

    val tasks = listTasksToProcess(jdbcTemplate)
    tasks shouldHaveSize 1

    // Has updated the row we just fetched
    tasks.forOne {
      it.fetchUri shouldBe URI("http://example.com")
      it.previousDataHash shouldBe null
      it.nextFetchAt shouldBeAfter Instant.now()
    }
  }

  @Test
  fun `should requeue a un-parsable XML for later`() {
    // GIVEN
    val sourceId = createDefaultSource(jdbcTemplate)

    createFetchTask(
        jdbcTemplate, sourceId, "SITES_LIST", "http://example.com", "2021-01-01 00:00:00")

    val xml =
        """
            <HilltopServer>
                <Agency>Horizons</Agency>
                <Version>2303.2.2.47</Version>
                <Projection>NZMG</Projection>
                <Site>
                </Site>
                <Site Name="X Forest Rd Drain at Drop Structure"></Site>
            </HilltopServer>
        """
            .trimIndent()

    mockServer
        .expect(requestTo("http://example.com"))
        .andExpect(method(HttpMethod.GET))
        .andRespond(withSuccess(xml, null))

    // WHEN
    val result = underTest.runNextTask()

    // THEN
    mockServer.verify()

    result shouldBe true

    val tasks = listTasksToProcess(jdbcTemplate)
    tasks shouldHaveSize 1

    // Has updated the row we just fetched
    tasks.forOne {
      it.fetchUri shouldBe URI("http://example.com")
      it.previousDataHash shouldBe null
      it.nextFetchAt shouldBeAfter Instant.now()
    }
  }

  @Test
  fun `should requeue and ignore content when response has same hash as previous message`() {
    // GIVEN
    val sourceId = createDefaultSource(jdbcTemplate)

    createFetchTask(
        jdbcTemplate,
        sourceId,
        "SITES_LIST",
        "http://example.com",
        "2021-01-01 00:00:00",
        "0fcafcc9533e521e53cad82226d44c832eca280e75dda23ffe5575b6563995c0")

    val input = this.javaClass.getResource("/hilltop-xml/SitesResponse-list.xml")!!.readText()

    mockServer
        .expect(requestTo("http://example.com"))
        .andExpect(method(HttpMethod.GET))
        .andRespond(withSuccess(input, null))

    // WHEN
    val result = underTest.runNextTask()

    // THEN
    mockServer.verify()

    result shouldBe true

    val tasks = listTasksToProcess(jdbcTemplate)
    tasks shouldHaveSize 1 // Didn't create any new tasks

    // Has updated the row we just fetched
    tasks.forOne {
      it.fetchUri shouldBe URI("http://example.com")
      it.requestType shouldBe HilltopMessageType.SITES_LIST
      it.previousDataHash shouldBe
          "0fcafcc9533e521e53cad82226d44c832eca280e75dda23ffe5575b6563995c0"
      it.nextFetchAt shouldBeAfter Instant.now()
    }
  }

  @Test
  fun `should correctly process a site list message`() {
    // GIVEN
    val sourceId = createDefaultSource(jdbcTemplate)

    createFetchTask(
        jdbcTemplate,
        sourceId,
        "SITES_LIST",
        "http://example.com",
        "2021-01-01 00:00:00",
    )

    val input = this.javaClass.getResource("/hilltop-xml/SitesResponse-list.xml")!!.readText()

    mockServer
        .expect(requestTo("http://example.com"))
        .andExpect(method(HttpMethod.GET))
        .andRespond(withSuccess(input, null))

    // WHEN
    val result = underTest.runNextTask()

    // THEN
    mockServer.verify()

    result shouldBe true

    val tasks = listTasksToProcess(jdbcTemplate)
    tasks shouldHaveSize 3

    // Has updated the row we just fetched
    tasks.forOne {
      it.fetchUri shouldBe URI("http://example.com")
      it.requestType shouldBe HilltopMessageType.SITES_LIST
      it.previousDataHash shouldBe
          "0fcafcc9533e521e53cad82226d44c832eca280e75dda23ffe5575b6563995c0"
      it.nextFetchAt shouldBeAfter Instant.now()
    }

    // Has created rows for the new sites
    tasks.forExactly(2) {
      it.requestType shouldBe HilltopMessageType.MEASUREMENTS_LIST
      it.nextFetchAt shouldBeBefore Instant.now()
    }

    argumentCaptor<HilltopSitesMessage>().apply {
      verify(mockKafka).send(capture())

      firstValue.councilId shouldBe 1
      firstValue.type shouldBe HilltopMessageType.SITES_LIST
      firstValue.hilltopBaseUrl shouldBe "http://example.com"
    }
  }

  @Test
  fun `should correctly process a measurement list message`() {
    // GIVEN
    val sourceId = createDefaultSource(jdbcTemplate)

    createFetchTask(
        jdbcTemplate,
        sourceId,
        "MEASUREMENTS_LIST",
        "http://example.com",
        "2021-01-01 00:00:00",
    )

    val input =
        this.javaClass.getResource("/hilltop-xml/MeasurementsResponse-list.xml")!!.readText()

    mockServer
        .expect(requestTo("http://example.com"))
        .andExpect(method(HttpMethod.GET))
        .andRespond(withSuccess(input, null))

    // WHEN
    val result = underTest.runNextTask()

    // THEN
    mockServer.verify()

    result shouldBe true

    val tasks = listTasksToProcess(jdbcTemplate)
    tasks shouldHaveSize 2

    // Has updated the row we just fetched
    tasks.forOne {
      it.fetchUri shouldBe URI("http://example.com")
      it.requestType shouldBe HilltopMessageType.MEASUREMENTS_LIST
      it.previousDataHash shouldBe
          "e58323f66a24dfdc774756f608efba792b55deba4f8c1135c3aefee38f71f404"
      it.nextFetchAt shouldBeAfter Instant.now()
    }

    // Has created rows for the new sites
    tasks.forOne {
      it.requestType shouldBe HilltopMessageType.MEASUREMENT_DATA
      it.nextFetchAt shouldBeBefore Instant.now()
      it.fetchUri shouldBe
          URI(
              "http://example.com?Service=Hilltop&Request=GetData&Site=Ahuahu%20at%20Te%20Tuhi%20Junction&Measurement=Rainfall%20%5BRainfall%5D&from=2023-03-01T00:00&to=2023-03-31T23:59:59")
    }

    argumentCaptor<HilltopMeasurementListMessage>().apply {
      verify(mockKafka).send(capture())

      firstValue.councilId shouldBe 1
      firstValue.type shouldBe HilltopMessageType.MEASUREMENTS_LIST
      firstValue.hilltopBaseUrl shouldBe "http://example.com"
      firstValue.siteName shouldBe "Ahuahu at Te Tuhi Junction"
    }
  }

  @Test
  fun `should correctly process a measurement values message`() {
    // GIVEN
    val sourceId = createDefaultSource(jdbcTemplate)

    createFetchTask(
        jdbcTemplate,
        sourceId,
        "MEASUREMENT_DATA",
        "http://example.com",
        "2021-01-01 00:00:00",
    )

    val input =
        this.javaClass.getResource("/hilltop-xml/MeasurementValuesResponse.xml")!!.readText()

    mockServer
        .expect(requestTo("http://example.com"))
        .andExpect(method(HttpMethod.GET))
        .andRespond(withSuccess(input, null))

    // WHEN
    val result = underTest.runNextTask()

    // THEN
    mockServer.verify()

    result shouldBe true

    val tasks = listTasksToProcess(jdbcTemplate)
    tasks shouldHaveSize 1

    // Has updated the row we just fetched
    tasks.forOne {
      it.fetchUri shouldBe URI("http://example.com")
      it.requestType shouldBe HilltopMessageType.MEASUREMENT_DATA
      it.previousDataHash shouldBe
          "c1b8652916a235b608818d3ce3efa0dc29517ba115b1de1b6221a487b4e696bc"
      it.nextFetchAt shouldBeAfter Instant.now()
    }

    argumentCaptor<HilltopMeasurementsMessage>().apply {
      verify(mockKafka).send(capture())

      firstValue.councilId shouldBe 1
      firstValue.type shouldBe HilltopMessageType.MEASUREMENT_DATA
      firstValue.hilltopBaseUrl shouldBe "http://example.com"
    }
  }

  @Test
  fun `should process a measurement values message and not send to kafka if no measurements`() {
    // GIVEN
    val sourceId = createDefaultSource(jdbcTemplate)

    createFetchTask(
        jdbcTemplate,
        sourceId,
        "MEASUREMENT_DATA",
        "http://example.com",
        "2021-01-01 00:00:00",
    )

    val input =
        """
                <?xml version="1.0" ?>
                <Hilltop>
                    <Agency>GWRC</Agency>
                </Hilltop>
            """
            .trimIndent()

    mockServer
        .expect(requestTo("http://example.com"))
        .andExpect(method(HttpMethod.GET))
        .andRespond(withSuccess(input, null))

    // WHEN
    val result = underTest.runNextTask()

    // THEN
    mockServer.verify()

    result shouldBe true

    val tasks = listTasksToProcess(jdbcTemplate)
    tasks shouldHaveSize 1

    // Has updated the row we just fetched
    tasks.forOne {
      it.fetchUri shouldBe URI("http://example.com")
      it.requestType shouldBe HilltopMessageType.MEASUREMENT_DATA
      it.previousDataHash shouldBe
          "1ddfbd7f9a3d44bca5a6ae05d56f2016eb4d6e4292625fa550102dea10861ce6"
      it.nextFetchAt shouldBeAfter Instant.now()
    }

    verifyNoInteractions(mockKafka)
  }
}

fun listTasksToProcess(template: JdbcTemplate): List<DB.HilltopFetchTaskRow> =
    template.query(
        """
        SELECT *
        FROM hilltop_fetch_tasks
        ORDER BY next_fetch_at, id
        """
            .trimIndent()) { rs, _ ->
          DB.HilltopFetchTaskRow(
              rs.getInt("id"),
              rs.getInt("source_id"),
              HilltopMessageType.valueOf(rs.getString("request_type")),
              rs.getTimestamp("next_fetch_at").toInstant(),
              URI(rs.getString("fetch_url")),
              rs.getString("previous_data_hash"))
        }

fun createDefaultSource(template: JdbcTemplate): Int {
  val keyHolder: KeyHolder = GeneratedKeyHolder()

  template.update(
      { connection ->
        connection.prepareStatement(
            """INSERT INTO hilltop_sources (council_id, hts_url, configuration) VALUES (1, 'http://example.com', '{"measurementNames": ["Rainfall"]}') RETURNING id""",
            arrayOf("id"))
      },
      keyHolder)

  return keyHolder.keys?.get("id") as Int
}

fun createFetchTask(
    template: JdbcTemplate,
    sourceId: Int,
    requestType: String,
    url: String,
    nextFetchAt: String,
    previousDataHash: String? = null
) =
    template.update(
        """INSERT INTO hilltop_fetch_tasks (source_id, request_type, fetch_url, next_fetch_at, previous_data_hash) VALUES (?, ?, ?, ?::TIMESTAMP, ?)""",
        sourceId,
        requestType,
        url,
        nextFetchAt,
        previousDataHash)
