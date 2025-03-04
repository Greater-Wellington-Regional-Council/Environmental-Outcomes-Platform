package nz.govt.eop.freshwater_management_units.models

import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import nz.govt.eop.freshwater_management_units.repositories.FreshwaterManagementUnitRepository
import org.geojson.FeatureCollection
import org.locationtech.jts.geom.Geometry
import org.locationtech.jts.io.geojson.GeoJsonReader
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.core.io.ClassPathResource
import org.springframework.test.context.ActiveProfiles

fun createUnsavedFMU(): FreshwaterManagementUnit {
  val objectMapper = jacksonObjectMapper()

  val geoJsonFile = ClassPathResource("fmus_test_response.json").file
  val mockFeatureResponse: FeatureCollection = objectMapper.readValue(geoJsonFile)

  val geometryJson: String =
      objectMapper.writeValueAsString(
          mockFeatureResponse.features
              .find { feature -> feature.properties["FID"] == 20 }!!
              .geometry)

  val geometry =
      GeoJsonReader().read(geometryJson).also { g: Geometry ->
        g.srid = FreshwaterManagementUnit.DEFAULT_SRID
      }

  return FreshwaterManagementUnit(
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
      geom = geometry,
      catchmentDescription = "Description of a catchment",
      farmPlanInfo =
          FarmPlanInfo().apply {
            implementationIdeas = "Action ideas"
            culturalOverview = "Cultural overview"
            vpo = "vpo"
            otherInfo = "Other info"
            catchmentOverview = "Catchment overview"
          },
  )
}

@SpringBootTest
@ActiveProfiles("test")
class FreshwaterManagementUnitTest(
    @Autowired private val repository: FreshwaterManagementUnitRepository
) :
    FunSpec({
      test("build a freshwater management unit") {
        val unsavedFMU = createUnsavedFMU()
        val fmu = repository.save(unsavedFMU)

        val savedFmu = repository.findById(fmu.id!!).get()

        savedFmu.fmuName1 shouldBe unsavedFMU.fmuName1

        savedFmu.farmPlanInfo.catchmentOverview shouldBe unsavedFMU.farmPlanInfo.catchmentOverview
        savedFmu.farmPlanInfo.culturalOverview shouldBe unsavedFMU.farmPlanInfo.culturalOverview
        savedFmu.farmPlanInfo.otherInfo shouldBe unsavedFMU.farmPlanInfo.otherInfo
        savedFmu.farmPlanInfo.vpo shouldBe unsavedFMU.farmPlanInfo.vpo
        savedFmu.farmPlanInfo.implementationIdeas shouldBe
            unsavedFMU.farmPlanInfo.implementationIdeas

        savedFmu.geom shouldBe unsavedFMU.geom
        savedFmu.boundary shouldNotBe null
      }

      test(
          "toFeature() should correctly convert FreshwaterManagementUnit to FreshwaterManagementUnitFeature") {
            val fmu = repository.findAll().find { fmu -> fmu.fmuName1 == "Parkvale Stream" }!!
            val feature = fmu.toFeature()

            feature.id shouldBe fmu.id
            feature.geometry shouldNotBe null
            feature.properties["fmuName1"] shouldBe fmu.fmuName1
            feature.properties["fmuGroup"] shouldBe fmu.fmuGroup
            feature.properties["shapeLeng"] shouldBe fmu.shapeLeng
            feature.properties["shapeArea"] shouldBe fmu.shapeArea
          }
    })
