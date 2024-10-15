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
WITH catchments AS (
    SELECT fmu2.id as catchment_id, bi.description as description
            FROM freshwater_management_units fmu2
                     JOIN council_plan_boundaries cpb
                          ON ST_Intersects(ST_Transform(fmu2.geom, 4326), ST_Transform(cpb.boundary, 4326))
                     JOIN boundary_info bi
                          ON cpb.source_id = bi.source_id
                              AND cpb.council_id = bi.council_id
                              AND bi.context = 'cccv_catchments'
    )
SELECT
    fmu.*,
    CAST(ST_AsGeoJSON(ST_Transform(fmu.geom, 4326), 6 ,2) AS jsonb) as boundary,
    catchments.description as catchmentDescription
FROM freshwater_management_units fmu
    LEFT JOIN catchments
    ON id = catchment_id
WHERE ST_Intersects(fmu.geom, ST_Transform(ST_SetSRID(ST_Point(:lng, :lat), :srid), 2193))
    """,
      nativeQuery = true,
  )
  fun findAllByLngLat(
      lng: Double,
      lat: Double,
      srid: Int = FreshwaterManagementUnit.DEFAULT_SRID,
  ): List<FreshwaterManagementUnit>

  @Query(
      value =
          """
        SELECT fmu.*,
               CAST(ST_AsGeoJSON(ST_Transform(fmu.geom, 4326), 6, 2) AS jsonb) as boundary
        FROM freshwater_management_units fmu
        WHERE ST_Intersects(fmu.geom, ST_GeomFromGeoJSON(:geoJson))
    """,
      nativeQuery = true)
  fun findAllByGeoJson(geoJson: String): List<FreshwaterManagementUnit>
}
