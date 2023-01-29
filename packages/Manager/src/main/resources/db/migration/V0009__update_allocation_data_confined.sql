UPDATE allocation_amounts
SET allocation_amount=1550000
WHERE id=6;

UPDATE allocation_amounts
SET allocation_amount=350000
WHERE id=7;

INSERT INTO allocation_amounts
  (
    id,
    take_type,
    management_unit_type,
    area_description,
    surfacewater_subunit_name,
    parent_surfacewatersubunit_id,
    hydro_id,
    excluded_hydro_ids,
    allocation_amount,
    allocation_amount_unit,
    consented_allocation_greater_than_allocation_amount,
    catchment_management_unit,
    plan_version,
    plan_table
  )
VALUES
  (
    55,
    'GROUNDWATER',
    NULL,
    'Upper Ruamāhanga Category A groundwater',
    NULL,
    18,
    NULL,
    NULL,
    NULL,
    '',
    FALSE,
    'Upper Ruamāhanga',
    'final appeals version 2022',
    7.3
  );
