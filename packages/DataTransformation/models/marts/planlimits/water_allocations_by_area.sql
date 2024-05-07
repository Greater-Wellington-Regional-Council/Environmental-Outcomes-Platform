{{ config(
    materialized = 'view'
) }}

WITH water_allocations AS (

  SELECT * FROM {{ ref('stg_planlimits_water_allocations') }}
),

water_allocations_by_area AS (

  SELECT

    area_id,
    SUM(allocation_plan) AS allocation_amount

  FROM water_allocations
  WHERE
    effective_to IS NULL
  GROUP BY 1

)

SELECT * FROM water_allocations_by_area
