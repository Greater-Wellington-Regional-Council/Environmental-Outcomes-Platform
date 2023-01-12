GRANT
  USAGE ON SCHEMA public TO eop_manager_app_user;

ALTER DEFAULT PRIVILEGES
  IN SCHEMA public
GRANT
SELECT
,
  INSERT,
UPDATE
,
  DELETE ON TABLES TO eop_manager_app_user;

GRANT
SELECT
,
  INSERT,
UPDATE
,
  DELETE ON ALL TABLES IN SCHEMA public TO eop_manager_app_user;
