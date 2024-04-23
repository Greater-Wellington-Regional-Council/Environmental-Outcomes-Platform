WITH modifications AS (
  SELECT *
  FROM {{ ref('stg_rec_features_rivers_modifications') }}


),

raw AS (
  SELECT *
  FROM
    {{ ref('stg_raw_rec_features_rivers') }}
),

combined AS (
  SELECT * FROM modifications
  UNION
  SELECT * FROM raw
)

SELECT
  hydro_id,
  next_hydro_id,
  nz_segment,
  is_headwater,
  stream_order,
  geom,
  created_at
FROM combined
