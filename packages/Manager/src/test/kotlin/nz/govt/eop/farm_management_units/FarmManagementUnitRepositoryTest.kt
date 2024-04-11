package nz.govt.eop.farm_management_units

import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.ints.shouldBeGreaterThan
import io.kotest.matchers.shouldBe
import nz.govt.eop.farm_management_units.models.FarmManagementUnit
import nz.govt.eop.farm_management_units.repositories.FarmManagementUnitRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

var TEMPLATE_FMU =
    FarmManagementUnit(
        id = 99999,
        gid = null,
        objectId = 25.0,
        fmuNo = 11,
        location = "GWRC",
        fmuName1 = "Otukura Stream",
        fmuGroup = "Valley floor streams",
        shapeLeng = 75553.3101648,
        shapeArea = 9.95337776444E7,
        byWhen = "2040",
        fmuIssue = "E.coli",
        topFmuGrp = "Parkvale Stream",
        ecoliBase = "D *",
        periBase = "-",
        periObj = "B",
        aToxBase = "B *",
        aToxObj = "A",
        nToxBase = "B",
        nToxObj = "A",
        phytoBase = null,
        phytoObj = null,
        tnBase = null,
        tnObj = null,
        tpBase = null,
        tpObj = null,
        tliBase = null,
        tliObj = null,
        tssBase = null,
        tssObj = null,
        macroBase = null,
        macroObj = null,
        mciBase = "-",
        mciObj = "Fair",
        ecoliObj = "C",
        geom =
            "{\"crs\": { \"type\": \"name\", \"properties\": { \"name\": \"EPSG:4326\" } }, " +
                "\"type\": \"MultiPolygon\", \"coordinates\": [[[[175.425931, -41.071014], [175.427715, -41.070976]]]]}")

@SpringBootTest
@Transactional
class FarmManagementUnitRepositoryTest
@Autowired
constructor(private val repository: FarmManagementUnitRepository) :
    StringSpec({
      "should find farm management unit by lat and lng" {
        val lng = 175.35
        val lat = -41.175
        val foundFmu = repository.findAllByLngLat(lng, lat)

        println(foundFmu)

        foundFmu.count() shouldBe 1
        isFmuSameAs(foundFmu[0])
      }

      "should not find farm management unit for out of range lat and lng" {
        val lng = 100.23
        val lat = -41.9999
        val foundFmu = repository.findAllByLngLat(lng, lat)

        foundFmu.count() shouldBe 0
      }

      "should be able to find all farm management units" {
        repository.findAll().count() shouldBeGreaterThan 1
      }
    })

private fun isFmuSameAs(
    newFmu: FarmManagementUnit,
    compareWith: FarmManagementUnit = TEMPLATE_FMU,
    idShouldBe: Int? = null
) {
  if (idShouldBe != null) {
    newFmu.id shouldBe idShouldBe
  }

  newFmu.gid shouldBe compareWith.gid
  newFmu.objectId shouldBe compareWith.objectId
  newFmu.fmuNo shouldBe compareWith.fmuNo
  newFmu.location shouldBe compareWith.location
  newFmu.fmuName1 shouldBe compareWith.fmuName1
  newFmu.fmuGroup shouldBe compareWith.fmuGroup
  newFmu.shapeLeng shouldBe compareWith.shapeLeng
  newFmu.shapeArea shouldBe compareWith.shapeArea
  newFmu.byWhen shouldBe compareWith.byWhen
  newFmu.fmuIssue shouldBe compareWith.fmuIssue
  newFmu.topFmuGrp shouldBe compareWith.topFmuGrp
  newFmu.geom?.substring(0, 5) shouldBe compareWith.geom?.substring(0, 5)
}
