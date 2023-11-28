set role materialized_views_role;
drop materialized view water_allocation_and_usage_by_area;
reset role;

create materialized view  water_allocation_and_usage_by_area as
with
    all_days as (
        select distinct
            date(effective_on) as date
        from
            effective_daily_consents),
    all_areas as (
        select distinct
            area_id,
            null::numeric as allocation,
            null::numeric as metered_allocation_daily,
            null::numeric as metered_allocation_daily_used,
            null::numeric as daily_usage
        from
            effective_daily_consents
        where
            area_id is not null),
    all_areas_per_day as (
        select *
        from
            all_days
                cross join all_areas),
    active_daily_consents as (
        select
            date(effective_on) as date,
            consent_id,
            area_id,
            allocation,
            metered_allocation_daily,
            metered_allocation_yearly,
            is_metered,
            meters,
            status
        from
            effective_daily_consents
        where
              area_id is not null
          and status = 'active'),
    total_daily_allocation_by_area as (
        select
            date,
            area_id,
            sum(allocation)               as allocation,
            sum(metered_allocation_daily) as metered_allocation_daily
        from
            active_daily_consents
        group by 1, 2),
    observed_water_use_with_sites as (
        select
            owu.*,
            os.name as site_name
        from
            observed_water_use_aggregated_daily owu
                inner join observation_sites os on os.id = owu.site_id),
    metered_daily_consents as (
        select *
        from
            active_daily_consents
        where
                is_metered = true),
    expanded_meters_per_consent_area as (
        select
            date,
            consent_id,
            area_id,
            unnest(meters) as meter
        from
            metered_daily_consents),
    meter_use_by_consent_area as (
        select
            date,
            consent_id,
            area_id,
            meter,
            use.daily_usage
        from
            expanded_meters_per_consent_area
                left join observed_water_use_with_sites use on date = day_observed_at and meter = site_name),
    total_daily_use_by_consent_area as (
        select
            date,
            consent_id,
            area_id,
            sum(daily_usage) as daily_usage
        from
            meter_use_by_consent_area
        group by 1, 2, 3),
    effective_active_daily_consents_with_use as (
        select
            c.date,
            c.consent_id,
            c.area_id,
            c.metered_allocation_daily,
            use.daily_usage
        from
            metered_daily_consents c
                join total_daily_use_by_consent_area use on c.consent_id = use.consent_id and c.area_id = use.area_id and c.date = use.date),
    used_daily_allocation_by_area as (
        select
            date,
            area_id,
            sum(metered_allocation_daily) as metered_allocation_daily_used,
            sum(daily_usage)              as daily_usage
        from
            effective_active_daily_consents_with_use
        where
            daily_usage is not null
        group by 1, 2),
    joined_daily_allocations as (
        select
            t.date,
            t.area_id,
            t.allocation,
            t.metered_allocation_daily,
            u.metered_allocation_daily_used,
            u.daily_usage
        from
            total_daily_allocation_by_area t
                left join used_daily_allocation_by_area u on t.date = u.date and t.area_id = u.area_id),
    total_daily_allocation_by_area_joined_with_defaults as (
        select *
        from
            joined_daily_allocations
        union
        select *
        from
            all_areas_per_day),
    final as (
        select
            date,
            area_id,
            sum(allocation)                    as allocation,
            sum(metered_allocation_daily)      as metered_allocation_daily,
            sum(metered_allocation_daily_used) as metered_allocation_daily_used,
            sum(daily_usage)                   as daily_usage
        from
            total_daily_allocation_by_area_joined_with_defaults
        group by 1, 2)
select *
from
    final
order by
    date
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

reset role;
