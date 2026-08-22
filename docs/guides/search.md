---
title: Search
order: 2
icon: phosphor-duotone:magnifying-glass
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
- **Cmd/Ctrl+K** also focuses it, from anywhere - including while typing in
  another field - the convention Algolia DocSearch, Pagefind, VitePress and
  Docusaurus all share. The search box shows a small `Ctrl K`/`⌘K` hint
  (platform-detected) so it's discoverable.
- **`Escape`** closes the results dropdown and blurs the search box.

Cmd/Ctrl+K works the same way for every provider - `local`'s own widget
binds it directly, `algolia` gets it for free from DocSearch itself
(`keyboardShortcuts` defaults to `true`), and `pagefind` gets it wired up
by `layout.bxm` since `PagefindUI` doesn't bind it on its own.

## Turning it off

```json title="bxdocs.json"
{ "search": false }
```

Skips building `search-index.json` entirely, and skips the search box, the
`lunr.js` CDN script, and the shared `search.js` widget in every rendered
page - a project with search off ships nothing search-related at all. This
is the master switch - it applies no matter which `searchProvider` is
configured.

## Rebuilding just the index

```bash frame="terminal" title="Terminal"
bxDocs search-index
```

Useful if you only need to refresh `search-index.json` - `build` already
does this as one of its own steps, so you don't need to run this
separately after a normal build. Only runs for providers that use the local
index (`"local"`, and any provider bx-docs doesn't otherwise know about) -
it's a no-op (`skipped: true`) when `searchProvider.provider` is `"algolia"`
or `"pagefind"`, since neither ever uses it.

## Algolia

Set `searchProvider.provider` to `"algolia"` to swap the search box for
[Algolia DocSearch](https://docsearch.algolia.com/) - the same
crawler-hosted search mkdocs-material, VitePress, Starlight and Docusaurus
all support:

```json title="bxdocs.json" linenums="1"
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

## Pagefind

Set `searchProvider.provider` to `"pagefind"` to swap the search box for
[Pagefind](https://pagefind.app/) - another fully static/no-server search
engine, but indexed from the *built* `site/` HTML rather than crawled like
Algolia:

```json title="bxdocs.json" linenums="1"
{
	"search": true,
	"searchProvider": {
		"provider": "pagefind",
		"pagefind": { "bin": "pagefind", "options": [] }
	}
}
```

Both `pagefind` keys are optional - `bin` (default `"pagefind"`) is the
executable name/path, resolved against `PATH` when it's a bare name;
`options` is an array of extra raw CLI flags passed straight through (e.g.
`["--exclude-selectors", ".no-index"]`).

With `pagefind` active:

- **The `pagefind` CLI must already be installed and on `PATH`** - BX Docs
  shells out to it (there's no BoxLang-native binding, the same reason
  `lastUpdated`/`gh-deploy` shell out to `git`), it doesn't install it for
  you. See [Pagefind's installation docs](https://pagefind.app/docs/installation/).
  Unlike `lastUpdated`, a missing/failing binary fails the `build` loudly
  (`BxDocs.PagefindFailed`) rather than degrading silently - shipping a
  site whose configured search provider doesn't work is worse than a
  failed build.
- Right after every doc tree (main + versions + locales) is written and
  `sitemap.xml`/`llms.txt` are generated, BX Docs runs
  `pagefind --site <siteDir> [...options]` against the *entire* built
  `site/` - so a multi-version/multi-locale site gets everything indexed
  in one pass, unlike bx-docs' own per-tree `search-index.json`. Pagefind
  writes its own bundle straight into `site/pagefind/` - self-hosted, no
  CDN involved.
- No `search-index.json` is built, and the shared `lunr.js`/`search.js`
  widget isn't shipped (same as `algolia`) - and `bxDocs search-index` is
  a no-op for the same reason (see above).
- Each built-in theme renders an empty `#bxdocs-search-pagefind`
  container, and `layout.bxm` loads `site/pagefind/pagefind-ui.{css,js}`
  and calls `new PagefindUI({...})` against it - Pagefind renders its own
  inline search box and results into that container.

## Other search providers

`searchProvider.provider` isn't limited to `"local"`/`"algolia"`/`"pagefind"` -
any other value is accepted by `bxdocs.json` as-is (BX Docs' own config
validation only checks the three providers above). There's no plugin hook
for this one - the built-in themes simply render nothing for an
unrecognized provider name, and wiring up a fourth search service
(Meilisearch, Typesense, etc.) is a project-level
[theme override](themes.md#overriding-a-theme): copy a built-in theme into
your project's own `theme/` folder and add your provider's markup/scripts
to its `layout.bxm`/`search.bxm`, reading `siteConfig.searchProvider` to
decide when to render them - `searchProviderName eq "..."` branches for
the mount point in `search.bxm`, matching branches in `layout.bxm` for its
CSS/JS, and (if it isn't crawler-hosted like Algolia) whatever indexing
step that product needs against `site/` after `build` - the same shape
this module's own `layout.bxm`/`BuildPipeline.bx` already use for
`algolia`/`pagefind`.
