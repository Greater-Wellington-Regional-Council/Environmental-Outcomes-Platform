{% macro generate_date_series(start_date, end_date, interval) %}

  GENERATE_SERIES(
    DATE_TRUNC('day', {{ start_date }}) - INTERVAL '1 YEAR',
    DATE_TRUNC('day', {{ end_date }}) - INTERVAL '1 DAY',
    {{ interval }}
  )

{% endmacro %}
