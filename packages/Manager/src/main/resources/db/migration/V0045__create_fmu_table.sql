SET CLIENT_ENCODING TO UTF8;

SET STANDARD_CONFORMING_STRINGS TO ON;

CREATE SEQUENCE farm_management_units_id_seq;

CREATE TABLE farm_management_units AS
SELECT
    nextval('farm_management_units_id_seq') AS id,
    *
FROM farm_management_units_raw;

CREATE INDEX ON farm_management_units USING GIST ("geom");

ANALYZE farm_management_units;