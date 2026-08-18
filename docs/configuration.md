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
	"markdown": {}
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

Reserved for serving a site from a sub-path. The built-in themes currently
link with root-relative URLs (`/page/`); full `baseURL` support is a future
enhancement.

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
