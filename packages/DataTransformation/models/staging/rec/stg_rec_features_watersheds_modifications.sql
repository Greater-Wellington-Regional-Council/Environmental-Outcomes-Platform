WITH source AS (
  SELECT *
  FROM {{ source('public', 'rec_watersheds_modifications') }}
)

SELECT
  hydro_id,
  nz_segment,
  geom,
  created_at
FROM source
