CREATE DATABASE eop_dev;
CREATE DATABASE eop_test;


-- Setup dev with the 2 users we use for running the App vs Migrations
-- these will be manually setup in the deployment environments
\c eop_dev
CREATE EXTENSION postgis;

REVOKE ALL PRIVILEGES ON SCHEMA public FROM PUBLIC;

CREATE USER eop_manager_migrations_user WITH password 'password' NOINHERIT;
GRANT ALL ON SCHEMA public TO eop_manager_migrations_user WITH GRANT OPTION;

CREATE USER eop_manager_app_user WITH password 'password' NOINHERIT;

\c eop_test
CREATE EXTENSION postgis;
