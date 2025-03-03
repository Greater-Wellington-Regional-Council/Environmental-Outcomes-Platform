package nz.govt.eop.freshwater_management_units.tasks

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import nz.govt.eop.freshwater_management_units.repositories.FreshwaterManagementUnitRepository
import nz.govt.eop.freshwater_management_units.services.FreshwaterManagementUnitService
import nz.govt.eop.tasks.FreshwaterManagementUnitFetcher
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class FreshwaterManagementUnitsFetcherTest :
    FunSpec({
      val fmuService =
          mockk<FreshwaterManagementUnitService>(relaxed = true) {
            every { loadFromArcGIS() } returns Unit
          }

      val freshwaterManagementUnitFetcher = FreshwaterManagementUnitFetcher(fmuService)

      test("updateFreshwaterManagementUnits should call fetchFreshwaterManagementUnits") {
        freshwaterManagementUnitFetcher.updateFreshwaterManagementUnits()
        verify { fmuService.loadFromArcGIS() }
      }
    })

@ActiveProfiles("test")
@SpringBootTest
class FreshwaterManagementUnitsFetcherWriteTest(
    private val rmuRepository: FreshwaterManagementUnitRepository,
    private val fmuService: FreshwaterManagementUnitService
) :
    FunSpec({
      val freshwaterManagementUnitsFetcher = FreshwaterManagementUnitFetcher(fmuService)

      test("updateFreshwaterManagementUnits should call fetchFreshwaterManagementUnits") {
        freshwaterManagementUnitsFetcher.updateFreshwaterManagementUnits()
      }

      rmuRepository.count() shouldBe 26
    })
