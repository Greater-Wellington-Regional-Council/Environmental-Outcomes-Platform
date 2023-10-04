create or replace view water_allocation_and_usage_by_area as
with all_areas as
(
	select distinct area_id
	from effective_daily_consents
	where area_id is not null
),
all_dates as (
	select distinct date(effective_from) as date
	from effective_daily_consents
),
area_defaults as (
	select area_id, date, 0 as allocation, 0 as allocation_daily, 0 as metered_allocation_yearly, 0 as daily_usage
	from all_areas cross join all_dates
),
usage as (
	select area_id, date(effective_from) as date, allocation, allocation_daily, metered_allocation_yearly, case when is_metered = true then daily_usage else null end as daily_usage
	from effective_daily_consents
	left outer join observed_water_use_aggregated_daily
	on day_observed_at = date(effective_daily_consents.effective_from)
	and site_id::varchar in(
		select unnest(meters)
	)
	where status = 'active'
	union 
	select * from area_defaults
)

select area_id, date, sum(allocation) as allocation, sum(allocation_daily) as allocation_daily, sum(metered_allocation_yearly) as metered_allocation_yearly, sum(daily_usage) as daily_usage
from usage
group by area_id, date
