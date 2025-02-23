package nz.govt.eop.freshwater_management_units.repositories

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.node.ObjectNode
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import nz.govt.eop.FreshwaterManagementUnitsDataSources
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.services.FreshwaterManagementUnitService
import nz.govt.eop.utils.UrlBasedDataSources.Source
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers
import org.mockito.Mockito
import org.mockito.MockitoAnnotations
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.util.ReflectionTestUtils
import org.springframework.web.client.RestTemplate

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

private val objectMapper = ObjectMapper()

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class FreshwaterManagementUnitServiceTest : FunSpec() {

    @Autowired
    private lateinit var fmuService: FreshwaterManagementUnitService

    @MockBean
    private lateinit var fmuRepository: FreshwaterManagementUnitRepository

    @MockBean
    private lateinit var restTemplate: RestTemplate

    @BeforeEach
    fun setup() {
        MockitoAnnotations.openMocks(this)

        val testDataSources = FreshwaterManagementUnitsDataSources().apply {
            sources = listOf(
                Source().apply {
                    name = "Schedule B"
                    urls = listOf("http://test.url1")
                }
            )
        }

        ReflectionTestUtils.setField(
            fmuService,
            "freshwaterManagementUnitDataSources",
            testDataSources
        )
    }

    @Test
    fun `get freshwater-management-units by lng and lat`() {
        Mockito.`when`(
            fmuRepository.findAllByLngLat(
                ArgumentMatchers.anyDouble(),
                ArgumentMatchers.anyDouble(),
                ArgumentMatchers.anyInt()
            )
        ).thenReturn(
            listOf(
                FreshwaterManagementUnit(
                    id = 1,
                    fmuGroup = "Western hill rivers",
                    boundary = TEMPLATE_FMU.boundary
                )
            )
        )

        val foundFmu =
            fmuService.findFreshwaterManagementUnitByLatAndLng(
                1805287.5391000006,
                5469337.152800006
            )

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

        val fmus = TEMPLATE_FMU.boundary?.let {
            fmuService.findFreshwaterManagementUnitsByShape(it)
        }

        fmus.shouldNotBe(null)
        fmus!!.size shouldBe 2

        val boundaryJsonNode = fmus[0].boundary?.let { objectMapper.readTree(it) as ObjectNode }
        boundaryJsonNode?.get("type")?.asText() shouldBe "MultiPolygon"
    }

    @Test
    fun `Delete all freshwater-management-units`() {
        fmuService.deleteAll()
        Mockito.verify(fmuRepository, Mockito.times(1)).deleteAll()
    }
}