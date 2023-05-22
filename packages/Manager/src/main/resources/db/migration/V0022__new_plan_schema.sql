CREATE TABLE councils
(
    id          INT         NOT NULL,
    stats_nz_id INT         NOT NULL,
    name        VARCHAR     NOT NULL,
    boundary    geometry    NOT NULL,
    created_at  timestamptz NOT NULL DEFAULT NOW(),
    updated_at  timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    UNIQUE (stats_nz_id)
);

CREATE TABLE council_plan_documents
(
    id         SERIAL      NOT NULL,
    council_id INT         NOT NULL UNIQUE,
    document   JSONB,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (council_id) REFERENCES councils
);

CREATE TABLE council_plan_boundaries
(
    id         SERIAL      NOT NULL,
    council_id INT         NOT NULL,
    source_id  VARCHAR     NOT NULL,
    boundary   geometry    NOT NULL,
    created_at timestamptz NOT NULL DEFAULT NOW(),
    updated_at timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (council_id) REFERENCES councils,
    UNIQUE (council_id, source_id)
);

CREATE TABLE plans
(
    id                            SERIAL      NOT NULL,
    council_id                    INT         NOT NULL,
    source_id                     VARCHAR     NOT NULL,
    name                          VARCHAR     NOT NULL,
    default_surface_water_limit   VARCHAR,
    default_groundwater_limit     VARCHAR,
    default_flow_management_site  VARCHAR,
    default_flow_management_limit VARCHAR,
    created_at                    timestamptz NOT NULL DEFAULT NOW(),
    updated_at                    timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (council_id) REFERENCES councils,
    UNIQUE (council_id, source_id)
);

CREATE TABLE plan_regions
(
    id                            SERIAL      NOT NULL,
    plan_id                       INT         NOT NULL,
    source_id                     VARCHAR     NOT NULL,
    name                          VARCHAR     NOT NULL,
    boundary                      geometry    NOT NULL,
    default_surface_water_limit   VARCHAR,
    default_groundwater_limit     VARCHAR,
    default_flow_management_site  VARCHAR,
    default_flow_management_limit VARCHAR,
    created_at                    timestamptz NOT NULL DEFAULT NOW(),
    updated_at                    timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (plan_id) REFERENCES plans,
    UNIQUE (plan_id, source_id)
);

CREATE TABLE surface_water_limits
(
    id                            SERIAL      NOT NULL,
    plan_region_id                INT         NOT NULL,
    source_id                     VARCHAR     NOT NULL,
    parent_surface_water_limit_id INT,
    name                          VARCHAR     NOT NULL,
    allocation_limit              NUMERIC     NOT NULL,
    boundary                      geometry    NOT NULL,
    created_at                    timestamptz NOT NULL DEFAULT NOW(),
    updated_at                    timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (plan_region_id) REFERENCES plan_regions,
    FOREIGN KEY (parent_surface_water_limit_id) REFERENCES surface_water_limits,
    UNIQUE (plan_region_id, source_id)
);

CREATE TABLE groundwater_limits
(
    id               SERIAL      NOT NULL,
    plan_region_id   INT         NOT NULL,
    source_id        VARCHAR     NOT NULL,
    name             VARCHAR     NOT NULL,
    allocation_limit NUMERIC     NOT NULL,
    created_at       timestamptz NOT NULL DEFAULT NOW(),
    updated_at       timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (plan_region_id) REFERENCES plan_regions,
    UNIQUE (plan_region_id, source_id)
);

CREATE TABLE groundwater_areas
(
    id                   SERIAL      NOT NULL,
    groundwater_limit_id INT         NOT NULL,
    category             VARCHAR     NOT NULL,
    depth                VARCHAR     NOT NULL,
    depletion_limit_id   INT,
    boundary             geometry    NOT NULL,
    created_at           timestamptz NOT NULL DEFAULT NOW(),
    updated_at           timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (groundwater_limit_id) REFERENCES groundwater_limits,
    FOREIGN KEY (depletion_limit_id) REFERENCES surface_water_limits
);

CREATE TABLE flow_measurement_sites
(
    id         SERIAL          NOT NULL,
    council_id INT             NOT NULL,
    name       VARCHAR         NOT NULL,
    location   geometry(Point) NOT NULL,
    created_at timestamptz     NOT NULL DEFAULT NOW(),
    updated_at timestamptz     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (council_id) REFERENCES councils
);

CREATE TABLE flow_limits
(
    id                  SERIAL      NOT NULL,
    council_id          INT         NOT NULL,
    minimum_flow        NUMERIC     NOT NULL,
    boundary            geometry    NOT NULL,
    measured_at_site_id INT         NOT NULL,
    created_at          timestamptz NOT NULL DEFAULT NOW(),
    updated_at          timestamptz NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id),
    FOREIGN KEY (measured_at_site_id) REFERENCES flow_measurement_sites,
    FOREIGN KEY (council_id) REFERENCES councils
);
