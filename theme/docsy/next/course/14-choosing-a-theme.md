---
title: Choosing a Theme
summary: Ten built-in themes, and how to override or write your own.
icon: phosphor-duotone:palette
tags: [course]
---

# Choosing a Theme

bx-sites ships ten built-in themes, each a full, distinct visual
identity rendering from the exact same Markdown - switching themes never
means rewriting content:

`bootstrap` (the default), `docsy`, `docusaurus`, `gitbook`,
`justthedocs`, `material`, `notion`, `slate`, `tailwind`, `vuepress`.

Pick one at scaffold time:

```bash title="Terminal"
bxSites new my-docs --theme=material
```

or switch later in `bxsites.yaml`:

```yaml title="bxsites.yaml"
theme:
  name: material
```

## Customizing without forking

Most projects never need a full custom theme - `theme.options` covers
color mode, nav behavior, logo/favicon, and more, and `theme.logo`/
`extraCss`/`extraJs` cover branding and small tweaks without touching a
single theme file.

## Overriding or writing your own

For real structural changes, a project can override individual files
from its own `theme/` folder - `theme/page.bxm`, `theme/layout.bxm`, or
just `theme/assets/style.css` - without forking the whole theme; bx-sites
falls back to the built-in theme's own file for anything not overridden.
A theme is a small, documented contract (a `ThemeProvider`) - writing one
completely from scratch is also fully supported.

Already have a theme from mkdocs, Jekyll, or Hugo? `bxSites` can
best-effort convert it - see [Importing a theme](../guides/theme-import.md).

Full theme gallery and the override/authoring contract:
[Themes](../guides/themes.md).
