---
title: Getting Started
order: 2
icon: 🚀
summary: Install the module, scaffold a project, and build your first site.
tags: [guides, setup]
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

Or, without CommandBox, BoxLang's own installer takes all three in one
command:

```bash
install-bx-module bx-docs bx-markdown bx-esapi
```

`box install`/`install-bx-module` reads `box.json`'s `boxlang.executable`
and drops a `bxDocs` script on your `PATH` (in `~/.boxlang/bin`), so every
command below works either as a short standalone command:

```bash
bxDocs <verb> [options]
```

or, everywhere BoxLang is available but that `PATH` shim isn't (a CI
runner, a module registered by hand rather than installed) - both forms
run the exact same thing:

```bash
boxlang module:bxdocs <verb> [options]
```

The rest of this guide uses the short form.

## Scaffold a project

```bash
bxDocs new my-docs
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

(A large site can override this inferred order/grouping entirely with an
explicit nav - see [`nav`](configuration.md#nav).)

### Linking between pages

Link to another page the normal mkdocs way - a file-relative path to its
`.md` source, exactly as if the two files were sitting next to each other
on disk (because they are):

```markdown
See [Deployment](guides/deployment.md) or, from that same guide,
[back to Getting Started](../getting-started.md#add-pages).
```

BX Docs rewrites every such link to its built pretty-URL at build time
(`guides/deployment.md` -> `/guides/deployment/index.html`, anchors and
query strings preserved), resolved against the *linking* page's own
folder - `../` and sibling references work exactly like they would
resolving any other relative path. This is also why the link keeps
working if you read the file directly on GitHub instead of the built
site: it's a real, valid relative path to a real file either way. Absolute
URLs, `mailto:`, and links already starting with `/` are left untouched.

Each page can start with a small frontmatter block:

```markdown
---
title: Deployment
order: 2
hidden: false
description: How to deploy a built BX Docs site.
tags: [guides, deployment]
icon: 🚀
summary: Everything you need to publish a built site.
ogImage: assets/deployment-card.png
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
- `tags` - an array of tags for this page, rendered as clickable badges
  under the title and collected into a site-wide `/tags/` index page
  (only built at all once at least one page has tags); also boosts search
  relevance for matching queries
- `icon` - a short emoji/text icon shown next to the page title
- `summary` - a one-line lead-in shown under the title (distinct from
  `description`, which is meta-tag-only and never rendered on the page itself)
- `ogImage` - overrides this one page's social-card image - see
  [`ogImage`](configuration.md#ogimage)

Frontmatter values can be inline lists (`tags: [a, b, c]`), YAML-style block
lists (`tags:` followed by indented `- item` lines), or `>`/`|` block
scalars for a multi-line value - it's a small hand-rolled parser though, not
full YAML, so nested objects/maps aren't supported.

## Build

```bash
bxDocs build
```

Renders every page in `docs/` into a static site in `site/`, ready to host
anywhere that serves static files.

## Serve locally

```bash
bxDocs serve
```

Builds the project, serves `site/` at `http://127.0.0.1:8080/`, and
rebuilds automatically whenever you save a change under `docs/`,
`bxdocs.json`, or a project-level `theme/` override - your browser reloads
on its own. Pass `--port=3000` or `--host=0.0.0.0` to change how it binds.

## Clean

```bash
bxDocs clean
```

Removes `site/` and any build cache, without touching your `docs/` source.
