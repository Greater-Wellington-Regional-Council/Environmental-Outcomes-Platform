{{ config(
    materialized = 'view'
) }}

WITH council_plan_boundaries AS (

  SELECT * FROM {{ ref('stg_planlimits_council_plan_boundaries') }}
),

plans AS (

  SELECT * FROM {{ ref('plans') }}
),

plan_regions AS (

  SELECT * FROM {{ ref('plan_regions') }}
),

flow_measurement_sites AS (

  SELECT * FROM {{ ref('flow_measurement_sites') }}
),

temp_plan_regions AS (

  SELECT * FROM {{ ref('int_temp_plan_regions') }}
),

temp_flow_limits AS (

  SELECT

    tpr.council_id,
    pr.id AS plan_region_id,
    JSONB_ARRAY_ELEMENTS(region -> 'minimumFlowLimits' -> 'limits') AS minimum_flow_limits

  FROM temp_plan_regions AS tpr

  INNER JOIN plan_regions AS pr
    ON
      tpr.plan_id = pr.plan_id
      AND tpr.region ->> 'id' = pr.source_id
),

flow_limits AS (

  SELECT

    plan_region_id,
    ROW_NUMBER() OVER () AS id,
    minimum_flow_limits ->> 'id' AS source_id,
    CAST(minimum_flow_limits ->> 'limit' AS INT) AS minimum_flow,
    (
      SELECT id
      FROM flow_measurement_sites AS fms
      WHERE
        fms.plan_region_id = tfl.plan_region_id
        AND fms.source_id = minimum_flow_limits ->> 'measuredAtId'

    ) AS measured_at_site_id,
    (
      SELECT boundary
      FROM council_plan_boundaries
      WHERE
        council_id = tfl.council_id
        AND source_id = tfl.minimum_flow_limits ->> 'boundaryId'

    ) AS boundary

  FROM temp_flow_limits AS tfl
)

SELECT * FROM flow_limits
