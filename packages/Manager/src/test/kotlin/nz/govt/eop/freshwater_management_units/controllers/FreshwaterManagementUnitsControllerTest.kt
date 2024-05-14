package nz.govt.eop.freshwater_management_units.controllers

import io.kotest.core.spec.style.FunSpec
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.models.TangataWhenuaSite
import nz.govt.eop.freshwater_management_units.repositories.TEMPLATE_FMU
import nz.govt.eop.freshwater_management_units.services.FreshwaterManagementUnitService
import nz.govt.eop.freshwater_management_units.services.TangataWhenuaSiteService
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class FreshwaterManagementUnitsControllerTest(
    @Autowired val mvc: MockMvc,
) : FunSpec() {
  @MockBean private lateinit var fmuService: FreshwaterManagementUnitService

  @MockBean private lateinit var twService: TangataWhenuaSiteService

  @Test
  fun `Get freshwater-management-units-lng-lat`() {
    val fmu = FreshwaterManagementUnit(id = 1, fmuGroup = "Western hill rivers")
    Mockito.`when`(
            fmuService.findFreshwaterManagementUnitByLatAndLng(
                ArgumentMatchers.anyDouble(),
                ArgumentMatchers.anyDouble(),
                ArgumentMatchers.anyInt(),
            ),
        )
        .thenReturn(fmu)
    Mockito.`when`(twService.findTangataWhenuaInterestSitesForFMU(fmu))
        .thenReturn(setOf(TangataWhenuaSite(id = 1, location = "Tangata Whenua site 1")))

    mvc.perform(
            MockMvcRequestBuilders.get("/freshwater-management-units?lng=175.34&lat=-41")
                .contentType(MediaType.APPLICATION_JSON),
        )
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andExpect(MockMvcResultMatchers.jsonPath("$.tangataWhenuaSites").isNotEmpty())
        .andExpect(
            MockMvcResultMatchers.jsonPath("$.tangataWhenuaSites[0].location")
                .value("Tangata Whenua site 1"),
        )
        .andReturn()
  }

  @Test
  fun `Get all freshwater-management-units as feature collection`() {
    val fmu1 =
        FreshwaterManagementUnit(id = 1, fmuName1 = "fmu 1", boundary = TEMPLATE_FMU.boundary)
    val fmu2 =
        FreshwaterManagementUnit(id = 2, fmuName1 = "fmu 2", boundary = TEMPLATE_FMU.boundary)

    Mockito.`when`(fmuService.findAllFreshwaterManagementUnits())
        .thenReturn(
            listOf(
                fmu1,
                fmu2,
            ),
        )

    mvc.perform(
            MockMvcRequestBuilders.get("/freshwater-management-units/as-features")
                .contentType(MediaType.APPLICATION_JSON),
        )
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2))
        .andExpect(MockMvcResultMatchers.jsonPath("$.features.length()").value(2))
        .andExpect(MockMvcResultMatchers.jsonPath("$.features[0].id").value(1))
        .andExpect(
            MockMvcResultMatchers.jsonPath("$.features[0].properties.fmuName1").value("fmu 1"),
        )
        .andExpect(MockMvcResultMatchers.jsonPath("$.features[1].id").value(2))
        .andExpect(
            MockMvcResultMatchers.jsonPath("$.features[1].properties.fmuName1").value("fmu 2"),
        )
        .andReturn()
  }
}
