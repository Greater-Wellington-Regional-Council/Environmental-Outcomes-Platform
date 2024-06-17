package nz.govt.eop.freshwater_management_units.services

import io.kotest.core.spec.style.BehaviorSpec
import java.net.URI
import nz.govt.eop.freshwater_management_units.repositories.TangataWhenuaSiteRepository
import org.geojson.Feature
import org.geojson.FeatureCollection
import org.geojson.Point
import org.mockito.kotlin.*
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.ResponseEntity
import org.springframework.test.context.ActiveProfiles
import org.springframework.test.util.ReflectionTestUtils
import org.springframework.web.client.RestTemplate

@SpringBootTest
@ActiveProfiles("test")
@AutoConfigureMockMvc
class TangataWhenuaSiteServiceTest :
    BehaviorSpec({
      given("TangataWhenuaSiteService") {
        val restTemplateMock = mock<RestTemplate>()
        val repositoryMock = mock<TangataWhenuaSiteRepository>()
        val featureCollection =
            FeatureCollection().apply {
              features =
                  listOf(
                      Feature().apply {
                        geometry = Point(174.0, -41.0) // Sample coordinates
                        properties = hashMapOf("Location" to "Sample Location") as Map<String, Any>?
                      },
                  )
            }

        val service =
            TangataWhenuaSiteService(restTemplateMock, repositoryMock).apply {
              ReflectionTestUtils.setField(this, "url", "http://test.url")
            }

        whenever(restTemplateMock.getForEntity(any<URI>(), eq(FeatureCollection::class.java)))
            .thenReturn(ResponseEntity.ok(featureCollection))

        `when`("loadFromArcGIS is called") {
          service.loadFromArcGIS()

          then("it should delete all existing sites") { verify(repositoryMock).deleteAll() }

          then("it should fetch feature collection from the configured URL") {
            verify(restTemplateMock)
                .getForEntity(URI.create("http://test.url"), FeatureCollection::class.java)
          }

          then("it should save each fetched feature as a Tangata Whenua site") {
            verify(repositoryMock)
                .saveWithGeom(
                    "Sample Location",
                    """{"type":"Point","coordinates":[174.0,-41.0]}""",
                )
          }
        }
      }
    })
