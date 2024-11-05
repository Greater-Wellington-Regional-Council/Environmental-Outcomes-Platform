SET CLIENT_ENCODING TO UTF8;
SET STANDARD_CONFORMING_STRINGS TO ON;

UPDATE freshwater_management_units
SET implementation_ideas = NULL;

ALTER TABLE freshwater_management_units
    ALTER COLUMN implementation_ideas SET DATA TYPE jsonb USING implementation_ideas::jsonb,
    ADD COLUMN cultural_overview jsonb;
