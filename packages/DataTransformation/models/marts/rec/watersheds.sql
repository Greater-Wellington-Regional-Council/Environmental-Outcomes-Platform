{{ config(
    materialized = 'table',
    indexes=[
      {'columns': ['hydro_id'], 'unique': True},
      {'columns': ['geom'], 'type': 'gist'},
    ]
) }}

WITH modifications AS (
  SELECT * FROM {{ ref('stg_rec_features_watersheds_modifications') }}
),

raw AS (
  SELECT * FROM {{ ref('stg_raw_rec_features_watersheds') }} WHERE hydro_id NOT IN (SELECT hydro_id FROM modifications)
),

combined AS (
  SELECT * FROM modifications
  UNION
  SELECT * FROM raw
)

SELECT
  hydro_id,
  nz_segment,
  geom::GEOMETRY (GEOMETRY, 4326),
  created_at
FROM combined
