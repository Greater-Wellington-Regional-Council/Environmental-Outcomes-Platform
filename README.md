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
