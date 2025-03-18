# EOP Local Infrastructure

This project contains the shared batect config for setting up local infrastructure for EOP.

In packages that import this config `./batect --output=all runSupportServices` will start the necessary infrastructure. 

See the readme for the [EOP Manager](../Manager/README.md) for instructions on using a convenience script to run the application locally.

### DataTransformation script when running locally

Something you may need to remember when running the EOP locally is that the data transformation does not run or start automatically as a part of this LocalInfrastructure process.  The DataTransformation script is responsible for transforming some raw data into forms and creating some tables that are needed by certain parts of the application.  You can run it manually by executing `./batect run` in the packages/DataTransformation folder after the rest of backend has started fully, 
especially if your front end or API do not seem to be displaying the data you expect.