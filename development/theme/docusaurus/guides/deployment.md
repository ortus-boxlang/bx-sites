---
title: Deploying to GitHub Pages
order: 3
icon: phosphor-duotone:cloud-arrow-up
tags: [guides, deployment]
---

# Deploying to GitHub Pages

`site/` is a plain static site - host it anywhere that serves static
files. This module ships a ready-to-use GitHub Actions workflow
(`.github/workflows/pages.yml`) for the common case: publishing straight
to GitHub Pages, with `main` and `development` published as two
independently-live versions of the same site.

For a simpler single-version project with no CI setup at all,
[`bxSites gh-deploy`](../cli-reference.md#gh-deploy) builds and pushes
`site/` to a `gh-pages` branch in one command, run from your own machine
whenever you want to publish - no workflow file needed. The rest of this
guide covers the GitHub Actions workflow this repo itself uses, for
automatic multi-version publishing on every push.

## What it does

On every push to `main` or `development` that touches `docs/`, `bxsites.yaml`,
or the module's own source (theme/pipeline changes), the workflow:

1. Installs BoxLang + [bx-markdown](https://github.com/ortus-boxlang/bx-markdown)
2. Registers this repo as a module so `boxlang bxSites build` resolves
3. On any branch but `main`, points `baseURL` at `.../<branch-name>/` for
   just this build (see [below](#publishing-two-versions-at-once))
4. Runs `boxlang bxSites build`
5. Pushes `site/` to the `gh-pages` branch - `main` to the site root,
   `development` to `/development/` - without touching the other version

It's also available as a manual trigger (`workflow_dispatch`) from the
Actions tab, for a one-off republish without a new commit.

## One-time setup

GitHub Pages needs to be pointed at the `gh-pages` branch before the
workflow can publish anything - this is a repository setting, not something
a workflow file can turn on by itself. The first successful run creates
`gh-pages` for you, so do this *after* the workflow has run at least once:

1. **Settings -> Pages**
2. Under **Build and deployment -> Source**, choose **Deploy from a branch**
3. Under **Branch**, choose **gh-pages** and **/ (root)**

After that, every matching push builds and deploys automatically. The
published URL shows up under **Settings -> Pages** once the first deploy
completes.

## Publishing two versions at once

`main` publishes to the site root (`https://<user>.github.io/<repo>/`) -
treat this as the stable/released docs. `development` publishes to
`/development/` (`https://<user>.github.io/<repo>/development/`) - the
latest, unreleased docs. Both stay live simultaneously: each branch's job
only pushes to `gh-pages` with `keep_files: true` and its own
`destination_dir`, so a `development` deploy never overwrites `main`'s
content and vice versa.

`main`'s own `bxsites.yaml` should have `baseURL` set to the site root
(`https://<user>.github.io/<repo>/`); the workflow overrides it for every
other branch at build time, so `development`'s `bxsites.yaml` doesn't need
its own `baseURL` entry for this to work.

To add a third branch (e.g. a `release/2.0` preview), add it to the `on.push.branches`
list and give it its own `if: github.ref_name == '...'` deploy step with
`destination_dir: release-2.0` (or similar) - the pattern is the same as
`development`'s.

## Using this for your own project

Copy `.github/workflows/pages.yml` into your own project (adjust the
`modules:` line if your project needs anything beyond `bx-markdown`), enable
Pages as above, and pushes to `main`/`development` will publish the same
way. If you only want a single published version, delete the branch you
don't need from `on.push.branches` and its matching deploy step.

## Serving from a project Pages sub-path

A GitHub *project* Pages site (as opposed to a `<user>.github.io` *user*
site) is served from `https://<user>.github.io/<repo>/`, not from the
domain root. Set `baseURL` in `bxsites.yaml` to that full URL so every
internal link, asset and nav entry gets the `/<repo>/` prefix it needs -
and so a real `sitemap.xml` gets generated too:

```yaml title="bxsites.yaml"
baseURL: "https://<user>.github.io/<repo>/"
```

See [Configuration](../configuration.md#baseurl) for the full breakdown of
what `baseURL` does. A `<user>.github.io` user site, or any custom domain
mapped to the site root, can leave `baseURL` at its default (`/`).
