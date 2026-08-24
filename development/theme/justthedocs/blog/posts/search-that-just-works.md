---
title: Search That Just Works
date: 2026-07-24
authors: [lmajano]
categories: [Search]
tags: [search, lunr, algolia, pagefind]
summary: A static site with no server-side search index still deserves fast, relevant search - here's how BxSites pulls that off by default, and when to reach for something bigger.
description: How BxSites' default lunr.js-based static search works, plus when and how to switch to Algolia DocSearch or Pagefind instead.
image: assets/blog/search-that-just-works-cover.svg
---

Search is one of those features that either quietly works or loudly doesn't, and for a static docs site it's easy to end up with the latter - no server to query, so search either gets bolted on as a third-party widget or skipped entirely. BxSites takes the same approach [mkdocs](https://www.mkdocs.org/) does by default: fully static, fully client-side, no server or external service required.

<!-- more -->

## How the default provider works

1. At `bxSites build` time, `SearchIndexer` walks every non-hidden page and writes `site/search-index.json` - one entry per page, with its title, URL, frontmatter tags, every heading's text, and a truncated plain-text copy of the body.
2. Each theme's `search.bxm` partial renders a search box, and it's only included - along with the `lunr.js` and shared `search.js` scripts - when your config's `search` is `true` and `searchProvider.provider` is `"local"` (the default).
3. In the browser, `search.js` fetches `search-index.json` once, builds a [lunr](https://lunrjs.com/) index from it - title weighted highest, then tags, then headings, then body text - and re-searches it on every keystroke. No network round-trip per query, no backend to keep alive.

You get keyboard shortcuts for free too: `/` focuses the search box from anywhere on the page (the same convention mkdocs-material uses), and Cmd/Ctrl+K focuses it from anywhere, including while you're typing in another field. `Escape` closes the results.

If you only need to refresh the index without a full rebuild:

```bash frame="terminal" title="Terminal"
bxSites search-index
```

though in practice `build` already runs this as one of its own steps.

## Turning it off

```yaml title="bxsites.yaml"
search: false
```

Skips building the index entirely, and skips shipping the search box, the `lunr.js` script, and `search.js` - a project with search off ships nothing search-related at all.

## When local search isn't enough

For most docs sites, lunr's relevance ranking is genuinely good. But if you're running a large site and want crawler-hosted, typo-tolerant search, swap providers instead of fighting the default:

```yaml title="bxsites.yaml" linenums="1"
search: true
searchProvider:
  provider: algolia
  algolia:
    appId: ABC123
    apiKey: a1b2c3d4e5f6...
    indexName: my-docs
```

With Algolia active, no `search-index.json` is built at all - Algolia serves results from its own hosted index, populated by DocSearch's crawler (or your own Algolia Crawler config), and each theme renders an empty container that `docsearch({...})` mounts into.

Prefer something that indexes your *built* HTML rather than a crawler hitting your live site? [Pagefind](https://pagefind.app/) is the other built-in option:

```yaml title="bxsites.yaml" linenums="1"
search: true
searchProvider: { provider: pagefind }
```

The `pagefind` CLI has to already be on your `PATH` - BxSites shells out to it right after the doc tree (including every version and locale) is written, and a missing binary fails the build loudly rather than shipping a site whose search silently doesn't work.

I still reach for the local `lunr` default on almost every project I ship - it's zero-config, it's fast enough that I've never noticed the difference, and it means one less moving part at deploy time. Pagefind is the one I'd pick next, mostly because it indexes the real rendered HTML rather than trusting my own frontmatter to be accurate.

Which provider is your site running - and if you switched off the default, what pushed you to do it?
