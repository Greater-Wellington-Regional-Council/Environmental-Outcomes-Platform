
CREATE OR REPLACE VIEW observed_water_use_aggregated_daily AS 

WITH filtered_obs AS (
         SELECT osm.site_id,
            date(o.observed_at) AS day_observed_at,
            osm.measurement_name,
            o.amount
           FROM observations o
             LEFT JOIN observation_sites_measurements osm ON o.observation_measurement_id = osm.id
          WHERE (osm.measurement_name::text = ANY (ARRAY['Water Meter Reading'::text, 'Water Meter Volume'::text])) 
          AND o.observed_at > '2023-01-01 00:00:00+13'::timestamp with time zone
        )
  SELECT filtered_obs.site_id,
      filtered_obs.day_observed_at,
      filtered_obs.measurement_name,
          CASE
              WHEN filtered_obs.measurement_name::text = 'Water Meter Reading'::text THEN max(filtered_obs.amount) - min(filtered_obs.amount)
              WHEN filtered_obs.measurement_name::text = 'Water Meter Volume'::text THEN avg(filtered_obs.amount) * 86.4
              ELSE 0::numeric
          END AS daily_usage
    FROM filtered_obs
    GROUP BY 
    filtered_obs.site_id,
    filtered_obs.day_observed_at, 
    filtered_obs.measurement_name;

