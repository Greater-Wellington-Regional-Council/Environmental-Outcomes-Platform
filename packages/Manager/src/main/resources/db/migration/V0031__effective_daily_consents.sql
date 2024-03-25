create or replace view effective_daily_consents as

with all_consents as (
	select distinct source_id from water_allocations
),

days_in_last_year as (
	select GENERATE_SERIES(DATE_TRUNC('day', now()) - INTERVAL '1 YEAR', DATE_TRUNC('day', now()) - INTERVAL '1 DAY', INTERVAL '1 DAY') as effective_on
),
data_per_day as (
	select * from all_consents cross join days_in_last_year
),

effective_daily_data as (
	select dpd.source_id, dpd.effective_on, wa.area_id, wa.allocation, wa.consent_id, wa.status, wa.is_metered, wa.metered_allocation_daily, wa.metered_allocation_yearly, wa.meters
	from data_per_day dpd
	left join lateral
	(
		select * from
		water_allocations wai
		where wai.source_id = dpd.source_id
		and date(dpd.effective_on) >= date(wai.effective_from)
		and (wai.effective_to is null or date(dpd.effective_on) < date(wai.effective_to))
		order by wai.effective_from desc
		limit 1
	) wa 
	on wa.source_id = dpd.source_id
)

select * from effective_daily_data
