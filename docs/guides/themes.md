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
  each with a **copy button** - shown on hover on devices that support it,
  always visible on touch devices (there's no hover to reveal it there).
- **A dark/light mode toggle**, powered by [Alpine.js](https://alpinejs.dev/)
  for reactivity. The visitor's choice is remembered in `localStorage`
  (falling back to their OS preference), and applied before first paint to
  avoid a flash of the wrong theme.
- **A responsive header** that stays a single row at every width - a
  narrow viewport shrinks the search box rather than wrapping it onto its
  own line - plus a collapsible sidebar nav (a hamburger toggle in
  `bootstrap`/`material`/`tailwind` alike).
- **Keyboard shortcuts** in the search box: `/` focuses search from
  anywhere on the page, and `Escape` closes the results. See
  [Search](search.md).
- **A repo link and "Edit this page"/"Last updated" line**, when
  `bxdocs.json`'s `repo`/`lastUpdated` options are set. See
  [Configuration](../configuration.md#repo).
- **An opt-in footer** (copyright, `social` links, a "Built with BX Docs"
  credit) when `bxdocs.json`'s `footer` is `true`. See
  [Configuration](../configuration.md#footer).
- **A version switcher**, appearing automatically once a project has a
  `docs/versions/` folder with more than one version in it. See
  [Configuration](../configuration.md#versioning).
- **A themed `404.html`**, served automatically by most static hosts
  (including GitHub Pages) for any unmatched path.
- **A custom logo and favicon**, when `bxdocs.json`'s `theme.logo`/
  `theme.favicon` are set. See [Configuration](../configuration.md#theme).
- **A collapsible sidebar nav**, opt-in via `theme.options.navCollapsible`.
  See [Configuration](../configuration.md#theme).
- **Google Analytics**, when `bxdocs.json`'s `analytics` is configured. See
  [Configuration](../configuration.md#analytics).
- **Social share cards** (Open Graph + Twitter Card meta tags), sourced
  from each page's `description` frontmatter (or the site-wide
  `description`) and `bxdocs.json`'s `ogImage`. See
  [Configuration](../configuration.md#ogimage).
- **Extra CSS/JS**, injected via `bxdocs.json`'s `extraCss`/`extraJs`. See
  [Configuration](../configuration.md#extracss--extrajs).
- **Admonition (note/warning/tip) callout boxes**, always available in any
  page's markdown - no config needed. See
  [Markdown Extensions](markdown.md#admonitions).
- **Mermaid diagrams**, opt-in via `bxdocs.json`'s `mermaid`. See
  [Markdown Extensions](markdown.md#diagrams).

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

`variables.page.editUrl`/`.lastUpdated` (empty strings when unconfigured)
and `variables.siteConfig.repo`/`.social`/`.footer` are always available too,
backing the repo link/edit link/last-updated/footer features above - a
custom theme decides for itself whether and how to render them, same as
everything else. `variables.versions` (`[ { label, url } ]`, "Latest"
first) and `variables.currentVersion` (the `label` being rendered right
now) back the version switcher - empty/`"Latest"` for a project that isn't
versioned, so a theme only needs to render a switcher when
`variables.versions.len() gt 1`. The three built-in themes get their repo/social icons from
a small shared SVG lookup, `<bx:include template="#variables.moduleAssetsDir#/icons.bxm">`
(defines `bxdocsIcon( name )`, one of `github`, `twitter`/`x`, `rss`,
`email`, `edit`, `clock`, falling back to a generic link glyph) - a custom
theme can include it the same way, or supply its own icons entirely.

A theme folder missing either required file fails fast with a clear
`BxDocs.InvalidTheme` error at build time, rather than a confusing template
error deep inside rendering.

## Overriding a theme

Drop your own `layout.bxm` + `page.bxm` (and optionally `search.bxm` /
`assets/`) into a `theme/` folder at your project root. BX Docs prefers a
project-level `theme/` override over any built-in theme, as long as it
satisfies the contract above - the built-in themes under this module's own
`resources/themes/` are a good starting point to copy and adapt.
