package nz.govt.eop.freshwater_management_units

import io.kotest.core.spec.style.FunSpec
import nz.govt.eop.freshwater_management_units.repositories.FreshwaterManagementUnitRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@SpringBootTest
@ActiveProfiles("test")
class FreshwaterManagementUnitTest(
    @Autowired val freshwaterManagementUnitRepository: FreshwaterManagementUnitRepository,
) :
    FunSpec({
      //            test("catchment should be Parkvale Stream and Tributaries") {
      //                val fmu = freshwaterManagementUnitRepository.findAll().first()
      //                fmu.catchmentDescription shouldContain "Parkvale"
      //            }
    })
