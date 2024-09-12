{{ config(
    materialized = 'view'
) }}

WITH council_plan_boundaries AS (

  SELECT * FROM {{ ref('council_plan_boundaries') }}
),

plans AS (

  SELECT * FROM {{ ref('plans') }}
),

plan_regions AS (

  SELECT * FROM {{ ref('plan_regions') }}
),

surface_water_limit AS (

  SELECT * FROM {{ ref('surface_water_limits') }}
),

temp_plan_regions AS (

  SELECT * FROM {{ ref('int_temp_plan_regions') }}
),

temp_groundwater_limits AS (

  SELECT

    tpr.council_id,
    pr.plan_id,
    pr.id AS plan_region_id,
    JSONB_ARRAY_ELEMENTS(region -> 'groundwaterLimits') AS groundwater_limit

  FROM temp_plan_regions AS tpr

  INNER JOIN plan_regions AS pr
    ON tpr.plan_id = pr.plan_id AND tpr.region ->> 'id' = pr.source_id
),

temp_groundwater_areas AS (

  SELECT

    tgl.council_id,
    tgl.plan_region_id,
    gl.id,
    JSONB_ARRAY_ELEMENTS(tgl.groundwater_limit -> 'areas') AS areas

  FROM temp_groundwater_limits AS tgl

  INNER JOIN groundwater_limits AS gl
    ON
      tgl.plan_region_id = gl.plan_region_id
      AND tgl.groundwater_limit ->> 'id' = gl.source_id
),

groundwater_areas AS (

  SELECT

    id AS groundwater_limit_id,
    ROW_NUMBER() OVER () AS id,
    areas ->> 'id' AS source_id,
    areas ->> 'category' AS category,
    areas ->> 'depth' AS depth,
    (
      SELECT id
      FROM surface_water_limits
      WHERE
        plan_region_id = tga.plan_region_id
        AND source_id = areas ->> 'depletionLimitId'

    ) AS depletion_limit_id,
    (
      SELECT boundary
      FROM council_plan_boundaries
      WHERE
        council_id = tga.council_id
        AND areas ->> 'boundaryId' = council_plan_boundaries.source_id

    ) AS boundary

  FROM temp_groundwater_areas AS tga

)

SELECT * FROM groundwater_areas
