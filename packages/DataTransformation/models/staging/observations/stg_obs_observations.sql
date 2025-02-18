WITH source AS (

  SELECT

    observation_measurement_id,
    amount,
    observed_at,
    created_at,
    updated_at

  FROM {{ source('public', 'observations') }}
  WHERE observed_at >= CURRENT_DATE - INTERVAL '372 days'
)

SELECT * FROM source
