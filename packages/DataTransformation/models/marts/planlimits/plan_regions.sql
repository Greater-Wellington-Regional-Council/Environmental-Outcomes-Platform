{{ config(
    materialized = 'view'
) }}

WITH council_plan_boundaries AS (

  SELECT * FROM {{ ref('stg_planlimits_council_plan_boundaries') }}
),

plans AS (

  SELECT * FROM {{ ref('plans') }}
),

temp_plan_regions AS (

  SELECT * FROM {{ ref('int_temp_plan_regions') }}
),

final AS (

  SELECT

    plan_id,
    ROW_NUMBER() OVER () AS id,
    region ->> 'id' AS source_id,
    region ->> 'name' AS name,
    (
      SELECT boundary
      FROM
        council_plan_boundaries
      WHERE
        council_id = temp_plan_regions.council_id
        AND region ->> 'boundaryId' = council_plan_boundaries.source_id
      LIMIT 1
    ) AS boundary,
    region ->> 'defaultSurfaceWaterLimit' AS default_surface_water_limit,
    region ->> 'defaultGroundwaterLimit' AS default_groundwater_limit,
    region ->> 'defaultFlowManagementSite' AS default_flow_management_site,
    region ->> 'defaultFlowManagementLimit' AS default_flow_management_limit,
    region ->> 'referenceUrl' AS reference_url

  FROM
    temp_plan_regions
)

SELECT

  id,
  plan_id,
  source_id,
  name,
  boundary,
  default_surface_water_limit,
  default_groundwater_limit,
  default_flow_management_site,
  default_flow_management_limit,
  reference_url

FROM final
