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
* `git commit` changes

### How to Run the application locally

This is currently a slightly manual process.  In general, you will need at least the following installed on your machine:-
* A [JVM](https://aws.amazon.com/corretto/?filtered-posts.sort-by=item.additionalFields.createdDate&filtered-posts.sort-order=desc) installed on the target machine.
* [Docker](https://docs.docker.com/get-docker/) in order to run the [Batect](https://batect.dev/) tool.
* And of course a **git** tool of some sort to clone the repo to your machine

With above in place, clone the repo to your machine and do the following from the command line in the root of your local repo to run the Plan Limits application:-
1. `cd packages/Manager`
2. `./batect runSupportServices`
_From a new shell session in the same folder_
3`./gradew bootRun`

You have now started the shared infrastructure, and will find specific run instructions for each application package in its own README.md file.

For example, [here are the run instructions for the Plan Limits UI](packages/PlanLimitsUI/README.md).
