WITH RECURSIVE
input AS (
  SELECT
    council_id,
    source_id,
    hydro_ids,
    excluded_hydro_ids
  FROM {{ ref('stg_council_plan_boundary_rec2_source') }}
),

expanded_input AS (
  -- Expand hydro_ids, but do NOT unnest excluded_hydro_ids here
  SELECT
    council_id,
    source_id,
    UNNEST(hydro_ids) AS hydro_id
  FROM input
),

excluded_hydro AS (
  -- Create a list of excluded hydro_ids
  SELECT
    council_id,
    source_id,
    UNNEST(excluded_hydro_ids) AS excluded_hydro_id
  FROM input
),

all_hydro_ids AS (
  -- Base case: Start with expanded_input hydro_ids and include council_id and source_id
  SELECT 
    a.council_id,
    a.source_id,
    rv.hydro_id
  FROM {{ ref('rivers') }} AS rv
  INNER JOIN expanded_input a 
    ON rv.next_hydro_id = a.hydro_id  -- Ensure hydro_id matches from expanded_input
  WHERE rv.next_hydro_id = ANY(
    (SELECT hydro_id FROM expanded_input)  -- This is returning an array
  )
  
  UNION ALL
  
  -- Recursive case: Propagate council_id and source_id in subsequent recursive calls
  SELECT
    a.council_id,
    a.source_id,
    rv.hydro_id
  FROM rivers rv
  INNER JOIN all_hydro_ids a ON a.hydro_id = rv.next_hydro_id
  WHERE rv.hydro_id NOT IN (SELECT excluded_hydro_id FROM excluded_hydro)
),

with_watershed_geom AS (
  -- Join all_hydro_ids with the watersheds table while keeping council_id and source_id
  SELECT
    a.council_id,
    a.source_id,
    a.hydro_id,
    w.geom
  FROM all_hydro_ids AS a
  INNER JOIN {{ ref('watersheds') }} AS w 
    ON a.hydro_id = w.hydro_id
),

as_grouped_boundaries AS (
  -- Group by council_id and source_id to create boundaries
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
