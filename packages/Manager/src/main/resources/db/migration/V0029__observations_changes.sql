ALTER TABLE observation_sites
    ALTER COLUMN location DROP NOT NULL;

ALTER TABLE observations
    DROP CONSTRAINT observations_pkey;

ALTER TABLE observations
    DROP CONSTRAINT observations_observation_measurement_id_observed_at_key;

ALTER TABLE observations
    DROP COLUMN id;

ALTER TABLE observations
    ADD PRIMARY KEY (observation_measurement_id, observed_at);

