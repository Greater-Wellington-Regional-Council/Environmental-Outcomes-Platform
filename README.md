# Environmental Outcomes Platform (EOP)

## Documentation

> Published documentation should be available [here](https://greater-wellington-regional-council.github.io/Environmental-Outcomes-Platform/)

All documentation for EOP should be defined in code as part of this repo, and deployed to GitHub pages. It is all very much a work in progress at this stage, with focus on high level of the 

Documentation so far has been built using C4 models with the [Structurizr](https://structurizr.com/) tool. 

### Working on the Documentation

> Expect this process to change

Structurizr lite is used to automatically create C4 diagram images from code, and using the export function that is merged with supplementary documentation written in markdown files and then published as Github pages.

Workflow

Launching Structurizr locally

* `cd docs-site`
* `./batect structurizr`

Making changes

* Edit workspace.dsl file to update diagrams
* View on http://localhost:8090

Include diagrams in the site:

* Export diagrams via http://localhost:8090
* Save exported diagrams to the relevant folder in `src/markdown-pages`
* Update the relevant markdown file to incorporate diagrams into the site.
* 
* `git commit` changes

### Run the application locally

Running this application is fairly manual at the moment and requires some technical expertise.  In summary, you can run the application on your own computer by downloading it to your computer, setting up a few dependencies and executing a number of shell commands to start desired components. You will need on your machine:-
* [postgres](https://www.postgresql.org/download/) installed on the target machine
* [Docker](https://docs.docker.com/get-docker/)
* [Node](https://nodejs.org/en/download/) to a GUI/front end application such as Plan Limits (which is a React application)
* Java and [Gradle](https://gradle.org/install/)
* And of course **git** to clone the repo to your machine

With above in place, clone the repo to your machine and do the following in the root of your local repo to run the Plan Limits application:-
1. `cd packages/Manager`
2. `./batect runSupportServices`
3. Create a new shell session in the same folder
4. `./gradew bootRun`
5. In a new shell, go to `packages/PlanLimitUI`
6. npm install
7. `cp .env.local.template .env.local`
8. Go to (LINZ Basemaps)[https://basemaps.linz.govt.nz/@-41.8899962,174.0492437,z5) and get a 90 day API key
9. Edit .env.local, adding your basemaps API key from the last step.  It should be be obvious where to insert it and should be a double-quoted string.
    eg, `VITE_LINZ_API_KEY="c01hnehzqpjbep1x6kgf8ey8wxw"`
10. Ensure there are no instances of postgres running on your system
11. `npm run dev`
12. Visit http://localhost:5173/
