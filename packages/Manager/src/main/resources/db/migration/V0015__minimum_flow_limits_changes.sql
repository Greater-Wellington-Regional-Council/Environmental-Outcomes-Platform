UPDATE allocation_amounts
SET surfacewater_subunit_name='Otukura Stream and tributaries above the confluence with Dock/Stonestead Creek'
WHERE id=30;

UPDATE minimum_flow_limits
SET excluded_hydro_ids='{259497, 257578, 256291, 254602,259523}'
WHERE id=9;

UPDATE minimum_flow_limits
SET hydro_id = 259613
WHERE id=6;

UPDATE minimum_flow_limits
SET excluded_hydro_ids='{260015,261930,262397,260343,258982,259960,262349,262,268}' 
WHERE id=12;

UPDATE minimum_flow_limits
SET hydro_id = 262349
WHERE id=10;
