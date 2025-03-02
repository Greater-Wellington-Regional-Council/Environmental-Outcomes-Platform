package nz.govt.eop.freshwater_management_units.repositories

import io.kotest.core.spec.style.FunSpec
import io.kotest.matchers.shouldBe
import io.kotest.matchers.shouldNotBe
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import nz.govt.eop.freshwater_management_units.models.toFeatureCollection
import nz.govt.eop.freshwater_management_units.models.toGeoJson
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.test.context.ActiveProfiles

@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
class FreshwaterManagementUnitRepositoryTest @Autowired constructor(
    private val fmuRepository: FreshwaterManagementUnitRepository
) : FunSpec() {

    val savedFMU = fmuRepository.findAll().find { fmu: FreshwaterManagementUnit -> fmu.fmuName1 == "Parkvale Stream" }

    @Test
    fun `get freshwater-management-units by name`() {
        savedFMU?.boundary shouldNotBe null
    }

    @Test
    fun `Get freshwater-management-units by shape`() {
        val shape = listOf(savedFMU!!).toFeatureCollection().toGeoJson()

        val matchingFMUs = fmuRepository.findAllByGeoJson(shape)
        matchingFMUs.shouldNotBe(null)
        matchingFMUs.size shouldBe 6
    }
}