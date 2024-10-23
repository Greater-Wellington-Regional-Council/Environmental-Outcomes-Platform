package nz.govt.eop.freshwater_management_units.services

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
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

val objectMapper = ObjectMapper()

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
                  ArgumentMatchers.anyInt()))
          .thenReturn(listOf(FreshwaterManagementUnit(id = 1, fmuGroup = "Western hill rivers", boundary = TEMPLATE_FMU.boundary)))

      val foundFmu =
          fmuService.findFreshwaterManagementUnitByLatAndLng(1805287.5391000006,
   5469337.152800006)

      // Verify the expected results
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
    val boundaryJsonNode = fmus[0].boundary?.let { objectMapper.readTree(it) as ObjectNode }

    boundaryJsonNode?.get("type")?.asText() shouldBe "MultiPolygon"
  }

  @Test
  fun `Get freshwater-management-units by shape`() {
    Mockito.`when`(fmuRepository.findAllByGeoJson(ArgumentMatchers.anyString()))
        .thenReturn(
            listOf(
                FreshwaterManagementUnit(id = 1, boundary = TEMPLATE_FMU.boundary),
                FreshwaterManagementUnit(id = 2, boundary = TEMPLATE_FMU.boundary),
            ),
        )

    val fmus = TEMPLATE_FMU.boundary?.let { fmuService.findFreshwaterManagementUnitsByShape(it) }

    fmus.shouldNotBe(null)
    fmus!!.size shouldBe 2

    val boundaryJsonNode = fmus[0].boundary?.let { objectMapper.readTree(it) as ObjectNode }

    boundaryJsonNode?.get("type")?.asText() shouldBe "MultiPolygon"
  }
}
