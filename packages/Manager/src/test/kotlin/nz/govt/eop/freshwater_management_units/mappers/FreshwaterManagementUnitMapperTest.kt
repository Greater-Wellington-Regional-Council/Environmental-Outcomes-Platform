package nz.govt.eop.freshwater_management_units.mappers

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import nz.govt.eop.freshwater_management_units.models.FarmPlanInfo
import org.geojson.Feature
import org.geojson.Point

class FreshwaterManagementUnitMapperTest :
    FunSpec({
      val mapper = FreshwaterManagementUnitMapper()

      test("fromFeature() should correctly convert a GeoJSON Feature to FreshwaterManagementUnit") {
        val feature =
            Feature().apply {
              geometry = Point(175.538, -41.153) // Sample Point Geometry
              properties =
                  mapOf(
                      "FID" to 123,
                      "OBJECTID" to 456,
                      "FMU_No" to 789,
                      "FMU_Name1" to "Test FMU",
                      "FMU_Group" to "Test Group",
                      "Location" to "Test Location",
                      "By_when" to "2030",
                      "FMU_issue" to "Water Quality",
                      "Top_FMUGrp" to "Main Group",
                      "Ecoli_base" to "B",
                      "Ecoli_Obj" to "A",
                      "Shape__Area" to 1000.0,
                      "Shape__Length" to 500.0,
                      "Implementation" to "Conservation Efforts",
                      "cultural_significance" to "High",
                      "Other" to "Additional Info",
                      "values_priorities_outcomes" to "Sustainability")
            }

        val fmu = mapper.fromFeature(feature)

        fmu.gid shouldBe 123
        fmu.objectId shouldBe 456.0
        fmu.fmuNo shouldBe 789
        fmu.fmuName1 shouldBe "Test FMU"
        fmu.fmuGroup shouldBe "Test Group"
        fmu.location shouldBe "Test Location"
        fmu.byWhen shouldBe "2030"
        fmu.fmuIssue shouldBe "Water Quality"
        fmu.topFmuGrp shouldBe "Main Group"
        fmu.ecoliBase shouldBe "B"
        fmu.ecoliObj shouldBe "A"
        fmu.shapeArea shouldBe 1000.0
        fmu.shapeLeng shouldBe 500.0
        fmu.farmPlanInfo shouldBe
            FarmPlanInfo(
                implementationIdeas = "Conservation Efforts",
                culturalOverview = "High",
                otherInfo = "Additional Info",
                vpo = "Sustainability")

        fmu.geom!!.srid shouldBe 4326
      }
    })
