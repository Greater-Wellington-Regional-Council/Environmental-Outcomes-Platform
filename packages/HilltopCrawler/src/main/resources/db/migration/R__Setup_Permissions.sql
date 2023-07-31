-- Permissions for the Application user.
GRANT USAGE ON SCHEMA hilltop_crawler TO eop_hilltop_crawler_app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA hilltop_crawler
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO eop_hilltop_crawler_app_user;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA hilltop_crawler TO eop_hilltop_crawler_app_user;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA hilltop_crawler TO eop_hilltop_crawler_app_user;

ALTER DEFAULT PRIVILEGES IN SCHEMA hilltop_crawler
    GRANT USAGE, SELECT ON SEQUENCES TO eop_hilltop_crawler_app_user;

-- Permissions for developer users debugging.
GRANT USAGE ON SCHEMA hilltop_crawler TO developers;

ALTER DEFAULT PRIVILEGES IN SCHEMA hilltop_crawler
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO developers;

GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA hilltop_crawler TO developers;

GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA hilltop_crawler TO developers;

ALTER DEFAULT PRIVILEGES IN SCHEMA hilltop_crawler
    GRANT USAGE, SELECT ON SEQUENCES TO developers;
