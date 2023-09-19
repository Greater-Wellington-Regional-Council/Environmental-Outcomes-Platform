CREATE TABLE hilltop_sources
(
    id            SERIAL      NOT NULL,
    council_id    INT         NOT NULL,
    hts_url       VARCHAR     NOT NULL,
    configuration JSONB       NOT NULL,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    UNIQUE (council_id, hts_url)
);

CREATE TABLE hilltop_fetch_tasks
(
    id                 SERIAL      NOT NULL,
    source_id          INT         NOT NULL,
    request_type       VARCHAR     NOT NULL,
    base_url           VARCHAR     NOT NULL,
    next_fetch_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    previous_data_hash VARCHAR,
    previous_history   JSONB DEFAULT '[]'::JSONB,
    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    UNIQUE (source_id, request_type, base_url),
    FOREIGN KEY (source_id) REFERENCES hilltop_sources (id)
);
