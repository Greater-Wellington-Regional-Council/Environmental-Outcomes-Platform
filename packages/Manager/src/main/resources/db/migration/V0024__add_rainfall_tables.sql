CREATE TABLE observation_sites (
    id SERIAL NOT NULL,
    council_id INT NOT NULL,
    name VARCHAR NOT NULL,
    location GEOMETRY (POINT, 2193) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    PRIMARY KEY (id),
    UNIQUE (council_id, name),
    FOREIGN KEY (council_id) REFERENCES councils (id)
  );

CREATE TABLE observation_sites_measurements (
    id SERIAL NOT NULL,
    site_id INT NOT NULL,
    measurement_name VARCHAR NOT NULL,
    first_observation_at TIMESTAMPTZ NOT NULL,
    last_observation_at TIMESTAMPTZ NOT NULL,
    observation_count INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    PRIMARY KEY (id),
    UNIQUE (site_id, measurement_name),
    FOREIGN KEY (site_id) REFERENCES observation_sites (id)
);

CREATE TABLE observations (
    id SERIAL NOT NULL,
    observation_measurement_id INT NOT NULL,
    amount NUMERIC NOT NULL,
    observed_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    PRIMARY KEY (id),
    FOREIGN KEY (observation_measurement_id) REFERENCES observation_sites_measurements (id),
    UNIQUE (observation_measurement_id, observed_at)
);

CREATE INDEX ON observations (observed_at)