CREATE TABLE councils
(
    id          INT         NOT NULL,
    stats_nz_id INT         NOT NULL,
    name        VARCHAR     NOT NULL,
    boundary    GEOMETRY    NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    UNIQUE (stats_nz_id)
);
