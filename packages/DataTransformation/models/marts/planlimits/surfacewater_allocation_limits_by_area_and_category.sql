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

    generate_month_ends AS (
        SELECT 
            month_start,
            (month_start + INTERVAL '1 month' - INTERVAL '1 day') AS month_end
        FROM generate_months
    ),

     water_allocations_at_month_end AS (
        SELECT
            m.month_start,
            m.month_end,
            t.*
        FROM generate_month_ends m
        LEFT JOIN water_allocations t
            ON 
                ( 
                    -- For past and future months: effective_from <= month_end
                    t.effective_from <= m.month_end
                    -- For the current month: effective_from must be <= today
                    OR (m.month_end = (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day') 
                        AND t.effective_from <= CURRENT_DATE)
                )
                AND 
                (
                    -- Keep records where effective_to is NULL or after the month end
                    t.effective_to IS NULL OR t.effective_to > m.month_end
                )
                -- Exclude records where effective_to is before today in the current month
                AND NOT (
                    m.month_end = (DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day') 
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

         FROM water_allocations_at_month_end
         WHERE
             status = 'active'
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