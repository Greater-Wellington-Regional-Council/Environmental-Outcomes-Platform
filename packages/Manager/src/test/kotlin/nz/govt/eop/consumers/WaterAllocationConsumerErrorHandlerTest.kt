package nz.govt.eop.consumers

import io.kotest.matchers.ints.shouldBeGreaterThan
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import java.math.BigDecimal
import java.time.Duration
import java.time.Instant
import nz.govt.eop.messages.ConsentStatus
import nz.govt.eop.messages.WaterAllocationMessage
import org.apache.kafka.clients.consumer.Consumer
import org.apache.kafka.common.serialization.StringDeserializer
import org.awaitility.Awaitility
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.context.annotation.Profile
import org.springframework.kafka.annotation.KafkaListener
import org.springframework.kafka.core.DefaultKafkaConsumerFactory
import org.springframework.kafka.core.KafkaTemplate
import org.springframework.kafka.test.EmbeddedKafkaBroker
import org.springframework.kafka.test.context.EmbeddedKafka
import org.springframework.kafka.test.utils.KafkaTestUtils
import org.springframework.stereotype.Component
import org.springframework.test.annotation.DirtiesContext
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles("test", "fake-consumer")
@SpringBootTest
@EmbeddedKafka(
    partitions = 1,
    bootstrapServersProperty = "spring.kafka.bootstrap-servers",
    topics = [WATER_ALLOCATION_TOPIC_NAME])
class WaterAllocationConsumerErrorHandlerTest(
    @Autowired val broker: EmbeddedKafkaBroker,
    @Autowired val template: KafkaTemplate<String, Any>,
    @Autowired val fakeConsumer: FakeConsumer
) {

  @DirtiesContext
  @Test
  fun `Should send message to DLT when processing fails multiple times`() {
    // GIVEN
    val consumerProps = KafkaTestUtils.consumerProps("test", "true", broker)
    val cf = DefaultKafkaConsumerFactory(consumerProps, StringDeserializer(), StringDeserializer())
    val dltConsumer: Consumer<String, String> = cf.createConsumer()
    dltConsumer.subscribe(listOf("$WATER_ALLOCATION_TOPIC_NAME.manager-consumer.DLT"))

    val firstMessage =
        WaterAllocationMessage(
            "poison",
            "consentId",
            ConsentStatus.valueOf("active"),
            "area-id",
            BigDecimal("100.11"),
            true,
            BigDecimal("10.0"),
            BigDecimal("10.0"),
            listOf("meter-0", "meter-1"),
            "firstIngestId",
            Instant.now(),
            "category")

    val secondMessage = firstMessage.copy(sourceId = "sourceId")

    // WHEN
    template.send(WATER_ALLOCATION_TOPIC_NAME, "poison", firstMessage)
    template.send(WATER_ALLOCATION_TOPIC_NAME, "sourceId", secondMessage)

    // THEN

    // Assert the first message ended up in the DLT
    val dltRecord =
        KafkaTestUtils.getSingleRecord(
            dltConsumer, "$WATER_ALLOCATION_TOPIC_NAME.manager-consumer.DLT")
    dltRecord.shouldNotBeNull()

    // Assert we tried to process the message multiple times
    fakeConsumer.timesCalled.shouldBeGreaterThan(2)

    Awaitility.waitAtMost(Duration.ofSeconds(5)).untilAsserted {

      // Assert the second message was processed successfully
      fakeConsumer.messageProcessed.shouldBe(true)
    }
  }

  @DirtiesContext
  @Test
  fun `Should handle an unparsable message by sending it to the DLT`() {
    // GIVEN
    val consumerProps = KafkaTestUtils.consumerProps("test", "true", broker)
    val cf = DefaultKafkaConsumerFactory(consumerProps, StringDeserializer(), StringDeserializer())
    val dltConsumer: Consumer<String, String> = cf.createConsumer()
    dltConsumer.subscribe(listOf("$WATER_ALLOCATION_TOPIC_NAME.manager-consumer.DLT"))

    val invalidMessage = """{"foo":"bar"}"""

    // WHEN
    template.send(WATER_ALLOCATION_TOPIC_NAME, "key1", invalidMessage)

    // THEN
    // Assert the first message ended up in the DLT
    val dltRecord =
        KafkaTestUtils.getSingleRecord(
            dltConsumer, "$WATER_ALLOCATION_TOPIC_NAME.manager-consumer.DLT")
    dltRecord.shouldNotBeNull()

    // This assert json shows how the message is a byte array encoded as JSON
    dltRecord.value().shouldBe("\"IntcImZvb1wiOlwiYmFyXCJ9Ig==\"")
  }
}

@Profile("fake-consumer")
@Component
class FakeConsumer {

  var timesCalled = 0
  var messageProcessed = false

  @KafkaListener(
      topics = [WATER_ALLOCATION_TOPIC_NAME], id = "nz.govt.eop.consumers.water-allocation-fake")
  fun processMessage(allocation: WaterAllocationMessage) {
    timesCalled++

    if (allocation.sourceId == "poison") {
      // Fake that processing fails
      throw RuntimeException("Fake failure")
    } else {
      messageProcessed = true
    }
  }
}
