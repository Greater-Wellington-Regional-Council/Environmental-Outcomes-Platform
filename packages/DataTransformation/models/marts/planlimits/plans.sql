{{ config(
    materialized = 'view'
) }}

WITH source AS (

  SELECT *
  FROM
    {{ ref('stg_planlimits_council_plan_documents') }}
),

final AS (
  SELECT

    council_id,
    ROW_NUMBER() OVER () AS id,
    document ->> 'id' AS source_id,
    document ->> 'name' AS name,
    document ->> 'defaultSurfaceWaterLimit' AS default_surface_water_limit,
    document ->> 'defaultGroundwaterLimit' AS default_groundwater_limit,
    document ->> 'defaultFlowManagementSite' AS default_flow_management_site,
    document ->> 'defaultFlowManagementLimit' AS default_flow_management_limit

  FROM
    source
)

SELECT
  id,
  council_id,
  source_id,
  name,
  default_surface_water_limit,
  default_groundwater_limit,
  default_flow_management_site,
  default_flow_management_limit
FROM
  final
