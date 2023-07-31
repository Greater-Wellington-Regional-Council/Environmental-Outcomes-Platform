-- DB used when running the Application locally
CREATE DATABASE eop_dev;

-- DB used when running automated DB integration tests
CREATE DATABASE eop_test;

\c eop_dev
CREATE SCHEMA hilltop_crawler;

\c eop_test
CREATE SCHEMA hilltop_crawler;
