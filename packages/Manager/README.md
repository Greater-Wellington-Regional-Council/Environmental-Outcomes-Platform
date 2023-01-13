# EOP Manager

## Getting Started

### Prerequisites

* Docker
* A Java 17 or later JDK

### Building

As a quick start, running a build will ensure you've got the prerequisites installed correctly:

* Start two terminal sessions
* In one session run start an instance of Postgres:
  ```./batect runDatabase```
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
