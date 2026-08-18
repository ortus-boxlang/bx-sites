---
title: Themes
order: 1
---

# Themes

Themes are native BoxLang `.bxm` templates - there's no separate template
engine or build step involved.

## Built in

| Theme | Base | Notes |
|---|---|---|
| `bootstrap` (default) | [Bootstrap 5](https://getbootstrap.com/) via CDN | Poppins font, brand gradient navbar |
| `material` | Hand-rolled Material-style CSS | Card layout, elevation shadows, Roboto font |
| `tailwind` | [Tailwind Play CDN](https://tailwindcss.com/) | Utility-class driven, no build step |

All three apply the same BoxLang brand palette: a `#00FF78 -> #00DBFF`
gradient and a `#FFF500` accent - and all three ship with the same set of
page features:

- **An in-page "On this page" table of contents**, generated from each
  page's own `h2`/`h3` headings.
- **Breadcrumbs**, showing a page's ancestor chain when it's nested more
  than one level deep under a linked ancestor.
- **Prev/next page links** at the bottom of the article, following the
  nav's own reading order.
- **Syntax-highlighted code blocks**, via [highlight.js](https://highlightjs.org/),
  each with a **copy button** on hover.
- **A dark/light mode toggle**, powered by [Alpine.js](https://alpinejs.dev/)
  for reactivity. The visitor's choice is remembered in `localStorage`
  (falling back to their OS preference), and applied before first paint to
  avoid a flash of the wrong theme.
- **A responsive, collapsible nav** on narrow viewports (a hamburger toggle
  in `bootstrap`/`material`/`tailwind` alike).
- **Keyboard shortcuts** in the search box: `/` focuses search from
  anywhere on the page, and `Escape` closes the results. See
  [Search](search.md).
- **A themed `404.html`**, served automatically by most static hosts
  (including GitHub Pages) for any unmatched path.

Set which one a project uses in `bxdocs.json`:

```json
{ "theme": { "name": "material" } }
```

## The `ThemeProvider` contract

A theme is just a folder with:

- **`layout.bxm`** (required) - the outer HTML shell + nav. Receives
  `variables.page`, `variables.nav`, `variables.siteConfig`,
  `variables.themeDir` and `variables.basePath` in scope, and includes the
  sibling `page.bxm` via `#variables.themeDir#/page.bxm`.
  `variables.basePath` is always a root-relative path ending in `/` (`/` by
  default, `/my-docs/` when `bxdocs.json`'s `baseURL` overrides it) - prefix
  every internal `href`/`src` with it, rather than hardcoding a leading `/`,
  so the theme still works when the site is served from a sub-path.
- **`page.bxm`** (required) - the article body. Renders
  `variables.page.contentHtml` - the already-converted markdown.
- **`search.bxm`** (optional) - the search box markup, included by
  `layout.bxm` only when `bxdocs.json`'s `search` is `true`. See
  [Search](search.md).
- **`assets/`** (optional) - theme CSS/JS, copied to `site/assets/theme/`
  at build time.

A theme folder missing either required file fails fast with a clear
`BxDocs.InvalidTheme` error at build time, rather than a confusing template
error deep inside rendering.

## Overriding a theme

Drop your own `layout.bxm` + `page.bxm` (and optionally `search.bxm` /
`assets/`) into a `theme/` folder at your project root. BX Docs prefers a
project-level `theme/` override over any built-in theme, as long as it
satisfies the contract above - the built-in themes under this module's own
`resources/themes/` are a good starting point to copy and adapt.
