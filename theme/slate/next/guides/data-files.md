---
title: Data Files
order: 12.5
icon: phosphor-duotone:database
tags: [guides, data]
---

# Data Files

[Reusable variables](variables-and-functions.md#reusable-variables) are
great for a flat, one-off fact (`company`, `supportEmail`) but awkward for
anything with real shape - a team roster, a pricing table, a feature
matrix. **Data files** fill that gap: drop a `docs/data/*.yaml`/`.yml`/
`.json` file in your project, and its whole content - any shape you like,
an object or an array - becomes reachable as `data.<file>` from every
page, the same `{{ }}` syntax `variables`/`page` already use. Need the data
*computed* rather than just parsed from a static file - a discount applied
at read time, a value that shouldn't live in three duplicated files? Drop a
`docs/data/*.bx` **class** instead - see [Data classes](#data-classes)
below.

## The convention

Add a `docs/data/` folder. Each file's basename (extension stripped)
becomes one top-level key under `data`:

```text title="docs/ layout"
docs/
├── index.md
└── data/
    ├── team.yaml
    └── pricing.json
```

```yaml title="docs/data/team.yaml"
- name: Luis Majano
  role: CEO
- name: Jon Clausen
  role: CTO
```

```json title="docs/data/pricing.json"
{
	"free": { "price": 0, "seats": 3 },
	"pro": { "price": 29, "seats": 20 }
}
```

`data.team` is now that array, `data.pricing.pro.price` that nested
number - a file's parsed root is used exactly as parsed, object or array
alike, no fixed shape to conform to. No `docs/data/` folder at all simply
means no `data` - the same opt-in-by-presence shape
[`docs/functions.bxs`](variables-and-functions.md#magic-functions)/
[`docs/blog/authors.yml`](blog.md) already use.

Reference any of it in ordinary Markdown, by dotted path:

```markdown title="docs/pricing.md"
The Pro plan is **${{ data.pricing.pro.price }}/mo** for up to
{{ data.pricing.pro.seats }} seats.
```

builds to:

```html
<p>The Pro plan is <strong>$29/mo</strong> for up to 20 seats.</p>
```

If more than one file shares a basename across extensions (both
`products.yaml` and `products.json` present), `.bx` wins first (see
[Data classes](#data-classes)), then `.yaml`, then `.yml`, then `.json` -
pick one format per basename rather than relying on that order in practice.

## Data classes

A `.yaml`/`.json` file is static - parsed once, used exactly as written.
For data that needs computing (a discounted price, a value assembled from
several sources, anything with real logic behind it), drop a real BoxLang
**class** instead - `docs/data/Pricing.bx` (PascalCase, this module's own
class-file convention everywhere else too) becomes `data.pricing` - same
lowercase `data.*` key shape as every other file, just the class
basename's own first letter lowercased:

```bx title="docs/data/Pricing.bx"
class {
	struct function getData() {
		return { "free": { "price": 0 }, "pro": { "price": 29 } }
	}

	numeric function getDiscountedPrice( required string plan, required numeric pct ) {
		var base = getData()[ arguments.plan ].price
		return base - ( base * arguments.pct )
	}
}
```

**`getData()` is required** - every data class needs one (even a trivial
one returning `{}`), since it's what gets called automatically whenever
`data.pricing` is used bare, exactly like a parsed YAML/JSON root:

```markdown title="docs/pricing.md"
The Pro plan is **${{ data.pricing.pro.price }}/mo**.

::: for plan, info in data.pricing
- {{ plan }}: ${{ info.price }}
:::
```

**Any other public method is callable too**, directly from `{{ }}`, with
the exact same argument syntax a [magic function](variables-and-functions.md#magic-functions)
call already uses (literals or dotted variable references, comma-separated):

```markdown title="docs/pricing.md"
Discounted for early adopters: **${{ data.pricing.getDiscountedPrice("pro", 0.2) }}/mo**
```

builds to:

```html
Discounted for early adopters: <strong>$23.2/mo</strong>
```

This works from `::: for`/`::: if` too, the identical `<dotted.path>`
grammar those directives already resolve through:

```markdown title="Example" linenums="1"
::: if data.pricing.getDiscountedPrice("pro", 0.2)
Discounts are active.
:::
```

A theme override or a magic function, which already have full BoxLang at
their disposal, get the live instance itself bound bare as `data.pricing` -
call `getData()` or any other method on it directly, no auto-invoke magic
needed there (see [Consuming data](#consuming-data) below).

**Only public methods are reachable this way** - a `private function`
in the same class stays a genuine implementation detail, unreachable from
`{{ }}` just like a non-`$`-prefixed helper in `functions.bxs` is
unreachable *directly* (though, same as there, it's still callable from
another method in the same file).

This doesn't loosen the trust boundary [below](#why-data-files-not-boxlang-templates-in-markdown) -
a `.bx` file under `docs/data/` is code the *project owner* writes, the
same tier of trust `docs/functions.bxs` already has, never something a
docs-only contributor's Markdown can reach into.

**One narrow limitation**, real but rare in practice: loading a data class
needs its own resolved path to be expressible as a BoxLang class name (no
hyphens or spaces anywhere in it). Running `bxSites` from inside the
project itself - the overwhelmingly common case - always works, since
nothing about the project's own path (which can have hyphens all it
wants, e.g. `my-project/`) ever needs spelling out that way. It only
becomes a real constraint with an explicit `--projectRoot` pointing at a
project outside the current directory, whose own path (or an ancestor
directory's) contains a hyphen or space - see
[`BxSites.UnsupportedDataClassPath`](#errors) for the exact error that
throws instead of a cryptic failure.

## Consuming data

A scalar `{{ data.x.y }}` reference works anywhere `{{ }}` already does,
but real content - a team grid, a pricing table - usually means looping
over `data.*`. There are three ways to do that, depending on where the
loop belongs:

### In a theme override

Once a project has a `theme/` override (see
[Themes](themes.md#overriding-a-theme)), `data` is bound bare into
`layout.bxm`/`page.bxm` the same way `page`/`siteConfig` already are - no
`{{ }}`, just real BoxLang:

```bx title="theme/layout.bxm (excerpt)"
<ul class="footer-sponsors">
<bx:loop array="#data.sponsors#" index="sponsor">
	<li>#encodeForHTML( sponsor )#</li>
</bx:loop>
</ul>
```

This is the natural home for data that belongs on *every* page (a footer
sponsor list, a site-wide nav badge) rather than one specific page's
content. If `sponsors` were a [data class](#data-classes) instead of a
`.yaml`/`.json` file, `data.sponsors` here is the live instance itself
(real BoxLang, no `{{ }}`-only auto-invoke convenience) - loop over
`data.sponsors.getData()` explicitly instead.

### From a magic function

A [magic function](variables-and-functions.md#magic-functions) can read
`data` bare too (it's one of the same "supporting variables" `page`/
`siteConfig`/etc. already are), and loop/branch over it with real BoxLang,
returning a Markdown/HTML fragment:

```bx title="docs/functions.bxs"
function $team() {
	var html = ""
	for ( item, idx in data.team ) {
		html &= "- **" & encodeForHTML( item.name ) & "** - " & encodeForHTML( item.role ) & char( 10 )
	}
	return html
}
```

```markdown title="docs/about.md"
## Our team

{{ $team() }}
```

This renders server-side, at build time - visible to a search crawler
with no JavaScript needed, unlike the Alpine recipe below.

### Directly in Markdown, with `::: for`/`::: if`

For a loop or a simple truthy check that doesn't need a magic function at
all, [`::: for`/`::: if`](content-blocks.md#loop-and-conditional-data-driven)
work straight from Markdown:

```markdown title="docs/team.md" linenums="1"
::: for member, idx in data.team
{{ idx }}. **{{ member.name }}** - {{ member.role }}
:::
```

`::: for <item>, <index> in <dotted.path>` binds `<item>`/`<index>` using
BoxLang's own native two-variable `for` loop semantics for whatever
`<dotted.path>` resolves to - item + 1-based index for an array, or key +
value for a struct, the *identical* syntax either way (no
array-vs-struct branching to write yourself):

```markdown title="Iterating a struct" linenums="1"
::: for name, enabled in data.flags
- {{ name }}: {{ enabled }}
:::
```

`::: if <dotted.path>` renders its own content only when the resolved
value is truthy (an empty array/struct/string, `0`, and `false` all count
as falsy):

```markdown title="Example" linenums="1"
::: if data.flags.betaBanner
Beta features are enabled on this build.
:::
```

Chain `::: elseif <dotted.path>` (any number) and a trailing bare
`::: else` right after a `::: if` for real `if`/`elseif`/`else`
semantics - the first truthy condition wins, `::: else` catches whatever's
left, and a later branch's own condition is never even resolved until
its own turn comes. One trailing `:::` closes the whole chain -
`::: elseif`/`::: else` mark where the previous branch ends, no `:::`
needed before each of them (though it still works if you'd rather write
it that way):

```markdown title="Example" linenums="1"
::: if data.flags.darkModeDefault
Dark mode is on by default.
::: elseif data.flags.betaBanner
Beta features are enabled, though dark mode isn't on by default.
::: else
Nothing special about this build.
:::
```

Both bodies can contain ordinary Markdown and even other content blocks,
including a nested `::: for`/`::: if`. Deliberately narrow grammar,
matching `{{ }}` itself - a dotted path only, no comparison operators
(`==`, `&&`, ...) in this first version. A real comparison need routes to
a magic function instead (above), which already has full BoxLang at its
disposal.

### In Alpine, client-side (`x-data`)

[Interactivity](interactivity.md) already covers dropping raw
`x-data`/`x-for` HTML into Markdown; feeding it from `data.*` instead of a
hand-typed JS array just needs `data.*` turned into a safe HTML attribute
value. `jsonSerialize()` alone isn't enough - the result still needs
HTML-attribute encoding to sit safely inside a `"..."`-quoted attribute
(the same two-step recipe ColdBox's own `attribute()`/`forAttribute()`
helper uses) - so define a one-line helper once, in your own
`functions.bxs`:

```bx title="docs/functions.bxs"
function $jsonAttr( required any value ) {
	return encodeForHtmlAttribute( jsonSerialize( arguments.value ) )
}
```

`encodeForHtmlAttribute()` comes from bx-esapi, already a dependency of
every bx-sites project - no new dependency, just this one recipe. Then, in
Markdown:

```markdown title="docs/team.md" linenums="1"
<div x-data="{ team: {{ $jsonAttr(data.team) }} }">
  <template x-for="member in team" :key="member.name">
    <li x-text="member.name + ' - ' + member.role"></li>
  </template>
</div>
```

Plain double quotes work safely around `x-data` - `encodeForHtmlAttribute()`
already handles the conflict, no single-quote workaround needed. This is
the one path that renders client-side only (nothing for a JS-disabled
reader or a search crawler) - reach for a magic function or `::: for`
instead when the content should be visible without JavaScript.

## Why data files, not BoxLang templates in Markdown?

A related, bigger question came up while designing this: why not let
Markdown itself become a real BoxLang template (loops, conditionals,
arbitrary logic), instead of adding a narrow `::: for`/`::: if` and
leaning on magic functions for anything more? Two reasons:

- **Trust boundary.** `docs/**.md` is the one artifact routinely edited by
  many/external/less-trusted contributors (a docs PR). `docs/functions.bxs`
  is the one artifact the *project owner* explicitly authors. Compiling
  every `.md` file as a real BoxLang template would collapse that
  boundary - any contributor able to open a docs PR would gain arbitrary
  BoxLang execution (file I/O, environment access) rather than just
  Markdown text.
- **Failure mode.** An unmatched `{{ }}` today is left as literal text - a
  typo never breaks a build. A BoxLang template compile error is a hard
  failure. `::: for`/`::: if` keep that same forgiving shape (an
  unresolvable path throws a clear, typo-catching error - see
  [Errors](#errors) - rather than silently miscompiling).

Data files close the actual gap (structured content, and loops/
conditionals over it) without either tradeoff: Markdown itself stays
inert-until-`{{ }}`-substituted, and `functions.bxs`/a `docs/data/*.bx`
class remain the explicitly-trusted escape hatches into real BoxLang
logic - both project-owner-authored code, never something a Markdown
contributor's own PR can add.

## Scope

- `docs/data/` is project-wide, loaded once - the same single-load scope
  [`functions.bxs`](variables-and-functions.md#scope) already has. Every
  version/locale tree sees the identical `data`; there's no per-version or
  per-locale override or merge in this first version. Don't duplicate
  `docs/data/` into `docs/versions/<name>/` or `docs/i18n/<code>/` - it
  isn't read from there.
- Flat directory only - no subfolder recursion into `docs/data/` in this
  first version, the same "exactly one file" shape
  [`docs/blog/authors.yml`](blog.md) already has.
- `data` is a reserved `{{ }}` name, the same way `page` already is (see
  [Reserved names](variables-and-functions.md#reserved-names)) - a
  `bxsites.yaml` `variables.data` entry, if a project somehow declared
  one, is shadowed by `docs/data/`'s own struct rather than winning.
  `docs/functions.bxs` can't declare a function named `data` either, for
  the same reason.

## Errors

- `BxSites.InvalidDataFile` - a `docs/data/*.yaml`/`.yml`/`.json` file
  failed to parse (a YAML/JSON syntax error), or a `docs/data/*.bx` class
  failed to compile/instantiate, naming the offending file.
- `BxSites.MissingDataMethod` - a `docs/data/*.bx` class has no public
  `getData()` method.
- `BxSites.UnknownDataMethod` - `{{ data.x.someMethod(...) }}` names a
  method that doesn't exist (or isn't public) on that data class instance.
- `BxSites.NotCallable` - `{{ data.x.someMethod(...) }}` where `data.x`
  isn't a data class instance at all (a `.yaml`/`.json`-backed key has no
  methods to call).
- `BxSites.UnsupportedDataClassPath` - a `docs/data/*.bx` class couldn't be
  loaded because its resolved path contains a character not valid in a
  BoxLang class name (a hyphen or space in some parent directory name) -
  see [Data classes](#data-classes)'s own note on this.
- `BxSites.UnknownVariable` - a `{{ data.x.y }}` (or a `::: for`/`::: if`
  path) doesn't resolve against what's actually in `docs/data/`.
- `BxSites.InvalidForTarget` - a `::: for`'s own path resolved to
  something that's neither an array nor a struct (can't be looped).
