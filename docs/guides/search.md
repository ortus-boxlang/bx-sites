---
title: Search
order: 2
---

# Search

BX Docs' search is fully static and client-side - the same approach
[mkdocs](https://www.mkdocs.org/) uses by default: an index built once at
`build` time, and [lunr.js](https://lunrjs.com/) doing the actual searching
in the visitor's browser. There's no server, database, or external search
service involved.

## How it works

1. At `build` time, `SearchIndexer` walks every non-hidden page and writes
   `site/search-index.json`: one entry per page with its `title`, `url`,
   the text of every heading on the page, and a truncated plain-text copy
   of its body (HTML tags stripped).
2. Each theme's `search.bxm` partial renders a search box; `layout.bxm`
   only includes it (and the `lunr.js` + shared `search.js` scripts) when
   `bxdocs.json`'s `search` is `true`.
3. In the browser, the shared `assets/search.js` widget fetches
   `search-index.json` once, builds a `lunr` index from it (title weighted
   highest, then headings, then body text), and re-searches it on every
   keystroke - no network round-trip per query.

## Keyboard shortcuts

- **`/`** focuses the search box from anywhere on the page (unless you're
  already typing in another field) - the same convention
  [mkdocs-material](https://squidfunk.github.io/mkdocs-material/) uses.
- **`Escape`** closes the results dropdown and blurs the search box.

## Turning it off

```json
{ "search": false }
```

Skips building `search-index.json` entirely, and skips the search box, the
`lunr.js` CDN script, and the shared `search.js` widget in every rendered
page - a project with search off ships nothing search-related at all.

## Rebuilding just the index

```bash
boxlang module:bxDocs search-index
```

Useful if you only need to refresh `search-index.json` - `build` already
does this as one of its own steps, so you don't need to run this
separately after a normal build.
