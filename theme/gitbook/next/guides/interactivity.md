---
title: Interactivity with Alpine.js
order: 9
icon: phosphor-duotone:lightning
tags: [guides, alpine, interactivity]
---

# Interactivity with Alpine.js

Every page built by BxSites already loads [Alpine.js](https://alpinejs.dev/)
- it's what powers the built-in dark-mode toggle and language dropdown in
every built-in theme. That same Alpine instance is available
to your own page content too, for free: no `bxsites.yaml` setting to flip,
no `extraJs` entry to add, no extra `<script>` tag to write in your
markdown.

Since [raw block-level HTML passes through
untouched](images.md#captions-alignment-and-framing) in your markdown,
you can drop Alpine's `x-data`/`x-show`/`@click`/etc. attributes
straight onto any HTML block and it just works.

## Before reaching for Alpine

Most "interactive" needs already have a purpose-built directive block that
doesn't require writing any JS yourself - reach for these first:

- A collapsible section → [Expandable](content-blocks.md#expandable) or a
  [collapsible admonition](markdown.md#collapsible-admonitions)
- Grouped alternative content behind clickable tabs → [Content
  Tabs](markdown.md#content-tabs)
- A numbered walkthrough → [Stepper](content-blocks.md#stepper)
- A styled call-to-action link → [Buttons](content-blocks.md#buttons) (the
  copy-to-clipboard button below is a *different* case - it has no `href`
  at all, just client-side behavior - which is exactly what Alpine is for)

Alpine is for the interactive content those don't cover - anything with
its own client-side state.

## A copy-to-clipboard button

[`::: button`](content-blocks.md#buttons) only ever renders a real link (or
an inert placeholder) - it has no notion of running arbitrary JS on
click. For a button that *does* something instead
of navigating somewhere, drop its `bxsites-button`/`bxsites-button--*`
classes onto a plain HTML `<button>` instead - same look, styled in every
built-in theme, just wired up with Alpine rather than an `href`. A common
one: a button next to an install command that copies it and confirms the
copy:

```markdown title="Copy button" linenums="1"
<div x-data="{ copied: false }">
  <button type="button" class="bxsites-button bxsites-button--secondary bxsites-button--small"
    @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
    <span x-show="!copied">Copy install command</span>
    <span x-show="copied" x-cloak>Copied!</span>
  </button>
</div>
```

<div x-data="{ copied: false }">
  <button type="button" class="bxsites-button bxsites-button--secondary bxsites-button--small"
    @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
    <span x-show="!copied">Copy install command</span>
    <span x-show="copied" x-cloak>Copied!</span>
  </button>
</div>

## A live filter

Filtering a list client-side, no server round-trip:

```markdown title="Live filter" linenums="1"
<div x-data="{ query: '' }">
  <input type="text" x-model="query" placeholder="Filter providers...">
  <ul>
    <li x-show="'local'.includes( query.toLowerCase() )">local (static index, no server)</li>
    <li x-show="'algolia'.includes( query.toLowerCase() )">algolia (hosted DocSearch)</li>
    <li x-show="'pagefind'.includes( query.toLowerCase() )">pagefind (indexed at build time)</li>
  </ul>
</div>
```

`x-model` binds the input's value to Alpine state; each `<li>`'s `x-show`
re-evaluates on every keystroke.

## A sortable, filterable table

A [native pipe table](tables.md) is static once built - for one that a
reader can actually sort and filter client-side, have Alpine own the
rows instead: put the data in `x-data` and render it with `x-for`,
rather than writing
`| Feature | Status |` pipe syntax:

```markdown title="Sortable table" linenums="1"
<div x-data="{
  query: '',
  sortKey: 'name',
  sortAsc: true,
  rows: [
    { name: 'Bootstrap', type: 'Components', stars: 4 },
    { name: 'GitBook', type: 'SaaS', stars: 5 },
    { name: 'Docusaurus', type: 'React', stars: 4 },
    { name: 'VuePress', type: 'Vue', stars: 3 }
  ],
  sortBy(key) {
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true
    this.sortKey = key
  },
  get sorted() {
    return [...this.rows]
      .filter(r => r.name.toLowerCase().includes(this.query.toLowerCase()))
      .sort((a, b) => {
        const dir = this.sortAsc ? 1 : -1
        return a[this.sortKey] > b[this.sortKey] ? dir : a[this.sortKey] < b[this.sortKey] ? -dir : 0
      })
  }
}">
  <input type="text" x-model="query" placeholder="Filter by name...">
  <table class="table">
    <thead>
      <tr>
        <th @click="sortBy('name')" style="cursor:pointer">Name</th>
        <th @click="sortBy('type')" style="cursor:pointer">Type</th>
        <th @click="sortBy('stars')" style="cursor:pointer">Stars</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="row in sorted" :key="row.name">
        <tr>
          <td x-text="row.name"></td>
          <td x-text="row.type"></td>
          <td x-text="row.stars"></td>
        </tr>
      </template>
    </tbody>
  </table>
</div>
```

Which renders as (type in the box, click a column heading):

<div x-data="{
  query: '',
  sortKey: 'name',
  sortAsc: true,
  rows: [
    { name: 'Bootstrap', type: 'Components', stars: 4 },
    { name: 'GitBook', type: 'SaaS', stars: 5 },
    { name: 'Docusaurus', type: 'React', stars: 4 },
    { name: 'VuePress', type: 'Vue', stars: 3 }
  ],
  sortBy(key) {
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true
    this.sortKey = key
  },
  get sorted() {
    return [...this.rows]
      .filter(r => r.name.toLowerCase().includes(this.query.toLowerCase()))
      .sort((a, b) => {
        const dir = this.sortAsc ? 1 : -1
        return a[this.sortKey] > b[this.sortKey] ? dir : a[this.sortKey] < b[this.sortKey] ? -dir : 0
      })
  }
}">
  <input type="text" x-model="query" placeholder="Filter by name...">
  <table class="table">
    <thead>
      <tr>
        <th @click="sortBy('name')" style="cursor:pointer">Name</th>
        <th @click="sortBy('type')" style="cursor:pointer">Type</th>
        <th @click="sortBy('stars')" style="cursor:pointer">Stars</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="row in sorted" :key="row.name">
        <tr>
          <td x-text="row.name"></td>
          <td x-text="row.type"></td>
          <td x-text="row.stars"></td>
        </tr>
      </template>
    </tbody>
  </table>
</div>

`rows` is a plain JS array baked right into the page - fine for the kind
of small reference table docs actually have. `sorted` is an Alpine
`get`ter, so it re-filters and re-sorts on every keystroke/click with no
extra wiring; `sortBy()` toggles direction on a second click of the same
column. The `<table>` here is a real `<table>` tag written by hand
(there's no pipe-table syntax to hand rows to Alpine directly), so it
still gets wrapped in `.bxsites-table-wrap` and the [responsive
scroll/sticky header](tables.md#responsive-scroll-and-a-sticky-header)
treatment automatically, same as any table bx-markdown itself renders.

Hand-typing `rows` works, but it's still content living inside a JS object
literal, edited nowhere near the rest of your reusable data. If the same
rows also belong in a plain table elsewhere, or in several pages,
[reusable data](data-files.md) plus `$jsonAttr()` feeds real
`docs/data/*.yaml`/`.json` content into `x-data` instead of a hand-typed
array:

```markdown title="Server-fed rows" linenums="1"
<div x-data="{ query: '', rows: {{ $jsonAttr(data.providers) }} }">
  ...
</div>
```

Same `x-for`/`x-model`/sort logic as above, just backed by
`docs/data/providers.yaml` instead of a literal baked into the page - see
[Data Files: Consuming data](data-files.md#consuming-data) for the full
recipe (and why it needs `encodeForHtmlAttribute()`, not just
`jsonSerialize()`, to land safely inside a `"..."`-quoted attribute).

## `x-data` fundamentals, if you're new to Alpine

`x-data` declares a scope's own reactive state as a plain JS object;
anything inside that element can read/write it, and `x-show`/`x-text`/
`x-model`/`@click` (shorthand for `x-on:click`) all react to it changing:

```markdown title="Example" linenums="1"
<div x-data="{ count: 0 }">
  <button type="button" @click="count++">Clicked <span x-text="count"></span> times</button>
</div>
```

See [Alpine's own documentation](https://alpinejs.dev/start-here) for the
full directive list (`x-if`, `x-for`, `x-transition`, and more).

## Things to know

- **It's core, not optional.** The theme chrome (dark mode, language
  switcher) depends on Alpine, so it can't be turned off in `bxsites.yaml`
  the way `mermaid`/`math` can.
- **Version.** Currently `alpinejs@3.14.1`, vendored with this module and
  served from `site/assets/vendor/alpine/` - no CDN involved. Check a
  theme's own `layout.bxm` for the exact `<script>` tag if you need to
  know precisely what's loaded.
- **Strict CSP.** Alpine's default build evaluates the JS expressions
  inside `x-data`/`@click` etc. directly, which needs `unsafe-eval` under
  a strict Content-Security-Policy. If your deployment can't allow that,
  don't rely on Alpine in your page content.
- **Keep it light.** A docs page should stay fast and simple - small,
  self-contained widgets (a copy button, a filter, a toggle) are a good
  fit; a full client-side app isn't what this is for.
