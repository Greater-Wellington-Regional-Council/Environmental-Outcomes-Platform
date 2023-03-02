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

UPDATE  allocation_amounts
SET parent_surfacewater_unit_id = 16
WHERE id IN (9, 11);

UPDATE  allocation_amounts
SET parent_surfacewater_unit_id = 29
WHERE id IN (
  1,2,3,4,5,6,8,
  10,12,13,14,
  45,46,47,48,
  54,55,56,58,
  61,67,68,69,
  70,73,
  80
);
