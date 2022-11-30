ALTER TABLE
  rivers_processed
RENAME TO
  rivers;

ALTER TABLE
  rivers
ADD
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE
  watersheds_processed
RENAME TO
  watersheds;

ALTER TABLE
  watersheds
ADD
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;

ALTER TABLE
  rivers_catchments
RENAME TO
  catchments;

ALTER TABLE
  catchments
ADD
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP;
