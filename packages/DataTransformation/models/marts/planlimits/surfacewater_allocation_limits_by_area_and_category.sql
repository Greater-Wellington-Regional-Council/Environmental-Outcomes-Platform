{{ config(
    materialized = 'view'
) }}

WITH water_allocations AS (

    SELECT * FROM {{ ref('stg_planlimits_water_allocations') }}
),

     generate_months AS (

         SELECT
             {{ generate_month_series("'2024-01-01'", 'CURRENT_DATE') }} AS month_start

     ),

     water_allocations_at_month_start AS(

         SELECT

             m.month_start,
             t.*
         FROM
             generate_months m

                 LEFT JOIN
             water_allocations t
             ON 
                ( 
                    -- For past and future months: effective_from <= month_start
                    t.effective_from <= m.month_start
                    -- For the current month: effective_from must be <= today
                    OR (m.month_start = DATE_TRUNC('month', CURRENT_DATE) AND t.effective_from <= CURRENT_DATE)
                )
                AND 
                (
                    -- Keep records where effective_to is NULL or after the month start
                    t.effective_to IS NULL OR t.effective_to > m.month_start
                )
                -- Exclude records where effective_to is before today in the current month
                AND NOT (
                    m.month_start = DATE_TRUNC('month', CURRENT_DATE) 
                    AND t.effective_to < CURRENT_DATE
                )
     ),

     surface_water_limits AS (

         SELECT * FROM {{ ref('surface_water_limits') }}
     ),

     surfacewater_allocations AS (

         SELECT
             month_start,
             area_id,
             category,
             SUM(allocation_plan) AS allocation_amount

         FROM water_allocations_at_month_start
         WHERE
             effective_to IS NULL AND status = 'active'
           AND category IN ('A', 'B', 'ST') AND area_id LIKE ('%SW')

         GROUP BY 1, 2, 3

     ),

     surfacewater_allocation_by_area_and_category AS(

         SELECT
             month_start,
             area_id,
             COALESCE(SUM(CASE WHEN category = 'A' THEN allocation_amount END), 0) AS category_A,
             COALESCE(SUM(CASE WHEN category = 'B' THEN allocation_amount END), 0) AS category_B,
             COALESCE(SUM(CASE WHEN category = 'ST' THEN allocation_amount END), 0) AS surface_take,
             COALESCE(SUM(CASE WHEN category IN ('A', 'B','ST') THEN allocation_amount END), 0) AS total_allocation

         FROM surfacewater_allocations group by 1, 2

     )

SELECT
    month_start,
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