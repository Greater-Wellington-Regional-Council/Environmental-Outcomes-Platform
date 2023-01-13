-- DB used when running the Application locally
CREATE DATABASE eop_dev;

-- DB used when running automated DB integration tests
CREATE DATABASE eop_test;


-- Setup dev with the 2 users we use for running the App vs Migrations
-- these will be manually setup in the deployment environments
\c eop_dev
-- Our Schema relies on PostGIS being enabled and must be done as a super-user
CREATE EXTENSION postgis;

-- By default the PUBLIC role has very permissive access to the public schema this is to lock that down to only GRANTED permissions
REVOKE ALL PRIVILEGES ON SCHEMA public FROM PUBLIC;

CREATE USER eop_manager_migrations_user WITH PASSWORD 'password' NOINHERIT;

-- Migrations user has full access
GRANT ALL ON SCHEMA public TO eop_manager_migrations_user WITH GRANT OPTION;

-- App / Developers will be granted access by the migrations user in migration scripts
CREATE USER eop_manager_app_user WITH PASSWORD 'password' NOINHERIT;

CREATE ROLE developers NOINHERIT;


\c eop_test
CREATE EXTENSION postgis;

-- Test DB will just be access via the super-user so no explicit roles needed
