ALTER TABLE effective_daily_consents
  RENAME COLUMN allocation TO allocation_plan;

ALTER TABLE effective_daily_consents
  RENAME COLUMN metered_allocation_daily TO allocation_daily;

ALTER TABLE effective_daily_consents
  RENAME COLUMN metered_allocation_yearly TO allocation_yearly;

CREATE OR REPLACE VIEW effective_daily_consents AS

WITH
  all_consents AS (
    SELECT DISTINCT
      source_id
    FROM
      water_allocations),

  days_in_last_year AS (
    SELECT GENERATE_SERIES(DATE_TRUNC('day', NOW()) - INTERVAL '1 YEAR', DATE_TRUNC('day', NOW()) - INTERVAL '1 DAY', INTERVAL '1 DAY') AS effective_on),
  data_per_day AS (
    SELECT *
    FROM
      all_consents
        CROSS JOIN days_in_last_year),

  effective_daily_data AS (
    SELECT
      dpd.source_id,
      dpd.effective_on,
      wa.area_id,
      wa.allocation_plan,
      wa.consent_id,
      wa.status,
      wa.is_metered,
      wa.allocation_daily,
      wa.allocation_yearly,
      wa.meters
    FROM
      data_per_day dpd
        LEFT JOIN LATERAL
        (
        SELECT *
        FROM
          water_allocations wai
        WHERE
            wai.source_id = dpd.source_id
        AND date(dpd.effective_on) >= date(wai.effective_from)
        AND (wai.effective_to IS NULL OR date(dpd.effective_on) < date(wai.effective_to))
        ORDER BY wai.effective_from DESC
        LIMIT 1
        ) wa ON wa.source_id = dpd.source_id)

SELECT *
FROM
  effective_daily_data
