---
title: Search
order: 2
tags: [guides, search]
---

# Search

BX Docs ships one search provider by default and can be pointed at others
via `bxdocs.json`'s [`searchProvider`](../configuration.md#searchprovider) -
`search: true`/`false` stays the master on/off switch regardless of which
provider is active.

## Local (the default)

BX Docs' search is fully static and client-side - the same approach
[mkdocs](https://www.mkdocs.org/) uses by default: an index built once at
`build` time, and [lunr.js](https://lunrjs.com/) doing the actual searching
in the visitor's browser. There's no server, database, or external search
service involved.

## How it works

1. At `build` time, `SearchIndexer` walks every non-hidden page and writes
   `site/search-index.json`: one entry per page with its `title`, `url`,
   frontmatter `tags`, the text of every heading on the page, and a
   truncated plain-text copy of its body (HTML tags stripped).
2. Each theme's `search.bxm` partial renders a search box; `layout.bxm`
   only includes it (and the `lunr.js` + shared `search.js` scripts) when
   `bxdocs.json`'s `search` is `true` and `searchProvider.provider` is
   `"local"` (the default - see [Other providers](#other-search-providers)
   below for what changes with a different one).
3. In the browser, the shared `assets/search.js` widget fetches
   `search-index.json` once, builds a `lunr` index from it (`title`
   weighted highest, then frontmatter `tags`, then `headings`, then plain
   body text), and re-searches it on every keystroke - no network
   round-trip per query.

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
page - a project with search off ships nothing search-related at all. This
is the master switch - it applies no matter which `searchProvider` is
configured.

## Rebuilding just the index

```bash
bxDocs search-index
```

Useful if you only need to refresh `search-index.json` - `build` already
does this as one of its own steps, so you don't need to run this
separately after a normal build. Only runs for providers that use the local
index (`"local"`, and any provider bx-docs doesn't otherwise know about) -
it's a no-op (`skipped: true`) when `searchProvider.provider` is `"algolia"`,
since that index is never used.

## Algolia

Set `searchProvider.provider` to `"algolia"` to swap the search box for
[Algolia DocSearch](https://docsearch.algolia.com/) - the same
crawler-hosted search mkdocs-material, VitePress, Starlight and Docusaurus
all support:

```json
{
	"search": true,
	"searchProvider": {
		"provider": "algolia",
		"algolia": {
			"appId": "ABC123",
			"apiKey": "a1b2c3d4e5f6...",
			"indexName": "my-docs",
			"insights": false
		}
	}
}
```

`appId`, `apiKey` and `indexName` are required - `apiKey` is the
**search-only** public API key DocSearch gives you (never an admin key; it's
shipped straight into every rendered page). `insights` (`false` by default)
turns on DocSearch's own click/conversion analytics.

With `algolia` active:

- No `search-index.json` is built, and the shared `lunr.js`/`search.js`
  widget isn't shipped - Algolia serves results from its own hosted index,
  populated by [DocSearch's crawler](https://docsearch.algolia.com/docs/what-is-docsearch/)
  or your own [Algolia Crawler](https://www.algolia.com/products/search-and-discovery/crawler/)
  config, not by anything BX Docs writes at build time. You still need to
  register the site with DocSearch (or run your own crawler) separately -
  BX Docs only wires up the client widget.
- Each built-in theme instead renders an empty `#bxdocs-search-algolia`
  container, and `layout.bxm` loads `@docsearch/css`/`@docsearch/js` from
  jsDelivr and calls `docsearch({...})` against it - DocSearch renders its
  own search button and modal into that container.

## Other search providers

`searchProvider.provider` isn't limited to `"local"`/`"algolia"` - any other
value is accepted by `bxdocs.json` as-is (BX Docs' own config validation
only checks the two providers above). The built-in themes render nothing
for an unrecognized provider name, though - wiring up a third search
service (Meilisearch, Typesense, Pagefind, etc.) is a project-level
[theme override](themes.md#overriding-a-theme): a project's own `theme/` folder
can read `siteConfig.searchProvider.provider` (and whatever
provider-specific keys it wants under `searchProvider`) directly in its
`layout.bxm`/`search.bxm` and render/load whatever that provider needs,
the same way this module's own `layout.bxm` does for `algolia`.
