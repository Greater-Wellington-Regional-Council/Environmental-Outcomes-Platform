ALTER TABLE minimum_flow_limits ADD hydro_ids INTEGER[];
UPDATE minimum_flow_limits SET hydro_ids[1] = hydro_id;
UPDATE minimum_flow_limits SET hydro_ids = '{263375,263134,263119,263054,263017,263454,263616,263615}', created_at = NOW() WHERE id = 14;
UPDATE minimum_flow_limits SET hydro_ids = '{250169}', created_at = NOW() WHERE id = 19;
ALTER TABLE minimum_flow_limits ALTER COLUMN hydro_ids SET NOT NULL;

ALTER TABLE minimum_flow_limit_boundaries ALTER COLUMN hydro_id DROP NOT NULL;
ALTER TABLE minimum_flow_limit_boundaries ALTER COLUMN excluded_hydro_ids DROP NOT NULL;

ALTER TABLE allocation_amounts ADD hydro_ids INTEGER[];
UPDATE allocation_amounts SET hydro_ids[1] = hydro_id WHERE hydro_id IS NOT NULL;
UPDATE allocation_amounts SET hydro_ids = '{263375,263134,263119,263054,263017,263454,263616,263615}', created_at = NOW() WHERE id = 32;
UPDATE allocation_amounts SET hydro_ids = '{250169}', created_at = NOW() WHERE id = 38;

ALTER TABLE surface_water_management_boundaries ALTER COLUMN hydro_id DROP NOT NULL;
ALTER TABLE surface_water_management_boundaries ALTER COLUMN excluded_hydro_ids DROP NOT NULL;
