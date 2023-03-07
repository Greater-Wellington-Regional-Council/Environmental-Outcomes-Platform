package nz.govt.eop.ingestapi

import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import org.apache.kafka.clients.consumer.Consumer
import org.apache.kafka.common.serialization.StringDeserializer
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.MediaType
import org.springframework.kafka.core.DefaultKafkaConsumerFactory
import org.springframework.kafka.support.serializer.JsonDeserializer
import org.springframework.kafka.test.EmbeddedKafkaBroker
import org.springframework.kafka.test.context.EmbeddedKafka
import org.springframework.kafka.test.utils.KafkaTestUtils
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
@EmbeddedKafka(
    partitions = 1, brokerProperties = ["listeners=PLAINTEXT://localhost:29092", "port=29092"])
class IntegrationTest(@Autowired val mvc: MockMvc, @Autowired val broker: EmbeddedKafkaBroker) {

  @Test
  fun `Should reject invalid auth`() {
    // GIVEN

    // WHEN
    mvc.perform(
            post("/water-allocations")
                .with(SecurityMockMvcRequestPostProcessors.httpBasic("gw", "WRONG TOKEN"))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isUnauthorized)

    // THEN
  }

  @Test
  fun `Should post records to Kafka Topic`() {
    // GIVEN
    val consumer = createKafkaConsumer(broker)

    // WHEN
    mvc.perform(
            post("/water-allocations")
                .with(SecurityMockMvcRequestPostProcessors.httpBasic("gw", "test-api-token"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """{"ingestId": "1", "allocations": [{"areaId":  "1", "amount": 1}, {"areaId":  "2", "amount": 2}, {"areaId":  "3", "amount": 3}]}"""))
        .andExpect(status().isOk)

    // THEN

    val records = KafkaTestUtils.getRecords(consumer)
    records.shouldNotBeNull()

    val foundRecords = records.records(WATER_ALLOCATION_TOPIC_NAME)
    foundRecords.shouldHaveSize(3)
  }

  private fun createKafkaConsumer(
      broker: EmbeddedKafkaBroker
  ): Consumer<String, IngestedWaterAllocation> {
    val consumerProps = KafkaTestUtils.consumerProps("test", "true", broker)
    consumerProps[JsonDeserializer.TRUSTED_PACKAGES] = "*"

    val cf =
        DefaultKafkaConsumerFactory<String, IngestedWaterAllocation>(
            consumerProps, StringDeserializer(), JsonDeserializer())

    val consumer: Consumer<String, IngestedWaterAllocation> = cf.createConsumer()
    consumer.subscribe(listOf(WATER_ALLOCATION_TOPIC_NAME))

    return consumer
  }
}
