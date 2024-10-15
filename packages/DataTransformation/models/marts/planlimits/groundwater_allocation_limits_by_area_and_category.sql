{{ config(
    materialized = 'view'
) }}

WITH water_allocations AS (

  SELECT * FROM {{ ref('stg_planlimits_water_allocations') }}
),

ground_water_limits AS (

  select * from {{ ref('groundwater_limits') }}
),

groundwater_allocations AS (

  SELECT
    area_id,
    category,
    SUM(allocation_plan) AS allocation_amount

  FROM water_allocations
  WHERE
    effective_to IS NULL AND status = 'active'
    AND category IN ('B', 'C', 'B/C') AND area_id LIKE ('%GW')

  GROUP BY 1, 2

),

groundwater_allocation_by_area_and_category AS(

  SELECT
	area_id,
	COALESCE(SUM(CASE WHEN category = 'B' THEN allocation_amount END), 0) AS category_B,
    COALESCE(SUM(CASE WHEN category = 'B/C' THEN allocation_amount END), 0) AS category_BC,
    COALESCE(SUM(CASE WHEN category = 'C' THEN allocation_amount END), 0) AS category_C,
    COALESCE(SUM(CASE WHEN category IN ('B', 'C','B/C') THEN allocation_amount END), 0) AS total_allocation

  FROM groundwater_allocations group by 1

 )

SELECT
   area_id,
   category_B,
   category_BC,
   category_C,
   total_allocation,
   gwl.allocation_limit,
   ROUND(
     (total_allocation * 100.0) /gwl.allocation_limit, 1
   ) AS pnrp_allocation_percentage,
   gwl.name,
   gwl.plan_region_id

 FROM groundwater_allocation_by_area_and_category gw
 LEFT JOIN ground_water_limits gwl
   ON gwl.source_id = gw.area_id