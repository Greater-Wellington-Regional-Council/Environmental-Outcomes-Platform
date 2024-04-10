package nz.govt.eop.farm_management_units

import io.kotest.assertions.print.print
import io.kotest.core.spec.style.FunSpec
import nz.govt.eop.farm_management_units.models.FarmManagementUnit
import nz.govt.eop.farm_management_units.services.FarmManagementUnitService
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers.anyDouble
import org.mockito.ArgumentMatchers.anyInt
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class FarmManagementUnitsControllerTest(@Autowired val mvc: MockMvc) : FunSpec() {

  @MockBean
  private lateinit var fmuService: FarmManagementUnitService

  @Test
  fun `Get farm-management-units-lng-lat`() {
    `when`(fmuService.findFarmManagementUnitByLatAndLng(anyDouble(), anyDouble(), anyInt()))
      .thenReturn(FarmManagementUnit(id = 1, fmuGroup = "Western hill rivers"))

    val result = mvc.perform(
      get("/farm-management-units?lng=175.34&lat=-41")
        .contentType(MediaType.APPLICATION_JSON)
    )
      .andExpect(status().isOk)
      .andReturn()
  }

  @Test
  fun `Get all farm-management-units as feature collection`() {
    `when`(fmuService.findAllFarmManagementUnits())
      .thenReturn(
        listOf(FarmManagementUnit(id = 1, geom = TEMPLATE_FMU.geom),
          FarmManagementUnit(id = 2, geom = TEMPLATE_FMU.geom))
        )

    val result = mvc.perform(
      get("/farm-management-units/as-features")
        .contentType(MediaType.APPLICATION_JSON)
    )
      .andExpect(status().isOk)
      .andExpect(jsonPath("$.length()").value(2))
      .andExpect(jsonPath("$.features.length()").value(2))
      .andExpect(jsonPath("$.features[0].id").value(1))
      .andExpect(jsonPath("$.features[0].properties").isEmpty)
      .andExpect(jsonPath("$.features[1].id").value(2))
//      .andExpect(jsonPath("$.features[1].geometry").value(TEMPLATE_FMU.geom))
      .andExpect(jsonPath("$.features[1].properties").isEmpty)
      .andReturn()
  }
}
