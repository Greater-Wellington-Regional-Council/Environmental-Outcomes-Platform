{{ config(
    materialized = 'table',
    indexes=[
      {'columns': ['hydro_id'], 'unique': True},
      {'columns': ['geom'], 'type': 'gist'},
    ]
) }}

WITH modifications AS (
  SELECT * FROM {{ ref('stg_rec_features_rivers_modifications') }}
),

raw AS (
  SELECT * FROM {{ ref('stg_raw_rec_features_rivers') }} WHERE hydro_id NOT IN (SELECT hydro_id FROM modifications)
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
  geom::GEOMETRY (GEOMETRY, 4326),
  created_at
FROM combined
