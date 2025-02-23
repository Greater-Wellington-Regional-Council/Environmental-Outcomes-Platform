package nz.govt.eop.freshwater_management_units.repositories

import nz.govt.eop.freshwater_management_units.models.FreshwaterManagementUnit
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional

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
WHERE ST_Intersects(
    ST_Transform(fmu.geom, 4326),
    (
        SELECT ST_Transform(ST_Union(ST_GeomFromGeoJSON(feature->>'geometry')), 4326)
        FROM jsonb_array_elements(CAST(:geoJson AS jsonb)->'features') AS feature
    )
)
    """,
        nativeQuery = true
    )
    fun findAllByGeoJson(geoJson: String): List<FreshwaterManagementUnit>

    @Modifying
    @Transactional
    @Query(
        value =
            """
        INSERT INTO freshwater_management_units (gid, objectid, fmu_no, location, fmu_name1, fmu_group, 
        shape_leng, shape_area, by_when, fmu_issue, top_fmugrp, geom, implementation_ideas, other_info, vpo)
        VALUES (:gid, :objectid, :fmuNo, :location, :fmuName1, :fmuGroup, :shapeLeng, :shapeArea, :byWhen, 
        :fmuIssue, :topFmuGrp, ST_GeomFromGeoJSON(:geom), CAST(:implementationIdeas AS jsonb), 
        CAST(:otherInfo AS jsonb), CAST(:vpo AS jsonb))
    """,
        nativeQuery = true
    )
    fun saveWithGeom(
        @Param("gid") gid: Int?,
        @Param("objectid") objectId: Double?,
        @Param("fmuNo") fmuNo: Int?,
        @Param("location") location: String?,
        @Param("fmuName1") fmuName1: String?,
        @Param("fmuGroup") fmuGroup: String?,
        @Param("shapeLeng") shapeLeng: Double?,
        @Param("shapeArea") shapeArea: Double?,
        @Param("byWhen") byWhen: String?,
        @Param("fmuIssue") fmuIssue: String?,
        @Param("topFmuGrp") topFmuGrp: String?,
        @Param("geom") geom: String,
        @Param("implementationIdeas") implementationIdeas: String,
        @Param("otherInfo") otherInfo: String,
        @Param("vpo") vpo: String
    )
}
