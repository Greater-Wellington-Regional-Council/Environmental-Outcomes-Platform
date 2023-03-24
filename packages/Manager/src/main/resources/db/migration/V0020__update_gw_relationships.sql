UPDATE allocation_amounts
SET parent_surfacewater_unit_id = 29
WHERE id IN (9, 11, 49, 81);

UPDATE allocation_amounts
SET parent_surfacewater_unit_id = 16
WHERE id IN (
             1, 2, 3, 4, 5, 6, 8, 10,
             12, 13, 14,
             45, 46, 47, 48,
             54, 55, 56, 57, 58, 59,
             60, 61, 62, 63, 64, 65, 66, 67, 68, 69,
             70, 71, 72, 73, 74,
             80
  );
