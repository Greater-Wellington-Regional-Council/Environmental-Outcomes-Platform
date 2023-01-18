-- pg_tileserve only provides access to tables including a geometry column with
-- an explicit SRID. So we set one for rivers here.
-- https://github.com/CrunchyData/pg_tileserv#table-layers
ALTER TABLE rivers ALTER COLUMN geom TYPE geometry (GEOMETRY, 4326);

-- Wrap the table in a view to be more explicit about access for the eop_manager_tileserver_user
CREATE OR REPLACE VIEW river_tile_features AS SELECT hydro_id, geom, stream_order FROM rivers;

GRANT USAGE ON SCHEMA public TO eop_tileserver_user;
GRANT SELECT ON river_tile_features TO eop_tileserver_user;

