FROM postgis/postgis:13-3.3

RUN mkdir -p /tools
COPY health-check.sh /tools/

HEALTHCHECK --interval=1s --retries=120 CMD /tools/health-check.sh

COPY init.sql /docker-entrypoint-initdb.d/
