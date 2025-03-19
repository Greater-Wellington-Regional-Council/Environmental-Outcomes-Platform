# EOP Local Infrastructure

This package contains the shared batect config for setting up local infrastructure for EOP.

At the command line in this folder, run `./batect --output=all runSupportServices` to start the necessary infrastructure. 

See the readme for the [EOP Manager](../Manager/README.md) for an alternative way of running this along with the backend APU using a convenience script.

### DataTransformation script when running locally

The data transformation does not run automatically as a part of this LocalInfrastructure process, although it is responsible for transforming raw data into other values and formats needed by the API and front end apps.  If you are running the EOP locally and are not seeing the data you expect, you may need to run the data transformation script manually after starting the local infrastructure as per [the instructions given here](../DataTransformation/README.md).