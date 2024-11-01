package nz.govt.eop.freshwater_management_units.controllers

import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.models.TangataWhenuaSite
import nz.govt.eop.freshwater_management_units.models.toFeatureCollection
import nz.govt.eop.freshwater_management_units.repositories.TEMPLATE_FMU
import nz.govt.eop.freshwater_management_units.services.FreshwaterManagementUnitService
import nz.govt.eop.freshwater_management_units.services.TangataWhenuaSiteService
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.http.MediaType
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders
import org.springframework.test.web.servlet.result.MockMvcResultMatchers

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class FreshwaterManagementUnitsControllerTest {

  @Autowired private lateinit var mvc: MockMvc

  @MockBean private lateinit var fmuService: FreshwaterManagementUnitService

  @MockBean private lateinit var twService: TangataWhenuaSiteService

  @Test
  fun `Get freshwater-management-units-lng-lat`() {
    val ttwLocationValues = listOf("site1", "site2", "site3")
    val fmu =
        FreshwaterManagementUnit(
            id = 1,
            fmuGroup = "Western hill rivers",
            tangataWhenuaSites =
                listOf(
                        TangataWhenuaSite(
                            id = 1,
                            location = "Tangata Whenua site 1",
                            locationValues = ttwLocationValues,
                            geomGeoJson =
                                "{\"type\":\"MultiPolygon\",\"coordinates\":[[[[175.34,-41],[175.35,-41],[175.35,-40.99],[175.34,-40.99],[175.34,-41]]]]}",
                            source_name = source_name
                        ))
                    .toFeatureCollection())

    // Mock the FMU service to return an FMU when querying by lng/lat
    Mockito.`when`(
            fmuService.findFreshwaterManagementUnitByLatAndLng(
                ArgumentMatchers.anyDouble(),
                ArgumentMatchers.anyDouble(),
                ArgumentMatchers.anyInt(),
                ArgumentMatchers.anyBoolean()))
        .thenReturn(fmu)

    Mockito.`when`(twService.findTangataWhenuaInterestSitesForFMU(fmu))
        .thenReturn(
            listOf(
                TangataWhenuaSite(
                    id = 1,
                    location = "Tangata Whenua site 1",
                    locationValues = ttwLocationValues,
                    geomGeoJson =
                        "{\"type\":\"MultiPolygon\",\"coordinates\":[[[[175.34,-41],[175.35,-41],[175.35,-40.99],[175.34,-40.99],[175.34,-41]]]]}",
                    source_name = source_name
                )))

    mvc.perform(
            MockMvcRequestBuilders.get(
                    "/freshwater-management-units/by-lng-and-lat?lng=175.34&lat=-41")
                .contentType(MediaType.APPLICATION_JSON),
        )
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andExpect(MockMvcResultMatchers.jsonPath("$.tangataWhenuaSites").isNotEmpty)
        .andExpect(
            MockMvcResultMatchers.jsonPath("$.tangataWhenuaSites.features[0].properties.location")
                .value("Tangata Whenua site 1"),
        )
        .andExpect(
            MockMvcResultMatchers.jsonPath(
                    "$.tangataWhenuaSites.features[0].properties.locationValues")
                .value("site1,site2,site3"),
        )
        .andReturn()
  }

  @Test
  fun `Get all freshwater-management-units as feature collection`() {
    val fmu1 =
        FreshwaterManagementUnit(id = 1, fmuName1 = "fmu 1", boundary = TEMPLATE_FMU.boundary)
    val fmu2 =
        FreshwaterManagementUnit(id = 2, fmuName1 = "fmu 2", boundary = TEMPLATE_FMU.boundary)

    Mockito.`when`(fmuService.findAllFreshwaterManagementUnits(ArgumentMatchers.anyBoolean()))
        .thenReturn(
            listOf(
                fmu1,
                fmu2,
            ),
        )

    mvc.perform(
            MockMvcRequestBuilders.get("/freshwater-management-units?format=features")
                .contentType(MediaType.APPLICATION_JSON),
        )
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andExpect(MockMvcResultMatchers.jsonPath("$.features.length()").value(2))
        .andExpect(MockMvcResultMatchers.jsonPath("$.features[0].id").value(1))
        .andExpect(
            MockMvcResultMatchers.jsonPath("$.features[0].properties.fmuName1").value("fmu 1"),
        )
        .andExpect(MockMvcResultMatchers.jsonPath("$.features[1].id").value(2))
        .andExpect(
            MockMvcResultMatchers.jsonPath("$.features[1].properties.fmuName1").value("fmu 2"),
        )
        .andReturn()
  }

  @Test
  fun `Search freshwater-management-units intersecting a shape`() {
    val geoJson =
        """
        {
            "type": "Polygon",
            "coordinates": [[[175.34, -41], [175.35, -41], [175.35, -40.99], [175.34, -40.99], [175.34, -41]]]
        }
        """

    val fmu1 =
        FreshwaterManagementUnit(id = 1, fmuName1 = "fmu 1", boundary = TEMPLATE_FMU.boundary)
    val fmu2 =
        FreshwaterManagementUnit(id = 2, fmuName1 = "fmu 2", boundary = TEMPLATE_FMU.boundary)

    Mockito.`when`(
            fmuService.findFreshwaterManagementUnitsByShape(
                ArgumentMatchers.anyString(), ArgumentMatchers.anyBoolean()))
        .thenReturn(listOf(fmu1, fmu2))

    mvc.perform(
            MockMvcRequestBuilders.post(
                    "/freshwater-management-units/search-for-freshwater-managements-intersecting")
                .contentType(MediaType.APPLICATION_JSON)
                .content(geoJson),
        )
        .andExpect(MockMvcResultMatchers.status().isOk)
        .andExpect(MockMvcResultMatchers.jsonPath("$.length()").value(2))
        .andExpect(MockMvcResultMatchers.jsonPath("$.[0].id").value(1))
        .andExpect(MockMvcResultMatchers.jsonPath("$.[0].fmuName1").value("fmu 1"))
        .andExpect(MockMvcResultMatchers.jsonPath("$.[1].id").value(2))
        .andExpect(MockMvcResultMatchers.jsonPath("$.[1].fmuName1").value("fmu 2"))
        .andReturn()
  }
}
