---
title: Markdown Extensions
summary: Admonitions, content tabs, code annotations, and diagrams - on top of standard Markdown.
icon: phosphor-duotone:markdown-logo
tags: [course]
---

# Markdown Extensions

Standard Markdown covers headings, lists, links, and code fences. On top
of that, bx-sites turns on a handful of extensions - some by default, a
couple opt-in - that get you a lot further before you'd ever reach for a
content block (next lesson).

## Admonitions

A callout box, on by default:

```markdown title="Example"
!!! tip "Heads up"
    This is an admonition. Its content is regular Markdown.
```

!!! tip "Heads up"
    This is an admonition. Its content is regular Markdown.

Twelve types are built in (`note`, `warning`, `danger`, `success`, and
more), each with its own color. Prefix with `???` instead of `!!!` for a
collapsible version.

## Content tabs

Group alternative content - different languages, different platforms -
behind clickable tabs:

```markdown title="Example"
=== "macOS"
    `brew install ...`

=== "Windows"
    Download the installer.
```

You've already seen this exact syntax in [lesson 2](02-installation.md)'s
platform-specific install commands.

## Code block annotations

Fenced code already syntax-highlights automatically; add `linenums`,
`hl_lines`, or `title` to a fence's info string for line numbers, a
highlighted range, or a small title bar - every example in this course
uses `title`.

## Diagrams and math

Opt in via `bxsites.yaml`: `mermaid: true` renders fenced ` ```mermaid `
blocks as live flowcharts/sequence diagrams; `math: true` typesets
`$...$`/`$$...$$` with KaTeX.

## Footnotes and definition lists

Both off by default, both one config flag away
(`markdown.enableFootnotes`/`enableDefinitionLists`) - reference-style
footnotes and `Term\n:   Definition` lists, respectively.

Full syntax and every config flag: [Markdown Extensions](../guides/markdown.md).
