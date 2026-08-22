---
title: Migrating from GitBook
order: 7
icon: phosphor-duotone:swap
tags: [guides, migration, gitbook]
---

# Migrating from GitBook

`bxDocs migrate` converts a GitBook export - a `SUMMARY.md` table of
contents plus its `.md` files, GitBook's own on-disk sync format (the
same one GitHub/Git Sync writes) - into a bx-docs `docs/` tree, in one
command. Everything GitBook's content-block system supports maps onto
something bx-docs already has (see [Content Blocks](content-blocks.md)),
so the result isn't a rough draft - it's a working site.

## Getting a GitBook export

`bxDocs migrate` reads GitBook's own file layout directly, so any of
these works as `--source`:

- A repository GitBook is Git-Synced to (Space settings → **GitSync**) -
  point `--source` at your local clone.
- GitBook's own **Export → Markdown** download, unzipped.

Either way, `--source` should be the directory that directly contains
`SUMMARY.md`.

## Running the migration

```bash frame="terminal" title="Terminal" linenums="1"
# 1. Scaffold a fresh bx-docs project (skip this if you already have one)
bxDocs new my-docs
cd my-docs

# 2. Migrate the GitBook export into it
bxDocs migrate --source=/path/to/gitbook-export

# 3. Build and look at the result
bxDocs serve
```

`migrate` prints how many pages it converted and, when something needed
a judgment call, exactly what and where:

```text title="migrate output"
Migrated 14 page(s) from [/path/to/gitbook-export] into my-docs/docs/, wrote my-docs/docs/nav.json

2 item(s) need a manual look:
  - guides/advanced.md: Unsupported GitBook block [{% prompt %}] - left in its original syntax, needs manual conversion
  - guides/layout.md: Column width="one-third" is not a plain length/percentage - dropped, review manually
```

Nothing is ever silently dropped - a block this tool doesn't know how to
convert is left in the migrated file in its original `{% %}` syntax, so
the content is still there and still easy to find (search the migrated
`docs/` tree for `{%` once you're done). Re-running `migrate` overwrites
any file or `docs/nav.json` it wrote before, so it's safe to fix your
source export and run it again.

## What gets converted automatically

| GitBook | Becomes |
|---|---|
| `SUMMARY.md` | `docs/nav.json` ([nav override](../configuration.md#nav) format), nesting preserved |
| `README.md` (any folder) | `index.md` - bx-docs' own folder-index convention |
| A page's `title`/`description`/`tags` frontmatter | Carried over into the migrated file's own bx-docs frontmatter unchanged |
| `.gitbook/assets/**` | `docs/assets/gitbook/**`, with every reference rewritten to match |
| `{% hint style="..." %}` | `!!! type` - a native [admonition](markdown.md#admonitions) |
| `{% tabs %}` / `{% tab title="..." %}` | `=== "Title"` - native [content tabs](markdown.md#content-tabs) |
| `{% cards %}` / `{% card %}` | [`::: cards` / `::: card`](content-blocks.md#cards) |
| `{% columns %}` / `{% column width="..." %}` | [`::: columns` / `::: column`](content-blocks.md#columns) |
| `{% stepper %}` / `{% step %}` | [`::: stepper` / `::: step`](content-blocks.md#stepper) - title taken from the step's own first heading |
| `{% file src="..." %}` | [`::: file`](content-blocks.md#file) |
| `{% embed url="..." %}` | [`::: embed`](content-blocks.md#embed) |
| `{% content-ref url="..." %}` | [`::: page-link`](content-blocks.md#page-link) |
| `{% details %}` / `{% expand %}` | [`::: expandable`](content-blocks.md#expandable) |

A block shown as a literal fenced example in your GitBook content (rather
than used for real) is correctly left alone, not misread as the real
thing.

## What needs a manual look

A handful of GitBook blocks have no bx-docs equivalent at all and are
left in their original `{% %}` syntax rather than guessed at: **Prompt**
(an AI-generation block - there's nothing to run it against once
migrated), **Conditional content** (GitBook-account-based visibility, not
a concept bx-docs has), and the **Ask AI** search bar. Anything else this
tool doesn't recognize - a typo'd block, a GitBook feature added after
this tool was written - gets the same treatment: left as-is, reported as
a warning.

A few smaller judgment calls are reported the same way: an unrecognized
`hint` `style` (falls back to `note`), or a `column` `width` that isn't a
plain CSS length/percentage (dropped rather than trusted verbatim).

**Page icons aren't migrated automatically.** GitBook's own docs don't
confirm that a page's icon assignment (set via its editor's icon picker)
actually survives into a Git-Sync export at all - if a project's exported
frontmatter genuinely has an `icon` field, `migrate` carries it through
opportunistically, but don't expect it for most real exports. Set icons
by hand afterward instead - either a page's own frontmatter, or a
[`docs/nav.json` entry's own `icon`](../configuration.md#nav) - using a
[named icon](themes.md#icons) from one of the eight bundled libraries
(no need to match GitBook's own Font-Awesome-based icons; pick whichever
name looks right in [Phosphor](https://phosphoricons.com/) - any of its
six weights - [Lucide](https://lucide.dev/icons/) or
[Tabler](https://tabler.io/icons)'s own gallery).

## After migrating

The migrated `docs/nav.json` is a plain [nav override](../configuration.md#nav)
file - edit it like any other, or delete it to fall back to bx-docs'
own folder-structure-is-nav-structure convention. From here it's a normal
bx-docs project: pick a [theme](themes.md), review
[`bxdocs.json`](../configuration.md), and [deploy](deployment.md) when
you're happy with it.
