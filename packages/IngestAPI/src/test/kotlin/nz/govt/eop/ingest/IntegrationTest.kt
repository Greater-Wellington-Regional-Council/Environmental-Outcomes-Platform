package nz.govt.eop.ingest

import io.kotest.matchers.collections.shouldHaveSize
import io.kotest.matchers.nulls.shouldNotBeNull
import nz.govt.eop.messages.WaterAllocationMessage
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
@EmbeddedKafka(
    partitions = 1,
    bootstrapServersProperty = "spring.kafka.bootstrap-servers",
    topics = [WATER_ALLOCATION_TOPIC_NAME])
@SpringBootTest
@AutoConfigureMockMvc
class IntegrationTest(@Autowired val mvc: MockMvc, @Autowired val broker: EmbeddedKafkaBroker) {
  @Test
  fun `Should reject invalid auth`() {
    mvc.perform(
            post("/water-allocations")
                .with(SecurityMockMvcRequestPostProcessors.httpBasic("gw", "WRONG TOKENs"))
                .contentType(MediaType.APPLICATION_JSON))
        .andExpect(status().isUnauthorized)
  }

  @Test
  fun `Should reject invalid data`() {
    mvc.perform(
            post("/water-allocations")
                .with(SecurityMockMvcRequestPostProcessors.httpBasic("gw", "test-api-token"))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""{"notIngestId": "1", "allocations": []}"""))
        .andExpect(status().isBadRequest)
  }

  @Test
  fun `Should reject null allocationPlan`() {
    mvc.perform(
            post("/water-allocations")
                .with(SecurityMockMvcRequestPostProcessors.httpBasic("gw", "test-api-token"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                {
                  "ingestId": "1",
                  "allocations":
                    [
                        { "sourceId": "OrongorongoSW-20540", "consentId":  "20540", "status":  "active", "areaId":  "OrongorongoSW", "allocationPlan": null, "isMetered": true, "allocationDaily": 0.0, "allocationYearly": 0.0, "meters": [], "category": "B" },
                    ]
                }
              """))
        .andExpect(status().isBadRequest)
  }

  @Test
  fun `Should reject null allocationDaily`() {
    mvc.perform(
            post("/water-allocations")
                .with(SecurityMockMvcRequestPostProcessors.httpBasic("gw", "test-api-token"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                {
                  "ingestId": "1",
                  "allocations":
                    [
                        { "sourceId": "OrongorongoSW-20540", "consentId":  "20540", "status":  "active", "areaId":  "OrongorongoSW", "allocationPlan": 0.0, "isMetered": true, "allocationDaily": null, "allocationYearly": 0.0, "meters": [], "category": "B" },
                    ]
                }
              """))
        .andExpect(status().isBadRequest)
  }

  @Test
  fun `Should reject null allocationYearly`() {
    mvc.perform(
            post("/water-allocations")
                .with(SecurityMockMvcRequestPostProcessors.httpBasic("gw", "test-api-token"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    """
                {
                  "ingestId": "1",
                  "allocations":
                    [
                        { "sourceId": "OrongorongoSW-20540", "consentId":  "20540", "status":  "active", "areaId":  "OrongorongoSW", "allocationPlan": 0.0, "isMetered": true, "allocationDaily": 0.0, "allocationYearly": null, "meters": [], "category": "B" },
                    ]
                }
              """))
        .andExpect(status().isBadRequest)
  }

  @Test
  fun `Should post records to Kafka Topic`() {
    val consumer = createKafkaConsumer(broker)
    val testData =
        """
            {
              "ingestId": "1",
              "allocations":
                [
                    { "sourceId": "OrongorongoSW-20540", "consentId":  "20540", "status":  "active", "areaId":  "OrongorongoSW", "allocationPlan": 87.0, "isMetered": true, "allocationDaily": 0.0, "allocationYearly": 0.0, "meters": [], "category": "B" },
                    { "sourceId": "Wairarapa-20544", "consentId":  "20544", "status":  "active", "areaId":  "Wairarapa CoastSW", "allocationPlan": 2.1, "isMetered": false, "allocationDaily": 0.0, "allocationYearly": 0.0, "meters": ["S25/5314"], "category": "ST" },
                    { "sourceId": "OtakiSW-20548", "consentId":  "20548", "status":  "inactive", "areaId":  "OtakiSW", "allocationPlan": 1.13, "isMetered": true, "allocationDaily": 6912.0, "allocationYearly": 1036800.0, "meters": ["BP34/0044", "BP34/0064", "T26/0871"], "category": "A" }
                ]
            }
        """
    mvc.perform(
            post("/water-allocations")
                .with(SecurityMockMvcRequestPostProcessors.httpBasic("gw", "test-api-token"))
                .contentType(MediaType.APPLICATION_JSON)
                .content(testData))
        .andExpect(status().isOk)

    val records = KafkaTestUtils.getRecords(consumer)
    records.shouldNotBeNull()

    val foundRecords = records.records(WATER_ALLOCATION_TOPIC_NAME)
    foundRecords.shouldHaveSize(3)
  }

  private fun createKafkaConsumer(
      broker: EmbeddedKafkaBroker
  ): Consumer<String, WaterAllocationMessage> {

    val consumerProps = KafkaTestUtils.consumerProps("test", "true", broker)
    consumerProps[JsonDeserializer.TRUSTED_PACKAGES] = "*"
    consumerProps[JsonDeserializer.VALUE_DEFAULT_TYPE] =
        "nz.govt.eop.messages.WaterAllocationMessage"
    consumerProps[JsonDeserializer.USE_TYPE_INFO_HEADERS] = "false"

    val cf =
        DefaultKafkaConsumerFactory<String, WaterAllocationMessage>(
            consumerProps, StringDeserializer(), JsonDeserializer())

    val consumer: Consumer<String, WaterAllocationMessage> = cf.createConsumer()
    consumer.subscribe(listOf(WATER_ALLOCATION_TOPIC_NAME))

    return consumer
  }
}
