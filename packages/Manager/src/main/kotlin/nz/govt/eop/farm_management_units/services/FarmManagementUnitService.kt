package nz.govt.eop.farm_management_units.services

import nz.govt.eop.farm_management_units.models.DEFAULT_SRID
import nz.govt.eop.farm_management_units.models.FarmManagementUnit
import org.jooq.DSLContext
import org.jooq.impl.DSL
import org.jooq.impl.DSL.field
import org.jooq.impl.DSL.table
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

@Service
class FarmManagementUnitService @Autowired constructor(val context: DSLContext) {
  fun findFarmManagementUnitByLatAndLng(lng: Double, lat: Double, srid: Int = DEFAULT_SRID): List<FarmManagementUnit> {
    // JOOQ query for finding farm management unit by lat and lng
    // SELECT * FROM farm_management_units WHERE ST_Intersects(geom, ST_SetSRID(ST_Point(1805286.5391000006, 5469336.152800006), 2193))
    return context.select()
      .from(table("FARM_MANAGEMENT_UNITS"))
      .where(
        DSL.condition(
          "ST_Intersects({0}, ST_SetSRID(ST_Point({1}, {2}), {3}))",
          field("geom"),
          lng,
          lat,
          srid
        )
      )
      .fetchInto(FarmManagementUnit::class.java)
  }
}