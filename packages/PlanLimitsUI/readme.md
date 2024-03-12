
## Plan Limits UI

The Plan Limits UI is a front end application that allows users to view water use limits. It is built using React and relies on the Ha Kākano shared data services to be running in the background. Therefore, to run this application locally, you will need to first start the supporting services which you can do by following the [instructions in the main readme](../../README.md).  Then do the following to serve this application to your browser:-

In a command line shell in the `packages/PlanLimitUI` folder:-
1. Run `npm install`

_The following steps (2 to 4) are only required once, or if your LINZ Basemaps key has expired._

2. Run `cp .env.local.template .env.local`
3. Go to (LINZ Basemaps)[https://basemaps.linz.govt.nz/@-41.8899962,174.0492437,z5) and get a 90 day API key
4. Edit .env.local, adding your basemaps API key from the last step.  It should be be obvious where to insert it and should be a double-quoted string.
   eg, `VITE_LINZ_API_KEY="c01ehzsqpjbep1x6akgf8ey8wxw"`

_And start the server_

5. Run `npm run dev`

You can now visit http://localhost:5173/ to see the Plan Limits UI.
