package nz.govt.eop.farm_management_units

import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.ints.shouldBeGreaterThan
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import nz.govt.eop.farm_management_units.models.FarmManagementUnit
import nz.govt.eop.farm_management_units.repositories.FarmManagementUnitRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

@SpringBootTest
@Transactional
class FarmManagementUnitRepositoryTest
@Autowired
constructor(private val repository: FarmManagementUnitRepository) : StringSpec({
  "should find farm management unit by lat and lng" {
    val fmu =
      FarmManagementUnit(
        id = null,
        gid = null,
        objectId = 4.0,
        fmuNo = 2,
        location = "GWRC",
        fmuName1 = "Waingawa River",
        fmuGroup = "Western hill rivers",
        shapeLeng = 139987.172962,
        shapeArea = 1.49773335075E8,
        byWhen = "Maintain",
        fmuIssue = null,
        topFmuGrp = "Upper Ruamanhanga and Mangatarere"
      )

    val lng = 1805287.5391000006
    val lat = 5469337.152800006
    val foundFmu = repository.findAllByLngLat(lng, lat)

    foundFmu.count() shouldBeGreaterThan 0

    foundFmu[0].id shouldNotBe null
    foundFmu[0].gid shouldBe fmu.gid
    foundFmu[0].objectId shouldBe fmu.objectId
    foundFmu[0].fmuNo shouldBe fmu.fmuNo
    foundFmu[0].location shouldBe fmu.location
    foundFmu[0].fmuName1 shouldBe fmu.fmuName1
    foundFmu[0].fmuGroup shouldBe fmu.fmuGroup
    foundFmu[0].shapeLeng shouldBe fmu.shapeLeng
    foundFmu[0].shapeArea shouldBe fmu.shapeArea
    foundFmu[0].byWhen shouldBe fmu.byWhen
    foundFmu[0].fmuIssue shouldBe fmu.fmuIssue
    foundFmu[0].topFmuGrp shouldBe fmu.topFmuGrp
  }
})
