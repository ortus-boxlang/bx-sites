---
title: Importing a theme
order: 6.5
icon: phosphor-duotone:arrows-left-right
tags: [guides, themes, migration]
---

# Importing a theme

`bxSites theme:import` converts a theme from another static site
generator's ecosystem into a bx-sites theme scaffold under
`themes/<name>/` - a best-effort starting point, not a lossless
one-command port. It handles the three ecosystems whose theme structure
maps onto bx-sites' own `layout.bxm`+`page.bxm` contract (see
[Themes](themes.md#the-themeprovider-contract)):

- **`mkdocs`** - Jinja2 templates (native mkdocs and mkdocs-material both
  use `base.html`+`main.html`)
- **`jekyll`** - Liquid templates (`_layouts/default.html`+
  `_layouts/page.html`)
- **`hugo`** - Go templates (`layouts/_default/baseof.html`+
  `layouts/_default/single.html`)

A React/Vue-component-based theme (Docusaurus, VuePress, Gatsby, ...) has
no equivalent here - there's no template *file* to mechanically translate,
since the theme is compiled UI components rather than server-rendered
markup. Porting one of those means re-authoring it as a bx-sites theme
from scratch (see [Writing a theme from scratch](themes.md#writing-a-theme-from-scratch)),
not converting it.

```bash frame="terminal" title="Terminal"
bxSites theme:import --source=mkdocs --path=/path/to/mkdocs-theme --name=my-imported-theme
```

- `--source` (required) - `mkdocs`, `jekyll`, or `hugo`
- `--path` (required) - the source theme's own root folder (the one
  containing its layout template, not the whole mkdocs/jekyll/hugo
  *project* - see [Migrating from mkdocs](migrating-from-mkdocs.md)/
  [Migrating from GitBook](migrating-from-gitbook.md) for converting a
  project's *content*, a different job from converting its *theme*)
- `--name` (required) - the destination name, written to `themes/<name>/`
  (the same [installed-theme convention](themes.md#installing-a-published-theme)
  `install:theme` uses) - set `bxsites.yaml`'s `theme.name` to it once
  you're happy with the result

Re-running against the same `--name` is safe - `layout.bxm`/`page.bxm`
are overwritten and any newly-found asset folders merged in, so iterating
(tweak the source, or the mapping, re-run) is the normal workflow, not a
one-shot operation.

## What actually gets converted

The command output reports exactly what happened - which source file
became `layout.bxm`/`page.bxm` (or a note that none was found, if the
source theme doesn't use one of the conventional filenames above), which
asset folders (`css/`, `js/`, `static/`, ...) were copied verbatim into
`themes/<name>/assets/`, and a numbered list of everything that needs a
manual look.

Within a template file, this is a **mechanical, best-effort translator**
(`JinjaLikeTranslator.bx` for mkdocs/jekyll's shared Jinja2/Liquid syntax,
`GoTemplateTranslator.bx` for hugo's Go templates) - not a real parser for
either language. What it handles:

- Variable output (`{{ page.title }}` / Hugo's `{{ .Title }}`), mapped
  against a small, fixed table of the common fields (page title/content/
  description, site name/description, base URL, nav) - anything outside
  that table is left as a `<!--- TODO: ... --->` marker rather than
  guessed at.
- `if`/`elif`/`else`/`endif` (mkdocs/jekyll) or `if`/`else if`/`else`/`end`
  (hugo), translated into real `<bx:if>`/`<bx:elseif>`/`<bx:else>`
  structure - always structurally valid even when the *condition* itself
  references something outside the mapping table (flagged as a warning
  instead, since leaving the surrounding `if` broken would be worse than
  a condition a human still needs to check).
- `for x in list`/`endfor` (mkdocs/jekyll) or `range`/`end` (hugo),
  translated into `<bx:loop>` the same way. Hugo's `range` rebinds `.` to
  each item with no named loop variable in the common case - the
  generated `<bx:loop>` always uses a synthetic `item` name, and a
  standing warning notes that a bare `.Field` *inside* the loop body
  means the range item's own field in Go, which can't be automatically
  retargeted to `item.Field`.
- Comments (`{# ... #}`/`{% comment %}` for Jinja2/Liquid, `{{/* ... */}}`
  for Go), dropped entirely.

What's deliberately **not** translated, always left as a TODO marker (or,
inside a condition where leaving raw untranslated syntax would produce
invalid BoxLang, substituted with a syntactically-safe placeholder -
`false` for a condition, `[]` for a loop's list expression - flagged the
same way):

- A filter/pipeline (`{{ page.title | upper }}`, `{{ .Title | truncate 100 }}`)
  - filter semantics vary too much to guess at safely.
  - it's still worth verifying manually, since a filter with a plainly-safe BoxLang
  equivalent (`upper` → `ucase()`) is common enough to be a quick manual fix.
- Template inheritance (Jinja2's `{% extends %}`/`{% block %}`, Hugo's
  `{{ block }}`/`{{ define }}`) and includes/partials (`{% include %}`) -
  no automatic way to map these onto bx-sites' own single-file
  `layout.bxm`+`page.bxm` contract.
- Hugo's `{{ with .X }}` - rebinds `.` to a new context for its own body,
  with no bx-sites equivalent at all, so it's left untranslated rather
  than emitted as a structurally-valid but semantically-wrong `<bx:if>`.
- A Go condition that isn't a single field reference (Go writes boolean
  logic as prefix function calls - `{{ if and .A .B }}`, `{{ if eq .Type "post" }}`
  - which have no BoxLang infix equivalent; substituting just the
  `.Field` tokens inside one would still leave invalid BoxLang text
  behind, so the whole condition is replaced with the placeholder
  instead).
- Any variable reference not in the fixed mapping table.

## After importing

The scaffold is a starting point, not a finished theme - work through the
reported TODO markers and warnings, then check it against the
[ThemeProvider contract](themes.md#the-themeprovider-contract) the same
way a hand-written theme needs to (`layout.bxm`+`page.bxm` required,
`search.bxm` optional). None of the page-feature conventions every
built-in theme implements (dark mode, breadcrumbs, prev/next, the search
box, ...) come along automatically - the source theme's own markup for
those, if it had any, went through the same mechanical translation as
everything else and needs the same review.
