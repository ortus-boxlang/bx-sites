---
title: Deploying to GitHub Pages
order: 3
---

# Deploying to GitHub Pages

`site/` is a plain static site - host it anywhere that serves static
files. This module ships a ready-to-use GitHub Actions workflow
(`.github/workflows/pages.yml`) for the common case: publishing straight
to GitHub Pages.

## What it does

On every push to `development` that touches `docs/`, `bxdocs.json`, or the
module's own source (theme/pipeline changes), the workflow:

1. Installs BoxLang + [bx-markdown](https://github.com/ortus-boxlang/bx-markdown)
2. Registers this repo as a module so `boxlang module:bxDocs build` resolves
3. Runs `boxlang module:bxDocs build`
4. Uploads `site/` as a Pages artifact and deploys it

It's also available as a manual trigger (`workflow_dispatch`) from the
Actions tab, for a one-off republish without a new commit.

## One-time setup

GitHub Pages needs to be pointed at Actions as its deploy source before the
workflow can publish anything - this is a repository setting, not something
a workflow file can turn on by itself:

1. **Settings -> Pages**
2. Under **Build and deployment -> Source**, choose **GitHub Actions**

After that, every matching push builds and deploys automatically. The
published URL shows up both in the workflow run's summary and under
**Settings -> Pages** once the first deploy completes.

## Using this for your own project

Copy `.github/workflows/pages.yml` into your own project (adjust the
`modules:` line if your project needs anything beyond `bx-markdown`, and
the trigger branch if you don't use `development`), enable Pages as above,
and pushes to your docs will publish the same way.

## Serving from a project Pages sub-path

A GitHub *project* Pages site (as opposed to a `<user>.github.io` *user*
site) is served from `https://<user>.github.io/<repo>/`, not from the
domain root. Set `baseURL` in `bxdocs.json` to that full URL so every
internal link, asset and nav entry gets the `/<repo>/` prefix it needs -
and so a real `sitemap.xml` gets generated too:

```json
{ "baseURL": "https://<user>.github.io/<repo>/" }
```

See [Configuration](../configuration.md#baseurl) for the full breakdown of
what `baseURL` does. A `<user>.github.io` user site, or any custom domain
mapped to the site root, can leave `baseURL` at its default (`/`).
