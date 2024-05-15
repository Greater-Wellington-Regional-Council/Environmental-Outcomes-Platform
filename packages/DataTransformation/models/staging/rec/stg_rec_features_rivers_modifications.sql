WITH source AS (
  SELECT *
  FROM
    {{ source('public', 'rec_rivers_modifications') }}
)

SELECT
  hydro_id,
  next_hydro_id,
  nz_segment,
  is_headwater,
  stream_order,
  geom,
  created_at
FROM source
