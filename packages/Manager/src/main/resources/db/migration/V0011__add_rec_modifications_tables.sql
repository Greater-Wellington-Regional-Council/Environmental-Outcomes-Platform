CREATE TABLE rec_rivers_modifications
(
  hydro_id      INTEGER   NOT NULL,
  next_hydro_id INTEGER,
  nz_segment    INTEGER   NOT NULL,
  is_headwater  BOOLEAN   NOT NULL,
  stream_order  INTEGER   NOT NULL,
  geom          GEOMETRY  NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  comment       VARCHAR   NOT NULL,
  PRIMARY KEY (hydro_id)
);

CREATE INDEX ON rec_rivers_modifications (created_at DESC);

COMMENT ON TABLE rec_rivers_modifications IS 'Data from this table is added to the Rivers data before the REC rivers are added. This allows for making manual adjustments to the REC rivers.';


CREATE TABLE rec_watersheds_modifications
(
  hydro_id   INTEGER   NOT NULL,
  nz_segment INTEGER   NOT NULL,
  geom       GEOMETRY  NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  comment    VARCHAR   NOT NULL,
  PRIMARY KEY (hydro_id)
);

CREATE INDEX ON rec_watersheds_modifications (created_at DESC);

COMMENT ON TABLE rec_watersheds_modifications IS 'Data from this table is added to the Watersheds data before the REC watersheds are added. This allows for making manual adjustments to the REC watersheds.';
