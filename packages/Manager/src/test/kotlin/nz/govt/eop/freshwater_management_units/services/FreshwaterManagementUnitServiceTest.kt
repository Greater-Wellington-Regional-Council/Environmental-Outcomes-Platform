package nz.govt.eop.freshwater_management_units.services

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.repositories.FreshwaterManagementUnitRepository
import nz.govt.eop.freshwater_management_units.repositories.TEMPLATE_FMU
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class FreshwaterManagementUnitServiceTest : FunSpec() {
  @Autowired private lateinit var fmuService: FreshwaterManagementUnitService

  @MockBean private lateinit var fmuRepository: FreshwaterManagementUnitRepository

  @Test
  fun `get freshwater-management-units by lng and lat`() {
    Mockito.`when`(
            fmuRepository.findAllByLngLat(
                ArgumentMatchers.anyDouble(),
                ArgumentMatchers.anyDouble(),
                ArgumentMatchers.anyInt(),
            ),
        )
        .thenReturn(listOf(FreshwaterManagementUnit(id = 1, fmuGroup = "Western hill rivers")))

    val foundFmu =
        fmuService.findFreshwaterManagementUnitByLatAndLng(1805287.5391000006, 5469337.152800006)

    foundFmu?.id shouldBe 1
    foundFmu?.fmuGroup shouldBe "Western hill rivers"
  }

  @Test
  fun `Get all freshwater-management-units`() {
    Mockito.`when`(fmuRepository.findAll())
        .thenReturn(
            listOf(
                FreshwaterManagementUnit(id = 1, boundary = TEMPLATE_FMU.boundary),
                FreshwaterManagementUnit(id = 2, boundary = TEMPLATE_FMU.boundary),
            ),
        )

    val fmus = fmuService.findAllFreshwaterManagementUnits()

    fmus.size shouldBe 2
    fmus[0].boundary?.substring(0, 5) shouldBe "{\"crs"
  }
}
