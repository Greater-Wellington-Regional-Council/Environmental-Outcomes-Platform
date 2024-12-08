# Data Transformations

TODO - this is super quick doc so it can be shared while work is sitll going on

## Running

* Start the Manager as per its [README](../Manager/README.md)
* run `./batect deps` - this will install the dependencies for dbt
* run `./batect run` - this will run DBT against the DB the manager is using
* You should now have a rivers_2 table in the DB

## Code Formatting

Configured to use SQLfluff

### Lint mode

Will run and return a non-zero exit code if there are any linting errors (for CI) 

* `./batect lint`

### Fix mode

Will fix any linting errors it can (for local development)

* `./batect lint-fix`

### Note

Any new views/tables created by DBT needs to be added into
`packages/Manager/src/main/resources/db/migration/R__dbt_temp_schema.sql`.

This will allow JOOQ to generate classes before DBT has run

### Generate DBT documentation

The command helps in generating your project's documentation and catelog will be created.

* `./batect generate-docs`

### Start a webserver
This command starts a webserver on port 8080 to serve your documentation locally and opens the documentation site in your default browser.

* `./batect serve-docs`

Note: Be sure to run docs generate before docs serve because the generate command produces a catalog metadata artifact that the serve command depends upon. 
You will see an error message if the catalog is missing.