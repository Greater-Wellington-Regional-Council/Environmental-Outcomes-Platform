-- Permissions for the Application user.
GRANT USAGE ON SCHEMA public TO eop_manager_app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO eop_manager_app_user;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO eop_manager_app_user;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO eop_manager_app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO eop_manager_app_user;

-- Permissions for the materialized_views_role
GRANT USAGE, CREATE ON SCHEMA public TO materialized_views_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO materialized_views_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO materialized_views_role;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO materialized_views_role;

GRANT materialized_views_role TO eop_manager_app_user;
GRANT materialized_views_role TO eop_manager_migrations_user WITH ADMIN OPTION;

-- Permissions for developer users debugging.
GRANT USAGE ON SCHEMA public TO developers;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT SELECT, INSERT ON TABLES TO developers;

GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO developers;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO developers;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
  GRANT USAGE, SELECT ON SEQUENCES TO developers;

