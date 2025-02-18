WITH source AS (

  SELECT * FROM {{ source('public', 'council_plan_boundary_rec2_source') }}

)


SELECT
  council_id,
  source_id,
  hydro_ids,
  excluded_hydro_ids,
  created_at,
  updated_at

FROM source
