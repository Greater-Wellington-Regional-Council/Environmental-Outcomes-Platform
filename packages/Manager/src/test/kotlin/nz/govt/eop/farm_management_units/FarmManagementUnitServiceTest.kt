package nz.govt.eop.farm_management_units

import io.kotest.core.spec.style.FunSpec
import io.kotest.extensions.spring.SpringExtension
import nz.govt.eop.farm_management_units.controllers.FarmManagementUnitsController
import nz.govt.eop.farm_management_units.models.FarmManagementUnit
import nz.govt.eop.farm_management_units.services.FarmManagementUnitService
import org.mockito.ArgumentMatchers.anyDouble
import org.mockito.ArgumentMatchers.anyInt
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.get

@WebMvcTest(controllers = [FarmManagementUnitsController::class])
class FarmManagementUnitControllerTest : FunSpec() {

  @Autowired
  private lateinit var mockMvc: MockMvc

  @MockBean
  private lateinit var fmuService: FarmManagementUnitService

  init {
    extension(SpringExtension)

    beforeTest {
      `when`(fmuService.findFarmManagementUnitByLatAndLng(anyDouble(), anyDouble(), anyInt())).thenReturn(
        listOf(FarmManagementUnit(id = 1, fmuGroup = "Western hill rivers"))
      )
    }

    test("Get /farm-management-units?lng=1805287.5391000006&lat=5469337.152800006 should return the FarmManagementUnit") {
      mockMvc
        .get("/farm-management-units?lng=1805287.5391000006&lat=5469337.152800006")
        .andExpect {
          status { isOk() }
          jsonPath("$.[?(@.id == 1)]") { exists() }
          jsonPath("$.[?(@.fmuGroup == \"Western hill rivers\")]") { exists() }
        }
        .andReturn()
    }
  }
}
