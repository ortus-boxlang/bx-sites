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
only checks the two providers above). There's no plugin hook for this one -
the built-in themes simply render nothing for an unrecognized provider
name, and wiring up a third search service is a project-level
[theme override](themes.md#overriding-a-theme): copy a built-in theme into
your project's own `theme/` folder and add your provider's markup/scripts
to its `layout.bxm`/`search.bxm`, reading `siteConfig.searchProvider` to
decide when to render them - the same way this module's own `layout.bxm`
does for `algolia`.

A worked example - adding [Pagefind](https://pagefind.app/) (another fully
static/no-server search engine, indexed from the *built* `site/` output
rather than crawled) alongside the built-in `local`/`algolia` providers,
starting from the `bootstrap` theme:

```json
{ "search": true, "searchProvider": { "provider": "pagefind" } }
```

1. Copy `resources/themes/bootstrap/{layout.bxm,page.bxm,search.bxm}` and
   `assets/` into your project's `theme/` folder (as in
   [Overriding a theme](themes.md#overriding-a-theme)).
2. In `theme/search.bxm`, add a branch for `"pagefind"` alongside the
   existing `"algolia"`/`"local"` ones - an empty container Pagefind's own
   UI script mounts into:

   ```html
   <bx:if condition="#variables.searchProviderName eq 'pagefind'#"><bx:output>
   <div id="bxdocs-search-pagefind"></div>
   </bx:output></bx:if>
   ```

3. In `theme/layout.bxm`, load Pagefind's UI bundle and mount it, right
   alongside the existing `variables.searchProviderName eq 'algolia'`
   blocks (one in `<head>` for the CSS, one near the bottom for the JS -
   see how `layout.bxm` already does this for `algolia`):

   ```html
   <bx:if condition="#variables.searchEnabled and variables.searchProviderName eq 'pagefind'#"><bx:output>
   <link rel="stylesheet" href="#variables.basePath#pagefind/pagefind-ui.css">
   </bx:output></bx:if>
   ```

   ```html
   <bx:if condition="#variables.searchEnabled and variables.searchProviderName eq 'pagefind'#"><bx:output>
   <script src="#variables.basePath#pagefind/pagefind-ui.js"></script>
   <script>
   	window.addEventListener( "DOMContentLoaded", function () {
   		new PagefindUI( { element : "##bxdocs-search-pagefind", showSubResults : true } );
   	} );
   </script>
   </bx:output></bx:if>
   ```

4. After `bxDocs build`, run Pagefind's own indexer against the output
   (its CLI ships as a standalone binary/npx package, not a bx-docs
   dependency): `npx pagefind --site site` - this writes the
   `site/pagefind/` bundle `pagefind-ui.js` fetches at request time. Wire
   this into whatever builds/deploys the site (a second CI step after
   `bxDocs build`, or a wrapper script), since BX Docs itself doesn't run
   it.

Any other static or hosted search product follows the same shape: a
`searchProviderName eq "..."` branch in `search.bxm` for the mount point,
matching branches in `layout.bxm` for its CSS/JS, and (if it isn't
crawler-hosted like Algolia) whatever indexing step that product needs
against `site/` after `build`.
