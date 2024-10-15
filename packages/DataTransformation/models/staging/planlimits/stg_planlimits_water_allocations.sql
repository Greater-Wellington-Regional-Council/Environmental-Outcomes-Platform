WITH source AS (

  SELECT

    id,
    area_id,
    allocation_plan,
    ingest_id,
    created_at,
    updated_at,
    source_id,
    consent_id,
    status,
    is_metered,
    allocation_daily,
    allocation_yearly,
    meters,
    effective_from,
    effective_to,
    category

  FROM {{ source('public', 'water_allocations') }}
)

SELECT * FROM source
