package nz.govt.eop.farm_management_units.models

import net.postgis.jdbc.geometry.Geometry
import org.junit.jupiter.api.Assertions.assertNotNull
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest
class GeometryBindingTest {

  @Autowired
  private lateinit var dslContext: org.jooq.DSLContext

  @Test
  fun `test geometry binding`() {
    val record = dslContext
      .select()
      .from("FARM_MANAGEMENT_UNITS")
      .fetchOne()

    assertNotNull(record)
    val geom = record?.get("geom", Geometry::class.java)
    assertNotNull(geom)
  }
}