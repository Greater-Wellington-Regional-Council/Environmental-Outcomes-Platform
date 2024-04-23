{{ config(materialized = 'view') }}

SELECT
  hydro_id,
  geom,
  stream_order
FROM {{ ref('rivers') }}
