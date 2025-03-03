package nz.govt.eop.freshwater_management_units.services

import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.KotlinModule
import com.fasterxml.jackson.module.kotlin.readValue
import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.longs.shouldBeGreaterThan
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import java.net.URI
import nz.govt.eop.FreshwaterManagementUnitsDataSources
import nz.govt.eop.freshwater_management_units.mappers.FreshwaterManagementUnitMapper
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.models.toFeatureCollection
import nz.govt.eop.freshwater_management_units.models.toGeoJson
import nz.govt.eop.freshwater_management_units.repositories.FreshwaterManagementUnitRepository
import nz.govt.eop.utils.UrlBasedDataSources
import org.geojson.FeatureCollection
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Disabled
import org.junit.jupiter.api.Test
import org.mockito.ArgumentMatchers
import org.mockito.Mockito
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.boot.test.mock.mockito.MockBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Import
import org.springframework.context.annotation.Primary
import org.springframework.core.io.ClassPathResource
import org.springframework.http.ResponseEntity
import org.springframework.test.context.ActiveProfiles
import org.springframework.web.client.RestTemplate

@TestConfiguration
class TestConfig {
  @Bean
  @Primary
  fun objectMapper(): ObjectMapper {
    return ObjectMapper()
        .registerModule(KotlinModule.Builder().build())
        .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
  }
}

@ActiveProfiles("test")
@SpringBootTest
class FreshwaterManagementUnitServiceTest : FunSpec() {

  @Autowired private lateinit var fmuService: FreshwaterManagementUnitService

  @Autowired
  private lateinit var fmuRepository: FreshwaterManagementUnitRepository // Mocked Repository

  @MockBean private lateinit var restTemplate: RestTemplate

  @Test
  fun `get freshwater-management-units by lng and lat`() {
    val foundFmu =
        fmuService.findFreshwaterManagementUnitByLatAndLng(175.600289, -41.018856, 4326, true)

    foundFmu shouldNotBe null
  }

  @Test
  fun `Get all freshwater-management-units`() {
    val fmus = fmuService.findAllFreshwaterManagementUnits()
    fmus.size shouldBe fmuRepository.findAll().size
    fmus.size shouldNotBe 0
  }

  @Test
  fun `Get freshwater-management-units by shape`() {
    val savedFMU =
        fmuRepository.findAll().find { fmu: FreshwaterManagementUnit ->
          fmu.fmuName1 == "Parkvale Stream"
        }
    val shape = listOf(savedFMU!!).toFeatureCollection().toGeoJson()
    val fmus = fmuService.findFreshwaterManagementUnitsByShape(shape)

    fmus.size shouldBe 6
    fmus.find { fmu: FreshwaterManagementUnit -> fmu.fmuName1 == savedFMU.fmuName1 } shouldNotBe
        null
  }

  @Test
  @Disabled
  fun `Load freshwater-management-units from ArcGIS Full Test`() {
    fmuRepository.deleteAll()
    fmuRepository.count() shouldBe 0
    fmuService.loadFromArcGIS()
    fmuRepository.count() shouldBeGreaterThan 0
  }
}

@Import(TestConfig::class)
@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class FreshwaterManagementUnitServiceWithMockedRepositoryTest {

  @MockBean private lateinit var fmuRepository: FreshwaterManagementUnitRepository

  @MockBean private lateinit var restTemplate: RestTemplate

  @MockBean private lateinit var mapper: FreshwaterManagementUnitMapper

  @MockBean private lateinit var twsService: TangataWhenuaSiteService

  @MockBean
  private lateinit var freshwaterManagementUnitsDataSources: FreshwaterManagementUnitsDataSources

  @Autowired private lateinit var fmuService: FreshwaterManagementUnitService

  @BeforeEach
  fun setup() {
    Mockito.reset(
        fmuRepository, restTemplate, mapper, twsService, freshwaterManagementUnitsDataSources)

    Mockito.`when`(freshwaterManagementUnitsDataSources.sources)
        .thenReturn(
            listOf(
                UrlBasedDataSources.Source().apply {
                  name = "arcgis"
                  urls = listOf("http://test.url1")
                }))
  }

  @Test
  fun `Delete all freshwater-management-units`() {
    Mockito.doNothing().`when`(fmuRepository).deleteAll()

    fmuService.deleteAll()

    Mockito.verify(fmuRepository, Mockito.times(1)).deleteAll()
  }

  @Test
  fun `Don't delete existing if nothing found in ArcGIS`() {
    Mockito.doNothing().`when`(fmuRepository).deleteAll()

    val mockFeatureCollection: FeatureCollection? = null

    Mockito.`when`(
            restTemplate.getForEntity(
                ArgumentMatchers.any<URI>(), ArgumentMatchers.eq(FeatureCollection::class.java)))
        .thenReturn(ResponseEntity.ok(mockFeatureCollection))

    try {
      fmuService.loadFromArcGIS()
    } catch (e: Exception) {
      // ignore
    }

    Mockito.verify(fmuRepository, Mockito.never()).deleteAll()
    Mockito.verify(restTemplate)
        .getForEntity(URI.create("http://test.url1"), FeatureCollection::class.java)
    Mockito.verify(fmuRepository, Mockito.never())
        .save(ArgumentMatchers.any(FreshwaterManagementUnit::class.java))
  }

  @Test
  fun `Don't delete existing if empty FeatureCollection returned`() {
    Mockito.doNothing().`when`(fmuRepository).deleteAll()

    val mockFeatureCollection = FeatureCollection()

    Mockito.`when`(
            restTemplate.getForEntity(
                ArgumentMatchers.any<URI>(), ArgumentMatchers.eq(FeatureCollection::class.java)))
        .thenReturn(ResponseEntity.ok(mockFeatureCollection))

    try {
      fmuService.loadFromArcGIS()
    } catch (e: Exception) {
      // ignore
    }

    Mockito.verify(fmuRepository, Mockito.never()).deleteAll()
    Mockito.verify(restTemplate)
        .getForEntity(URI.create("http://test.url1"), FeatureCollection::class.java)
    Mockito.verify(fmuRepository, Mockito.never())
        .save(ArgumentMatchers.any(FreshwaterManagementUnit::class.java))
  }

  @Test
  @Disabled
  fun `Fetch and save FMUs from URL`() {
    Mockito.`when`(
            restTemplate.getForEntity(
                ArgumentMatchers.any<URI>(), ArgumentMatchers.eq(FeatureCollection::class.java)))
        .thenReturn(ResponseEntity.ok(FeatureCollection()))

    fmuService.fetchAndSave("http://test.url1")

    Mockito.verify(restTemplate)
        .getForEntity(URI.create("http://test.url1"), FeatureCollection::class.java)
    Mockito.verify(fmuRepository).deleteAll()
    Mockito.verify(fmuRepository).save(ArgumentMatchers.any(FreshwaterManagementUnit::class.java))
  }

  @Test
  @Disabled
  fun `Fetch and save actual response data from URL using mock JSON file`() {
    val geoJsonFile = ClassPathResource("fmus_test_response.json").file
    val mockFeatureCollection: FeatureCollection = ObjectMapper().readValue(geoJsonFile)

    Mockito.`when`(
            restTemplate.getForEntity(
                ArgumentMatchers.any<URI>(), ArgumentMatchers.eq(FeatureCollection::class.java)))
        .thenReturn(ResponseEntity.ok(mockFeatureCollection))

    fmuService.fetchAndSave("http://test.url1")

    Mockito.verify(restTemplate)
        .getForEntity(URI.create("http://test.url1"), FeatureCollection::class.java)

    Mockito.verify(fmuRepository).deleteAll()
    Mockito.verify(fmuRepository, Mockito.times(25))
        .save(ArgumentMatchers.any(FreshwaterManagementUnit::class.java))
  }
}
