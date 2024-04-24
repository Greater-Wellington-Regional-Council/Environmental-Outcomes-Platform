WITH source AS (

  SELECT

    id,
    council_id,
    source_id,
    boundary,
    created_at,
    updated_at

  FROM {{ source('public', 'council_plan_boundaries') }}
)

SELECT * FROM source
