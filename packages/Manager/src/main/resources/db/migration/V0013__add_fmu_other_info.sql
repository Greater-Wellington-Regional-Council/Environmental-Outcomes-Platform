SET CLIENT_ENCODING TO UTF8;
SET STANDARD_CONFORMING_STRINGS TO ON;

ALTER TABLE freshwater_management_units
    ADD COLUMN other_info jsonb,
    ADD COLUMN vpo jsonb;
