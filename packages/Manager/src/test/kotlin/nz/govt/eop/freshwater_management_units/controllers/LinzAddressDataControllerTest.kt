package nz.govt.eop.freshwater_management_units.controllers

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import nz.govt.eop.freshwater_management_units.services.LinzDataService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

class LinzAddressDataControllerTest {

  private lateinit var linzDataService: LinzDataService
  private lateinit var linzAddressDataController: LinzAddressDataController

  @BeforeEach
  fun setup() {
    linzDataService = mockk()
    linzAddressDataController = LinzAddressDataController(linzDataService)
  }

  @Test
  fun `getUnitOfPropertyIdForAddressId returns unit of property ID successfully`() {
    val addressId = "12345"
    val expectedUnitOfPropertyId = "54321"

    every { linzDataService.getUnitOfPropertyIdForAddressId(addressId) } returns
        expectedUnitOfPropertyId

    val response: ResponseEntity<String> =
        linzAddressDataController.getUnitOfPropertyIdForAddressId(addressId)

    assertEquals(HttpStatus.OK, response.statusCode)
    assertEquals(expectedUnitOfPropertyId, response.body)

    verify { linzDataService.getUnitOfPropertyIdForAddressId(addressId) }
  }

  @Test
  fun `getUnitOfPropertyIdForAddressId returns error when exception is thrown`() {
    val addressId = "12345"
    val errorMessage = "Failed to retrieve address data"

    every { linzDataService.getUnitOfPropertyIdForAddressId(addressId) } throws
        RuntimeException(errorMessage)

    val response: ResponseEntity<String> =
        linzAddressDataController.getUnitOfPropertyIdForAddressId(addressId)

    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.statusCode)
    assertEquals("Failed to retrieve address data: $errorMessage", response.body)

    verify { linzDataService.getUnitOfPropertyIdForAddressId(addressId) }
  }

  @Test
  fun `getGeometryForUnitOfProperty returns geometry data successfully`() {
    val unitOfPropertyId = "54321"
    val projection = "EPSG:4326"
    val expectedGeometryData = mapOf("someKey" to "someValue")

    every { linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection) } returns
        expectedGeometryData

    val response: ResponseEntity<Map<String, Any>> =
        linzAddressDataController.getGeometryForUnitOfProperty(unitOfPropertyId, projection)

    assertEquals(HttpStatus.OK, response.statusCode)
    assertEquals(expectedGeometryData, response.body)

    verify { linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection) }
  }

  @Test
  fun `getGeometryForUnitOfProperty returns error when exception is thrown`() {
    val unitOfPropertyId = "54321"
    val projection = "EPSG:4326"
    val errorMessage = "Failed to retrieve geometry data"

    every { linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection) } throws
        RuntimeException(errorMessage)

    val response: ResponseEntity<Map<String, Any>> =
        linzAddressDataController.getGeometryForUnitOfProperty(unitOfPropertyId, projection)

    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.statusCode)
    assertEquals(mapOf("error" to errorMessage), response.body)

    verify { linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection) }
  }

  @Test
  fun `getGeometryForAddressId returns geometry data by address ID successfully`() {
    val addressId = "12345"
    val unitOfPropertyId = "54321"
    val projection = "EPSG:4326"
    val expectedGeometryData = mapOf("someKey" to "someValue")

    every { linzDataService.getUnitOfPropertyIdForAddressId(addressId) } returns unitOfPropertyId
    every { linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection) } returns
        expectedGeometryData

    val response: ResponseEntity<Map<String, Any>> =
        linzAddressDataController.getGeometryForAddressId(addressId, projection)

    assertEquals(HttpStatus.OK, response.statusCode)
    assertEquals(expectedGeometryData, response.body)

    verify { linzDataService.getUnitOfPropertyIdForAddressId(addressId) }
    verify { linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection) }
  }

  @Test
  fun `getGeometryForAddressId returns error when exception is thrown`() {
    val addressId = "12345"
    val errorMessage = "Failed to retrieve address data"

    every { linzDataService.getUnitOfPropertyIdForAddressId(addressId) } throws
        RuntimeException(errorMessage)

    val response: ResponseEntity<Map<String, Any>> =
        linzAddressDataController.getGeometryForAddressId(addressId, "EPSG:4326")

    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.statusCode)
    assertEquals(mapOf("error" to errorMessage), response.body)

    verify { linzDataService.getUnitOfPropertyIdForAddressId(addressId) }
  }
}
