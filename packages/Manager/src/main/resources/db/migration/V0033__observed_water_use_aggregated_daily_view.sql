CREATE OR REPLACE VIEW observed_water_use_aggregated_daily AS

WITH filtered_obs AS (SELECT osm.site_id,
                             date(o.observed_at AT TIME ZONE 'NZST') AS day_observed_at,
                             osm.measurement_name,
                             o.amount
                      FROM observations o
                               LEFT JOIN observation_sites_measurements osm ON o.observation_measurement_id = osm.id
                      WHERE osm.measurement_name IN ('Water Meter Reading', 'Water Meter Volume')
                        AND o.observed_at > '2023-01-01 00:00:00+13')
SELECT filtered_obs.site_id,
       filtered_obs.day_observed_at,
       filtered_obs.measurement_name,
       CASE
           WHEN filtered_obs.measurement_name = 'Water Meter Reading' THEN MAX(filtered_obs.amount) - MIN(filtered_obs.amount)
           WHEN filtered_obs.measurement_name = 'Water Meter Volume' THEN SUM(filtered_obs.amount)
           END AS daily_usage
FROM filtered_obs
GROUP BY filtered_obs.site_id,
         filtered_obs.day_observed_at,
         filtered_obs.measurement_name;
