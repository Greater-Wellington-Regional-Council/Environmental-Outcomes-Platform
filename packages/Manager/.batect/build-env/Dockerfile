FROM eclipse-temurin:17

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

RUN curl -sL https://deb.nodesource.com/setup_18.x | bash - \
  && apt-get install -qq nodejs --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*
