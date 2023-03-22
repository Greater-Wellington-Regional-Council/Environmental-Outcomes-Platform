package nz.govt.eop.consumers

import io.kotest.matchers.ints.shouldBeGreaterThan
import io.kotest.matchers.nulls.shouldNotBeNull
import io.kotest.matchers.shouldBe
import java.math.BigDecimal
import java.time.Duration
import java.time.Instant
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

  @Test
  fun `Should send message to DLT when processing fails multiple times`() {
    // GIVEN
    val consumerProps = KafkaTestUtils.consumerProps("test", "true", broker)
    val cf = DefaultKafkaConsumerFactory(consumerProps, StringDeserializer(), StringDeserializer())
    val dltConsumer: Consumer<String, String> = cf.createConsumer()
    dltConsumer.subscribe(listOf("$WATER_ALLOCATION_TOPIC_NAME.manager-consumer.DLT"))

    val firstMessage =
        WaterAllocationMessage("poison", BigDecimal("100.11"), "ingest-id", Instant.now())
    val secondMessage =
        WaterAllocationMessage("areaid", BigDecimal("100.11"), "ingest-id", Instant.now())

    // WHEN
    template.send(WATER_ALLOCATION_TOPIC_NAME, "poison", firstMessage)
    template.send(WATER_ALLOCATION_TOPIC_NAME, "areaid", secondMessage)

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

    if (allocation.areaId == "poison") {
      // Fake that processing fails
      throw RuntimeException("Fake failure")
    } else {
      messageProcessed = true
    }
  }
}
