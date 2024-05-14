WITH source AS (

  SELECT * FROM {{ source('public', 'council_plan_boundary_geojson_source') }}

)


SELECT
  id,
  council_id,
  source_id,
  url,
  feature_id,
  created_at,
  updated_at

FROM source
