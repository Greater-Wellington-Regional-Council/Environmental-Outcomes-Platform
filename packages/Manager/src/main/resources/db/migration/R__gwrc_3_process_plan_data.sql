-- Clean Up Temp
DROP TABLE IF EXISTS temp_flow_limits;

DROP TABLE IF EXISTS temp_flow_measurement_sites;

DROP TABLE IF EXISTS temp_surface_water_sub_limits;

DROP TABLE IF EXISTS temp_surface_water_limits;

DROP TABLE IF EXISTS temp_groundwater_limits;

DROP TABLE IF EXISTS temp_groundwater_areas;

DROP TABLE IF EXISTS temp_boundary;

DROP TABLE IF EXISTS temp_plan_regions;

-- Trim old Data
DELETE
FROM groundwater_areas;

DELETE
FROM groundwater_limits;

DELETE
FROM surface_water_limits;

DELETE
FROM flow_limits;

DELETE
FROM flow_measurement_sites;

DELETE
FROM plan_regions;

DELETE
FROM plans;

INSERT INTO plans(council_id, source_id, name, default_flow_management_site, default_flow_management_limit,
                  default_groundwater_limit, default_surface_water_limit)
SELECT council_id,
       document ->> 'id',
       document ->> 'name',
       document ->> 'defaultFlowManagementSite',
       document ->> 'defaultFlowManagementLimit',
       document ->> 'defaultGroundwaterLimit',
       document ->> 'defaultSurfaceWaterLimit'
FROM council_plan_documents;

CREATE TEMP TABLE temp_plan_regions AS (SELECT p.council_id,
                                               p.id                                        AS plan_id,
                                               JSONB_ARRAY_ELEMENTS(document -> 'regions') AS region
                                        FROM council_plan_documents cpd
                                                 JOIN plans p ON cpd.council_id = p.council_id);

INSERT INTO plan_regions (plan_id, source_id, name, boundary, default_surface_water_limit, default_groundwater_limit,
                          default_flow_management_site, default_flow_management_limit)
SELECT plan_id,
       region ->> 'id',
       region ->> 'name',
       (SELECT boundary
        FROM council_plan_boundaries
        WHERE council_id = temp_plan_regions.council_id
          AND region ->> 'boundaryId' = council_plan_boundaries.source_id),
       region ->> 'defaultSurfaceWaterLimit',
       region ->> 'defaultGroundwaterLimit',
       region ->> 'defaultFlowManagementSite',
       region ->> 'defaultFlowManagementLimit'
FROM temp_plan_regions;

CREATE TEMP TABLE temp_surface_water_limits AS (SELECT temp_plan_regions.council_id,
                                                       pr.plan_id,
                                                       pr.id                                                AS plan_region_id,
                                                       JSONB_ARRAY_ELEMENTS(region -> 'surfaceWaterLimits') AS surface_water_limit
                                                FROM temp_plan_regions
                                                         JOIN plan_regions pr
                                                              ON temp_plan_regions.plan_id = pr.plan_id AND
                                                                 temp_plan_regions.region ->> 'id' = pr.source_id);

INSERT INTO surface_water_limits (plan_region_id, source_id, name, allocation_limit, boundary)
SELECT plan_region_id,
       surface_water_limit ->> 'id',
       surface_water_limit ->> 'name',
       CAST(surface_water_limit -> 'allocationLimit' AS INT),
       (SELECT boundary
        FROM council_plan_boundaries
        WHERE council_id = temp_surface_water_limits.council_id
          AND surface_water_limit ->> 'boundaryId' = council_plan_boundaries.source_id)
FROM temp_surface_water_limits;

CREATE TEMP TABLE temp_surface_water_sub_limits AS (SELECT tswl.council_id,
                                                           swl.plan_region_id,
                                                           swl.id                                                       AS parent_surface_water_limit_id,
                                                           JSONB_ARRAY_ELEMENTS(tswl.surface_water_limit -> 'children') AS surface_water_limit
                                                    FROM temp_surface_water_limits tswl
                                                             JOIN surface_water_limits swl
                                                                  ON tswl.plan_region_id = swl.plan_region_id AND
                                                                     swl.source_id = tswl.surface_water_limit ->> 'id');

INSERT INTO surface_water_limits (plan_region_id, parent_surface_water_limit_id, source_id, name, allocation_limit,
                                  boundary)
SELECT plan_region_id,
       parent_surface_water_limit_id,
       surface_water_limit ->> 'id',
       surface_water_limit ->> 'name',
       CAST(surface_water_limit -> 'allocationLimit' AS INT),
       (SELECT boundary
        FROM council_plan_boundaries
        WHERE council_id = temp_surface_water_sub_limits.council_id
          AND surface_water_limit ->> 'boundaryId' = council_plan_boundaries.source_id)
FROM temp_surface_water_sub_limits;

CREATE TEMP TABLE temp_groundwater_limits AS (SELECT temp_plan_regions.council_id,
                                                     pr.plan_id,
                                                     pr.id                                               AS plan_region_id,
                                                     JSONB_ARRAY_ELEMENTS(region -> 'groundwaterLimits') AS groundwater_limit
                                              FROM temp_plan_regions
                                                       JOIN plan_regions pr
                                                            ON temp_plan_regions.plan_id = pr.plan_id AND
                                                               temp_plan_regions.region ->> 'id' = pr.source_id);

INSERT INTO groundwater_limits (plan_region_id, source_id, name, allocation_limit)
SELECT plan_region_id,
       groundwater_limit ->> 'id',
       groundwater_limit ->> 'name',
       CAST(groundwater_limit ->> 'allocationLimit' AS INT)
FROM temp_groundwater_limits;

CREATE TEMP TABLE temp_groundwater_areas AS (SELECT tgl.council_id,
                                                    tgl.plan_region_id,
                                                    gl.id,
                                                    JSONB_ARRAY_ELEMENTS(tgl.groundwater_limit -> 'areas') AS areas
                                             FROM temp_groundwater_limits tgl
                                                      JOIN groundwater_limits gl
                                                           ON tgl.plan_region_id = gl.plan_region_id AND
                                                              tgl.groundwater_limit ->> 'id' = gl.source_id);

INSERT INTO groundwater_areas (groundwater_limit_id, category, depth, depletion_limit_id, boundary)
SELECT id,
       areas ->> 'category',
       areas ->> 'depth',
       (SELECT id
        FROM surface_water_limits
        WHERE plan_region_id = temp_groundwater_areas.plan_region_id
          AND source_id = areas ->> 'depletionLimitId'),
       (SELECT boundary
        FROM council_plan_boundaries
        WHERE council_id = temp_groundwater_areas.council_id
          AND areas ->> 'boundaryId' = council_plan_boundaries.source_id)
FROM temp_groundwater_areas;

CREATE TEMP TABLE temp_flow_measurement_sites AS (SELECT temp_plan_regions.council_id,
                                                         pr.id                                                                     AS plan_region_id,
                                                         JSONB_ARRAY_ELEMENTS(region -> 'minimumFlowLimits' -> 'measurementSites') AS minimum_flow_sites
                                                  FROM temp_plan_regions
                                                           JOIN plan_regions pr
                                                                ON temp_plan_regions.plan_id = pr.plan_id AND
                                                                   temp_plan_regions.region ->> 'id' = pr.source_id);

INSERT INTO flow_measurement_sites(plan_region_id, source_id, name, location)
SELECT plan_region_id,
       minimum_flow_sites ->> 'id',
       minimum_flow_sites ->> 'name',
       (SELECT boundary
        FROM council_plan_boundaries
        WHERE council_id = temp_flow_measurement_sites.council_id
          AND source_id = minimum_flow_sites ->> 'geometryId')
FROM temp_flow_measurement_sites;

CREATE TEMP TABLE temp_flow_limits AS (SELECT temp_plan_regions.council_id,
                                              pr.id                                                           AS plan_region_id,
                                              JSONB_ARRAY_ELEMENTS(region -> 'minimumFlowLimits' -> 'limits') AS minimum_flow_limits
                                       FROM temp_plan_regions
                                                JOIN plan_regions pr
                                                     ON temp_plan_regions.plan_id = pr.plan_id AND
                                                        temp_plan_regions.region ->> 'id' = pr.source_id);

INSERT INTO flow_limits(plan_region_id, minimum_flow, measured_at_site_id, boundary)
SELECT plan_region_id,
       CAST(minimum_flow_limits ->> 'limit' AS INT),
       (SELECT id
        FROM flow_measurement_sites fms
        WHERE fms.plan_region_id = tfl.plan_region_id
          AND fms.source_id = minimum_flow_limits ->> 'measuredAtId'),
       (SELECT boundary
        FROM council_plan_boundaries
        WHERE council_id = tfl.council_id
          AND source_id = tfl.minimum_flow_limits ->> 'boundaryId')
FROM temp_flow_limits tfl;
