package nz.govt.eop.farm_management_units

import io.kotest.core.spec.style.FunSpec
import io.kotest.extensions.spring.SpringExtension
import io.mockk.mockk
import nz.govt.eop.farm_management_units.controllers.FarmManagementUnitsController
import nz.govt.eop.farm_management_units.models.FarmManagementUnit
import nz.govt.eop.farm_management_units.services.FarmManagementUnitService
import nz.govt.eop.plan_limits.Queries
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers.any
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers
import java.time.LocalDate

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class FarmManagementUnitsControllerTest(@Autowired val mvc: MockMvc) {

  @MockBean
  private lateinit var fmuService: FarmManagementUnitService

  @Test
  fun `Get farm-management-units-lng-lat`() {
    // mock db query
    `when`(fmuService.findFarmManagementUnitByLatAndLng(any(), any()))
      .thenReturn(listOf(FarmManagementUnit(id = 1, fmuGroup = "Western hill rivers")))
    mvc.perform(
      MockMvcRequestBuilders.get("/farm-management-units?lng=1805287.5391000006&lat=5469337.152800006")
        .contentType(MediaType.APPLICATION_JSON)
    )
      .andExpect(MockMvcResultMatchers.status().isOk)
  }
}