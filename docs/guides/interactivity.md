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

A common one: a button next to an install command that copies it and
confirms the copy:

```markdown title="Copy button" linenums="1"
<div x-data="{ copied: false }">
  <button type="button" @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
    <span x-show="!copied">Copy install command</span>
    <span x-show="copied" x-cloak>Copied!</span>
  </button>
</div>
```

<div x-data="{ copied: false }">
  <button type="button" class="btn btn-sm btn-outline-secondary" @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
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
