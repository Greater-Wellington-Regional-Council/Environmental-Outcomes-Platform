{{ config(
    materialized = 'table'
) }}

WITH
RECURSIVE
input AS (
  SELECT
    council_id,
    source_id,
    hydro_ids,
    excluded_hydro_ids
  FROM
    {{ ref('stg_council_plan_boundary_rec2_source') }}
),

expanded_input AS (
  SELECT
    council_id,
    source_id,
    UNNEST(hydro_ids) AS hydro_id
  FROM
    input
),

all_hydro_ids AS (
  SELECT *
  FROM
    expanded_input
  UNION ALL
  SELECT
    a.council_id,
    a.source_id,
    rv.hydro_id
  FROM
    {{ ref('rivers') }} AS rv
  INNER JOIN all_hydro_ids AS a ON rv.next_hydro_id = a.hydro_id
),

with_watershed_geom AS (
  SELECT
    a.council_id,
    a.source_id,
    a.hydro_id,
    w.geom
  FROM
    all_hydro_ids AS a
  INNER JOIN watersheds AS w ON a.hydro_id = w.hydro_id
),

as_grouped_boundaries AS (
  SELECT
    council_id,
    source_id,
    ST_UNION(geom) AS boundary
  FROM
    with_watershed_geom
  GROUP BY council_id, source_id
)

SELECT *
FROM
  as_grouped_boundaries
