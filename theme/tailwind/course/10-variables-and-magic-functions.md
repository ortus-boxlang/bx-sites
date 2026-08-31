---
title: Variables & Magic Functions
summary: Reusable {{ variables }}, and small BoxLang helper functions callable the same way.
icon: phosphor-duotone:function
tags: [course]
---

# Variables & Magic Functions

`bxsites.yaml`'s `variables` block - any shape, flat or nested - is
reachable from any page as `{{ dotted.path }}`, resolved once at build
time:

```yaml title="bxsites.yaml"
variables:
  company: Acme Corp
  supportEmail: help@acme.com
```

```markdown title="Anywhere in docs/"
Contact {{ company }} at {{ supportEmail }}.
```

The current page's own frontmatter works the same way, under the
reserved name `page` - `{{ page.title }}`, or
`{{ page.frontmatter.<key> }}` for a custom field.

## Magic functions

For anything a flat variable can't express, a project-wide
`docs/functions.bxs` - plain BoxLang, no plugin/wiring needed - lets you
declare small helper functions. Any function named with a leading `$`
becomes callable the same way, from Markdown:

```bx title="docs/functions.bxs"
function $badge( required string status ) {
    var color = status == "done" ? "success" : "warning"
    return '<span class="badge badge--' & color & '">' & encodeForHTML( status ) & '</span>'
}
```

```markdown title="Anywhere in docs/"
Status: {{ $badge("done") }}
```

A magic function's own body can also bare-reference a shared context -
`page`, `siteConfig`, `nav`, and (from the next lesson on) `data` -
identically whether it's called from `{{ }}` or bare from a theme
override.

Full reference, including the "reserved names" a project's own
`functions.bxs` can't shadow: [Variables & Magic Functions](../guides/variables-and-functions.md).
