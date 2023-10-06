create or replace view water_allocation_and_usage_by_area as

with all_days as (
	select distinct effective_on from effective_daily_consents 
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
)
,
effective_consents_with_defaults as
(
	select * from data_per_day
	union
	select effective_on, area_id, allocation, metered_allocation_daily, metered_allocation_yearly, is_metered, meters, status
	from effective_daily_consents
	where area_id is not null 
	and status = 'active'
)
select
	area_id,
	date(effective_on) as date,
	sum(allocation) as allocation,
	sum(metered_allocation_daily) as allocation_daily,
	sum(metered_allocation_yearly) as metered_allocation_yearly,
	coalesce(sum(case when is_metered = true then daily_usage else 0 end), 0) as daily_usage
from effective_consents_with_defaults edc
left join observed_water_use_aggregated_daily owuage
on edc.effective_on = owuage.day_observed_at
and owuage.site_id::varchar in(select unnest(meters))
and status = 'active'
group by area_id, effective_on
order by date