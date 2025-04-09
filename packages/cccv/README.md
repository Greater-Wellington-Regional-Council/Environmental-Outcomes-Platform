# Catchment Context, Challenges and Values (CCCV) application

CCCV provides information on Freshwater Management Units mostly intended to inform the creation of [Farm Plans](https://environment.govt.nz/acts-and-regulations/freshwater-implementation-guidance/freshwater-farm-plans/) by farmers and/or their expert representatives.  Farm Plans are required by
by the government as detailed [here](https://environment.govt.nz/acts-and-regulations/acts/).

CCCV is a React/Vite application single page web application.  It is supported by several backend components including several domain APIs provided by the EOP/He Kākano backend.  The front end application displays a map of Whaitua (catchments) and the Freshwater Unit boundaries and allows the user to select points and features on the map to identify intersecting catchments and/or FMUs and read or print further details.
  It also provides a search feature to find catchments and FMUs that intersect a physical address boundary.  This is useful, for example, for farmers who may want to know which catchments and FMUs intersect their farm.

The live application is available at [https://cccv.eop.gw.govt.nz/](https://cccv.eop.gw.govt.nz/), but you can also run it locally, which you may want to do, for example, if you would like to make and submit changes to the app.  To run it locally, you will need to start first the backend, then the front end.

See [the Manager readme](../Manager/README.md) for instructions on running the backend.

When you are ready to start the front end the first time, you will need to ensure that the following environment variables have been set in a `.env` file in the cccv folder:- by running the following commands in the ```packages/cccv``` folder of the repository:
```shell
VITE_LINZ_API_KEY=<your own LINZ API key from https://basemaps.linz.govt.nz/>
VITE_MAPBOX_API_KEY=<your own Mapbox API key from https://account.mapbox.com/>
```

Then, from in the commandline in the `packages/cccv` folder, run the following commands:-
```shell
npm install
npm run dev
```

The Vite server will start, and will show a URL in the terminal that you can use to access the application.

### Running CCCV with the convenience script

There is a convenience script provided in the root of the repository that can be used to start CCCV as well as other components.  For example, to start the CCCV application, you would run `./start.sh cccv`.  This still requires you to start the backend services separately beforehand.  See [the top-level readme](../../README.md) for details.

