{{ config(materialized='table') }}

WITH modifications AS (

  SELECT
    hydro_id,
    nz_segment,
    geom,
    NOW() AS created_at
  FROM {{ source('public', 'rec_watersheds_modifications') }}

),

raw AS (
  SELECT
    (data -> 'properties' -> 'HydroID')::INT AS "hydro_id",
    (data -> 'properties' -> 'nzsegment')::INT AS "nz_segment",
    ST_GEOMFROMGEOJSON(data -> 'geometry') AS "geom",
    NOW() AS "created_at"
  FROM {{ source('public', 'raw_rec_features_watersheds') }}
),

combined AS (
  SELECT * FROM modifications
  UNION
  SELECT * FROM raw
)

SELECT *
FROM combined
