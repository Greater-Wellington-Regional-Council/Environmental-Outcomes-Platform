CREATE TABLE raw_rec_features_rivers
(
  id          INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  data        jsonb
);

COMMENT ON TABLE raw_rec_features_rivers IS 'Store for the REC watersheds as RAW GeoJSON features. One Feature per row';

CREATE INDEX raw_rec_features_rivers_ingested_at_idx ON raw_rec_features_rivers (ingested_at DESC);

CREATE TABLE raw_rec_features_watersheds
(
  id          INTEGER GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  data        jsonb
);

CREATE INDEX raw_rec_features_watersheds_ingested_at_idx ON raw_rec_features_watersheds (ingested_at DESC);

CREATE TABLE raw_rec_rivers_names
(
  nz_segment  INTEGER                             NOT NULL PRIMARY KEY,
  river_name  VARCHAR                             NOT NULL,
  ingested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX raw_rec_rivers_names_ingested_at_idx ON raw_rec_rivers_names (ingested_at DESC);

CREATE TABLE rec_rivers_modifications
(
  hydro_id      INTEGER                             NOT NULL PRIMARY KEY,
  next_hydro_id INTEGER,
  nz_segment    INTEGER                             NOT NULL,
  is_headwater  BOOLEAN                             NOT NULL,
  stream_order  INTEGER                             NOT NULL,
  geom          geometry                            NOT NULL,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  comment       VARCHAR                             NOT NULL
);

COMMENT ON TABLE rec_rivers_modifications IS 'Data from this table is added to the Rivers data before the REC rivers are added. This allows for making manual adjustments to the REC rivers.';

CREATE INDEX rec_rivers_modifications_created_at_idx ON rec_rivers_modifications (created_at DESC);

CREATE TABLE rec_watersheds_modifications
(
  hydro_id   INTEGER                             NOT NULL PRIMARY KEY,
  nz_segment INTEGER                             NOT NULL,
  geom       geometry                            NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
  comment    VARCHAR                             NOT NULL
);

COMMENT ON TABLE rec_watersheds_modifications IS 'Data from this table is added to the Watersheds data before the REC watersheds are added. This allows for making manual adjustments to the REC watersheds.';

CREATE INDEX rec_watersheds_modifications_created_at_idx ON rec_watersheds_modifications (created_at DESC);