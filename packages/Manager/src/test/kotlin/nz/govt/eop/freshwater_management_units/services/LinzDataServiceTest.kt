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

class LinzDataServiceTest {

  private lateinit var restTemplate: RestTemplate
  private lateinit var linzDataService: LinzDataService
  private val apiKey = "testApiKey"

  @BeforeEach
  fun setup() {
    restTemplate = mockk()
    linzDataService = LinzDataService(restTemplate, apiKey)
  }

  @Test
  fun `getUnitOfPropertyIdForAddressId returns unit of property ID successfully`() {
    val addressId = "12345"
    val expectedUnitOfPropertyId = "54321"
    val responseData =
        mapOf(
            "features" to
                listOf(
                    mapOf(
                        "properties" to mapOf("unit_of_property_id" to expectedUnitOfPropertyId))))

    every { restTemplate.getForEntity(any<String>(), Map::class.java) } returns
        ResponseEntity(responseData, HttpStatus.OK)

    val result = linzDataService.getUnitOfPropertyIdForAddressId(addressId)

    assertEquals(expectedUnitOfPropertyId, result)
    verify { restTemplate.getForEntity(any<String>(), Map::class.java) }
  }

  @Test
  fun `getUnitOfPropertyIdForAddressId throws exception when API call fails`() {
    val addressId = "12345"

    every { restTemplate.getForEntity(any<String>(), Map::class.java) } returns
        ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR)

    val exception =
        assertThrows<RuntimeException> {
          linzDataService.getUnitOfPropertyIdForAddressId(addressId)
        }

    assertEquals("Failed to retrieve address data for address $addressId", exception.message)
    verify { restTemplate.getForEntity(any<String>(), Map::class.java) }
  }

  @Test
  fun `getGeometryForUnitOfProperty returns geometry data successfully`() {
    val unitOfPropertyId = "54321"
    val projection = "EPSG:4326"
    val expectedGeometryData = mapOf("someKey" to "someValue")

    every { restTemplate.getForEntity(any<String>(), Map::class.java) } returns
        ResponseEntity(expectedGeometryData, HttpStatus.OK)

    val result = linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection)

    assertEquals(expectedGeometryData, result)
    verify { restTemplate.getForEntity(any<String>(), Map::class.java) }
  }

  @Test
  fun `getGeometryForUnitOfProperty throws exception when API call fails`() {
    val unitOfPropertyId = "54321"
    val projection = "EPSG:4326"

    every { restTemplate.getForEntity(any<String>(), Map::class.java) } returns
        ResponseEntity(null, HttpStatus.INTERNAL_SERVER_ERROR)

    val exception =
        assertThrows<RuntimeException> {
          linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection)
        }

    assertEquals(
        "Failed to retrieve geometry data for unit of property $unitOfPropertyId",
        exception.message)
    verify { restTemplate.getForEntity(any<String>(), Map::class.java) }
  }
}
