ALTER TABLE water_allocations
    RENAME COLUMN allocation TO allocation_plan;

ALTER TABLE water_allocations
    RENAME COLUMN metered_allocation_daily TO allocation_daily;

ALTER TABLE water_allocations
    ALTER COLUMN allocation_daily SET NOT NULL;

ALTER TABLE water_allocations
    RENAME COLUMN metered_allocation_yearly TO allocation_yearly;

ALTER TABLE water_allocations
    ALTER COLUMN allocation_yearly SET NOT NULL;

