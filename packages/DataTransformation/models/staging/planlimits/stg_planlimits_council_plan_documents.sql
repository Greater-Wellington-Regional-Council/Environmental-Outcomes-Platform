WITH source AS (
  SELECT
    id,
    council_id,
    source_id,
    document,
    created_at,
    updated_at
  FROM {{ source('public', 'council_plan_documents') }}
)

SELECT * FROM source
