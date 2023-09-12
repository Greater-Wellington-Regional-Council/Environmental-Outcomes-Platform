TRUNCATE TABLE water_allocations RESTART IDENTITY;

ALTER TABLE water_allocations RENAME COLUMN amount TO allocation;
ALTER TABLE water_allocations RENAME column last_updated_ingest_id to ingest_id;
ALTER TABLE water_allocations DROP COLUMN received_at;
ALTER TABLE water_allocations 
ADD COLUMN source_id VARCHAR NOT NULL,
ADD COLUMN consent_id VARCHAR NOT NULL,
ADD COLUMN status VARCHAR NOT NULL,
ADD COLUMN is_metered BOOLEAN NOT NULL,
ADD COLUMN metered_allocation_daily NUMERIC NULL,
ADD COLUMN metered_allocation_yearly NUMERIC NULL,
ADD COLUMN meters VARCHAR[] NOT NULL check (array_position(meters, null) is null),
ADD COLUMN effective_from TIMESTAMPTZ NOT NULL,
ADD COLUMN effective_to TIMESTAMPTZ NULL;

ALTER TABLE water_allocations DROP CONSTRAINT water_allocations_area_id_key;

-- Ensures there can only be record where effective_to set yo NULL, which indicates it is currently active
CREATE UNIQUE INDEX water_allocations_source_id_effective_to_idx on water_allocations(source_id) WHERE effective_to IS NULL;
