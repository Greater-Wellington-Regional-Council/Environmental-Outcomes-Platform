{{ config(materialized='table') }}

SELECT
  (data -> 'properties' -> 'HydroID')::INT AS "hydro_id",
  (data -> 'properties' -> 'nzsegment')::INT AS "nz_segment",
  (data -> 'properties' -> 'Headwater')::INT::BOOLEAN AS "is_headwater",
  (data -> 'properties' -> 'StreamOrde')::INT AS "stream_order",
  NULLIF((data -> 'properties' -> 'NextDownID')::INT, -1) AS "next_hydro_id",
  ST_GEOMFROMGEOJSON(data -> 'geometry') AS "path"
FROM {{ source('public', 'raw_rec_features_rivers') }}
