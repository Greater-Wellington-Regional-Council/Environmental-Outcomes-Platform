CREATE
OR REPLACE VIEW water_allocations_by_area (area_id, allocation_amount) AS
SELECT
  area_id,
  sum(allocation_plan) as allocation_amount
FROM
  water_allocations
WHERE
  effective_to is null
GROUP BY
  area_id

UNION ALL

SELECT
'RuamahangaTotalSW' AS area_id
, sum(allocation_plan) as allocation_amount
FROM water_allocations
WHERE area_id IN (
'BoothsSW',
'HuangaruaSW',
'KopuarangaSW',
'MangatarereSW',
'PapawaiSW',
'ParkvaleSW',
'Ruamahanga_LowerSW',
'Ruamahanga_MiddleSW',
'Ruamahanga_UpperSW',
'WaingawaSW',
'WaiohineSW',
'WaipouaSW')