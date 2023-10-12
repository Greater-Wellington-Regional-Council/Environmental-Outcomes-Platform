-- This script moves all the observed_at time stamps so that the latest one is 60 days in the future.

-- If we just try to add say 30 days to the observed_at column we get primary key conflicts.
-- So we subtract 10 years first so that we can add days back without conflicts.
UPDATE observations
SET observed_at = observed_at - make_interval(years => 10);

WITH days_to_add AS (SELECT make_interval(days => (SELECT (EXTRACT(DAY FROM NOW() - MAX(observed_at))::INT + 60))) FROM observations)
UPDATE observations
SET observed_at = observed_at + (SELECT * FROM days_to_add);
