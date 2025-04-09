
## Plan Limits UI

The Plan Limits UI is a front end application that allows users to view water use limits. It is built using React and relies on the Ha Kākano shared data services to be running to provide backend services.

See the [here](../../README.md) for more information on running the backend services on your machine.

Once the backend is running, execute the following at the command line in the `packages/PlanLimitUI` folder:-
1. Run `npm install` to build the application
2. Run the following command to create a .env file<br/>
   `cp .env.local.template .env.local`
3. Go to [LINZ Basemaps](https://basemaps.linz.govt.nz/@-41.8899962,174.0492437,z5) and get a 90 day API key and add it to the .env.local file, eg:<br/>
   `VITE_LINZ_API_KEY="c01ehzsqpjbep1x6akgf8ey8wxw"`
4. Start the server with<br/>
   `npm run dev`

Steps 2 and 3 are only required the first time you run the application.

Go to the address shown in the terminal to view the application.
