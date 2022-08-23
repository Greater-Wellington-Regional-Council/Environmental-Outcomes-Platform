# Environmental Outcomes Platform (EOP)

## Documentation

> Published documentation should be available [here](https://greater-wellington-regional-council.github.io/Environmental-Outcomes-Platform/)

All documentation for EOP should be defined in code as part of this repo, and deployed to GitHub pages. It is all very much a work in progress at this stage, with focus on high level of the 

Documentation so far has been built using C4 models with the [Structurizr](https://structurizr.com/) tool. 

### Working on the Documentation

> Expect this process to change

Structurizr lite is used to automatically create C4 diagram images from code, and using the export function that is merged with supplementary documentation written in markdown files and then published as Github pages.

Workflow

* `cd docs`
* `./batect docs`
* View the running docs on http://localhost:8090
* Make changes to the workspace.json or markdown files
* "Export to offline HTML page" and update the version in `docs-exports`
* `git commit` changes
