---
title: Interactivity with Alpine.js
summary: Copy buttons, live filters, and sortable tables - with no extra setup.
icon: phosphor-duotone:lightning
tags: [course]
---

# Interactivity with Alpine.js

Every page already loads [Alpine.js](https://alpinejs.dev/) - it's what
powers the dark-mode toggle and language dropdown in every built-in
theme. That same instance is available to your own content too, for
free: since raw block-level HTML passes through Markdown untouched, you
can drop Alpine's `x-data`/`x-show`/`@click` attributes straight onto
any HTML block and it just works.

```markdown title="A copy-to-clipboard button"
<div x-data="{ copied: false }">
  <button type="button" @click="navigator.clipboard.writeText('bxSites new my-docs'); copied = true">
    <span x-show="!copied">Copy install command</span>
    <span x-show="copied">Copied!</span>
  </button>
</div>
```

## Before reaching for Alpine

Most "interactive" needs already have a purpose-built content block that
needs no JS at all - a collapsible section is `::: expandable`, a
numbered walkthrough is `::: stepper`, alternative content behind tabs
is the `=== "Tab"` syntax from [lesson 6](06-markdown-extensions.md).
Alpine is for what those don't cover - anything with its own real
client-side state.

## Feeding Alpine from real data

A [native pipe table](08-tables.md) is static once built - for one a
reader can actually sort or filter, have Alpine own the rows instead of
a hand-typed JS array. Combined with [data files](11-data-files.md) from
a couple of lessons back, a one-line `functions.bxs` helper safely
serializes `data.*` into an `x-data` attribute, so the same reusable
data drives both a static table *and* an interactive one.

Full recipes, including the sortable-table walkthrough:
[Interactivity with Alpine.js](../guides/interactivity.md).
