package nz.govt.eop.freshwater_management_units.services

import java.net.URLDecoder
import java.nio.charset.StandardCharsets
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
class LinzDataServiceTest {

  private lateinit var mockWebServer: MockWebServer
  private lateinit var linzDataService: LinzDataService

  @BeforeEach
  fun setup() {
    mockWebServer = MockWebServer()
    mockWebServer.start()

    val baseUrl = mockWebServer.url("/").toString()
    val webClient = WebClient.builder().baseUrl(baseUrl).build()

    linzDataService = LinzDataService(webClient, "dummy-linz-api-key")
  }

  @AfterEach
  fun tearDown() {
    mockWebServer.shutdown()
  }

  @Test
  fun `test getUnitOfPropertyIdForAddressId returns correct data`() = runTest {
    val mockResponseBody =
        """
            {
              "features": [
                {
                  "properties": {
                    "unit_of_property_id": "12345"
                  }
                }
              ]
            }
        """
            .trimIndent()

    mockWebServer.enqueue(
        MockResponse().setBody(mockResponseBody).addHeader("Content-Type", "application/json"))

    val result = linzDataService.getUnitOfPropertyIdForAddressId("some-address-id")
    assertEquals("12345", result)

    val request = mockWebServer.takeRequest()
    val decodedPath = URLDecoder.decode(request.path, StandardCharsets.UTF_8.toString())
    assertEquals(
        "/services;key=dummy-linz-api-key/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=table-115638&cql_filter=address_id=some-address-id&PropertyName=(id,unit_of_property_id,address_id)&outputFormat=json",
        decodedPath)
  }

  @Test
  fun `test getUnitOfPropertyIdForAddressId throws exception when features are missing`() =
      runTest {
        val mockResponseBody =
            """
            {
              "some_other_key": []
            }
        """
                .trimIndent()

        mockWebServer.enqueue(
            MockResponse().setBody(mockResponseBody).addHeader("Content-Type", "application/json"))

        assertFailsWith<RuntimeException> {
          linzDataService.getUnitOfPropertyIdForAddressId("some-address-id")
        }

        val request = mockWebServer.takeRequest()
        val decodedPath = URLDecoder.decode(request.path, StandardCharsets.UTF_8.toString())
        assertEquals(
            "/services;key=dummy-linz-api-key/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=table-115638&cql_filter=address_id=some-address-id&PropertyName=(id,unit_of_property_id,address_id)&outputFormat=json",
            decodedPath)
      }

  @Test
  fun `test getGeometryForUnitOfProperty returns correct data`() = runTest {
    val mockResponseBody =
        """
            {
              "type": "FeatureCollection",
              "features": [
                {
                  "type": "Feature",
                  "geometry": {
                    "type": "Point",
                    "coordinates": [174.7633, -36.8485]
                  },
                  "properties": {
                    "unit_of_property_id": "12345"
                  }
                }
              ]
            }
        """
            .trimIndent()

    mockWebServer.enqueue(
        MockResponse().setBody(mockResponseBody).addHeader("Content-Type", "application/json"))

    val result = linzDataService.getGeometryForUnitOfProperty("12345", "EPSG:4326")

    val expected =
        mapOf(
            "type" to "FeatureCollection",
            "features" to
                listOf(
                    mapOf(
                        "type" to "Feature",
                        "geometry" to
                            mapOf("type" to "Point", "coordinates" to listOf(174.7633, -36.8485)),
                        "properties" to mapOf("unit_of_property_id" to "12345"))))

    assertEquals(expected, result)

    val request = mockWebServer.takeRequest()
    val decodedPath = URLDecoder.decode(request.path, StandardCharsets.UTF_8.toString())
    assertEquals(
        "/services;key=dummy-linz-api-key/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=layer-113968&cql_filter=unit_of_property_id='12345'&PropertyName=(unit_of_property_id,geom)&SRSName=EPSG:4326&outputFormat=json",
        decodedPath)
  }

  @Test
  fun `test getGeometryForUnitOfProperty throws exception when geometry data is missing`() =
      runTest {
        val mockResponseBody =
            """
            null
        """
                .trimIndent()

        mockWebServer.enqueue(
            MockResponse().setBody(mockResponseBody).addHeader("Content-Type", "application/json"))

        assertFailsWith<RuntimeException> {
          linzDataService.getGeometryForUnitOfProperty("12345", "EPSG:4326")
        }

        val request = mockWebServer.takeRequest()
        val decodedPath = URLDecoder.decode(request.path, StandardCharsets.UTF_8.toString())
        assertEquals(
            "/services;key=dummy-linz-api-key/wfs?service=WFS&version=2.0.0&request=GetFeature&typeNames=layer-113968&cql_filter=unit_of_property_id='12345'&PropertyName=(unit_of_property_id,geom)&SRSName=EPSG:4326&outputFormat=json",
            decodedPath)
      }
}
