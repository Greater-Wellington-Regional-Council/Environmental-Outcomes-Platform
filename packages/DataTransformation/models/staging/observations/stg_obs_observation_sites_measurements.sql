WITH source AS (

  SELECT

    id,
    site_id,
    measurement_name,
    first_observation_at,
    last_observation_at,
    observation_count,
    created_at,
    updated_at

  FROM {{ source('public', 'observation_sites_measurements') }}
)

SELECT * FROM source
