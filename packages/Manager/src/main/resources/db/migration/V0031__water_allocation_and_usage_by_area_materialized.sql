DROP VIEW IF EXISTS water_allocation_and_usage_by_area;

CREATE MATERIALIZED VIEW  water_allocation_and_usage_by_area AS

with all_days as (
    select distinct date(effective_on) as effective_on from effective_daily_consents
),
     all_areas as (
         select distinct
             area_id,
             0 as allocation,
             0 as metered_allocation_daily,
             0 as metered_allocation_yearly,
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
             coalesce(daily_usage, 0) as daily_usage
         from total_daily_allocation_by_area
                  left join total_daily_use_by_area using (area_id, date)
     )
SELECT *
FROM allocated_joined_with_use
WITH NO DATA;