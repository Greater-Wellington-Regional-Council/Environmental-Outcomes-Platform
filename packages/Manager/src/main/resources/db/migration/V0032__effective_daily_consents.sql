create or replace view effective_daily_consents as

with all_consents as (
	select distinct source_id,
		null::varchar as area_id,
		null::varchar as status,
		null::numeric as allocation,
		null::boolean as is_metered,
		null::numeric as metered_allocation_daily,
		null::numeric as metered_allocation_yearly,
		null::varchar[] as meters,
		0 as is_real
	from water_allocations
),

days_in_last_year as (
	select GENERATE_SERIES(DATE_TRUNC('day', now()) - INTERVAL '1 YEAR', DATE_TRUNC('day', now()), INTERVAL '1 DAY') as effective_from
),

data_per_day as (
	select * from all_consents cross join days_in_last_year
	union
	SELECT source_id,
		area_id,
		status,
		allocation,
		is_metered,
		metered_allocation_daily,
		metered_allocation_yearly,
		meters,
		1 as is_real,
		effective_from
	from water_allocations
),

latest_values as (
	select source_id, effective_from, area_id, status, allocation, is_metered, metered_allocation_daily, metered_allocation_yearly, meters, is_real,
		sum (case when area_id is not null then 1 end) over (partition by source_id order by effective_from, is_real) as is_area_id_null,
		sum (case when status is not null then 1 end) over (partition by source_id order by effective_from, is_real) as is_status_null,
		sum (case when allocation is not null then 1 end) over (partition by source_id order by effective_from, is_real) as is_allocation_null,
		sum (case when is_metered is not null then 1 end) over (partition by source_id order by effective_from, is_real) as is_is_metered_null,
		sum (case when metered_allocation_daily is not null then 1 end) over (partition by source_id order by effective_from, is_real) as is_mad_null,
		sum (case when metered_allocation_yearly is not null then 1 end) over (partition by source_id order by effective_from, is_real) as is_may_null,
		sum (case when meters is not null then 1 end) over (partition by source_id order by effective_from, is_real) as is_meters_null
	from data_per_day
),

effective_daily_data as (
	select source_id, effective_from,
		first_value(area_id) over (partition by source_id, latest_values.is_area_id_null) as area_id,
		first_value(status) over (partition by source_id, latest_values.is_status_null) as status,
		first_value(allocation) over (partition by source_id, latest_values.is_allocation_null) as allocation,
		first_value(is_metered) over (partition by source_id, latest_values.is_is_metered_null) as is_metered,
		first_value(metered_allocation_daily) over (partition by source_id, latest_values.is_mad_null) as allocation_daily,
		first_value(metered_allocation_yearly) over (partition by source_id, latest_values.is_may_null) as metered_allocation_yearly,
		first_value(meters) over (partition by source_id, latest_values.is_meters_null) as meters,
		ROW_NUMBER() over(order by source_id, effective_from, is_real) as row_number
from latest_values),

grouped_effective_data as (
	select ea.* from effective_daily_data ea
	inner join
	(
		select source_id, date(effective_from) as effective_from, max(row_number) as max_row_number
		from effective_daily_data
		group by source_id, date(effective_from)
	) lef
	on lef.source_id = ea.source_id
	and lef.max_row_number = ea.row_number
	order by source_id, effective_from
)

select * from grouped_effective_data
