CREATE OR REPLACE VIEW plans
            (id,
             council_id,
             source_id,
             name,
             default_surface_water_limit,
             default_groundwater_limit,
             default_flow_management_site,
             default_flow_management_limit)
AS
SELECT ROW_NUMBER() OVER (),
       council_id,
       document ->> 'id',
       document ->> 'name',
       document ->> 'defaultSurfaceWaterLimit',
       document ->> 'defaultGroundwaterLimit',
       document ->> 'defaultFlowManagementSite',
       document ->> 'defaultFlowManagementLimit'
FROM council_plan_documents;

CREATE OR REPLACE VIEW plan_regions
            (id,
             plan_id,
             source_id,
             name,
             boundary,
             default_surface_water_limit,
             default_groundwater_limit,
             default_flow_management_site,
             default_flow_management_limit,
             reference_url)
AS
WITH temp_plan_regions AS (SELECT p.council_id,
                                  p.id                                        AS plan_id,
                                  JSONB_ARRAY_ELEMENTS(document -> 'regions') AS region
                           FROM council_plan_documents cpd
                                    JOIN plans p ON cpd.council_id = p.council_id)
SELECT ROW_NUMBER() OVER (),
       plan_id,
       region ->> 'id',
       region ->> 'name',
       (SELECT boundary
        FROM council_plan_boundaries
        WHERE council_id = temp_plan_regions.council_id
          AND region ->> 'boundaryId' = council_plan_boundaries.source_id),
       region ->> 'defaultSurfaceWaterLimit',
       region ->> 'defaultGroundwaterLimit',
       region ->> 'defaultFlowManagementSite',
       region ->> 'defaultFlowManagementLimit',
       region ->> 'referenceUrl'
FROM temp_plan_regions;


CREATE OR REPLACE VIEW surface_water_limits
            (id,
             plan_region_id,
             source_id,
             parent_surface_water_limit_id,
             name,
             allocation_limit,
             boundary)
AS
WITH temp_plan_regions AS (SELECT p.council_id,
                                  p.id                                        AS plan_id,
                                  JSONB_ARRAY_ELEMENTS(document -> 'regions') AS region
                           FROM council_plan_documents cpd
                                    JOIN plans p ON cpd.council_id = p.council_id),
     expanded_surface_water_limits
         AS (SELECT temp_plan_regions.council_id,
                    pr.plan_id,
                    pr.id                                                AS plan_region_id,
                    JSONB_ARRAY_ELEMENTS(region -> 'surfaceWaterLimits') AS surface_water_limit
             FROM temp_plan_regions
                      JOIN plan_regions pr
                           ON temp_plan_regions.plan_id = pr.plan_id AND
                              temp_plan_regions.region ->> 'id' = pr.source_id),

     id_surface_water_limits AS (SELECT ROW_NUMBER() OVER () AS id,
                                        council_id,
                                        plan_region_id,
                                        surface_water_limit
                                 FROM expanded_surface_water_limits),

     expanded_surface_water_sub_limits AS (SELECT swl.council_id,
                                                  swl.plan_region_id,
                                                  swl.id                                                      AS parent_surface_water_limit_id,
                                                  JSONB_ARRAY_ELEMENTS(swl.surface_water_limit -> 'children') AS surface_water_limit
                                           FROM id_surface_water_limits swl),
     id_surface_water_sub_limits AS (SELECT ROW_NUMBER() OVER () + (SELECT max(id) FROM id_surface_water_limits) AS id,
                                            council_id,
                                            plan_region_id,
                                            parent_surface_water_limit_id,
                                            surface_water_limit
                                     FROM expanded_surface_water_sub_limits),
     combined_surface_water_limits AS (SELECT id,
                                              plan_region_id,
                                              surface_water_limit ->> 'id' AS source_id,
                                              NULL                         AS parent_surface_water_limit_id,
                                              surface_water_limit ->> 'name',
                                              (surface_water_limit -> 'allocationLimit')::INT,
                                              (SELECT boundary
                                               FROM council_plan_boundaries
                                               WHERE council_id = id_surface_water_limits.council_id
                                                 AND surface_water_limit ->> 'boundaryId' = council_plan_boundaries.source_id)
                                       FROM id_surface_water_limits
                                       UNION ALL
                                       SELECT id,
                                              plan_region_id,
                                              surface_water_limit ->> 'id' AS source_id,
                                              parent_surface_water_limit_id,
                                              surface_water_limit ->> 'name',
                                              (surface_water_limit -> 'allocationLimit')::INT,
                                              (SELECT boundary
                                               FROM council_plan_boundaries
                                               WHERE council_id = id_surface_water_sub_limits.council_id
                                                 AND surface_water_limit ->> 'boundaryId' = council_plan_boundaries.source_id)
                                       FROM id_surface_water_sub_limits)
SELECT *
FROM combined_surface_water_limits;

CREATE OR REPLACE VIEW groundwater_limits
            (id,
             plan_region_id,
             source_id,
             name,
             allocation_limit)
AS
WITH temp_plan_regions AS (SELECT p.council_id,
                                  p.id                                        AS plan_id,
                                  JSONB_ARRAY_ELEMENTS(document -> 'regions') AS region
                           FROM council_plan_documents cpd
                                    JOIN plans p ON cpd.council_id = p.council_id),
     temp_groundwater_limits AS (SELECT temp_plan_regions.council_id,
                                        pr.plan_id,
                                        pr.id                                               AS plan_region_id,
                                        JSONB_ARRAY_ELEMENTS(region -> 'groundwaterLimits') AS groundwater_limit
                                 FROM temp_plan_regions
                                          JOIN plan_regions pr
                                               ON temp_plan_regions.plan_id = pr.plan_id AND
                                                  temp_plan_regions.region ->> 'id' = pr.source_id)
SELECT row_number() over (),
       plan_region_id,
       groundwater_limit ->> 'id',
       groundwater_limit ->> 'name',
       CAST(groundwater_limit ->> 'allocationLimit' AS INT)
FROM temp_groundwater_limits;

CREATE OR REPLACE VIEW groundwater_areas
            (id,
             groundwater_limit_id,
             source_id,
             category,
             depth,
             depletion_limit_id,
             boundary)
AS
WITH temp_plan_regions AS (SELECT p.council_id,
                                  p.id                                        AS plan_id,
                                  JSONB_ARRAY_ELEMENTS(document -> 'regions') AS region
                           FROM council_plan_documents cpd
                                    JOIN plans p ON cpd.council_id = p.council_id),
     temp_groundwater_limits AS (SELECT temp_plan_regions.council_id,
                                        pr.plan_id,
                                        pr.id                                               AS plan_region_id,
                                        JSONB_ARRAY_ELEMENTS(region -> 'groundwaterLimits') AS groundwater_limit
                                 FROM temp_plan_regions
                                          JOIN plan_regions pr
                                               ON temp_plan_regions.plan_id = pr.plan_id AND
                                                  temp_plan_regions.region ->> 'id' = pr.source_id),
     temp_groundwater_areas AS (SELECT tgl.council_id,
                                       tgl.plan_region_id,
                                       gl.id,
                                       JSONB_ARRAY_ELEMENTS(tgl.groundwater_limit -> 'areas') AS areas
                                FROM temp_groundwater_limits tgl
                                         JOIN groundwater_limits gl
                                              ON tgl.plan_region_id = gl.plan_region_id AND
                                                 tgl.groundwater_limit ->> 'id' = gl.source_id)
SELECT row_number() over (),
       id,
       areas ->> 'id',
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

CREATE OR REPLACE VIEW flow_measurement_sites
            (id,
             plan_region_id,
             source_id,
             name,
             location)
AS
WITH temp_plan_regions AS (SELECT p.council_id,
                                  p.id                                        AS plan_id,
                                  JSONB_ARRAY_ELEMENTS(document -> 'regions') AS region
                           FROM council_plan_documents cpd
                                    JOIN plans p ON cpd.council_id = p.council_id),
     temp_flow_measurement_sites AS (SELECT temp_plan_regions.council_id,
                                            pr.id                                                                     AS plan_region_id,
                                            JSONB_ARRAY_ELEMENTS(region -> 'minimumFlowLimits' -> 'measurementSites') AS minimum_flow_sites
                                     FROM temp_plan_regions
                                              JOIN plan_regions pr
                                                   ON temp_plan_regions.plan_id = pr.plan_id AND
                                                      temp_plan_regions.region ->> 'id' = pr.source_id)
SELECT row_number() over (),
       plan_region_id,
       minimum_flow_sites ->> 'id',
       minimum_flow_sites ->> 'name',
       (SELECT boundary
        FROM council_plan_boundaries
        WHERE council_id = temp_flow_measurement_sites.council_id
          AND source_id = minimum_flow_sites ->> 'geometryId')
FROM temp_flow_measurement_sites;


CREATE OR REPLACE VIEW flow_limits
            (id,
             plan_region_id,
             source_id,
             minimum_flow,
             measured_at_site_id,
             boundary)
AS
WITH temp_plan_regions AS (SELECT p.council_id,
                                  p.id                                        AS plan_id,
                                  JSONB_ARRAY_ELEMENTS(document -> 'regions') AS region
                           FROM council_plan_documents cpd
                                    JOIN plans p ON cpd.council_id = p.council_id),
     temp_flow_limits AS (SELECT temp_plan_regions.council_id,
                                 pr.id                                                           AS plan_region_id,
                                 JSONB_ARRAY_ELEMENTS(region -> 'minimumFlowLimits' -> 'limits') AS minimum_flow_limits
                          FROM temp_plan_regions
                                   JOIN plan_regions pr
                                        ON temp_plan_regions.plan_id = pr.plan_id AND
                                           temp_plan_regions.region ->> 'id' = pr.source_id)
SELECT row_number() over (),
       plan_region_id,
       minimum_flow_limits ->> 'id',
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

