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

temp_plan_regions AS (

  SELECT * FROM {{ ref('int_temp_plan_regions')}}
),

temp_flow_measurement_sites AS (

  SELECT 

    tpr.council_id,
    pr.id as plan_region_id,
    JSONB_ARRAY_ELEMENTS(region -> 'minimumFlowLimits' -> 'measurementSites') AS minimum_flow_sites
  
  FROM temp_plan_regions tpr

    INNER JOIN plan_regions pr
      ON tpr.plan_id = pr.plan_id 
        AND tpr.region ->> 'id' = pr.source_id
),

flow_measurement_sites AS (

  SELECT

    ROW_NUMBER() OVER () AS id,
    plan_region_id,
    minimum_flow_sites ->> 'id' AS source_id,
    minimum_flow_sites ->> 'name' AS name,
    (
      SELECT
        boundary
      FROM council_plan_boundaries
      WHERE council_id = temp_flow_measurement_sites.council_id
      AND source_id = minimum_flow_sites ->> 'geometryId'
    ) AS location

  FROM temp_flow_measurement_sites 
)

SELECT * FROM flow_measurement_sites