FROM ghcr.io/dbt-labs/dbt-postgres:1.7.14

RUN pip install sqlfluff
RUN pip install sqlfluff-templater-dbt

ENTRYPOINT [ "sqlfluff" ]
