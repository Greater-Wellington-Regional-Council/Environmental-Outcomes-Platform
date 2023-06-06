# EOP Local Infrastructure

This project contains the local infrastructure config for running the EOP Modules locally. It is exposed via shared
batect tasks.

## Getting started

### Prerequisites

* Docker

### Running

* Start services required for development ```./batect --output=all runSupportServices```

> Because of the way batect config is shared, the `runSupportServices` is available from any package that includes the
> shared batect config and only a single instance of this task needs to be running for all packages / their will be port
> conflicts if more than one is started.

