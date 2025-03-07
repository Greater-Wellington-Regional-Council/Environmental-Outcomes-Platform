ALTER TABLE freshwater_management_units
    DROP COLUMN cultural_overview,
    DROP COLUMN implementation_ideas,
    DROP COLUMN other_info,
    DROP COLUMN vpo,
    ADD COLUMN farm_plan_info JSONB;
