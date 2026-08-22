---
title: Migrating from mkdocs
order: 8
icon: phosphor-duotone:swap
tags: [guides, migration, mkdocs]
---

# Migrating from mkdocs

`bxDocs migrate --from=mkdocs` converts an mkdocs project - `mkdocs.yml`
plus its `docs/` folder - into a complete bx-docs project, in one command:

```bash frame="terminal" title="Terminal"
bxDocs migrate --source=/path/to/mkdocs-project --from=mkdocs
```

- `--source` (required) - the mkdocs project's root directory (must contain `mkdocs.yml`)

Unlike [migrating from GitBook](migrating-from-gitbook.md), this is mostly
a *config* translation, not a *content* one. mkdocs' own `docs/` folder
already uses bx-docs' exact conventions - folder nesting is nav structure,
`index.md` is a folder's own home page, and relative `.md` links between
pages just work. More to the point: mkdocs-material's own extended
Markdown syntax is the *same textual syntax* bx-docs already speaks,
because bx-docs modeled itself on mkdocs-material to begin with (see
[Markdown Extensions](markdown.md)). So page bodies are copied across
byte-for-byte unchanged - nothing here needs to rewrite `!!! note`
admonitions, `=== "Tab"` content tabs, or `$x^2$` math, because they're
already valid bx-docs syntax.

## What gets converted automatically

**`mkdocs.yml` → `bxdocs.yaml`:**

| mkdocs.yml | bxdocs.yaml |
|---|---|
| `site_name` | `name` |
| `site_description` | `description` |
| `site_url` | `baseURL` |
| `theme.name: material` | `theme.name: "material"` |
| any other `theme.name` | `theme.name: "bootstrap"` (bx-docs' own default) - reported as a warning, since the visual result differs |
| `repo_url` / `edit_uri` | `repo.url` / `repo.editUri` |
| `extra_css` / `extra_javascript` | `extraCss` / `extraJs` |
| `markdown_extensions: [footnotes]` | `markdown.enableFootnotes: true` |
| `markdown_extensions: [def_list]` | `markdown.enableDefinitionLists: true` |
| `markdown_extensions: [pymdownx.arithmatex]` | `math: true` |

Every other `markdown_extensions` entry mkdocs-material's own syntax
already covers natively - `admonition`, `pymdownx.tabbed`,
`pymdownx.details`, `pymdownx.superfences`, `pymdownx.highlight`,
`toc`, `attr_list`, and more - needs no `bxdocs.yaml` change at all;
bx-docs already behaves that way out of the box.

**`nav:` → `docs/nav.json`:**

```yaml title="mkdocs.yml" linenums="1"
# mkdocs.yml
nav:
  - Home: index.md
  - Guide:
      - Setup: guide/setup.md
      - Advanced: guide/advanced.md
  - About: about.md
```

becomes:

```json title="docs/nav.json" linenums="1"
[
  { "title": "Home", "path": "index.md", "children": [] },
  { "title": "Guide", "path": "", "children": [
    { "title": "Setup", "path": "guide/setup.md", "children": [] },
    { "title": "Advanced", "path": "guide/advanced.md", "children": [] }
  ] },
  { "title": "About", "path": "about.md", "children": [] }
]
```

- a bare path entry (`- about.md`, no explicit title) converts too - its
  title comes from the migrated page's own frontmatter/first-heading, the
  same as any bx-docs `docs/nav.json` entry with no `title` set
- see [Configuration: `nav`](../configuration.md#nav) for the full format

**Pages and assets:**

- every `.md` file is copied to the same path under `docs/`, unchanged
- every *other* file (images, PDFs, ...) is relocated to
  `docs/assets/mkdocs/<same-relative-path>` - bx-docs' own asset pipeline
  only ever publishes `docs/assets/**`, and mkdocs has no single
  asset-folder convention of its own the way GitBook's `.gitbook/assets/`
  is, so images are commonly scattered next to the pages that use them
- every reference to a relocated asset - `![diagram](img/diagram.png)`,
  say - is rewritten to the correct relative path reaching its new
  location, accounting for how deep the linking page itself sits (the
  same "author writes the right number of `../`" convention any bx-docs
  project already uses - computed for you here instead of left to a
  find-and-replace)

## What needs a manual look

Reported as warnings in the command's own output, nothing is silently
dropped:

- an mkdocs `markdown_extensions`/`plugins` entry with no bx-docs
  equivalent (mkdocs-material's own emoji shortcodes, a third-party
  plugin like `awesome-pages` or `git-revision-date`) - if you need the
  same behavior, see [Plugins](plugins.md)
- `mkdocs.yml`'s own color/font customization
  (`theme.palette`/`theme.font`) has no direct equivalent - see
  [Customizing colors](themes.md#customizing-colors-without-a-theme-override)
  once the migration is done
- a `theme.name` other than `material` (defaulted to `bootstrap`)

## Worked example

```bash frame="terminal" title="Terminal" linenums="1"
boxlang module:bxDocs new --projectRoot=my-docs
boxlang module:bxDocs migrate --projectRoot=my-docs --source=../my-mkdocs-project --from=mkdocs
cd my-docs
boxlang module:bxDocs serve
```

`migrate` writes `bxdocs.yaml` and `docs/` itself - the `new` step above
is only there to get a project root with `docs/` ready to receive them;
migrate creates `docs/` on its own too, so it's not strictly required.
Review the command's own warnings, then `serve` to see the result before
committing it.
