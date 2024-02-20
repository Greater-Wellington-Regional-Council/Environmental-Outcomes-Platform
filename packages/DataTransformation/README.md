# Data Transformations

TODO - this is super quick doc so it can be shared while work is sitll going on

## Running

* Start the Manager as per its [README](../Manager/README.md)
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
