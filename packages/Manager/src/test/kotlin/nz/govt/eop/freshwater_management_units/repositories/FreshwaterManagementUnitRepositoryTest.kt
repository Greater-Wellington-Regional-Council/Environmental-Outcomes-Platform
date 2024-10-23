package nz.govt.eop.freshwater_management_units.repositories

import com.fasterxml.jackson.databind.node.ObjectNode
import io.kotest.core.spec.style.StringSpec
import io.kotest.matchers.shouldBe
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.services.objectMapper
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles
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
        """
        {
            "type": "MultiPolygon",
            "coordinates": [
            [
                [
                    [175.538, -41.153],
                    [175.540, -41.153],
                    [175.540, -41.151],
                    [175.538, -41.151],
                    [175.538, -41.153]
                ]
            ]
            ],
            "crs": {
            "type": "name",
            "properties": {
            "name": "EPSG:4326"
        }
        }
        }
        """
            .trimIndent(),
        catchmentDescription = null,
    )

@SpringBootTest
@Transactional
@ActiveProfiles("test")
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

        "should find freshwater management unit by GeoJSON geometry" {
            val geoJson =
                """
            {
              "type": "FeatureCollection",
              "features": [
                {
                  "type": "Feature",
                  "geometry": {
                    "type": "Polygon",
                    "coordinates": [
                      [
                        [175.349, -41.176],
                        [175.351, -41.176],
                        [175.351, -41.174],
                        [175.349, -41.174],
                        [175.349, -41.176]
                      ]
                    ]
                  },
                  "properties": {}
                }
              ]
            }
        """
                    .trimIndent()

            val foundFmu = repository.findAllByGeoJson(geoJson)

            foundFmu.count() shouldBe 1
            isFmuSameAs(foundFmu[0])
        }

        "should not find freshwater management unit with non-intersecting GeoJSON geometry" {
            val geoJson =
                """
                        {
                          "type": "FeatureCollection",
                          "features": [
                            {
                              "type": "Feature",
                              "geometry": {
                                "type": "Polygon",
                                "coordinates": [
                                  [
                  [172.0, -1.0],
                  [172.1, -1.0],
                  [172.1, -0.9],
                  [172.0, -0.9],
                  [172.0, -1.0]
                                  ]
                                ]
                              },
                              "properties": {}
                            }
                          ]
                        }
        """
                    .trimIndent()

            val foundFmu = repository.findAllByGeoJson(geoJson)

            foundFmu.count() shouldBe 0
        }

        // Any additional test cases...
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

    val actualBoundaryJsonNode = newFmu.boundary?.let { objectMapper.readTree(it) as ObjectNode }
    val expectedBoundaryJsonNode = compareWith.boundary?.let { objectMapper.readTree(it) as ObjectNode }

    actualBoundaryJsonNode?.get("type")?.asText() shouldBe expectedBoundaryJsonNode?.get("type")?.asText()
}
