package nz.govt.eop.freshwater_management_units.services

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertThrows
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.client.RestTemplate

class AddressFinderServiceTest {

  private lateinit var restTemplate: RestTemplate
  private lateinit var addressFinderService: AddressFinderService
  private val apiKey = "testApiKey"

  @BeforeEach
  fun setup() {
    restTemplate = mockk()
    addressFinderService = AddressFinderService(restTemplate, apiKey)
  }

  @Test
  fun `getAddressOptions returns address options successfully`() {
    val query = "Test Address"
    val expectedResponse =
        mapOf(
            "completions" to
                listOf(
                    mapOf("a" to "Test Address 1", "pxid" to "123"),
                    mapOf("a" to "Test Address 2", "pxid" to "456")))
    val expectedOptions =
        listOf(
            mapOf("label" to "Test Address 1", "value" to "123"),
            mapOf("label" to "Test Address 2", "value" to "456"))

    every { restTemplate.getForEntity(any<String>(), Map::class.java) } returns
        ResponseEntity(expectedResponse, HttpStatus.OK)

    val result = addressFinderService.getAddressOptions(query)

    assertEquals(expectedOptions, result)

    verify { restTemplate.getForEntity(any<String>(), Map::class.java) }
  }

  @Test
  fun `getAddressOptions throws exception when API call fails`() {
    val query = "Test Address"

    every { restTemplate.getForEntity(any<String>(), Map::class.java) } returns
        ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR)

    val exception = assertThrows<RuntimeException> { addressFinderService.getAddressOptions(query) }
    assertEquals(
        "Failed to get matching addresses. The AddressFinder service may be unavailable.",
        exception.message)

    verify { restTemplate.getForEntity(any<String>(), Map::class.java) }
  }

  @Test
  fun `getAddressByPxid returns address details successfully`() {
    val pxid = "123"
    val expectedResponse =
        mapOf(
            "aims_address_id" to "AIMS-123",
            "a" to "Test Address 1",
            "x" to 174.775,
            "y" to -41.290)
    val expectedResult =
        mapOf(
            "id" to "AIMS-123",
            "address" to "Test Address 1",
            "location" to
                mapOf(
                    "type" to "Feature",
                    "geometry" to
                        mapOf("type" to "Point", "coordinates" to listOf(174.775, -41.290)),
                    "properties" to emptyMap<String, Any>()))

    every { restTemplate.getForEntity(any<String>(), Map::class.java) } returns
        ResponseEntity(expectedResponse, HttpStatus.OK)

    val result = addressFinderService.getAddressByPxid(pxid)

    assertEquals(expectedResult, result)

    verify { restTemplate.getForEntity(any<String>(), Map::class.java) }
  }

  @Test
  fun `getAddressByPxid throws exception when API call fails`() {
    val pxid = "123"

    every { restTemplate.getForEntity(any<String>(), Map::class.java) } returns
        ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR)

    val exception = assertThrows<RuntimeException> { addressFinderService.getAddressByPxid(pxid) }
    assertEquals(
        "Failed to retrieve address data. The AddressFinder service may be unavailable.",
        exception.message)

    verify { restTemplate.getForEntity(any<String>(), Map::class.java) }
  }

  @Test
  fun `getAddressByPxid throws exception when response is missing required fields`() {
    val pxid = "123"
    val incompleteResponse =
        mapOf("a" to "Test Address 1") // Missing `aims_address_id`, `x`, and `y`

    every { restTemplate.getForEntity(any<String>(), Map::class.java) } returns
        ResponseEntity(incompleteResponse, HttpStatus.OK)

    val exception = assertThrows<RuntimeException> { addressFinderService.getAddressByPxid(pxid) }
    assertEquals("aims_address_id not found", exception.message)

    verify { restTemplate.getForEntity(any<String>(), Map::class.java) }
  }
}
