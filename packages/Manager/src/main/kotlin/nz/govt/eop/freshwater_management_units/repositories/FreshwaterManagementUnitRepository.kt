package nz.govt.eop.freshwater_management_units.repositories

import jakarta.persistence.EntityManager
import jakarta.persistence.PersistenceContext
import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

interface CustomFreshwaterManagementUnitRepository {
    fun saveWithLogging(entity: FreshwaterManagementUnit): FreshwaterManagementUnit
}

@Repository
class FreshwaterManagementUnitRepositoryImpl(
    @PersistenceContext private val entityManager: EntityManager
) : CustomFreshwaterManagementUnitRepository {

    @Transactional
    override fun saveWithLogging(entity: FreshwaterManagementUnit): FreshwaterManagementUnit {
        return entityManager.merge(entity)
    }
}

@Repository
interface FreshwaterManagementUnitRepository :
    JpaRepository<FreshwaterManagementUnit, Int>,
    CustomFreshwaterManagementUnitRepository {
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
WHERE ST_Intersects(fmu.geom, ST_Transform(ST_SetSRID(ST_Point(:lng, :lat), :srid), :srid))
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
    CAST(ST_AsGeoJSON(ST_Transform(fmu.geom, :srid), 6 ,2) AS jsonb) as boundary,
    catchments.description as catchmentDescription
FROM freshwater_management_units fmu
    LEFT JOIN catchments
    ON id = catchment_id
WHERE ST_Intersects(
    ST_Transform(fmu.geom, :srid),
    (
        SELECT ST_Transform(ST_Union(ST_GeomFromGeoJSON(feature->>'geometry')), :srid)
        FROM jsonb_array_elements(CAST(:geoJson AS jsonb)->'features') AS feature
    )
)
    """,
        nativeQuery = true
    )
    fun findAllByGeoJson(
        geoJson: String,
        srid: Int = FreshwaterManagementUnit.DEFAULT_SRID
    ): List<FreshwaterManagementUnit>
}
