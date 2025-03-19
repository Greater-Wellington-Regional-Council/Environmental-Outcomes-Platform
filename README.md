# Environmental Outcomes Platform (EOP)

EOP / He Kākano is an initiative led by Greater Wellington Regional Council to establish an end-to-end platform for capture, management and reporting of environmental information. It's goal is to allow all regional councils to maximise the value they get from their environmental data efforts and provide clear, consistent and user-centric information to end-users if this data. It’s built based on the experiences from the Environment Canterbury Water Data programme
## About this Documentation
> Published documentation is available [here](https://greater-wellington-regional-council.github.io/Environmental-Outcomes-Platform/)

Documentation for EOP is expressed as a Gatsby web site as part of this repo, and deployed to GitHub pages.  Any changes are automatically published to the above link when the repository is pushed to or merged into the `main` branch in GitHub.

### Updating the documentation

It is recommended to start the documentation server locally and use the live preview in your browser to monitor the effect of changes.

See the [docs-site README](./docs-site/README.md) for more information on how to run the documentation locally.

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
`./start.sh DataTransformation`

Try this if your front end or API are not displaying the data you expect.
