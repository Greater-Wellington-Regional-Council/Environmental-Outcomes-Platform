WITH council_plan_documents AS (

  SELECT * FROM {{ ref('stg_planlimits_council_plan_documents') }}
),

plans AS (

  SELECT * FROM {{ ref('plans') }}
),

temp_plan_regions AS (

  SELECT

    p.council_id,
    p.id AS plan_id,
    JSONB_ARRAY_ELEMENTS(document -> 'regions') AS region

  FROM council_plan_documents AS cpd

  INNER JOIN plans AS p ON cpd.council_id = p.council_id
)

SELECT * FROM temp_plan_regions
