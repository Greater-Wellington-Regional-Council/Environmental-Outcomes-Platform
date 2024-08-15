WITH source AS (

  SELECT * FROM {{ source('public', 'council_plan_boundary_geom_source') }}

)


SELECT
  council_id,
  source_id,
  boundary,
  created_at,
  updated_at

FROM source
