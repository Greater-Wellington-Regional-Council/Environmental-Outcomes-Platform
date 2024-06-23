CREATE TABLE councils
(
  id          INTEGER                                NOT NULL
    PRIMARY KEY,
  stats_nz_id INTEGER                                NOT NULL
    UNIQUE,
  name        VARCHAR                                NOT NULL,
  boundary    geometry                               NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);
