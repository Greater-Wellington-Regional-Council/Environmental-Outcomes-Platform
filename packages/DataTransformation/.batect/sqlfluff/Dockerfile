FROM ghcr.io/dbt-labs/dbt-postgres:1.5.8

RUN pip install sqlfluff
RUN pip install sqlfluff-templater-dbt

ENTRYPOINT [ "sqlfluff" ]