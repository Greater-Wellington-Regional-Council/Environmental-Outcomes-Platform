{% macro generate_month_series(start_date, end_date) %}

  GENERATE_SERIES(
    {{ start_date }}::DATE,  -- Starting date cast to DATE
    {{ end_date }}::DATE,    -- End date cast to DATE
    '1 month'::INTERVAL      -- Monthly step
  )::DATE

{% endmacro %}
