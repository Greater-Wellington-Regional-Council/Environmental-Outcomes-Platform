package nz.govt.eop.freshwater_management_units.seeders

import com.fasterxml.jackson.databind.ObjectMapper
import nz.govt.eop.freshwater_management_units.mappers.FreshwaterManagementUnitMapper
import nz.govt.eop.freshwater_management_units.repositories.FreshwaterManagementUnitRepository
import org.geojson.FeatureCollection
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile

@Configuration
@Profile("test")
class DatabaseSeeder {

  @Autowired lateinit var fmuRepository: FreshwaterManagementUnitRepository

  @Bean
  fun seedDatabase(): ApplicationRunner {
    return ApplicationRunner { seedData() }
  }

  fun seedData() {
    val path = "/fmus_test_response.json"
    val mapper = FreshwaterManagementUnitMapper()
    val featureCollection: FeatureCollection =
        DatabaseSeeder::class.java.getResourceAsStream(path).use { inputStream ->
          ObjectMapper().readValue(inputStream, FeatureCollection::class.java)
        }

    fmuRepository.deleteAll()

    featureCollection.features.forEach { feature ->
      val fmu = mapper.fromFeature(feature)
      fmuRepository.save(fmu)
    }
  }
}
