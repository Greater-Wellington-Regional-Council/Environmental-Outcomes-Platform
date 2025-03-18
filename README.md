# Environmental Outcomes Platform (EOP)

## On Documentation

> Published documentation should be available [here](https://greater-wellington-regional-council.github.io/Environmental-Outcomes-Platform/)

All documentation for EOP should be defined in code as part of this repo, and deployed to GitHub pages. It is all very much a work in progress at this stage, with focus on high level of the 

### Updating the documentation

It is recommended to start the documentation locally and use the live preview in your browser to monitor the effect of changes.

See the docs-site README for more information on how to run the documentation locally.

### How to Run the application locally

To run CCCV locally, see the READMEs for the components you need to execute.  You may need to start more than one component.
* [Plan Limits UI](./packages/PlanLimitsUI/README.md)
* [CCCV](./packages/cccv/README.md)
* [Manager](./packages/Manager/README.md)
* [Local Infrastructure](./packages/LocalInfrastructure/README.md)

#### Application Packages

Having started the shared infrastructure, you will find specific run instructions for each application package in its own README.md file.  For example, [here are the run instructions for the Plan Limits UI](./packages/PlanLimitsUI/README.md).

## `start.sh` ZSH convenience script

To simplify running EOP locally, a `start.sh` script written using ZSH has been provided in the root of the repository.  This script will start a package whose name you provide as the first argument.

For example, to start the PlanUnitsUI single page application, you would run `./start.sh PlanUnitsUI`.

A particularly convenient option for zsh users could be ```./start.sh manager -r``` which will completely delete the database, stop and remove any running containers and restart the backend services.  After running that, in another terminal session you can then ```./start.sh cccv``` or ```./start.sh PlanUnitsUI``` to start your choice SPA front end.

This script was developed on a Mac.

### DataTransformation script when running locally

Something you may need to remember when running the EOP locally is that the data transformation script is not run automatically.  This script is responsible for transforming some raw data into forms that are needed by certain parts of the application.  You can run it manually by executing the following command after the rest of backend has started fully.
`./batect run data-transformation`

Try this if your front end or API are not displaying the data you expect.