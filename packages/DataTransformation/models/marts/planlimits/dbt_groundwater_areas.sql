{{ config(
    materialized = 'view'
) }}

WITH council_plan_documents AS (

  SELECT * FROM {{ ref('stg_planlimits_council_plan_documents') }}
),

council_plan_boundaries AS (

  SELECT * FROM {{ ref('stg_planlimits_council_plan_boundaries') }}
),

plans AS (

  SELECT * FROM {{ ref('dbt_plans') }}
),

plan_regions AS (

  SELECT * FROM {{ ref('dbt_plan_regions') }}
),

surface_water_limit AS (

  SELECT * FROM {{ ref('dbt_surface_water_limits')}}
),

temp_plan_regions AS (

  SELECT

    p.council_id,
    p.id AS plan_id,
    JSONB_ARRAY_ELEMENTS(document -> 'regions') AS region

  FROM council_plan_documents AS cpd

  INNER JOIN plans AS p ON cpd.council_id = p.council_id
),

temp_groundwater_limits AS (

SELECT

  tpr.council_id,
  pr.plan_id,
  pr.id AS plan_region_id,
  JSONB_ARRAY_ELEMENTS(region -> 'groundwaterLimits') AS groundwater_limit

FROM temp_plan_regions tpr

  INNER JOIN plan_regions pr
    ON tpr.plan_id = pr.plan_id AND tpr.region ->> 'id' = pr.source_id
),

temp_groundwater_areas AS (

  SELECT

    tgl.council_id,
    tgl.plan_region_id,
    gl.id,
    JSONB_ARRAY_ELEMENTS(tgl.groundwater_limit -> 'areas') AS areas

  FROM temp_groundwater_limits tgl

    INNER JOIN groundwater_limits gl
      ON tgl.plan_region_id = gl.plan_region_id 
        AND tgl.groundwater_limit ->> 'id' = gl.source_id
),

groundwater_areas AS (

  SELECT 
  
    row_number() over () as id,
    id as groundwater_limit_id,
    areas ->> 'id' as source_id,
    areas ->> 'category' as category,
    areas ->> 'depth' as depth,
    (
      SELECT
        id
      FROM surface_water_limits
      WHERE plan_region_id = tga.plan_region_id
      AND source_id = areas ->> 'depletionLimitId'

    ) AS depletion_limit_id,
    (
      SELECT
        boundary
      FROM council_plan_boundaries
      WHERE council_id = tga.council_id
      AND areas ->> 'boundaryId' = council_plan_boundaries.source_id

        ) AS boundary

    FROM temp_groundwater_areas tga

)

SELECT * FROM groundwater_areas