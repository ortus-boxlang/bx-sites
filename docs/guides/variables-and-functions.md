---
title: Variables & Magic Functions
order: 12
icon: phosphor-duotone:magic-wand
tags: [guides, variables, functions]
---

# Variables & Magic Functions

Two small, related features for keeping repeated facts and repeated logic
out of your Markdown: **reusable variables**, defined once in
`bxsites.yaml` and dropped into any page with `{{ }}`, and **magic
functions**, small BoxLang helpers you write once in `docs/functions.bxs`
and call the same way - everywhere, with no import, no plugin, no wiring.

Both share one syntax:

```text
{{ dotted.path }}          # a reusable variable
{{ $name(arg1, arg2) }}    # a magic function call
```

## Reusable variables

Add a `variables` block to `bxsites.yaml` - any shape you like, flat or
nested:

```yaml title="bxsites.yaml"
variables:
  company: "Ortus Solutions"
  product:
    name: "BoxLang"
    supportEmail: "support@example.com"
```

Then reference any of it, by dotted path, from any Markdown page:

```markdown title="docs/index.md"
# Welcome to {{ company }}

We build {{ product.name }} tools. Need help? Write us at
{{ product.supportEmail }}.
```

builds to:

```html
<h1>Welcome to Ortus Solutions</h1>
<p>We build BoxLang tools. Need help? Write us at support@example.com.</p>
```

A `{{ }}` variable is resolved once, at build time, against whatever
`bxsites.yaml`'s own `variables` block has right then - rename a product,
update a support address, or bump a year in one place, and every page
using it picks up the change on the next build. See
[`variables`](../configuration.md#variables) in the configuration
reference.

## Magic functions

Add a `docs/functions.bxs` file (or `src/functions.bxs`, if your project
uses `src/` - see [Getting Started](../getting-started.md)) - a plain
BoxLang script. Any function you name with a leading `$` becomes a *magic
function*: callable from `{{ }}` in Markdown, and callable bare, directly,
from a project's own [`theme/`](themes.md#overriding-a-theme)
`.bxm` overrides.

```bx title="docs/functions.bxs" linenums="1"
function $shout( text ) {
	return uCase( arguments.text ) & "!"
}

function $badge( label, kind = "info" ) {
	return '<span class="badge bg-' & arguments.kind & '">' & arguments.label & '</span>'
}
```

```markdown title="docs/index.md"
{{ $shout('this is important') }}

Status: {{ $badge('Stable', 'success') }}
```

builds to:

```html
<p>THIS IS IMPORTANT!</p>
<p>Status: <span class="badge bg-success">Stable</span></p>
```

A magic function can return anything `toString()`-able - plain text,
HTML, a number - and it's spliced straight into the page's Markdown
before it's converted, so returning real HTML (like `$badge()` above)
works exactly the way you'd expect.

A function declared *without* a leading `$` in the same `functions.bxs` is
just a private helper, meant to be called only from your other
`$`-prefixed functions in the same file (they're all loaded into the same
scope, so one can call another bare) - `{{ }}` can never call one directly
(only a `$name(...)` call target is ever recognized), and it isn't part of
the documented public surface a theme override should call either, even
though it happens to be technically reachable there too:

```bx title="docs/functions.bxs"
private string function formatPrice( amount ) {
	return "$" & numberFormat( arguments.amount, "9.99" )
}

function $price( amount ) {
	return formatPrice( arguments.amount )
}
```

### Calling a magic function from a theme override

Because a magic function is bound directly into template scope, a
project's own `theme/page.bxm` (or `layout.bxm`) can call it bare, with no
prefix at all - the same way it already reads `variables.page`/
`variables.siteConfig`:

```bx title="theme/page.bxm (excerpt)"
<p class="build-banner">#$shout( 'built with boxlang' )#</p>
```

### Argument syntax

A magic function call's arguments are simple, comma-separated literals or
variable references - no nested function calls or expressions in this
first version:

- Numbers: `{{ $discount(20) }}`
- Quoted strings: `{{ $greet('World') }}` or `{{ $greet("World") }}`
- Booleans: `{{ $badge('Beta', true) }}`
- A `{{ }}`-less dotted variable reference: `{{ $greet(product.name) }}`

## Showing the syntax literally

A `{{ }}` shown inside a fenced code block (three backticks or more, like
every example on this page) is left completely untouched rather than
resolved - the same convention this module already uses for `$...$` math
and `=== "Tab"` content tabs. A `` `{{ example }}` `` shown in *inline*
code isn't fence-protected, though, so if you need to show the syntax
inline rather than in a full code block, prefer a name that isn't also a
real variable/function in your own project.

A `{{ }}` whose contents don't look like either a variable path or a
`$name(...)` call - some other templating engine's own `{{ }}` syntax
shown in prose, say - is left untouched rather than treated as an error.
Only a token that *looks like* a variable or a magic function call, but
doesn't resolve, fails the build (see [Errors](#errors) below) - that's
deliberate, to catch a real typo without misreading unrelated `{{ }}` text
as broken syntax.

## Scope

- `functions.bxs` is project-wide - one file, loaded once, the same set of
  magic functions available on every page across the main tree and every
  [version](versioning.md)/[locale](i18n.md) tree. You don't need to
  duplicate it into `docs/versions/<name>/` or `docs/i18n/<code>/`.
- `variables` is likewise a single, project-wide `bxsites.yaml` block -
  it isn't itself translatable per locale. A multilingual project wanting
  different variable text per language can instead reach for a magic
  function that switches on `siteConfig.i18n.defaultLocale.code` (or
  simply keep the value locale-neutral - a product name, a support email).

## Reserved names

A `theme/page.bxm`/`layout.bxm` override calling a magic function bare
(`$name(...)`) works because every loaded function - `$`-prefixed or a
private helper alike - is bound directly into that same template's own
rendering scope, right alongside the built-in `variables.page`/
`variables.siteConfig`/etc. that every theme already reads. That means a
`functions.bxs` function sharing a name with one of those already has one:
avoid `page`, `nav`, `siteConfig`, `themeDir`, `basePath`,
`moduleAssetsDir`, `versions`, `currentVersion`, `locales`,
`currentLocale`, `currentLocaleDir`, `strings`, `requiredFiles` and
`stringsResolver` for a private helper's own name (a `$`-prefixed magic
function can never collide with any of these, since none of them start
with `$`).

## Errors

- `BxSites.UnknownVariable` - a `{{ dotted.path }}` (or a `$name(...)`
  argument that looks like a variable reference) doesn't match anything in
  `bxsites.yaml`'s `variables` block.
- `BxSites.UnknownFunction` - a `{{ $name(...) }}` call doesn't match any
  `$`-prefixed function in `docs/functions.bxs`.
- `BxSites.InvalidFunctions` - `docs/functions.bxs` failed to load (a
  BoxLang syntax error in the file itself).
- `BxSites.InvalidConfig` - `bxsites.yaml`'s `variables` key is present but
  isn't an object.
