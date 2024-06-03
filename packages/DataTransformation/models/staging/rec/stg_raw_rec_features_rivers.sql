WITH source AS (
  SELECT
    (data -> 'properties' -> 'HydroID')::INT AS "hydro_id",
    (data -> 'properties' -> 'nzsegment')::INT AS "nz_segment",
    (data -> 'properties' -> 'Headwater')::INT::BOOLEAN AS "is_headwater",
    (data -> 'properties' -> 'StreamOrde')::INT AS "stream_order",
    ingested_at AS created_at,
    ST_GEOMFROMGEOJSON(data -> 'geometry')::GEOMETRY (GEOMETRY, 4326) AS "geom",
    NULLIF((data -> 'properties' -> 'NextDownID')::INT, -1) AS "next_hydro_id"
  FROM {{ source('public', 'raw_rec_features_rivers') }}
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
