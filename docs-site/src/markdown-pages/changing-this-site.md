---
slug: /changing-this-site/
title: Changing this site
---

## Overview

This site is built using [Gatsby](https://www.gatsbyjs.com/) and hosted in
GitHub pages. Any changes made under `docs-site` in this repo will automatically
be published when pushed to the `main` branch in GitHub.

On top of the basic configuration Gatsby has been configured to build pages from
markdown files, to simplify adding new content.

### Local Development

This site should be runnable on any system with a modern (later that `16`)
nodejs installation. This assumes basic `git` and `nodejs` knowledge, and beyond
the scope of this documentation.

- Clone this repo
- Go to the `docs-site` folder in the clone
- `npm install` - to install node js dependencies
- `npm run develop` - will compile and run the site on port `8000`
- Make changes - simple changes should automatically update in your browser

### Adding a Page

- Add a new markdown file in the `markdown-pages` folder
- Add a `slug` / `section` / `title` into the frontmatter for the markdown file
  (see an existing file for an example)
- Add a reference to the new page in `navigation.ts` to make it appear in the
  left hand menu
