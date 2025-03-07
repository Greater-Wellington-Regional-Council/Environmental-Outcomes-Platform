--- Set SRID of FMU geom column to 4326 for new rows if no SRID is set
CREATE OR REPLACE FUNCTION set_srid()
    RETURNS TRIGGER AS $$
BEGIN
    IF ST_SRID(NEW.geom) = 0 THEN
        NEW.geom := ST_SetSRID(NEW.geom, 4326);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE freshwater_management_units
    ALTER COLUMN geom TYPE geometry(GEOMETRY, 4326)
        USING ST_SetSRID(geom, 4326);

