SET ROLE materialized_views_role;

DROP MATERIALIZED VIEW water_allocation_and_usage_by_area;

RESET ROLE;

CREATE MATERIALIZED VIEW water_allocation_and_usage_by_area AS
WITH
  all_days AS (
    SELECT DISTINCT
      date(effective_on) AS date
    FROM
      effective_daily_consents),
  all_areas AS (
    SELECT DISTINCT
      area_id,
      NULL::NUMERIC AS allocation_plan,
      NULL::NUMERIC AS allocation_daily,
      NULL::NUMERIC AS allocation_daily_used,
      NULL::NUMERIC AS daily_usage
    FROM
      effective_daily_consents
    WHERE
      area_id IS NOT NULL),
  all_areas_per_day AS (
    SELECT *
    FROM
      all_days
        CROSS JOIN all_areas),
  active_daily_consents AS (
    SELECT
      date(effective_on) AS date,
      consent_id,
      area_id,
      allocation_plan,
      allocation_daily,
      allocation_yearly,
      is_metered,
      meters,
      status
    FROM
      effective_daily_consents
    WHERE
        area_id IS NOT NULL
    AND status = 'active'),
  total_daily_allocation_by_area AS (
    SELECT
      date,
      area_id,
      SUM(allocation_plan)  AS allocation_plan,
      SUM(allocation_daily) AS allocation_daily
    FROM
      active_daily_consents
    GROUP BY 1, 2),
  observed_water_use_with_sites AS (
    SELECT
      owu.*,
      os.name AS site_name
    FROM
      observed_water_use_aggregated_daily owu
        INNER JOIN observation_sites os ON os.id = owu.site_id),
  metered_daily_consents AS (
    SELECT *
    FROM
      active_daily_consents
    WHERE
      is_metered = TRUE),
  expanded_meters_per_consent_area AS (
    SELECT
      date,
      consent_id,
      area_id,
      UNNEST(meters) AS meter
    FROM
      metered_daily_consents),
  meter_use_by_consent_area AS (
    SELECT
      date,
      consent_id,
      area_id,
      meter,
      use.daily_usage
    FROM
      expanded_meters_per_consent_area
        LEFT JOIN observed_water_use_with_sites use ON date = day_observed_at AND meter = site_name),
  total_daily_use_by_consent_area AS (
    SELECT
      date,
      consent_id,
      area_id,
      SUM(daily_usage) AS daily_usage
    FROM
      meter_use_by_consent_area
    GROUP BY 1, 2, 3),
  effective_active_daily_consents_with_use AS (
    SELECT
      c.date,
      c.consent_id,
      c.area_id,
      c.allocation_daily,
      use.daily_usage
    FROM
      metered_daily_consents c
        JOIN total_daily_use_by_consent_area use ON c.consent_id = use.consent_id AND c.area_id = use.area_id AND c.date = use.date),
  used_daily_allocation_by_area AS (
    SELECT
      date,
      area_id,
      SUM(allocation_daily) AS allocation_daily_used,
      SUM(daily_usage)      AS daily_usage
    FROM
      effective_active_daily_consents_with_use
    WHERE
      daily_usage IS NOT NULL
    GROUP BY 1, 2),
  joined_daily_allocations AS (
    SELECT
      t.date,
      t.area_id,
      t.allocation_plan,
      t.allocation_daily,
      u.allocation_daily_used,
      u.daily_usage
    FROM
      total_daily_allocation_by_area t
        LEFT JOIN used_daily_allocation_by_area u ON t.date = u.date AND t.area_id = u.area_id),
  total_daily_allocation_by_area_joined_with_defaults AS (
    SELECT *
    FROM
      joined_daily_allocations
    UNION
    SELECT *
    FROM
      all_areas_per_day),
  final AS (
    SELECT
      date,
      area_id,
      SUM(allocation_plan)       AS allocation_plan,
      SUM(allocation_daily)      AS allocation_daily,
      SUM(allocation_daily_used) AS allocation_daily_used,
      SUM(daily_usage)           AS daily_usage
    FROM
      total_daily_allocation_by_area_joined_with_defaults
    GROUP BY 1, 2)
SELECT *
FROM
  final
ORDER BY
  date
  -- This prevents initial generation so we don't block the app booting when migrations
-- are run as part of app-deploy
WITH NO DATA;

CREATE INDEX ON water_allocation_and_usage_by_area (date);
-- A unique index is required to refresh the view concurrently
CREATE UNIQUE INDEX ON water_allocation_and_usage_by_area (date, area_id);

ALTER MATERIALIZED VIEW water_allocation_and_usage_by_area OWNER TO materialized_views_role;

SET ROLE materialized_views_role;

-- After changing the owner, we need to ensure eop_manager_migrations_user still
-- has rights on the table for commands in R__setup_permissions.sql to be able to
-- to run without error
GRANT ALL ON TABLE water_allocation_and_usage_by_area TO eop_manager_migrations_user;
-- Ensure the app user can select over the view
GRANT SELECT ON TABLE water_allocation_and_usage_by_area TO eop_manager_app_user;

RESET ROLE;
