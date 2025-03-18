# Catchment Context, Challenges and Values (CCCV) application

CCCV is a web application that provides information on Freshwater Management Units mostly intended to inform the creation of [Farm Plans](https://environment.govt.nz/acts-and-regulations/freshwater-implementation-guidance/freshwater-farm-plans/) farmers and their expert representatives.  Farm Plans are required by
by the government as detailed [here](https://environment.govt.nz/acts-and-regulations/acts/).

CCCV is a React/Vite application single page application supported by several backend components including several domain APIs provided by the EOP/He Kākāno backend.  It displays a map of Whaitua (catchments) and the Freshwater Unit boundaries and allows the user to select points and features on the map to identify intersecting catechments and/or FMUs and read or print further details.

The production application is available at [https://cccv.eop.gw.govt.nz/](https://cccv.eop.gw.govt.nz/), but you can also run it locally.  The latter involves running the backend by following the instructions [here]().

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

