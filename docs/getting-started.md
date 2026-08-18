---
title: Getting Started
order: 2
---

# Getting Started

## Install

BX Docs depends on [bx-markdown](https://github.com/ortus-boxlang/bx-markdown)
for Markdown rendering and [bx-esapi](https://github.com/ortus-boxlang/bx-esapi)
for HTML-encoding. With [CommandBox](https://commandbox.ortusbooks.com/)
installed:

```bash
box install bx-docs
box install bx-markdown
box install bx-esapi
```

## Scaffold a project

```bash
boxlang module:bxDocs new my-docs
cd my-docs
```

This creates:

```
my-docs/
├── docs/
│   ├── assets/
│   └── index.md
└── bxdocs.json
```

Pass `--theme=material` or `--theme=tailwind` to scaffold with a different
default theme, and `--name="My Project Docs"` to set the site name up
front - otherwise `new` derives it from the target directory name.

## Add pages

Every `.md` file under `docs/` becomes a page. Folder nesting becomes nav
nesting automatically:

```
docs/
├── index.md              -> /
├── guides/
│   ├── index.md          -> /guides/
│   └── deployment.md     -> /guides/deployment/
```

Each page can start with a small frontmatter block:

```markdown
---
title: Deployment
order: 2
hidden: false
description: How to deploy a built BX Docs site.
---

# Deployment

Your content here.
```

- `title` - overrides the nav/page title (otherwise derived from the filename)
- `order` - controls sibling ordering in the nav (lower sorts first; omitted pages sort last, alphabetically)
- `hidden` - `true` excludes the page from the nav (and from search) without excluding it from the build
- `description` - this page's social-card/meta description (see
  [`ogImage`](configuration.md#ogimage)); falls back to the site-wide
  `description` in `bxdocs.json` when omitted

## Build

```bash
boxlang module:bxDocs build
```

Renders every page in `docs/` into a static site in `site/`, ready to host
anywhere that serves static files.

## Serve locally

```bash
boxlang module:bxDocs serve
```

Builds the project, serves `site/` at `http://127.0.0.1:8080/`, and
rebuilds automatically whenever you save a change under `docs/`,
`bxdocs.json`, or a project-level `theme/` override - your browser reloads
on its own. Pass `--port=3000` or `--host=0.0.0.0` to change how it binds.

## Clean

```bash
boxlang module:bxDocs clean
```

Removes `site/` and any build cache, without touching your `docs/` source.
