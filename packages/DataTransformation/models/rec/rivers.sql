{{ config(materialized='table') }}

WITH modifications AS (
  SELECT
    hydro_id,
    next_hydro_id,
    nz_segment,
    is_headwater,
    stream_order,
    geom,
    NOW() AS created_at
  FROM {{ source('public', 'rec_rivers_modifications') }}
),

raw AS (
  SELECT
    (data -> 'properties' -> 'HydroID')::INT AS "hydro_id",
    NULLIF((data -> 'properties' -> 'NextDownID')::INT, -1) AS "next_hydro_id",
    (data -> 'properties' -> 'nzsegment')::INT AS "nz_segment",
    (data -> 'properties' -> 'Headwater')::INT::BOOLEAN AS "is_headwater",
    (data -> 'properties' -> 'StreamOrde')::INT AS "stream_order",
    ST_GEOMFROMGEOJSON(data -> 'geometry') AS "geom",
    NOW() AS created_at
  FROM {{ source('public', 'raw_rec_features_rivers') }}
),

combined AS (
  SELECT * FROM modifications
  UNION
  SELECT * FROM raw
)

SELECT *
FROM combined
