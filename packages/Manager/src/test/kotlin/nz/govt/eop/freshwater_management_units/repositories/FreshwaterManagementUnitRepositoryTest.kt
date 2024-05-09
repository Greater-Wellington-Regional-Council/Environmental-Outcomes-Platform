package nz.govt.eop.freshwater_management_units.repositories

import io.kotest.core.annotation.Ignored
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.ints.shouldBeGreaterThan
import io.kotest.matchers.shouldBe
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.transaction.annotation.Transactional

var TEMPLATE_FMU =
    FreshwaterManagementUnit(
        id = null,
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
        boundary =
            "{\"crs\": {\"type\": \"name\", \"properties\": {\"name\": \"EPSG:4326\"}}, \"type\": " +
                "\"Point\", \"coordinates\": [175.5391000006, -41.152800006]}",
        catchmentDescription = null,
    )

@SpringBootTest
@Transactional
@Ignored
class FreshwaterManagementUnitRepositoryTest
@Autowired
constructor(private val repository: FreshwaterManagementUnitRepository) :
    StringSpec({
      "should find freshwater management unit by lat and lng" {
        val lng = 175.35
        val lat = -41.175

        val foundFmu = repository.findAllByLngLat(lng, lat)

        foundFmu.count() shouldBe 1
        isFmuSameAs(foundFmu[0])
      }

      "should not find freshwater management unit for out of range lat and lng" {
        val lng = 100.23
        val lat = -41.9999
        val foundFmu = repository.findAllByLngLat(lng, lat)

        foundFmu.count() shouldBe 0
      }

      "should be able to find all freshwater management units" {
        repository.findAll().count() shouldBeGreaterThan 1
      }
    })

private fun isFmuSameAs(
    newFmu: FreshwaterManagementUnit,
    compareWith: FreshwaterManagementUnit = TEMPLATE_FMU,
    idShouldBe: Int? = null,
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
  newFmu.boundary?.substring(0, 5) shouldBe compareWith.boundary?.substring(0, 5)
}
