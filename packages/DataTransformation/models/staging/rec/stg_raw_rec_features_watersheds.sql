WITH source AS (
  SELECT
    (data -> 'properties' -> 'HydroID')::INT AS "hydro_id",
    (data -> 'properties' -> 'nzsegment')::INT AS "nz_segment",
    ingested_at AS created_at,
    ST_GEOMFROMGEOJSON(data -> 'geometry') AS "geom"
  FROM {{ source('public', 'raw_rec_features_watersheds') }}
)

SELECT
  hydro_id,
  nz_segment,
  geom,
  created_at
FROM source
