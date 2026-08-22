---
title: Migrate From GitBook or mkdocs in One Command
date: 2026-08-15
authors: [lmajano]
categories: [Migration, Getting Started]
tags: [migration, gitbook, mkdocs, cli]
summary: You shouldn't have to hand-copy hundreds of Markdown files to switch docs tools - bxDocs migrate reads your existing export or project and does the conversion for you.
description: How the bxDocs migrate command converts an existing GitBook export or mkdocs project into a working bx-docs site, and what it flags for a manual look.
image: assets/blog/migrate-from-gitbook-or-mkdocs-in-one-command-cover.svg
---

The single biggest thing standing between a team and switching docs tools is almost never the tool itself - it's the migration. Nobody wants to hand-convert three hundred Markdown files and their nav structure. `bxDocs migrate` exists specifically to remove that excuse, for the two sources I hear about most: GitBook and mkdocs.

<!-- more -->

## From a GitBook export

```bash frame="terminal" title="Terminal"
bxDocs migrate --source=/path/to/gitbook-export
```

`--from=gitbook` is the default, so you don't need to pass it explicitly. `--source` should point at whatever directory directly contains `SUMMARY.md` - either a local clone of a repo GitBook is Git-Synced to, or an unzipped **Export → Markdown** download.

`migrate` reads GitBook's on-disk format directly and converts what it can automatically:

| GitBook | Becomes |
|---|---|
| `SUMMARY.md` | `docs/nav.json`, nesting preserved |
| `README.md` (any folder) | `index.md` |
| `.gitbook/assets/**` | `docs/assets/gitbook/**`, references rewritten |
| `{% hint style="..." %}` | a native admonition |
| `{% tabs %}` / `{% tab %}` | native content tabs |
| `{% stepper %}` / `{% step %}` | `::: stepper` / `::: step` |

Nothing is silently dropped. A block it doesn't recognize - GitBook's AI-generation **Prompt** block, account-based conditional content, the **Ask AI** search bar - is left in its original `{% %}` syntax and reported as a warning, so the content survives even when the conversion doesn't:

```text title="migrate output"
Migrated 14 page(s) from [/path/to/gitbook-export] into my-docs/docs/, wrote my-docs/docs/nav.json

2 item(s) need a manual look:
  - guides/advanced.md: Unsupported GitBook block [{% prompt %}] - left in its original syntax, needs manual conversion
```

Re-running it overwrites whatever it wrote before, so fixing your source export and running it again is completely safe.

## From an mkdocs project

```bash frame="terminal" title="Terminal"
bxDocs migrate --source=/path/to/mkdocs-project --from=mkdocs
```

`--source` must point at the project root containing `mkdocs.yml`. This one is a fundamentally easier migration, because mkdocs' `docs/` folder already uses bx-docs' exact conventions - folder nesting is nav structure, `index.md` is a folder's home page, relative `.md` links just work. bx-docs modeled its own extended Markdown on mkdocs-material to begin with, so page bodies copy across byte-for-byte: `!!! note` admonitions, `=== "Tab"` content tabs, `$x^2$` math - none of it needs rewriting.

What *does* need translating is `mkdocs.yml` itself:

| mkdocs.yml | bxdocs.yaml |
|---|---|
| `site_name` | `name` |
| `theme.name: material` | `theme.name: "material"` |
| `repo_url` / `edit_uri` | `repo.url` / `repo.editUri` |
| `markdown_extensions: [footnotes]` | `markdown.enableFootnotes: true` |

and its `nav:` block, which becomes a `docs/nav.json` in the same [nav override](../../configuration.md#nav) format bx-docs already supports natively. Non-Markdown assets scattered next to pages get relocated to `docs/assets/mkdocs/<path>`, with every reference to them rewritten to match.

## After either one

Both commands leave you with an entirely normal bx-docs project - the migrated `docs/nav.json` is just a regular nav override, editable or deletable like any other. From there it's the usual next steps: pick a theme (see [Pick Your Theme](pick-your-theme.md)), check search is configured the way you want (see [Search That Just Works](search-that-just-works.md)), and `bxDocs serve` to see the result before you commit to it.

I built this because I was tired of watching teams stay on a docs tool they'd already outgrown, purely because the migration looked like a multi-day project. It shouldn't be.

Have you migrated a real project with this yet - and if so, what did it flag for a manual look?
