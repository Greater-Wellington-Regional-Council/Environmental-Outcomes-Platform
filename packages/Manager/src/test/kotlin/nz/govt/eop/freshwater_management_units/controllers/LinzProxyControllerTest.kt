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

class LinzProxyControllerTest {

  private lateinit var linzDataService: LinzDataService
  private lateinit var linzProxyController: LinzProxyController

  @BeforeEach
  fun setup() {
    linzDataService = mockk()
    linzProxyController = LinzProxyController(linzDataService)
  }

  @Test
  fun `getUnitOfPropertyIdForAddressId returns unit of property ID successfully`() {
    val addressId = "12345"
    val expectedUnitOfPropertyId = "54321"

    // Mock the service response
    every { linzDataService.getUnitOfPropertyIdForAddressId(addressId) } returns
        expectedUnitOfPropertyId

    // Call the controller method
    val response: ResponseEntity<String> =
        linzProxyController.getUnitOfPropertyIdForAddressId(addressId)

    // Verify the result
    assertEquals(HttpStatus.OK, response.statusCode)
    assertEquals(expectedUnitOfPropertyId, response.body)

    // Verify the service was called with the correct parameter
    verify { linzDataService.getUnitOfPropertyIdForAddressId(addressId) }
  }

  @Test
  fun `getUnitOfPropertyIdForAddressId returns error when exception is thrown`() {
    val addressId = "12345"
    val errorMessage = "Failed to retrieve address data"

    // Mock the service to throw an exception
    every { linzDataService.getUnitOfPropertyIdForAddressId(addressId) } throws
        RuntimeException(errorMessage)

    // Call the controller method
    val response: ResponseEntity<String> =
        linzProxyController.getUnitOfPropertyIdForAddressId(addressId)

    // Verify the result
    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.statusCode)
    assertEquals("Failed to retrieve address data: $errorMessage", response.body)

    // Verify the service was called with the correct parameter
    verify { linzDataService.getUnitOfPropertyIdForAddressId(addressId) }
  }

  @Test
  fun `getGeometryForUnitOfProperty returns geometry data successfully`() {
    val unitOfPropertyId = "54321"
    val projection = "EPSG:4326"
    val expectedGeometryData = mapOf("someKey" to "someValue")

    // Mock the service response
    every { linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection) } returns
        expectedGeometryData

    // Call the controller method
    val response: ResponseEntity<Map<String, Any>> =
        linzProxyController.getGeometryForUnitOfProperty(unitOfPropertyId, projection)

    // Verify the result
    assertEquals(HttpStatus.OK, response.statusCode)
    assertEquals(expectedGeometryData, response.body)

    // Verify the service was called with the correct parameters
    verify { linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection) }
  }

  @Test
  fun `getGeometryForUnitOfProperty returns error when exception is thrown`() {
    val unitOfPropertyId = "54321"
    val projection = "EPSG:4326"
    val errorMessage = "Failed to retrieve geometry data"

    // Mock the service to throw an exception
    every { linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection) } throws
        RuntimeException(errorMessage)

    // Call the controller method
    val response: ResponseEntity<Map<String, Any>> =
        linzProxyController.getGeometryForUnitOfProperty(unitOfPropertyId, projection)

    // Verify the result
    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.statusCode)
    assertEquals(mapOf("error" to errorMessage), response.body)

    // Verify the service was called with the correct parameters
    verify { linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection) }
  }

  @Test
  fun `getGeometryForAddressId returns geometry data by address ID successfully`() {
    val addressId = "12345"
    val unitOfPropertyId = "54321"
    val projection = "EPSG:4326"
    val expectedGeometryData = mapOf("someKey" to "someValue")

    // Mock the service responses
    every { linzDataService.getUnitOfPropertyIdForAddressId(addressId) } returns unitOfPropertyId
    every { linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection) } returns
        expectedGeometryData

    // Call the controller method
    val response: ResponseEntity<Map<String, Any>> =
        linzProxyController.getGeometryForAddressId(addressId, projection)

    // Verify the result
    assertEquals(HttpStatus.OK, response.statusCode)
    assertEquals(expectedGeometryData, response.body)

    // Verify the service was called with the correct parameters
    verify { linzDataService.getUnitOfPropertyIdForAddressId(addressId) }
    verify { linzDataService.getGeometryForUnitOfProperty(unitOfPropertyId, projection) }
  }

  @Test
  fun `getGeometryForAddressId returns error when exception is thrown`() {
    val addressId = "12345"
    val errorMessage = "Failed to retrieve address data"

    // Mock the service to throw an exception
    every { linzDataService.getUnitOfPropertyIdForAddressId(addressId) } throws
        RuntimeException(errorMessage)

    // Call the controller method
    val response: ResponseEntity<Map<String, Any>> =
        linzProxyController.getGeometryForAddressId(addressId, "EPSG:4326")

    // Verify the result
    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.statusCode)
    assertEquals(mapOf("error" to errorMessage), response.body)

    // Verify the service was called with the correct parameter
    verify { linzDataService.getUnitOfPropertyIdForAddressId(addressId) }
  }
}
