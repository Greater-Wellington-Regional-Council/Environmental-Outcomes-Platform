SET CLIENT_ENCODING TO UTF8;

SET STANDARD_CONFORMING_STRINGS TO ON;

CREATE SEQUENCE freshwater_management_units_id_seq;

CREATE TABLE freshwater_management_units
(
    id INTEGER PRIMARY KEY DEFAULT nextval('freshwater_management_units_id_seq'),
    LIKE freshwater_management_units_raw INCLUDING ALL

);

CREATE INDEX ON freshwater_management_units USING GIST ("geom");

ANALYZE freshwater_management_units;