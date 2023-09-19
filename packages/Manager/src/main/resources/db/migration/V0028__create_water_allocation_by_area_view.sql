CREATE
OR REPLACE VIEW water_allocations_by_area (area_id, allocation_amount) AS
SELECT
  area_id,
  sum(allocation) as allocation_amount
FROM
  water_allocations
WHERE
  effective_to is null
GROUP BY
  area_id