{{ config(
    materialized = 'view'
) }}

WITH geom_source AS (

  SELECT
    council_id,
    source_id,
    boundary
  FROM {{ ref('stg_council_plan_boundary_geom_source') }}
),

rec2_data AS (

  SELECT
    council_id,
    source_id,
    boundary
  FROM {{ ref('council_plan_boundary_rec2_data') }}
),

geojson_data AS (

  SELECT
    council_id,
    source_id,
    boundary
  FROM {{ ref('stg_council_plan_boundary_geojson_data') }}
),

combined_data AS (
  SELECT * FROM geom_source
  UNION ALL
  SELECT * FROM rec2_data
  UNION ALL
  SELECT * FROM geojson_data
)

SELECT * FROM combined_data
