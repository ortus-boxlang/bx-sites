---
title: Content Organization
summary: How docs/ maps to your site's nav and URLs, and how pages link to each other.
icon: phosphor-duotone:folders
tags: [course]
---

# Content Organization

Every `.md` file under `docs/` becomes a page. Folder nesting becomes
nav nesting automatically - no config needed to get a working sidebar:

```text title="docs/ -> nav"
docs/
├── index.md              -> /
├── guides/
│   ├── index.md          -> /guides/
│   └── deployment.md     -> /guides/deployment/
```

An `index.md` inside a folder becomes that folder's own landing page.
Everything else becomes a page at its own URL, named after the file.

For a large site, this inferred order can be overridden entirely with an
explicit `nav` in `bxsites.yaml` - full control over grouping and order,
independent of the folder layout. See [`nav`](../configuration.md#nav).

## Linking between pages

Link the normal way - a file-relative path to another page's `.md`
source, exactly as if the two files were sitting next to each other on
disk (because they are):

```markdown title="Example"
See [Deployment](guides/deployment.md) or, from that same guide,
[back to Getting Started](../getting-started.md).
```

bx-sites rewrites every such link to its built pretty-URL at build time
(`guides/deployment.md` → `/guides/deployment/index.html`, anchors and
query strings preserved). This also means the link keeps working if
someone reads the file directly on GitHub instead of the built site -
it's a real, valid relative path to a real file either way.

## `docs/` or `src/`

`docs/` is what `bxSites new` scaffolds, but a project that isn't really
"docs" in spirit - a marketing site, a portfolio - can use `src/`
instead, with zero other changes: every command looks for `docs/` first
and falls back to `src/` when that's what actually exists. Build output
always lands in `site/` either way.

Full detail on nav inference, hidden pages, and redirects lives in
[Getting Started: Add pages](../getting-started.md#add-pages) and
[Redirects](../guides/redirects.md).
