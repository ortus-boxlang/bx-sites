---
title: Get Your Docs Live in 10 Minutes
date: 2026-07-01
authors: [lmajano]
categories: [Getting Started]
tags: [getting-started, cli, install, boxlang]
summary: Install BX Docs, scaffold a project, add a page, and have a real static site built and served locally before your coffee gets cold.
description: A walkthrough of installing BX Docs, scaffolding a new project with bxDocs new, adding your first page, and building/serving it locally.
image: assets/blog/get-your-docs-live-in-10-minutes-cover.svg
---

I've written a lot of documentation tools over the years, and the thing I keep coming back to with BX Docs is how little ceremony is involved in going from nothing to a real, browsable static site. No config wizard, no plugin marketplace to shop through first - just a folder of Markdown and one command.

<!-- more -->

## Install

BX Docs is a BoxLang module, so it installs the same way any other BoxLang module does. With [CommandBox](https://commandbox.ortusbooks.com/) installed:

```bash frame="terminal" title="Terminal" linenums="1"
box install bx-docs
box install bx-markdown
box install bx-esapi
box install bx-yaml
```

`bx-markdown` handles Markdown rendering, `bx-esapi` handles HTML-encoding, and `bx-yaml` reads your `bxdocs.yaml`. If you'd rather skip CommandBox entirely, BoxLang's own installer grabs all four in a single command:

```bash frame="terminal" title="Terminal"
install-bx-module bx-docs bx-markdown bx-esapi bx-yaml
```

Either path drops a `bxDocs` script on your `PATH`, so every command from here on is just `bxDocs <verb> [options]`.

## Scaffold a project

```bash frame="terminal" title="Terminal" linenums="1"
bxDocs new my-docs
cd my-docs
```

That's it - you now have a `docs/index.md` and a `bxdocs.yaml` sitting next to it. Pass `--theme=material` or `--theme=tailwind` if you don't want the `bootstrap` default, and `--name="My Project Docs"` if you don't want the site name derived from your folder name.

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

BX Docs rewrites that at build time into the real built URL, resolved relative to the *linking* page's own folder. It also means the link still works if someone reads the raw file on GitHub instead of the built site - it's a genuinely valid relative path either way.

A page can carry a small frontmatter block up top - `title`, `order`, `tags`, `icon`, `summary`, and a few others - all optional. Skip it entirely and BX Docs derives a sensible title from the filename.

## Build and serve

```bash frame="terminal" title="Terminal"
bxDocs build
```

renders everything in `docs/` into `site/`, ready to host anywhere that serves static files. While you're actively writing:

```bash frame="terminal" title="Terminal"
bxDocs serve
```

builds the project, serves `site/` at `http://127.0.0.1:8080/`, and rebuilds automatically the moment you save a change under `docs/` or `bxdocs.yaml` - your browser reloads on its own, no manual refresh loop.

From here, the obvious next moves are picking a theme that fits your project (see [Pick Your Theme](pick-your-theme.md)) and deciding whether you want search wired up beyond the default (it already is - see [Search That Just Works](search-that-just-works.md)). Both work with zero extra setup beyond what `new` already scaffolded.

Which part of this took you the longest the first time - install, or picking your first page structure? I'd genuinely like to know.
