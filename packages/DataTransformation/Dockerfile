FROM ghcr.io/dbt-labs/dbt-postgres:1.7.14

WORKDIR /usr/app

COPY . .
COPY profiles.yml /root/.dbt/profiles.yml
RUN dbt deps

ENTRYPOINT ["/usr/local/bin/dbt", "run", "--target", "prod"]
