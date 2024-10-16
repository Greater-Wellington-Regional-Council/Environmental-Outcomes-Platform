-- Permissions for the Application user.
GRANT USAGE ON SCHEMA public TO eop_manager_app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO eop_manager_app_user;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO eop_manager_app_user;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO eop_manager_app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO eop_manager_app_user;

-- Permissions for developer users debugging.
GRANT USAGE ON SCHEMA public TO developers;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT, INSERT ON TABLES TO developers;

GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO developers;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO developers;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO developers;

