WITH source AS (

  SELECT

    observation_measurement_id,
    amount,
    observed_at,
    created_at,
    updated_at

  FROM {{ source('public', 'observations') }}
)

SELECT * FROM source
