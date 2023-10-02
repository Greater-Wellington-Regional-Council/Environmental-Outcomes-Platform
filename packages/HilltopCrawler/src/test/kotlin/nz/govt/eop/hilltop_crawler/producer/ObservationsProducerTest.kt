package nz.govt.eop.hilltop_crawler.producer

import com.fasterxml.jackson.databind.ObjectMapper
import io.kotest.matchers.collections.shouldContain
import io.kotest.matchers.collections.shouldHaveSize
import java.math.BigDecimal
import java.time.Instant
import java.time.OffsetDateTime
import java.time.YearMonth
import java.util.*
import nz.govt.eop.hilltop_crawler.HILLTOP_RAW_DATA_TOPIC_NAME
import nz.govt.eop.hilltop_crawler.HilltopCrawlerTestConfiguration
import nz.govt.eop.hilltop_crawler.OUTPUT_DATA_TOPIC_NAME
import nz.govt.eop.hilltop_crawler.api.parsers.HilltopXmlParsers
import nz.govt.eop.hilltop_crawler.fetcher.*
import org.apache.kafka.streams.StreamsBuilder
import org.apache.kafka.streams.TestInputTopic
import org.apache.kafka.streams.TestOutputTopic
import org.apache.kafka.streams.TopologyTestDriver
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Import
import org.springframework.kafka.config.TopicBuilder
import org.springframework.kafka.support.serializer.JsonSerde
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles("test")
@SpringBootTest
@Import(HilltopCrawlerTestConfiguration::class)
class ObservationsProducerTest(@Autowired val objectMapper: ObjectMapper) {

  private final val inputTopic: TestInputTopic<HilltopMessageKey, HilltopMessage>
  private final val outputTopic: TestOutputTopic<ObservationMessageKey, ObservationMessage>

  init {
    val streamsBuilder = StreamsBuilder()

    ObservationProducer(
            HilltopXmlParsers(),
            objectMapper,
            TopicBuilder.name(HILLTOP_RAW_DATA_TOPIC_NAME).build(),
            TopicBuilder.name(OUTPUT_DATA_TOPIC_NAME).build())
        .buildPipeline(streamsBuilder)
    val topology = streamsBuilder.build()
    val driver = TopologyTestDriver(topology, Properties())
    inputTopic =
        driver.createInputTopic(
            HILLTOP_RAW_DATA_TOPIC_NAME,
            JsonSerde(HilltopMessageKey::class.java).noTypeInfo().serializer(),
            JsonSerde(HilltopMessage::class.java).noTypeInfo().serializer())

    outputTopic =
        driver.createOutputTopic(
            OUTPUT_DATA_TOPIC_NAME,
            JsonSerde(ObservationMessageKey::class.java).noTypeInfo().deserializer(),
            JsonSerde(ObservationMessage::class.java).noTypeInfo().deserializer())
  }

  @Test
  fun `should map sites list XML to a series of SiteDetailsMessage's`() {

    // GIVEN
    val input = this.javaClass.getResource("/hilltop-xml/SitesResponse-list.xml")!!.readText()

    val message =
        HilltopSitesMessage(
            555, "http://example.com", Instant.now(), "http://hilltop.example.com/some/path", input)

    // WHEN
    inputTopic.pipeInput(message.toKey(), message)

    // THEN
    val records = outputTopic.readRecordsToList()
    records shouldHaveSize 2
    val recordValues = records.map { it.value() }

    recordValues shouldContain
        SiteDetailsMessage(555, "Wrens Creek at Graham Road", Location(2764950, 6100940))
    recordValues shouldContain SiteDetailsMessage(555, "X Forest Rd Drain at Drop Structure", null)
  }

  @Test
  fun `should ignore a measurement list message`() {
    // GIVEN
    val input =
        this.javaClass.getResource("/hilltop-xml/MeasurementsResponse-list.xml")!!.readText()

    val message =
        HilltopMeasurementListMessage(
            555,
            "http://hilltop.example.com",
            Instant.now(),
            "SOME_SITE_NAME",
            "http://hilltop.example.com/some/path",
            input)

    // WHEN
    inputTopic.pipeInput(message.toKey(), message)

    // THEN
    val records = outputTopic.readRecordsToList()
    records shouldHaveSize 0
  }

  @Test
  fun `should map a measurement message to an ObservationDataMessage`() {
    // GIVEN
    val input =
        this.javaClass.getResource("/hilltop-xml/MeasurementValuesResponse.xml")!!.readText()

    val message =
        HilltopMeasurementsMessage(
            555,
            "http://example.com",
            Instant.now(),
            "SOME_SITE_NAME",
            "SOME_MEASUREMENT_NAME",
            YearMonth.of(2023, 8),
            "http://hilltop.example.com/some/path",
            input)

    // WHEN
    inputTopic.pipeInput(message.toKey(), message)

    // THEN
    val records = outputTopic.readRecordsToList()
    records shouldHaveSize 1

    val recordValues = records.map { it.value() }
    recordValues shouldContain
        ObservationDataMessage(
            555,
            "R26/6804",
            "Water Meter Volume",
            listOf(
                Observation(OffsetDateTime.parse("2023-08-29T12:00Z"), BigDecimal.valueOf(0)),
                Observation(OffsetDateTime.parse("2023-08-30T12:00Z"), BigDecimal.valueOf(100))))
  }
}
