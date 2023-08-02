CREATE TABLE council_plan_documents
(
    id         SERIAL      NOT NULL,
    council_id INT         NOT NULL UNIQUE,
    source_id  VARCHAR     NOT NULL,
    document   JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (council_id) REFERENCES councils,
    UNIQUE (council_id, source_id)
);

CREATE TABLE council_plan_boundaries
(
    id         SERIAL      NOT NULL,
    council_id INT         NOT NULL,
    source_id  VARCHAR     NOT NULL,
    boundary   GEOMETRY    NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (council_id) REFERENCES councils,
    UNIQUE (council_id, source_id)
);
