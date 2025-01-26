package nz.govt.eop.freshwater_management_units.services

import kotlin.test.assertEquals
import kotlin.test.assertFailsWith
import kotlinx.coroutines.test.runTest
import okhttp3.mockwebserver.MockResponse
import okhttp3.mockwebserver.MockWebServer
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
import org.springframework.web.reactive.function.client.WebClient

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class AddressFinderServiceTest {

  private lateinit var mockWebServer: MockWebServer
  private lateinit var addressFinderService: AddressFinderService

  @BeforeEach
  fun setup() {
    mockWebServer = MockWebServer()
    mockWebServer.start()

    val baseUrl = mockWebServer.url("/").toString()
    val webClient = WebClient.builder().baseUrl(baseUrl).build()

    addressFinderService = AddressFinderService(webClient, "dummy-api-key")
  }

  @AfterEach
  fun tearDown() {
    mockWebServer.shutdown()
  }

  @Test
  fun `test getAddressOptions returns correct data`() = runTest {
    val mockResponseBody =
        """
            {
              "completions": [
                { "a": "123 Sample Street", "pxid": "abc123" }
              ]
            }
        """
            .trimIndent()

    mockWebServer.enqueue(
        MockResponse().setBody(mockResponseBody).addHeader("Content-Type", "application/json"))

    val result = addressFinderService.getAddressOptions("Sample Street")

    val expected = listOf(mapOf("label" to "123 Sample Street", "value" to "abc123"))

    assertEquals(expected, result)

    val request = mockWebServer.takeRequest()
    assertEquals(
        "/autocomplete/?key=dummy-api-key&q=Sample%20Street&format=json&post_box=0&strict=2&region_code=F&highlight=1",
        request.path)
  }

  @Test
  fun `test getAddressByPxid returns correct data`() = runTest {
    val mockResponseBody =
        """
            {
              "aims_address_id": "aims123",
              "a": "123 Sample Street",
              "x": 174.7633,
              "y": -36.8485
            }
        """
            .trimIndent()

    mockWebServer.enqueue(
        MockResponse().setBody(mockResponseBody).addHeader("Content-Type", "application/json"))

    val result = addressFinderService.getAddressByPxid("abc123")

    val expected =
        mapOf(
            "id" to "aims123",
            "address" to "123 Sample Street",
            "location" to
                mapOf(
                    "type" to "Feature",
                    "geometry" to
                        mapOf("type" to "Point", "coordinates" to listOf(174.7633, -36.8485)),
                    "properties" to emptyMap<String, Any>()))

    assertEquals(expected, result)

    val request = mockWebServer.takeRequest()
    assertEquals("/metadata/?key=dummy-api-key&format=json&pxid=abc123", request.path)
  }

  @Test
  fun `test getAddressByPxid throws exception when required fields are missing`() = runTest {
    val mockResponseBody =
        """
            {
              "a": "123 Sample Street"
            }
        """
            .trimIndent()

    mockWebServer.enqueue(
        MockResponse().setBody(mockResponseBody).addHeader("Content-Type", "application/json"))

    assertFailsWith<RuntimeException> { addressFinderService.getAddressByPxid("missing_fields") }

    val request = mockWebServer.takeRequest()
    assertEquals("/metadata/?key=dummy-api-key&format=json&pxid=missing_fields", request.path)
  }
}
