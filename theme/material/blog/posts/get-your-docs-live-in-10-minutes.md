---
title: Get Your Docs Live in 10 Minutes
date: 2026-07-01
authors: [lmajano]
categories: [Getting Started]
tags: [getting-started, cli, install, boxlang]
summary: Install BxSites, scaffold a project, add a page, and have a real static site built and served locally before your coffee gets cold.
description: A walkthrough of installing BxSites, scaffolding a new project with bxSites new, adding your first page, and building/serving it locally.
image: assets/blog/get-your-docs-live-in-10-minutes-cover.svg
---

I've written a lot of documentation tools over the years, and the thing I keep coming back to with BxSites is how little ceremony is involved in going from nothing to a real, browsable static site. No config wizard, no plugin marketplace to shop through first - just a folder of Markdown and one command.

<!-- more -->

## Install

BxSites is a BoxLang module, so it installs the same way any other BoxLang module does. Its dependencies (`bx-markdown` for Markdown rendering, `bx-esapi` for HTML-encoding, `bx-yaml` for reading your `bxsites.yaml`, and `bx-image` for the responsive-image pipeline) are all installed automatically as `box.json` dependencies, so installing `bx-sites` itself is the only command needed:

```bash frame="terminal" title="Terminal"
# OS Binary
install-bx-module bx-sites

# CommandBox
box install bx-sites
```

Either path drops a `bxSites` script on your `PATH`, so every command from here on is just `bxSites <verb> [options]`.

## Scaffold a project

```bash frame="terminal" title="Terminal" linenums="1"
bxSites new my-docs
cd my-docs
```

That's it - you now have a `docs/index.md` and a `bxsites.yaml` sitting next to it. Pass `--theme=material` or `--theme=tailwind` if you don't want the `bootstrap` default, and `--name="My Project Docs"` if you don't want the site name derived from your folder name.

## Add pages

Every `.md` file under `docs/` becomes a page, and folder nesting becomes nav nesting automatically - no separate nav config to maintain for a normal-sized project:

```text title="Project structure"
docs/
├── index.md              -> /
├── guides/
│   ├── index.md          -> /guides/
│   └── deployment.md     -> /guides/deployment/
```

Link between pages the way you'd expect if the files were just sitting next to each other on disk, because they are:

```markdown title="Example link"
See [Deployment](guides/deployment.md) for the full picture.
```

BxSites rewrites that at build time into the real built URL, resolved relative to the *linking* page's own folder. It also means the link still works if someone reads the raw file on GitHub instead of the built site - it's a genuinely valid relative path either way.

A page can carry a small frontmatter block up top - `title`, `order`, `tags`, `icon`, `summary`, and a few others - all optional. Skip it entirely and BxSites derives a sensible title from the filename.

## Build and serve

```bash frame="terminal" title="Terminal"
bxSites build
```

renders everything in `docs/` into `site/`, ready to host anywhere that serves static files. While you're actively writing:

```bash frame="terminal" title="Terminal"
bxSites serve
```

builds the project, serves `site/` at `http://127.0.0.1:8080/`, and rebuilds automatically the moment you save a change under `docs/` or `bxsites.yaml` - your browser reloads on its own, no manual refresh loop.

From here, the obvious next moves are picking a theme that fits your project (see [Pick Your Theme](pick-your-theme.md)) and deciding whether you want search wired up beyond the default (it already is - see [Search That Just Works](search-that-just-works.md)). Both work with zero extra setup beyond what `new` already scaffolded.

Which part of this took you the longest the first time - install, or picking your first page structure? I'd genuinely like to know.
