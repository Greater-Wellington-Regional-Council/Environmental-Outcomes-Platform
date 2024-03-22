package nz.govt.eop.farm_management_units.services

import io.kotest.matchers.collections.shouldNotBeEmpty
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class FarmManagementUnitServiceTests @Autowired constructor(private val fmuService: FarmManagementUnitService) {
    @Test
    fun `Can find farm management unit by lat and lng`() {
      // GIVEN
      val lng = 1805287.5391000006
      val lat = 5469337.152800006
      val srid = 2193

      // WHEN
      val result = fmuService.findFarmManagementUnitByLatAndLng(lng, lat)

      // THEN
      result.shouldNotBeEmpty()
    }
}