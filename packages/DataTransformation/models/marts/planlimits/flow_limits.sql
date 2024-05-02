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

  SELECT * FROM {{ ref('plans') }}
),

plan_regions AS (

  SELECT * FROM {{ ref('plan_regions') }}
),

flow_measurement_sites as (

  SELECT * FROM {{ ref('flow_measurement_sites')}}
),

temp_plan_regions AS (

  SELECT

    p.council_id,
    p.id AS plan_id,
    JSONB_ARRAY_ELEMENTS(document -> 'regions') AS region

  FROM council_plan_documents AS cpd

  INNER JOIN plans AS p ON cpd.council_id = p.council_id
),

temp_flow_limits AS (

  SELECT 

    tpr.council_id,
    pr.id as plan_region_id,
    JSONB_ARRAY_ELEMENTS(region -> 'minimumFlowLimits' -> 'limits') AS minimum_flow_limits
  
  FROM temp_plan_regions tpr

    INNER JOIN plan_regions pr
      ON tpr.plan_id = pr.plan_id 
        AND tpr.region ->> 'id' = pr.source_id
),

flow_limits AS (

  SELECT

    ROW_NUMBER() OVER () AS id,
    plan_region_id,
    minimum_flow_limits ->> 'id' AS source_id,
    CAST(minimum_flow_limits  ->> 'limit' AS INT) AS minimum_flow,
    (
      SELECT
        id
      FROM flow_measurement_sites fms
      WHERE fms.plan_region_id = tfl.plan_region_id
      AND fms.source_id = minimum_flow_limits ->> 'measuredAtId'

    ) AS measured_at_site_id,
    (
      SELECT
        boundary
      FROM council_plan_boundaries
      WHERE council_id = tfl.council_id
      AND source_id = tfl.minimum_flow_limits ->> 'boundaryId'

    ) AS boundary

  FROM temp_flow_limits tfl
)

SELECT * FROM flow_limits