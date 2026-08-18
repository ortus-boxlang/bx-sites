---
title: Configuration
order: 4
---

# Configuration

Every project has one `bxdocs.json` at its root:

```json
{
	"name": "My Docs",
	"description": "",
	"baseURL": "/",
	"theme": {
		"name": "bootstrap",
		"options": {}
	},
	"search": true,
	"nav": [],
	"markdown": {},
	"repo": {
		"url": "",
		"editUri": ""
	},
	"social": [],
	"footer": false,
	"lastUpdated": false
}
```

Only `name` is required - everything else falls back to the defaults shown
above. A partial `theme` object is merged one level deep, so
`{"theme":{"name":"material"}}` alone still keeps the default (empty)
`options`.

## `name`

The site name, shown in the header/brand mark and page titles. Required.

## `description`

An optional site description. Not yet surfaced in the built-in themes'
markup, but reserved for future use (meta tags, RSS, etc.).

## `baseURL`

Controls how every internal link, asset path and nav entry is prefixed, and
doubles as the site's canonical URL for `sitemap.xml` and `llms.txt`.

- Left blank or `"/"` (the default) - links stay root-relative (`/page/`),
  and neither `sitemap.xml` nor an absolute-URL `llms.txt` is generated
  (there's no canonical domain to build them from).
- A bare path, e.g. `"my-docs"` or `"/my-docs/"` - the site is assumed to be
  served from that sub-path, and every internal link, nav entry and asset
  is prefixed with it (`/my-docs/page/`). Still no `sitemap.xml`, since
  there's still no absolute domain.
- A full URL, e.g. `"https://docs.example.com/"` - the path portion
  (`/` here) is used the same way a bare path would be, **and**
  `sitemap.xml` is written at build time with every non-hidden page's
  absolute URL under that domain.

`llms.txt` (see [below](#llms-txt)) is always written; it just prefers an
absolute URL when `baseURL` provides one.

## `llms.txt`

Every build writes a `llms.txt` to the site root - a plain Markdown index of
every non-hidden page, following the emerging
[llms.txt](https://llmstxt.org) convention for helping LLM-based tools
navigate a site without crawling its rendered HTML. There's no config key
for this; it's generated automatically, using an absolute URL per link when
`baseURL` is a full URL, or a `basePath`-relative one otherwise.

## `sitemap.xml`

Written at the site root, but only when `baseURL` is a full URL (see
above) - a sitemap needs an absolute domain to be meaningful. Lists every
non-hidden page per the [sitemaps.org](https://www.sitemaps.org/) protocol.

## `theme`

- `theme.name` - one of the built-in themes (`bootstrap`, `material`,
  `tailwind`), or the name of a custom theme you provide via a `theme/`
  folder at the project root (see [Themes](guides/themes.md))
- `theme.options` - reserved for theme-specific options in a future release;
  currently unused by the built-in themes

## `search`

`true` (the default) builds a static search index and wires up the search
box; `false` skips both entirely - no `search-index.json`, no search UI, no
extra JS shipped. See [Search](guides/search.md).

## `nav`

Reserved for a hand-authored nav override. In v1, nav is always inferred
from `docs/`'s own folder/file structure (with `order`/`hidden`
frontmatter); this key is validated but not yet consumed.

## `markdown`

Forwarded as-is to [bx-markdown](https://github.com/ortus-boxlang/bx-markdown)'s
own module settings before each page renders - table options, anchor
links, the YouTube embed transformer, code block styling, and everything
else bx-markdown supports. BX Docs doesn't redefine or validate these keys;
whatever you put here is bx-markdown's own option set, straight through.

```json
{
	"markdown": {
		"anchorLinks": false,
		"enableYouTubeTransformer": true
	}
}
```

## `repo`

Adds a repository icon link to the header (all three built-in themes) and,
when both keys are set, an "Edit this page" link on every page.

- `repo.url` - your repo's URL, e.g. `"https://github.com/acme/docs"`.
  Renders the header icon link on its own; leave blank to omit it entirely.
- `repo.editUri` - the path segment between the repo URL and a page's own
  source path, e.g. `"edit/main/docs/"` (GitHub's own "edit" URL
  convention). Combined with `repo.url` and a page's `docs/`-relative
  source path to build its edit link - e.g. with the example above,
  `docs/guides/setup.md` gets
  `https://github.com/acme/docs/edit/main/docs/guides/setup.md`. Requires
  `repo.url` too; leave blank to omit edit links while still showing the
  header icon.

```json
{ "repo": { "url": "https://github.com/acme/docs", "editUri": "edit/main/docs/" } }
```

## `social`

An array of social/external links rendered in the footer (see
[`footer`](#footer) - has no effect unless it's also turned on). Each entry
needs a `url`; `icon` selects from a small built-in icon set (`github`,
`twitter`/`x`, `rss`, `email`, falling back to a generic link glyph for
anything else), and `label` sets the link's accessible name/tooltip
(defaults to `icon`, then `"Link"`).

```json
{
	"social": [
		{ "url": "https://twitter.com/acme", "icon": "twitter", "label": "Twitter" },
		{ "url": "https://acme.com/rss.xml", "icon": "rss", "label": "RSS" }
	]
}
```

## `footer`

`false` (the default) - no footer at all. `true` adds one to every page:
a copyright line (`© <year> <site name>`), the `social` links (if any),
and a "Built with BX Docs" credit.

```json
{ "footer": true }
```

## `lastUpdated`

`false` (the default) - no last-updated date. `true` adds a "Last updated"
line next to the edit link (or on its own, if `repo.editUri` isn't set),
sourced from `git log` on each page's own Markdown file at build time.
Silently omitted for a page git has no history for - a fresh `git init`
with no commits yet, a build running from a downloaded zip with no `.git`
at all, or git not being installed on the build machine - rather than
breaking the build.

```json
{ "lastUpdated": true }
```

## Versioning

Versioned docs are convention over configuration - there's no `bxdocs.json`
key for it. Add a `docs/versions/` folder, and each direct subfolder inside
it is built as its own fully self-contained doc tree, alongside your
regular `docs/` (which always builds as "Latest"):

```
docs/
├── index.md
├── guides/
└── versions/
    ├── 1.0/
    │   ├── index.md
    │   └── guides/
    └── 2.0/
        ├── index.md
        └── guides/
```

Each version folder is a normal `docs/`-shaped tree - its own `index.md`,
its own nav, its own pages - built into `site/versions/<name>/` with every
internal link prefixed accordingly, and sharing the project's single
`bxdocs.json` config/theme. Version names sort newest-first, numerically
rather than alphabetically (so `2.0` sorts before `10.0`), and every theme
renders a version-switcher dropdown in the header automatically once more
than one version exists - nothing to opt into. A loose file placed directly
under `docs/versions/` (not inside a subfolder) is ignored.

`sitemap.xml` and `llms.txt` include every version's pages alongside the
main site's.
