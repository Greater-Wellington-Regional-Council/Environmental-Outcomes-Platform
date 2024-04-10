package nz.govt.eop.farm_management_units

import io.kotest.core.spec.style.FunSpec
import io.kotest.extensions.spring.SpringExtension
import io.kotest.matchers.shouldBe
import nz.govt.eop.farm_management_units.models.FarmManagementUnit
import nz.govt.eop.farm_management_units.repositories.FarmManagementUnitRepository
import nz.govt.eop.farm_management_units.services.FarmManagementUnitService
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers.anyDouble
import org.mockito.ArgumentMatchers.anyInt
import org.mockito.Mockito.`when`
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class FarmManagementUnitServiceTest : FunSpec() {

  @Autowired
  private lateinit var fmuService: FarmManagementUnitService

  @MockBean
  private lateinit var fmuRepository: FarmManagementUnitRepository

  @Test
  fun `get farm-management-units by lng and lat`() {
      `when`(fmuRepository.findAllByLngLat(anyDouble(), anyDouble(), anyInt())).thenReturn(
        listOf(FarmManagementUnit(id = 1, fmuGroup = "Western hill rivers"))
      )

    val foundFmu = fmuService.findFarmManagementUnitByLatAndLng(1805287.5391000006, 5469337.152800006)

    foundFmu?.id shouldBe 1
    foundFmu?.fmuGroup shouldBe "Western hill rivers"
  }

  @Test
  fun `Get all farm-management-units`() {
    `when`(fmuRepository.findAll()).thenReturn(
      listOf(FarmManagementUnit(id = 1, geom = TEMPLATE_FMU.geom), FarmManagementUnit(id = 2, geom = TEMPLATE_FMU.geom))
    )

    val fmus = fmuService.findAllFarmManagementUnits()

    fmus.size shouldBe 2
    fmus[0].geom?.substring(0, 5) shouldBe "{\"crs"
  }
}
