{% macro generate_month_series(start_date, end_date, interval) %}

  GENERATE_SERIES
    (
        {{ start_date }}::DATE,   -- Starting date
        {{ end_date }}::DATE,     -- End date
        '1 month'::interval       -- Monthly step
    )::DATE AS month_start

{% endmacro %}
