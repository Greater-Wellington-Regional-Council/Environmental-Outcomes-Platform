package nz.govt.eop.freshwater_management_units

import io.kotest.core.spec.style.FunSpec
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.services.FreshwaterManagementUnitService
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
class FreshwaterManagementUnitsControllerTest(
    @Autowired val mvc: MockMvc,
) : FunSpec() {
  @MockBean private lateinit var fmuService: FreshwaterManagementUnitService

  @Test
  fun `Get freshwater-management-units-lng-lat`() {
    `when`(fmuService.findFreshwaterManagementUnitByLatAndLng(anyDouble(), anyDouble(), anyInt()))
        .thenReturn(FreshwaterManagementUnit(id = 1, fmuGroup = "Western hill rivers"))

    mvc.perform(
            get("/freshwater-management-units?lng=175.34&lat=-41")
                .contentType(MediaType.APPLICATION_JSON),
        )
        .andExpect(status().isOk)
        .andReturn()
  }

  @Test
  fun `Get all freshwater-management-units as feature collection`() {
    val fmu1 =
        FreshwaterManagementUnit(id = 1, fmuName1 = "fmu 1", boundary = TEMPLATE_FMU.boundary)
    val fmu2 =
        FreshwaterManagementUnit(id = 2, fmuName1 = "fmu 2", boundary = TEMPLATE_FMU.boundary)

    `when`(fmuService.findAllFreshwaterManagementUnits())
        .thenReturn(
            listOf(
                fmu1,
                fmu2,
            ),
        )

    mvc.perform(
            get("/freshwater-management-units/as-features").contentType(MediaType.APPLICATION_JSON),
        )
        .andExpect(status().isOk)
        .andExpect(jsonPath("$.length()").value(2))
        .andExpect(jsonPath("$.features.length()").value(2))
        .andExpect(jsonPath("$.features[0].id").value(1))
        .andExpect(jsonPath("$.features[0].properties.fmuName1").value("fmu 1"))
        .andExpect(jsonPath("$.features[1].id").value(2))
        .andExpect(jsonPath("$.features[1].properties.fmuName1").value("fmu 2"))
        .andReturn()
  }
}
