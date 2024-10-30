package nz.govt.eop.freshwater_management_units.controllers

import nz.govt.eop.freshwater_management_units.services.SystemValueService
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.Mockito.*
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.*

@WebMvcTest(SystemValueController::class)
class SystemValueControllerTest {

  @Autowired private lateinit var mockMvc: MockMvc

  @MockBean private lateinit var service: SystemValueService

  @BeforeEach
  fun setup() {
    reset(service)
  }

  @Test
  fun `should return system value when found with councilId`() {
    val councilId = 1
    val valueName = "testValue"
    val expectedResponse = mapOf("key" to "value")

    `when`(service.getValue(valueName, councilId)).thenReturn(expectedResponse)

    mockMvc
        .perform(
            get("/system-values/{councilId}/{valueName}", councilId, valueName)
                .header("Referer", "http://test.com")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.key").value("value"))

    verify(service, times(1)).getValue(valueName, councilId)
  }

  @Test
  fun `should return 404 when system value is not found with councilId`() {
    val councilId = 1
    val valueName = "missingValue"

    `when`(service.getValue(valueName, councilId)).thenReturn(null)

    mockMvc
        .perform(
            get("/system-values/{councilId}/{valueName}", councilId, valueName)
                .header("Referer", "http://test.com")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound)

    verify(service, times(1)).getValue(valueName, councilId)
  }

  @Test
  fun `should return system value when councilId is not provided`() {
    val valueName = "testValue"
    val expectedResponse = mapOf("key" to "value")

    `when`(service.getValue(valueName, null)).thenReturn(expectedResponse)

    mockMvc
        .perform(
            get("/system-values/{valueName}", valueName)
                .header("Referer", "http://test.com")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isOk)
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$.key").value("value"))

    verify(service, times(1)).getValue(valueName, null)
  }

  @Test
  fun `should return 404 when system value is not found and councilId is not provided`() {
    val valueName = "missingValue"

    `when`(service.getValue(valueName, null)).thenReturn(null)

    mockMvc
        .perform(
            get("/system-values/{valueName}", valueName)
                .header("Referer", "http://test.com")
                .accept(MediaType.APPLICATION_JSON))
        .andExpect(status().isNotFound)

    verify(service, times(1)).getValue(valueName, null)
  }
}
