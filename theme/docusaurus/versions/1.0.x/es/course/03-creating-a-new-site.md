---
title: Creating a New Site
summary: Scaffold a real project with bxSites new, then build and serve it locally.
icon: phosphor-duotone:magic-wand
tags: [course]
---

# Creating a New Site

With bx-sites installed, scaffold a project:

```bash title="Terminal"
bxSites new my-docs
cd my-docs
```

That creates:

```text title="Project structure"
my-docs/
├── docs/
│   ├── assets/
│   └── index.md
└── bxsites.yaml
```

`bxsites.yaml` is the site's own config - name, theme, and every other
setting you'll meet later in this course, all covered in full in
[Configuration](../configuration.md). `docs/` is where every page you
write lives - you'll spend most of the rest of this course inside it.

Two flags worth knowing now:

- `--theme=material` (or any other [built-in theme](14-choosing-a-theme.md))
  scaffolds with a different default look, instead of the default
  bootstrap theme.
- `--name="My Project Docs"` sets the site name up front, instead of
  deriving it from the folder name.

## Build it

```bash title="Terminal"
bxSites build
```

This converts every page under `docs/` into a static `site/` folder -
plain HTML, CSS, and JS, ready to host anywhere. Every built-in theme
renders identically from the same Markdown, so switching themes later
never means rewriting content.

## Serve it locally

```bash title="Terminal"
bxSites serve
```

Opens a local dev server with live reload - edit a page, save, and the
browser updates. This is how you'll want to work through the rest of
this course: keep `bxSites serve` running in one terminal, and a page
open in your browser, so every lesson's example renders as you go.

Already have content in GitBook or mkdocs? `bxSites migrate` converts an
export straight into `docs/` - see
[Migrating from GitBook](../guides/migrating-from-gitbook.md) or
[Migrating from mkdocs](../guides/migrating-from-mkdocs.md) - and you can
skip ahead to [lesson 14](14-choosing-a-theme.md).
