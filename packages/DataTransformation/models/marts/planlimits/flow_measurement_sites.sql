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

temp_plan_regions AS (

  SELECT * FROM {{ ref('int_temp_plan_regions') }}
),

temp_flow_measurement_sites AS (

  SELECT

    tpr.council_id,
    pr.id AS plan_region_id,
    JSONB_ARRAY_ELEMENTS(region -> 'minimumFlowLimits' -> 'measurementSites') AS minimum_flow_sites

  FROM temp_plan_regions AS tpr

  INNER JOIN plan_regions AS pr
    ON
      tpr.plan_id = pr.plan_id
      AND tpr.region ->> 'id' = pr.source_id
),

flow_measurement_sites AS (

  SELECT

    plan_region_id,
    ROW_NUMBER() OVER () AS id,
    minimum_flow_sites ->> 'id' AS source_id,
    minimum_flow_sites ->> 'name' AS name,
    (
      SELECT boundary
      FROM council_plan_boundaries
      WHERE
        council_id = temp_flow_measurement_sites.council_id
        AND source_id = minimum_flow_sites ->> 'geometryId'
    ) AS location

  FROM temp_flow_measurement_sites
)

SELECT * FROM flow_measurement_sites
