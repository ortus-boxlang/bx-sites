---
title: Content Blocks
summary: Cards, buttons, steppers, and more - a family of rich blocks Markdown alone doesn't have.
icon: phosphor-duotone:squares-four
tags: [course]
---

# Content Blocks

On top of everything in the last lesson, bx-sites adds a family of
content blocks - things plain Markdown has no concept of at all: cards,
tabs of steps, downloads, embeds, and more. Every one uses the same
`::: name ... :::` container syntax:

```markdown title="Example"
::: card title="Themes" icon="phosphor-duotone:palette" href="14-choosing-a-theme.md"
Ten built-in themes to choose from.
:::
```

::: card title="Themes" icon="phosphor-duotone:palette" href="14-choosing-a-theme.md"
Ten built-in themes to choose from.
:::

## A quick tour

- **`::: cards`** - a grid of linked cards, like the one above
- **`::: button`**/**`::: buttons`** - call-to-action links, styled
  consistently across every theme
- **`::: expandable`** - a collapsible `<details>` section
- **`::: stepper`** - a numbered walkthrough, each step its own
  `::: step`
- **`::: file`** - a download link with an icon and filename
- **`::: page-link`** - a rich preview card that auto-pulls its target
  page's own title/summary, so it never goes stale when that page
  changes

## No separate closing line needed

Most of these never have a body of their own - for those, a trailing
bare `:::` on the *same* line closes them immediately:

```markdown title="Example"
::: file src="assets/spec.pdf" title="API Specification" :::
```

A block *can* nest inside another too - a `::: cards` grid containing
`::: card` children is exactly how the example above works.

The next few lessons cover more specialized blocks - tables, images,
data-driven loops, including `::: for`/`::: if` in
[lesson 12](12-loops-and-conditionals.md). One more content block sits
outside even that list: `::: course`, the one rendering this very
course's own numbered index page - a whole lesson sequence from one line
of Markdown, covered in the [Courses guide](../guides/courses.md).

Full block reference: [Content Blocks](../guides/content-blocks.md).
