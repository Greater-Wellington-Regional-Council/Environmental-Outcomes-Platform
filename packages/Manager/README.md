# EOP Manager

## Getting Started

### Prerequisites

* Docker
* A Java 17 or later JDK

### Building

As a quick start, running a build will ensure you've got the prerequisites installed correctly:

* Start two terminal sessions
* In one session run start an instance of Postgres:  ```./batect runDatabase```
* In a second session build the application ```./gradlew check```

And if successful, everything you need is installed.

For day to day development use your IDE of choice. IntelliJ's community edition is a good full-featured IDE or VSCode
with plugins for Kotlin and Gradle also works (though support for running inline is limited.)

> Running via `./batect runDatabase` will store postgres data in the .postgres folder, you can delete this folder to
> start from a clean slate.

### Running

* Start two terminal sessions
* In one session run start an instance of Postgres:
  ```./batect runDatabase```
* In a second session start the application ```./gradlew bootRun```

### Code Formatting

Code is formatted using [Spotless](https://github.com/diffplug/spotless)

## Config

### Profiles

There are currently 2 spring profiles available for configuring the application in different modes

* `prod` - For running in production, doesn't add test data to the database, and tweaks logging settings.
* `ssl` - For running with SSL enabled, when enabling this requires other config properties are set (see below)

> Note: in production, the expectation is that both the `prod` and `ssl` profiles will be enabled

### Environment Properties

The table below lists all the config settings that can be controlled via the environment:

| Key                                 | Description                                                          | Default   | Profiles |
|-------------------------------------|----------------------------------------------------------------------|-----------|----------|
| CONFIG_DATABASE_HOST                | Database host name                                                   | localhost | default  |
| CONFIG_DATABASE_PORT                | Database port                                                        | 5432      | default  |
| CONFIG_DATABASE_NAME                | Database name                                                        | eop_dev   | default  |
| CONFIG_DATABASE_USERNAME            | User for standard database access                                    | postgres  | default  |
| CONFIG_DATABASE_PASSWORD            | Password for standard user                                           | password  | default  |
| CONFIG_DATABASE_MIGRATIONS_USERNAME | User for running database migrations                                 | postgres  | default  |
| CONFIG_DATABASE_MIGRATIONS_PASSWORD | Password for migrations user                                         | password  | default  | 
| CONFIG_KEYSTORE_CONTENT             | Base64 encoded content of JKS file (see SSL section)                 | NONE      | ssl      | 
| CONFIG_KEYSTORE_PATH                | Path to Java keystore (overridden if CONFIG_KEYSTORE_CONTENT is set) | NONE      | ssl      | 
| CONFIG_KEYSTORE_PASSWORD            | Password for the Keystore                                            | NONE      | ssl      | 
| CONFIG_KEYSTORE_KEY                 | Key ion the keystore for SSL                                         | NONE      | ssl      | 

## Database

### Bootstrapping

The application is configured to use different users when running migration scripts vs normal running of the
application. This requires some bootstrapping of a new database using the super-user to set up the initial access. For
local development setup this is handled in [the docker container init script](.batect/database/init.sql)

When setting up a new deployment environment of a database for EOP Manager this script will need to be run manually with
super-user privilege

> **Note** that passwords will need to be updated / set in this script

```sql
-- Our Schema relies on PostGIS being enabled and must be done as a super-user
CREATE EXTENSION postgis;

-- By default the PUBLIC role has very permissive access to the public schema this is to lock that down to only GRANTED permissions
REVOKE ALL PRIVILEGES ON SCHEMA public FROM PUBLIC;

CREATE USER eop_manager_migrations_user WITH PASSWORD '***' NOINHERIT;

-- Migrations user has full access
GRANT ALL ON SCHEMA public TO eop_manager_migrations_user WITH GRANT OPTION;

-- App / Developers will be granted access by the migrations user in migration scripts
CREATE USER eop_manager_app_user WITH PASSWORD '***' NOINHERIT;

CREATE ROLE developers NOINHERIT;
```

### Developer Access

The bootstrap script creates a role called `developers` for which development support users can be added.

These users will need to be added with the super-user privilege.

```sql
CREATE USER foo_bar WITH LOGIN;

GRANT developers TO foo_bar;
```

## SSL

When running in a deployment environment, the application should be running with SSL enabled. Because we package the
application in a Docker container we need to be able to provide the Keystore to use without baking it into the container
image.

There are various ways to do this depending on deployment environment, but to support Amazon ECS as a target our
approach is to provide the keystore content as a Base64 encoded string passed in via the environment, and the app has
some bootstrapping code to store the keystore on the file system before it gets accessed.
