TRUNCATE TABLE observations RESTART IDENTITY CASCADE;
TRUNCATE TABLE observation_sites_measurements RESTART IDENTITY CASCADE;
TRUNCATE TABLE observation_sites RESTART IDENTITY CASCADE;

INSERT INTO observation_sites(council_id, name, location)
SELECT 9, CONCAT('TEST-METER-', LPAD(num::varchar, 2, '0')), null FROM (SELECT generate_series(0, 50) AS num) AS subquery;

INSERT INTO observation_sites_measurements(site_id, measurement_name, first_observation_at, last_observation_at, observation_count)
SELECT id, 'Water Meter Reading', '2000-01-01', '2099-01-01', 0
FROM observation_sites
WHERE council_id = 9;

SELECT pg_temp.insert_observation_data(osm.id) FROM observation_sites_measurements osm;
