WITH source AS (

  SELECT

    id,
    council_id,
    name,
    location,
    created_at,
    updated_at

  FROM {{ source('public', 'observation_sites') }}
)

SELECT * FROM source
