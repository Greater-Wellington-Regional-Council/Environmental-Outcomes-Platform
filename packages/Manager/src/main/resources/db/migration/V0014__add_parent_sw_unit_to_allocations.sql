ALTER TABLE allocation_amounts ADD COLUMN parent_surfacewater_unit_id INTEGER NULL;

UPDATE allocation_amounts
SET
  parent_surfacewater_unit_id = parent_surfacewatersubunit_id,
  parent_surfacewatersubunit_id = NULL
WHERE id IN (
	SELECT aa.id
	FROM allocation_amounts aa
	INNER JOIN allocation_amounts paa
	ON aa.parent_surfacewatersubunit_id = paa.id
	WHERE paa.management_unit_type = 'MANAGEMENT_UNIT'
);
