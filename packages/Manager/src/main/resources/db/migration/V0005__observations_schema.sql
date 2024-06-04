CREATE TABLE observation_sites
(
  id         SERIAL PRIMARY KEY,
  council_id INTEGER                                NOT NULL REFERENCES councils,
  name       VARCHAR                                NOT NULL,
  location   geometry(Point, 2193),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE (council_id, name)
);

CREATE TABLE observation_sites_measurements
(
  id                   SERIAL PRIMARY KEY,
  site_id              INTEGER                                NOT NULL REFERENCES observation_sites,
  measurement_name     VARCHAR                                NOT NULL,
  first_observation_at TIMESTAMP WITH TIME ZONE               NOT NULL,
  last_observation_at  TIMESTAMP WITH TIME ZONE               NOT NULL,
  observation_count    INTEGER                                NOT NULL,
  created_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at           TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE (site_id, measurement_name)
);

CREATE TABLE observations
(
  observation_measurement_id INTEGER                                NOT NULL REFERENCES observation_sites_measurements,
  amount                     NUMERIC                                NOT NULL,
  observed_at                TIMESTAMP WITH TIME ZONE               NOT NULL,
  created_at                 TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at                 TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  PRIMARY KEY (observation_measurement_id, observed_at)
);

CREATE INDEX observations_observed_at_idx ON observations (observed_at);
