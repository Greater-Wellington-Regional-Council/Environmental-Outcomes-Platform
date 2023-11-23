drop view if exists water_allocation_and_usage_by_area;

-- Permissions for the materialized_views_role
GRANT USAGE, CREATE ON SCHEMA public TO materialized_views_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT ON TABLES TO materialized_views_role;

GRANT SELECT ON ALL TABLES IN SCHEMA public TO materialized_views_role;

GRANT materialized_views_role TO eop_manager_app_user;
GRANT materialized_views_role TO eop_manager_migrations_user WITH ADMIN OPTION;

create materialized view  water_allocation_and_usage_by_area as
with all_days as (
    select distinct date(effective_on) as effective_on from effective_daily_consents
),
     all_areas as (
         select distinct
             area_id,
             null::numeric as allocation,
             null::numeric as metered_allocation_daily,
             null::numeric as metered_allocation_yearly,
             false as is_metered,
             '{}'::varchar[] as meters,
             'inactive' as status
         from effective_daily_consents
         where area_id is not null
     ),
     data_per_day as (
         select * from all_days cross join all_areas
     ),
     effective_consents_with_defaults as (
         select * from data_per_day
         union
         select
             date(effective_on),
             area_id,
             allocation,
             metered_allocation_daily,
             metered_allocation_yearly,
             is_metered,
             meters,
             status
         from effective_daily_consents
         where area_id is not null and status = 'active'
     ),
     observed_water_use_with_sites as (
         select owu.*, os.name as site_name
         from observed_water_use_aggregated_daily owu
                  inner join observation_sites os on os.id = owu.site_id
     ),
     expanded_meters_per_area as
         (select effective_on, area_id, UNNEST(meters) as meter from effective_consents_with_defaults where is_metered = true),
     meter_use_by_area as (select effective_on,
                                  area_id,
                                  meter,
                                  use.daily_usage
                           from expanded_meters_per_area
                                    left join observed_water_use_with_sites use on effective_on = day_observed_at and meter = site_name),
     total_daily_use_by_area as (select area_id,
                                        effective_on as date,
                                        SUM(daily_usage) as daily_usage
                                 from meter_use_by_area
                                 group by area_id, effective_on),
     total_daily_allocation_by_area as (
         select
             area_id,
             effective_on as date,
             SUM(allocation) as allocation,
             SUM(metered_allocation_daily) as allocation_daily,
             SUM(metered_allocation_yearly) as metered_allocation_yearly
         from effective_consents_with_defaults group by 1, 2
         order by date
     ),
     allocated_joined_with_use AS (
         select
             area_id,
             date,
             allocation,
             allocation_daily,
             metered_allocation_yearly,
             daily_usage,
         from total_daily_allocation_by_area
                  left join total_daily_use_by_area using (area_id, date)
     )
select *
from allocated_joined_with_use
-- This prevents initial generation so we don't block the app booting when migrations
-- are run as part of app-deploy
with no data;

create index on water_allocation_and_usage_by_area (date);
-- A unique index is required to refresh the view concurrently
create unique index on water_allocation_and_usage_by_area (date, area_id);

alter materialized view water_allocation_and_usage_by_area owner to materialized_views_role;

set role materialized_views_role;
-- After changing the owner, we need to ensure eop_manager_migrations_user still
-- has rights on the table for commands in R__setup_permissions.sql to be able to
-- to run without error
grant all ON table water_allocation_and_usage_by_area to eop_manager_migrations_user;
-- Ensure the app user can select over the view
grant select ON table water_allocation_and_usage_by_area to eop_manager_app_user;
