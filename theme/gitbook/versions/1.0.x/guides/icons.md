---
title: Icons
order: 1.5
icon: phosphor-duotone:shapes
tags: [guides, themes, icons]
---

# Icons

A page's own `icon` frontmatter (shown next to its title, and next to its
entry in the sidebar nav) accepts either a plain emoji/short text - the
original, still fully supported form - or a named icon from one of eight
self-hosted libraries, all MIT/ISC-licensed and bundled with this module
(~16,200 icons combined, no CDN, nothing added to a built page's own
weight beyond the handful of icons it actually uses - see IconResolver.bx):

```markdown title="Frontmatter"
---
icon: rocket
---
```

```markdown title="Frontmatter"
---
icon: lucide:rocket
---
```

```markdown title="Frontmatter"
---
icon: phosphor-bold:rocket
---
```

Bare `rocket` defaults to [Phosphor](https://phosphoricons.com/), regular
weight. Phosphor ships all six of its own weights, each its own prefix:
`phosphor-thin:`, `phosphor-light:`, `phosphor:` (regular, same as the
bare name), `phosphor-bold:`, `phosphor-fill:` and `phosphor-duotone:`.
Prefix with `lucide:` for [Lucide](https://lucide.dev/icons/), or
`tabler:` for [Tabler](https://tabler.io/icons) instead. Browse each
site's own gallery for the exact name - it matches this module's own
vendored filename exactly (lowercase, hyphenated, e.g. `book-open`,
`arrow-up-right`; Phosphor's own site shows a weight switcher - each of
its six options there is one of this module's six `phosphor[-weight]:`
prefixes).

Font Awesome is deliberately not one of these - its Duotone style (and
most of its icon set from v6 on) is Pro-only, not available under a
license this module could bundle and redistribute for free.

A project's own SVG works too - drop it at `docs/assets/icons/my-icon.svg`
and reference it as `icon: custom:my-icon`.

A [nav.json](../configuration.md#nav) entry can set its own `icon` too,
overriding the target page's own frontmatter for that one entry:

```json title="docs/nav.json"
{ "title": "Guides", "path": "guides/index.md", "icon": "lucide:book-open" }
```

The same `[library:]name`/emoji values work anywhere else an `icon` is
accepted, like a [content-block card](content-blocks.md#cards) - resolved
the same way, through the same shared cache, so referencing the same icon
twice across a build only ever reads its SVG file once.
