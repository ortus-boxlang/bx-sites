---
title: Tables
order: 4.6
icon: phosphor-duotone:table
tags: [guides, markdown]
---

# Tables

Standard [GFM](https://github.github.com/gfm/#tables-extension-) pipe
tables, on top of everything in [Markdown Extensions](markdown.md) - no
`bxsites.yaml` config needed, always on:

```markdown title="Example" linenums="1"
| Feature      | Community | Enterprise |
| ------------ | :-------: | ---------: |
| Themes       |    10     |         10 |
| Multi-locale |    Yes    |        Yes |
| Support      |  Forums   |     24/7   |
```

Which renders as:

| Feature      | Community | Enterprise |
| ------------ | :-------: | ---------: |
| Themes       |    10     |         10 |
| Multi-locale |    Yes    |        Yes |
| Support      |  Forums   |     24/7   |

A row of `---` under the header turns the table on; put colons on that
separator row to control alignment per column - `:---` left, `:---:`
center, `---:` right (no colons at all defaults every column to left).

## Cell content is regular inline markdown

`code`, **bold**, *italic*, and [links](../index.md) all work inside a
cell exactly the way they do anywhere else on the page:

```markdown title="Example" linenums="1"
| Setting | Value |
| --- | --- |
| Default theme | `bootstrap` |
| Docs | [Themes guide](themes.md) |
| Status | **Stable** |
```

Which renders as:

| Setting | Value |
| --- | --- |
| Default theme | `bootstrap` |
| Docs | [Themes guide](themes.md) |
| Status | **Stable** |

## Escaping a pipe inside a cell

A literal `|` inside a cell's own plain text needs a backslash, `\|` - an
unescaped one is read as the next column's separator instead:

```markdown title="Example" linenums="1"
| Expression | Meaning |
| --- | --- |
| a \| b | bitwise OR |
```

Which renders as:

| Expression | Meaning |
| --- | --- |
| a \| b | bitwise OR |

A `|` inside inline code doesn't need escaping at all - the code span
(`` `a | b` ``) already protects it:

| Expression | Meaning |
| --- | --- |
| `a | b` | bitwise OR |

## Short and long rows

A data row doesn't have to match the header's column count exactly - a
short row is padded out with empty cells, and a long row has its extra
cells silently dropped, both controlled by `tableOptions.appendMissingColumns`/`discardExtraColumns` below:

```markdown title="Example" linenums="1"
| One | Two | Three |
| --- | --- | --- |
| a | b |
| c | d | e | f |
```

Which renders as:

| One | Two | Three |
| --- | --- | --- |
| a | b |
| c | d | e | f |

## Configuring parsing

Short/long row handling, the `---` separator row's own strictness, and
the CSS class every `<table>` renders with are all controlled by
`bxsites.yaml`'s [`markdown.tableOptions`](../configuration.md#markdown);
the defaults shown throughout this page are almost always what you want.

## Responsive scroll and a sticky header

Every rendered table is automatically wrapped in a `.bxsites-table-wrap`
div - no `bxsites.yaml` config, no extra markdown. It gives a wide table
its own horizontal scrollbar instead of overflowing the page, and caps
tall tables (past a `max-height`) at a fixed height with their own
vertical scrollbar, header row pinned in place while the body scrolls
underneath - a short table like the ones above never grows a scrollbar
at all, since it already fits. A custom `theme/` override can restyle
`.bxsites-table-wrap` (its `max-height`, in particular) like any other
CSS class.

## Beyond plain data

Two more recipes build directly on top of a plain table like the ones
above:

- Need a status chip or a star rating in a cell? See [Visualizer
  recipes](variables-and-functions.md#visualizer-recipes).
- Need a reader to actually sort or filter a table client-side, rather
  than just read it? See [A sortable, filterable
  table](interactivity.md#a-sortable-filterable-table).
