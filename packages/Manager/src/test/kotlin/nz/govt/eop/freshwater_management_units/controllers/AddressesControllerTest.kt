package nz.govt.eop.freshwater_management_units.controllers

import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import nz.govt.eop.freshwater_management_units.services.AddressFinderService
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity

class AddressesControllerTest {

  private lateinit var addressFinderService: AddressFinderService
  private lateinit var addressesController: AddressesController

  @BeforeEach
  fun setup() {
    addressFinderService = mockk()
    addressesController = AddressesController(addressFinderService)
  }

  @Test
  fun `getAddressOptions returns address options successfully`() {
    val query = "Test Address"
    val serviceResponse =
        listOf(
            mapOf("label" to "Test Address 1", "value" to "123"),
            mapOf("label" to "Test Address 2", "value" to "456"))

    every { addressFinderService.getAddressOptions(query) } returns serviceResponse

    val response: ResponseEntity<List<Map<String, Any>>> =
        addressesController.getAddressOptions(query)

    assertEquals(HttpStatus.OK, response.statusCode)
    assertEquals(serviceResponse, response.body)

    verify { addressFinderService.getAddressOptions(query) }
  }

  @Test
  fun `getAddressOptions handles exception and returns error response`() {
    val query = "Test Address"
    val errorMessage = "Service unavailable"
    every { addressFinderService.getAddressOptions(query) } throws RuntimeException(errorMessage)

    val response: ResponseEntity<List<Map<String, Any>>> =
        addressesController.getAddressOptions(query)

    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.statusCode)
    assertEquals(listOf(mapOf("error" to errorMessage)), response.body)

    verify { addressFinderService.getAddressOptions(query) }
  }

  @Test
  fun `getAddressByPxid returns address data successfully`() {
    val pxid = "123"
    val serviceResponse =
        mapOf(
            "id" to "AIMS-123",
            "address" to "Test Address 1",
            "location" to
                mapOf(
                    "type" to "Feature",
                    "geometry" to
                        mapOf("type" to "Point", "coordinates" to listOf(174.775, -41.290)),
                    "properties" to emptyMap<String, Any>()))
    every { addressFinderService.getAddressByPxid(pxid) } returns serviceResponse

    val response: ResponseEntity<Map<String, Any>> = addressesController.getAddressByPxid(pxid)

    assertEquals(HttpStatus.OK, response.statusCode)
    assertEquals(serviceResponse, response.body)

    verify { addressFinderService.getAddressByPxid(pxid) }
  }

  @Test
  fun `getAddressByPxid handles exception and returns error response`() {
    val pxid = "123"
    val errorMessage = "Address not found"
    every { addressFinderService.getAddressByPxid(pxid) } throws RuntimeException(errorMessage)

    val response: ResponseEntity<Map<String, Any>> = addressesController.getAddressByPxid(pxid)

    assertEquals(HttpStatus.INTERNAL_SERVER_ERROR, response.statusCode)
    assertEquals(mapOf("error" to errorMessage), response.body)

    verify { addressFinderService.getAddressByPxid(pxid) }
  }
}
