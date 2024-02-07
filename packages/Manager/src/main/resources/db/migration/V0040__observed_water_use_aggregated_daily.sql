CREATE OR REPLACE VIEW observed_water_use_aggregated_daily AS

WITH filtered_obs AS (SELECT osm.id,
                             osm.site_id,
                             os.name as site_name,
                             date(o.observed_at AT TIME ZONE 'NZST') AS day_observed_at,
                             osm.measurement_name,
                             o.amount
                      FROM observations o
                               LEFT JOIN observation_sites_measurements osm ON o.observation_measurement_id = osm.id
                               LEFT JOIN observation_sites os ON os.id = osm.site_id
                      WHERE osm.measurement_name IN ('Water Meter Reading', 'Water Meter Volume')
                        AND o.observed_at > '2022-11-01 00:00:00+12'),

daily_calculation AS (

SELECT filtered_obs.site_name,
       filtered_obs.day_observed_at,
       filtered_obs.measurement_name,
       CASE
           -- first condition: caculate usage for water meter volume measurements
           WHEN filtered_obs.measurement_name = 'Water Meter Volume' THEN SUM(filtered_obs.amount)
           -- second condition: return null for observations less frequent than daily
	         WHEN count(*) = 1 AND LAG(max(day_observed_at)) OVER (PARTITION BY id, measurement_name ORDER BY id, filtered_obs.day_observed_at, measurement_name) != day_observed_at - interval '1 day' THEN NULL
           -- third condition: return usage by comparing with the record from the previous day for observations recorded once per day 
	         WHEN count(*) = 1 THEN max(filtered_obs.amount) - LAG(max(filtered_obs.amount)) OVER (PARTITION BY id, measurement_name ORDER BY id, filtered_obs.day_observed_at, measurement_name)
            -- fourth condition: return usage based on observations within the day
           WHEN filtered_obs.measurement_name = 'Water Meter Reading' THEN MAX(filtered_obs.amount) - MIN(filtered_obs.amount)
           END AS daily_usage
FROM filtered_obs
GROUP BY filtered_obs.id,
         filtered_obs.site_name,
         filtered_obs.day_observed_at,
         filtered_obs.measurement_name
),

duplication_dates AS (
    SELECT
        site_name,
        day_observed_at,
        MIN(day_observed_at) OVER (PARTITION BY site_name) AS min_duplication_date
    FROM
        daily_calculation
    GROUP BY
        site_name, day_observed_at
    HAVING
        COUNT(DISTINCT measurement_name) > 1
),

PreviousMeasurement AS (
    SELECT
        dc.site_name,
        dc.day_observed_at,
        dc.measurement_name,
        dc.daily_usage,
        CASE
            WHEN d.day_observed_at IS NULL THEN 'No Duplication'
            ELSE 'Duplication'
        END AS duplication_status
    FROM
        daily_calculation dc
    LEFT JOIN
        duplication_dates d ON dc.site_name = d.site_name AND dc.day_observed_at = d.day_observed_at
 
),
NonDuplicateMeasurements AS (
    SELECT
        site_name,
        day_observed_at,
        measurement_name,
        daily_usage,
        duplication_status,
        CASE
            WHEN duplication_status = 'No Duplication' THEN measurement_name
            ELSE NULL
        END AS non_duplicate_measurement
    FROM
        PreviousMeasurement
),
FilledMeasurements AS (
    SELECT
        site_name,
        day_observed_at,
        measurement_name,
        duplication_status,
        COALESCE(non_duplicate_measurement,
                 FIRST_VALUE(non_duplicate_measurement) OVER (
                     PARTITION BY site_name ORDER BY day_observed_at
                     ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW
                 ),
                             LAST_VALUE(non_duplicate_measurement) OVER (
                PARTITION BY site_name ORDER BY day_observed_at
                ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING
            )
                 ) AS filled_measurement
    FROM
        NonDuplicateMeasurements
)
SELECT
*
FROM
    FilledMeasurements ORDER BY site_name, day_observed_at
    WHERE measurement_name != filled_measurement
