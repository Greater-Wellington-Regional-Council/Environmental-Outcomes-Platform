CREATE TABLE council_plan_boundary_geojson_source
(
    id         SERIAL      NOT NULL,
    council_id INT         NOT NULL,
    source_id  VARCHAR     NOT NULL,
    url        VARCHAR     NOT NULL,
    feature_id VARCHAR     NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (council_id) REFERENCES councils,
    UNIQUE (council_id, source_id)
);

CREATE TABLE council_plan_boundary_rec2_source
(
    id                 SERIAL      NOT NULL,
    council_id         INT         NOT NULL,
    source_id          VARCHAR     NOT NULL,
    hydro_ids          INTEGER[]   NOT NULL,
    excluded_hydro_ids INTEGER[]   NOT NULL,
    created_at         timestamptz NOT NULL DEFAULT NOW(),
    updated_at         timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (council_id) REFERENCES councils,
    UNIQUE (council_id, source_id)
);
