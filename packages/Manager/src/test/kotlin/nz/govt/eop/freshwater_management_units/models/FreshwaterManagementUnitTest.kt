package nz.govt.eop.freshwater_management_units.models

import io.kotest.core.annotation.Ignored
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.string.shouldContain
import nz.govt.eop.freshwater_management_units.repositories.FreshwaterManagementUnitRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("test")
@Ignored
class FreshwaterManagementUnitTest(
    @Autowired val freshwaterManagementUnitRepository: FreshwaterManagementUnitRepository,
) :
    FunSpec({
      test("catchment should be Parkvale Stream and Tributaries") {
        val fmu = freshwaterManagementUnitRepository.findAll().first()
        fmu.catchmentDescription shouldContain "Parkvale"
      }
    })
