{{ config(
    materialized = 'view'
) }}

{# {% import "macros/generate_date_series.sql" as macros %} #}

WITH water_allocations AS (

  SELECT * FROM {{ ref('stg_planlimits_water_allocations') }}
),

all_consents AS (

  SELECT DISTINCT source_id FROM water_allocations

),

days_in_last_year AS (

  SELECT
    {{ generate_date_series('NOW()', 'NOW()', "INTERVAL '1 DAY'") }} AS effective_on

),

data_per_day AS (

  SELECT *
  FROM
    all_consents
  CROSS JOIN days_in_last_year
),

effective_daily_data AS (

  SELECT

    dpd.source_id,
    dpd.effective_on,
    wa.area_id,
    wa.allocation_plan,
    wa.consent_id,
    wa.status,
    wa.is_metered,
    wa.allocation_daily,
    wa.allocation_yearly,
    wa.meters

  FROM
    data_per_day AS dpd
  LEFT JOIN
    LATERAL
    (
      SELECT *
      FROM
        water_allocations AS wai
      WHERE
        wai.source_id = dpd.source_id
        AND DATE(dpd.effective_on) >= DATE(wai.effective_from)
        AND (wai.effective_to IS NULL OR DATE(dpd.effective_on) < DATE(wai.effective_to))
      ORDER BY wai.effective_from DESC
      LIMIT 1
    ) AS wa ON dpd.source_id = wa.source_id
)

SELECT * FROM effective_daily_data
