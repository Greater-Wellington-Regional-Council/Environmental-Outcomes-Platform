WITH modifications AS (

  SELECT * FROM {{ ref('stg_rec_features_watersheds_modifications') }}

),

raw AS (
  SELECT * FROM {{ ref('stg_raw_rec_features_watersheds') }}
),

combined AS (
  SELECT * FROM modifications
  UNION
  SELECT * FROM raw
)

SELECT *
FROM combined
