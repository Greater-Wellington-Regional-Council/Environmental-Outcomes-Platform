FROM ghcr.io/dbt-labs/dbt-postgres:1.9.0

WORKDIR /usr/app

COPY . .
COPY profiles.yml /root/.dbt/profiles.yml
RUN dbt deps

ENTRYPOINT ["/usr/local/bin/dbt", "run", "--target", "prod"]