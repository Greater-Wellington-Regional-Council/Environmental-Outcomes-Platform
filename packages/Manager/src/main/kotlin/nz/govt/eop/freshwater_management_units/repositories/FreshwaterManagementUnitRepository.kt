package nz.govt.eop.freshwater_management_units.repositories

import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

@Repository
interface FreshwaterManagementUnitRepository : JpaRepository<FreshwaterManagementUnit, Int> {
  @Query(
      value =
          """
SELECT
    fmu.*,
    CAST(ST_AsGeoJSON(ST_Transform(fmu.geom, 4326), 6 ,2) AS jsonb) as boundary,
    bi.description as catchmentDescription
FROM freshwater_management_units fmu
         LEFT JOIN boundary_info bi ON
    ST_Intersects(fmu.geom, ST_Transform(bi.boundary, 2193))
WHERE ST_Intersects(fmu.geom, ST_Transform(ST_SetSRID(ST_Point(:lng, :lat), :srid), 2193))
    """,
      nativeQuery = true,
  )
  fun findAllByLngLat(
      lng: Double,
      lat: Double,
      srid: Int = FreshwaterManagementUnit.DEFAULT_SRID,
  ): List<FreshwaterManagementUnit>
}
