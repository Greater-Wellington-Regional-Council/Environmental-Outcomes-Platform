<p align="center">
  <a href="https://www.gatsbyjs.com/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts">
    <img alt="Gatsby" src="https://www.gatsbyjs.com/Gatsby-Monogram.svg" width="60" />
  </a>
</p>
<h1 align="center">
  EOP Docs created with Gatsby
</h1>

This is a Gatsby site that provides documentation for the EOP project.  It is a static site that is generated from markdown files that are stored in the `docs-site/src/markdown-pages` directory.  The site is deployed to Github Pages by the docs-site.yml workflow.

### Getting Started

It is recommended that you run the site locally to see the effect of changes as you edit the document locally.  The easiest way to do this is to clone the repo to your machine and do following at the command line from the root of the project:-
- `cd docs-site`
- `./batect run` - will compile and run the site on port `8000`
- Open a browser and navigate to `http://localhost:8000` to view the documentation

### Adding a Page

- Add a new markdown file in the `markdown-pages` folder
- Add a `slug` / `section` / `title` into the front matter for the markdown file
  (see an existing file for an example)
- Add a reference to the new page in `navigation.ts` to make it appear in the
  left hand menu

### To edit pages
- Use an editor the markdown file in the `markdown-pages` folder.  If you started the site locally, you should see the effect of changes in real time in your browser.
- If you need to add system diagrams to a page, you will need to run the [Structurizr](https://structurizr.com/) tool as well, and export completed diagrams from that into the same folder as the markdown file. See full instructions below [in the next section](#Updating-System-Diagrams) below.
- When you are happy with all changes, commit them to the repo.  The site will be automatically updated on the next push to the `main` branch.

### Updating System Diagrams

[Structurizr lite](https://docs.structurizr.com/lite) is used to generate most system diagrams in this documentation.  Structurizr generates diagrams from [C4 models](https://c4model.com/) textual descriptions which you will find in the `docs-site/workspace.dsl` file.

#### Here is how to generate and update the diagrams.

At the command line in the root of the project/repo:-
* `cd docs-site`
* `./batect structurizr`

This starts the Structurizr tool to serve the diagrams on http://localhost:8090.

To make changes to the diagrams:-
* Edit workspace.dsl file
* Refesh the browser window on http://localhost:8090 to see the effect of changes

Then, to include new system diagrams in the EOP documentation:-
* Export the diagrams from Structurizer lite at http://localhost:8090 (make sure you export them as PNGs)
* Move/copy exported diagrams to the same folder as their corresponding pages under `src/markdown-pages`
* Make sure the links in the markdown pages reflect the names and locations of your new files
* `git commit` changes. The site will be automatically updated on the next push or merge into the `main` branch.

<br/>
<hr/>

### 🚀 APPENDIX 1: Gadsby Starter README

Just in case it's useful, here is the README from the Gatsby starter that was used to create this site.

The latest version of this README can be found [here](https://www.gatsbyjs.com/docs/) on the Gatsby website.

1.  **Create a Gatsby site.**

    Use the Gatsby CLI to create a new site, specifying the minimal TypeScript
    starter.

    ```shell
    # create a new Gatsby site using the minimal TypeScript starter
    npm init gatsby
    ```

2.  **Start developing.**

    Navigate into your new site’s directory and start it up.

    ```shell
    cd my-gatsby-site/
    npm run develop
    ```

3.  **Open the code and start customizing!**

    Your site is now running at http://localhost:8000!

    Edit `src/pages/index.tsx` to see your site update in real-time!

4.  **Learn more**

    - [Documentation](https://www.gatsbyjs.com/docs/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)

    - [Tutorials](https://www.gatsbyjs.com/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)

    - [Guides](https://www.gatsbyjs.com/tutorial/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)

    - [API Reference](https://www.gatsbyjs.com/docs/api-reference/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)

    - [Plugin Library](https://www.gatsbyjs.com/plugins?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)

    - [Cheat Sheet](https://www.gatsbyjs.com/docs/cheat-sheet/?utm_source=starter&utm_medium=readme&utm_campaign=minimal-starter-ts)

## 🚀 Quick start (Gatsby Cloud)

Deploy this starter with one click on
[Gatsby Cloud](https://www.gatsbyjs.com/cloud/):

[<img src="https://www.gatsbyjs.com/deploynow.svg" alt="Deploy to Gatsby Cloud">](https://www.gatsbyjs.com/dashboard/deploynow?url=https://github.com/gatsbyjs/gatsby-starter-minimal-ts)
