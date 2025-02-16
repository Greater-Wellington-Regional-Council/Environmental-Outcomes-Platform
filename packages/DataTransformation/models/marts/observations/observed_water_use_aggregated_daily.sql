{{ config(materialized = 'table') }}

WITH observations AS (

  SELECT * FROM {{ ref('stg_obs_observations') }}
  WHERE observed_at >= CURRENT_DATE - INTERVAL '372 days';

),

observation_sites_measurements AS (

  SELECT * FROM {{ ref('stg_obs_observation_sites_measurements') }}
),

observation_sites AS (

  SELECT * FROM {{ ref('stg_obs_observation_sites') }}
),

filtered_obs AS (

  SELECT

    osm.id,
    osm.site_id,
    os.name AS site_name,
    osm.measurement_name,
    o.amount,
    DATE(o.observed_at AT TIME ZONE 'NZST') AS day_observed_at

  FROM observations AS o

  LEFT JOIN observation_sites_measurements AS osm ON o.observation_measurement_id = osm.id
  LEFT JOIN observation_sites AS os ON osm.site_id = os.id

  WHERE
    osm.measurement_name IN ('Water Meter Reading', 'Water Meter Volume')
),

first_values AS (

  SELECT DISTINCT
    site_name,
    day_observed_at,
    measurement_name,
    FIRST_VALUE(amount) OVER (
      PARTITION BY site_name, day_observed_at, measurement_name
      ORDER BY site_name, day_observed_at, measurement_name
    ) AS first_value

  FROM filtered_obs
),

last_values AS (

  SELECT DISTINCT
    site_name,
    day_observed_at,
    measurement_name,
    LAST_VALUE(amount) OVER (
      PARTITION BY site_name, day_observed_at, measurement_name
      ORDER BY site_name, day_observed_at, measurement_name ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
    ) AS last_value

  FROM filtered_obs
  WHERE amount != 0

),

daily_calculation AS (

  SELECT

    filtered_obs.site_name,
    filtered_obs.day_observed_at,
    filtered_obs.measurement_name,

    CASE
      WHEN filtered_obs.measurement_name = 'Water Meter Volume' THEN SUM(filtered_obs.amount)
      WHEN COUNT(*) = 1 AND LAG(MAX(filtered_obs.day_observed_at)) OVER (
        PARTITION BY id, filtered_obs.measurement_name
        ORDER BY id, filtered_obs.day_observed_at, filtered_obs.measurement_name
      ) != filtered_obs.day_observed_at - INTERVAL '1 day' THEN NULL
      WHEN COUNT(*) = 1
        THEN MAX(filtered_obs.amount) - LAG(MAX(filtered_obs.amount)) OVER (
          PARTITION BY id, filtered_obs.measurement_name
          ORDER BY id, filtered_obs.day_observed_at, filtered_obs.measurement_name
        )
      WHEN filtered_obs.measurement_name = 'Water Meter Reading' THEN last_values.last_value - first_values.first_value
    END AS daily_usage

  FROM filtered_obs

  INNER JOIN
    first_values
    ON
      filtered_obs.site_name = first_values.site_name
      AND filtered_obs.day_observed_at = first_values.day_observed_at
      AND filtered_obs.measurement_name = first_values.measurement_name
  INNER JOIN
    last_values
    ON
      filtered_obs.site_name = last_values.site_name
      AND filtered_obs.day_observed_at = last_values.day_observed_at
      AND filtered_obs.measurement_name = last_values.measurement_name
  GROUP BY
    filtered_obs.id,
    filtered_obs.site_name,
    filtered_obs.day_observed_at,
    filtered_obs.measurement_name,
    first_values.first_value,
    last_values.last_value
),

duplication_dates AS (

  SELECT
    site_name,
    day_observed_at,
    MIN(day_observed_at) OVER (PARTITION BY site_name) AS min_duplication_date

  FROM daily_calculation
  GROUP BY
    1, 2
  HAVING
    COUNT(DISTINCT measurement_name) > 1

),

previous_measurement AS (

  SELECT

    dc.site_name,
    dc.day_observed_at,
    dc.measurement_name,
    dc.daily_usage,
    CASE
      WHEN d.day_observed_at IS NULL THEN 'No Duplication'
      ELSE 'Duplication'
    END AS duplication_status

  FROM daily_calculation AS dc

  LEFT JOIN duplication_dates AS d ON dc.site_name = d.site_name AND dc.day_observed_at = d.day_observed_at

),

non_duplicate_measurements AS (

  SELECT

    site_name,
    day_observed_at,
    measurement_name,
    daily_usage,
    duplication_status,
    CASE
      WHEN duplication_status = 'No Duplication' THEN measurement_name
    END AS non_duplicate_measurement

  FROM previous_measurement

),

filled_measurements AS (

  SELECT
    site_name,
    day_observed_at,
    measurement_name,
    daily_usage,
    duplication_status,
    COALESCE(
      non_duplicate_measurement,
      FIRST_VALUE(non_duplicate_measurement) OVER (
        PARTITION BY site_name ORDER BY day_observed_at
        ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
      ),
      LAST_VALUE(non_duplicate_measurement)
        OVER (
          PARTITION BY site_name ORDER BY day_observed_at
          ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
        )
    ) AS filled_measurement

  FROM
    non_duplicate_measurements
)

SELECT

  site_name,
  day_observed_at,
  daily_usage

FROM
  filled_measurements

WHERE measurement_name = filled_measurement
ORDER BY 1, 2
