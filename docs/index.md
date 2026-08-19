---
title: Home
order: 1
---

# BX Docs

BX Docs is a BoxLang module that generates static documentation sites from
Markdown, in the spirit of [mkdocs](https://www.mkdocs.org/) and
[mkdocs-material](https://squidfunk.github.io/mkdocs-material/).

This very site is built by BX Docs, from the Markdown files in this
repository's own `docs/` folder - see
[Getting Started](getting-started.md) to build it yourself.

## Highlights

- **Markdown in, static HTML out.** Point it at a `docs/` folder and it
  renders a complete site into `site/` - no server required to host it.
- **Folder structure is nav structure.** Nest folders and files under
  `docs/` and the navigation builds itself, in the order you set via
  frontmatter.
- **Three built-in themes.** `bootstrap` (the default), `material` and
  `tailwind` - all sharing the same BoxLang brand palette, and all
  overridable with your own theme.
- **Static, client-side search.** A [lunr.js](https://lunrjs.com/)-powered
  search box, wired against a search index built at `build` time - the same
  approach mkdocs itself uses by default, no server dependency.
- **Markdown handled by [bx-markdown](https://github.com/ortus-boxlang/bx-markdown).**
  BX Docs doesn't parse Markdown itself; it delegates to bx-markdown and
  forwards your own `bxdocs.json` options straight through to it.
- **A plugin system built on BoxLang's own module system.** A plugin is
  just another installed BoxLang module - no separate plugin API to learn.

## Where to go next

- [Getting Started](getting-started.md) - install, scaffold a project, build and serve it
- [CLI Reference](cli-reference.md) - every verb and its options
- [Configuration](configuration.md) - the full `bxdocs.json` reference
- [Themes](guides/themes.md) - the built-in themes, and how to write your own
- [Search](guides/search.md) - how the static search index works
- [Deploying to GitHub Pages](guides/deployment.md) - the built-in GitHub Actions workflow
- [Markdown Extensions](guides/markdown.md) - admonitions, footnotes, definition lists, content tabs, math, code annotations and Mermaid diagrams
- [Plugins](guides/plugins.md) - extending BX Docs with a BoxLang module of your own
- [Releases](releases/index.md) - versioning policy and what's new per release
