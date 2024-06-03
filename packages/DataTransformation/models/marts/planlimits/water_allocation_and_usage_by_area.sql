{{ config(materialized = 'table') }}

WITH effective_daily_consents AS (

  SELECT * FROM {{ ref('effective_daily_consents') }}
),

observed_water_use_aggregated_daily AS (

  SELECT * FROM {{ ref('observed_water_use_aggregated_daily') }}
),

all_days AS (

  SELECT DISTINCT DATE(effective_on) AS date
  FROM
    effective_daily_consents
),

all_areas AS (

  SELECT DISTINCT

    area_id,
    NULL::NUMERIC AS allocation_plan,
    NULL::NUMERIC AS allocation_daily,
    NULL::NUMERIC AS allocation_daily_used,
    NULL::NUMERIC AS daily_usage

  FROM
    effective_daily_consents
  WHERE
    area_id IS NOT NULL

),

all_areas_per_day AS (

  SELECT *
  FROM
    all_days
  CROSS JOIN all_areas

),

active_daily_consents AS (

  SELECT

    consent_id,
    area_id,
    allocation_plan,
    allocation_daily,
    allocation_yearly,
    is_metered,
    meters,
    status,
    DATE(effective_on) AS date

  FROM
    effective_daily_consents
  WHERE
    area_id IS NOT NULL
    AND status = 'active'
),

total_daily_allocation_by_area AS (

  SELECT

    date,
    area_id,
    SUM(allocation_plan) AS allocation_plan,
    SUM(allocation_daily) AS allocation_daily

  FROM
    active_daily_consents
  GROUP BY 1, 2
),

metered_daily_consents AS (

  SELECT *
  FROM
    active_daily_consents
  WHERE
    is_metered = TRUE
),

expanded_meters_per_consent_area AS (

  SELECT

    date,
    consent_id,
    area_id,
    UNNEST(meters) AS meter

  FROM
    metered_daily_consents
),

meter_use_by_consent_area AS (

  SELECT

    date,
    consent_id,
    area_id,
    meter,
    use.daily_usage

  FROM
    expanded_meters_per_consent_area
  LEFT JOIN observed_water_use_aggregated_daily AS use 
    ON date = day_observed_at AND meter = site_name

  WHERE meter NOT LIKE 'WAR%_Combined'
),

total_daily_use_by_consent_area AS (

  SELECT
    date,
    consent_id,
    area_id,
    SUM(daily_usage) AS daily_usage

  FROM
    meter_use_by_consent_area
  GROUP BY 1, 2, 3
),

effective_active_daily_consents_with_use AS (

  SELECT

    c.date,
    c.consent_id,
    c.area_id,
    c.allocation_daily,
    use.daily_usage

  FROM
    metered_daily_consents AS c
  INNER JOIN
    total_daily_use_by_consent_area AS use
    ON c.consent_id = use.consent_id AND c.area_id = use.area_id AND c.date = use.date

),

used_daily_allocation_by_area AS (

  SELECT

    date,
    area_id,
    SUM(allocation_daily) AS allocation_daily_used,
    SUM(daily_usage) AS daily_usage

  FROM
    effective_active_daily_consents_with_use
  WHERE
    daily_usage IS NOT NULL
  GROUP BY 1, 2
),

joined_daily_allocations AS (

  SELECT

    t.date,
    t.area_id,
    t.allocation_plan,
    t.allocation_daily,
    u.allocation_daily_used,
    u.daily_usage

  FROM
    total_daily_allocation_by_area AS t
  LEFT JOIN used_daily_allocation_by_area AS u ON t.date = u.date AND t.area_id = u.area_id

),

total_daily_allocation_by_area_joined_with_defaults AS (

  SELECT *
  FROM
    joined_daily_allocations

  UNION

  SELECT *
  FROM
    all_areas_per_day
),

final AS (

  SELECT

    date,
    area_id,
    SUM(allocation_plan) AS allocation_plan,
    SUM(allocation_daily) AS allocation_daily,
    SUM(allocation_daily_used) AS allocation_daily_used,
    SUM(daily_usage) AS daily_usage

  FROM
    total_daily_allocation_by_area_joined_with_defaults
  GROUP BY 1, 2
)

SELECT

  date,
  area_id,
  allocation_plan,
  allocation_daily,
  allocation_daily_used,
  daily_usage

FROM
  final
ORDER BY
  date
