{{ config(
    materialized = 'view'
) }}

WITH water_allocations AS (

  SELECT * FROM {{ ref('stg_planlimits_water_allocations') }}
),

water_allocations_by_area AS (

  SELECT

    area_id,
    SUM(allocation_plan) AS allocation_amount

  FROM water_allocations
  WHERE
    effective_to IS NULL 
  AND 
    status = 'active'
  
  GROUP BY 1

),

water_allocations_ruamahangasw AS (

  SELECT

    'RuamahangaTotalSW' AS area_id,
    SUM(allocation_plan) AS allocation_amount
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
    'WaipouaSW'
  )
  AND
    effective_to IS NULL
  AND 
    status = 'active'

),

water_allocations_lakewairarapasw AS (

  SELECT

    'LakeWairarapaTotalSW' AS area_id,
    SUM(allocation_plan) AS allocation_amount
  FROM water_allocations

  WHERE area_id IN (
    'LakeWairarapaSW',
    'OtukuraSW',
    'TauherenikauSW'
  )
  AND
    effective_to IS NULL
  AND 
    status = 'active'

)

SELECT * FROM water_allocations_by_area
UNION ALL
SELECT * FROM water_allocations_ruamahangasw
UNION ALL
SELECT * FROM water_allocations_lakewairarapasw
