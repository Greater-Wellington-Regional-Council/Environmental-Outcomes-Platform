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

temp_plan_regions AS (

  SELECT

    p.council_id,
    p.id AS plan_id,
    JSONB_ARRAY_ELEMENTS(document -> 'regions') AS region

  FROM council_plan_documents AS cpd

  INNER JOIN plans AS p ON cpd.council_id = p.council_id
),

expanded_surface_water_limits AS (

  SELECT

    tpr.council_id,
    pr.plan_id,
    pr.id AS plan_region_id,
    JSONB_ARRAY_ELEMENTS(region -> 'surfaceWaterLimits') AS surface_water_limit

  FROM
    temp_plan_regions AS tpr

  INNER JOIN
    plan_regions AS pr 
      ON tpr.plan_id = pr.plan_id AND tpr.region ->> 'id' = pr.source_id
),

id_surface_water_limits AS (

  SELECT

    ROW_NUMBER() OVER () AS id,
    council_id,
    plan_region_id,
    surface_water_limit
  FROM
    expanded_surface_water_limits
),

expanded_surface_water_sub_limits AS (
  SELECT

    swl.council_id,
    swl.plan_region_id,
    swl.id AS parent_surface_water_limit_id,
    JSONB_ARRAY_ELEMENTS(swl.surface_water_limit -> 'children') AS surface_water_limit

  FROM
    id_surface_water_limits AS swl
),

id_surface_water_sub_limits AS (

  SELECT

    ROW_NUMBER() OVER () + (SELECT MAX(id) FROM id_surface_water_limits) AS id,
    council_id,
    plan_region_id,
    parent_surface_water_limit_id,
    surface_water_limit

  FROM
    expanded_surface_water_sub_limits
),

combined_surface_water_limits AS (
  SELECT
    id,
    plan_region_id,
    surface_water_limit ->> 'id' AS source_id,
    NULL AS parent_surface_water_limit_id,
    surface_water_limit ->> 'name' AS name,
    (surface_water_limit -> 'allocationLimit')::INT AS allocation_limit,
    (
      SELECT 
        boundary
      FROM council_plan_boundaries

      WHERE
        council_id = id_surface_water_limits.council_id
        AND surface_water_limit ->> 'boundaryId' = council_plan_boundaries.source_id
    ) AS boundary

  FROM
    id_surface_water_limits

  UNION ALL

  SELECT

    id,
    plan_region_id,
    surface_water_limit ->> 'id' AS source_id,
    parent_surface_water_limit_id,
    surface_water_limit ->> 'name' AS name,
    (surface_water_limit -> 'allocationLimit')::INT AS allocation_limit,
    (
      SELECT 
        boundary
      FROM council_plan_boundaries

      WHERE
        council_id = id_surface_water_sub_limits.council_id
        AND surface_water_limit ->> 'boundaryId' = council_plan_boundaries.source_id
    ) AS boundary
    
  FROM
    id_surface_water_sub_limits
)

SELECT 
  *
FROM combined_surface_water_limits
