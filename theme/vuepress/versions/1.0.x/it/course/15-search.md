---
title: Search
summary: A static search index, on by default - plus Algolia and Pagefind as drop-in alternatives.
icon: phosphor-duotone:magnifying-glass
tags: [course]
---

# Search

Every site gets a working search box with zero setup - the `local`
provider builds a static index at build time (powered by
[MiniSearch](https://lucaong.github.io/minisearch/)) and ships it
alongside the site, no server or third-party service involved.

Open it with `Cmd/Ctrl+K` or `/` from anywhere on the page - the same
shortcut convention most modern docs sites share.

## Other providers

Two drop-in alternatives, same config shape, different tradeoffs:

- **Algolia DocSearch** - hosted, typo-tolerant, free for open-source
  docs sites; needs an API key.
- **Pagefind** - indexed as a separate build step, scales to very large
  sites better than an in-browser index.

```yaml title="bxsites.yaml"
search:
  provider: local # or "algolia" / "pagefind"
```

Switching providers later is a one-line config change - the search box
itself, and the keyboard shortcut, work identically regardless of which
one is running underneath.

Full comparison table and a walkthrough for wiring up a fourth,
custom provider: [Search](../guides/search.md).
