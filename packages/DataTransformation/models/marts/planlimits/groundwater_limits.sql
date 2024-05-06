{{ config(
    materialized = 'view'
) }}

WITH council_plan_documents AS (

  SELECT * FROM {{ ref('stg_planlimits_council_plan_documents') }}
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

groundwater_limits AS (

  SELECT

    ROW_NUMBER() OVER () AS id,
    plan_region_id,
    groundwater_limit ->> 'id' AS source_id,
    groundwater_limit ->> 'name' AS name,
    CAST(groundwater_limit ->> 'allocationLimit' AS INT) AS allocation_limit

  FROM temp_groundwater_limits
)

SELECT * FROM groundwater_limits