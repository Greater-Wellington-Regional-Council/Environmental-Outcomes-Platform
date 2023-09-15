
CREATE VIEW observed_water_use_aggregated_daily AS

-- Water Meter Reading
SELECT
  site_id,
  DATE(observed_at) AS day_observed_at,
  measurement_name,
  MAX(amount) - MIN(amount) AS daily_usage
FROM
  observations o
LEFT JOIN
  observation_sites_measurements osm 
    ON o.observation_measurement_id = osm.id
WHERE osm.measurement_name = 'Water Meter Reading'
GROUP BY
  site_id,
  day_observed_at,
  measurement_name

UNION ALL
 
-- Water Meter Volume
SELECT 
  site_id,
  DATE(observed_at) as observation_date,
  measurement_name,
  avg(amount) * 86.4 as daily_usage -- convert l/s to m3/day
FROM 
   observations o
LEFT JOIN observation_sites_measurements osm 
    ON o.observation_measurement_id = osm.id 
WHERE measurement_name = 'Water Meter Volume'
GROUP BY 
    site_id, 
    observation_date, 
    measurement_name
ORDER BY 
 	site_id,
 	day_observed_at,
 	measurement_name

