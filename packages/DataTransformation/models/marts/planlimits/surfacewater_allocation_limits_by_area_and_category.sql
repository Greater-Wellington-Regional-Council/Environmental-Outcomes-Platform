{{ config(
    materialized = 'view'
) }}

WITH water_allocations AS (

  SELECT * FROM {{ ref('stg_planlimits_water_allocations') }}
),

surface_water_limits AS (

  select * from {{ ref('surface_water_limits') }}
),

surfacewater_allocations AS (

  SELECT

    area_id,
    category,
    SUM(allocation_plan) AS allocation_amount

  FROM water_allocations
  WHERE
    effective_to IS NULL AND status = 'active'
    AND category IN ('A', 'B', 'ST') AND area_id LIKE ('%SW')

  GROUP BY 1, 2

),

surfacewater_allocation_by_area_and_category AS(

  SELECT
	area_id,
	COALESCE(SUM(CASE WHEN category = 'A' THEN allocation_amount END), 0) AS category_A,
    COALESCE(SUM(CASE WHEN category = 'B' THEN allocation_amount END), 0) AS category_B,
    COALESCE(SUM(CASE WHEN category = 'ST' THEN allocation_amount END), 0) AS surface_take,
    COALESCE(SUM(CASE WHEN category IN ('A', 'B','ST') THEN allocation_amount END), 0) AS total_allocation

  FROM surfacewater_allocations group by 1

 )

 SELECT
   area_id,
   category_A,
   category_B,
   surface_take,
   total_allocation,
   swl.allocation_limit,
   ROUND(
     (total_allocation * 100.0) /swl.allocation_limit, 1
   ) AS pnrp_allocation_percentage,
   swl.name,
   swl.plan_region_id

 FROM surfacewater_allocation_by_area_and_category sw
 LEFT JOIN surface_water_limits swl
   ON swl.source_id = sw.area_id