# Catchment Context, Challenges and Values (CCCV) application

This application supports the Catchment Context, Challenges and Values (CCCV) project. It is a web-based application that allows users to explore data on catchments health and impacting activities as relating to Freshwater Management Units.
See [here](https://www.orc.govt.nz/consents-and-compliance/the-farmer-s-guide/fwfp-cccv-introduction) for more information on the CCCV project. 

This is a React/Vite application on the front end that is supported by several backend components.  The front end provides a view on Whaitua (catchments) and the Freshwater Units using them integrated with relevant health and usage information.  The information is mostly structured to help farmers and other Freshwater Unit Managers produce their Farm Management Plan, a regulatory requirement in New Zealand, but also to enable council staff to access the Farm Management Plan once produced.

To run the application locally, you will need to have the backend components running.  They can be started by running

```bash
cd packages/Manager
./batect run
```

Then, you can start the front end by running

```bash
cd ../cccv
./start.sh -x # This is optional in case you need to remove the local db and artifacts form a previous instance
./batect run
```

The Vite server will start, and will provide a URL that you can use to access the application.

