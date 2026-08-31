---
title: Tables
summary: GFM pipe tables, always on, with automatic responsive scroll and visualizer recipes.
icon: phosphor-duotone:table
tags: [course]
---

# Tables

GitHub-flavored Markdown pipe tables work out of the box - no config,
no content block, just the syntax you already know:

```markdown title="Example"
| Feature      | Status |
| ------------ | ------ |
| Tables       | ✅ Done |
| Alignment    | ✅ Done |
```

| Feature      | Status |
| ------------ | ------ |
| Tables       | ✅ Done |
| Alignment    | ✅ Done |

Alignment colons (`:---`/`:---:`/`---:`) work as expected. Every table
also gets an automatic treatment for free: a responsive horizontal
scroll on narrow viewports, and a sticky header on a long one - no extra
markup.

## Beyond plain cells

Two recipes worth knowing about once you've met [magic
functions](10-variables-and-magic-functions.md) in a couple of lessons:
a magic function can return HTML, which means a table cell can hold a
status chip, a star rating, or a progress bar instead of plain text -
and since `{{ }}` resolves before tables are even parsed, that works
inside a pipe table exactly like anywhere else on the page.

For a table a reader can actually sort or filter, rather than just
read, [Interactivity with Alpine.js](13-interactivity-with-alpine.md)
covers the client-side recipe.

Full syntax, alignment rules, and the visualizer recipes:
[Tables](../guides/tables.md).
