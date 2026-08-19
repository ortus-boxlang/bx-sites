---
title: Markdown Extensions
order: 4
tags: [guides, markdown]
---

# Markdown Extensions

Beyond standard Markdown, BX Docs turns on three of bx-markdown's native
Flexmark extensions by default - admonitions, footnotes and definition lists
- plus a Mermaid diagram integration of its own. All four are configurable
via [`bxdocs.json`'s `markdown`/`mermaid` keys](../configuration.md#markdown).

On top of those, BX Docs implements three more extensions of its own that
Flexmark has no concept of at all - content tabs, math, and fenced-code
`hl_lines`/`linenums`/`title` annotations. Since bx-docs can't fork
bx-markdown's parser, each one works as a pre/post-processing pass around
the normal markdown conversion instead - see the sections below.

## Admonitions

A callout/note box - on by default, no `bxdocs.json` config needed:

```markdown
!!! note "Heads Up"
    This is an admonition. Its content is regular markdown - **bold**,
    `code`, [links](../index.md) and lists all work exactly as normal.
```

Which renders as:

!!! note "Heads Up"
    This is an admonition. Its content is regular markdown - **bold**,
    `code`, [links](../index.md) and lists all work exactly as normal.

The type (`note` above) becomes the box's icon/color and, if you don't give
an explicit `"Title"`, its own capitalized name is used instead. Many
common synonyms resolve to the same 12 canonical types, each with its own
accent color:

!!! note "note"
    Blue - also the fallback for any type not in this list.

!!! abstract "abstract / summary / tldr"
    Light blue.

!!! info "info / todo"
    Cyan.

!!! tip "tip / hint / important"
    Teal.

!!! success "success / check / done"
    Green.

!!! faq "question / help / faq"
    Lime.

!!! warning "warning / caution / attention"
    Orange.

!!! fail "failure / fail / missing"
    Light red.

!!! danger "danger / error"
    Red.

!!! bug "bug"
    Pink.

!!! example "example"
    Purple.

!!! quote "quote / cite"
    Gray.

The body must stay indented by 4 spaces (or a tab); the block ends at the
first non-indented, non-blank line. Blank lines are fine *inside* the block
- they just start a new paragraph, same as anywhere else in markdown.

### Collapsible admonitions

Prefix the type with `???` instead of `!!!` to make the block collapsible -
`???` starts collapsed, `???+` starts open. Either way the heading is
clickable to toggle it:

```markdown
??? tip "Click to expand"
    This starts collapsed.

???+ tip "Click to collapse"
    This starts open.
```

??? tip "Click to expand"
    This starts collapsed.

???+ tip "Click to collapse"
    This starts open.

Turn admonitions off entirely with `{"markdown":{"enableAdmonition":false}}`.

## Footnotes

Reference a footnote inline with `[^label]` and define its text anywhere in
the document with `[^label]: text`:

```markdown
Here's a claim that needs backing up[^1].

[^1]: Here's the backup.
```

Here's a claim that needs backing up[^1].

[^1]: Here's the backup.

Footnote definitions are collected and rendered as a numbered list at the
bottom of the page regardless of where in the source they're written. Off by
default - turn it on with `{"markdown":{"enableFootnotes":true}}`.

## Definition Lists

A term line followed by one or more `:   ` description lines becomes a
`<dl>`:

```markdown
Term
:   Its definition.

Second term
:   First definition.
:   Second definition.
```

Term
:   Its definition.

Second term
:   First definition.
:   Second definition.

Off by default - turn it on with `{"markdown":{"enableDefinitionLists":true}}`.

## Content Tabs

Group alternative content - different languages, different platforms -
behind a set of clickable tabs with `=== "Title"`, indented the same way an
admonition body is (4 spaces or a tab):

```markdown
=== "Java"
    ```java
    System.out.println( "Hi" );
    ```

=== "BoxLang"
    ```bx
    println( "Hi" )
    ```
```

Which renders as:

=== "Java"
    ```java
    System.out.println( "Hi" );
    ```

=== "BoxLang"
    ```bx
    println( "Hi" )
    ```

Consecutive `=== "..."` blocks (separated by at most one blank line) form a
single tab group; a tab's own content is full markdown, so code fences,
lists, admonitions, whatever you'd write anywhere else. No `bxdocs.json`
config needed - always on.

## Code Blocks

Fenced code blocks are syntax-highlighted client-side (highlight.js), no
config needed - the language identifier after the opening ` ``` ` selects
the grammar, e.g. ` ```json `. On top of highlight.js's own bundled
languages, BX Docs registers its own lightweight BoxLang grammar under
`bx`/`boxlang`/`bxs`/`bxm`/`cfscript`:

```bx
class {

	numeric function add( required numeric a, required numeric b ) {
		var result = a + b
		var message = "The sum is #result#"
		return result
	}

}
```

### Line numbers, highlighted lines, and titles

Add `linenums`, `hl_lines` and/or `title` to a fence's info string - any
combination, all optional:

````markdown
```bx hl_lines="2" linenums="1" title="add.bx"
numeric function add( required numeric a, required numeric b ) {
	return a + b
}
```
````

Which renders as:

```bx hl_lines="2" linenums="1" title="add.bx"
numeric function add( required numeric a, required numeric b ) {
	return a + b
}
```

`linenums="N"` starts the gutter counting at `N`; `hl_lines` takes
space-separated line numbers and/or ranges (`"2 4-6"`) to highlight, counted
from the top of the block regardless of where `linenums` starts; `title`
adds a small title bar above the block. No `bxdocs.json` config needed -
always available.

## Diagrams

Opt-in via `bxdocs.json`'s [`mermaid`](../configuration.md#mermaid) key:

```json
{ "mermaid": true }
```

Once enabled, any ` ```mermaid ` fenced code block renders as a live
[Mermaid](https://mermaid.js.org/) diagram instead of a code listing:

```mermaid
flowchart LR
    A[docs/*.md] --> B[bx-markdown]
    B --> C[Theme]
    C --> D[site/*.html]
```

Mermaid supports flowcharts, sequence diagrams, class diagrams, Gantt
charts and more - see [Mermaid's own syntax reference](https://mermaid.js.org/intro/syntax-reference.html)
for everything it can draw.

## Math

Opt-in via `bxdocs.json`'s [`math`](../configuration.md#math) key:

```json
{ "math": true }
```

Once enabled, [KaTeX](https://katex.org/) typesets `$...$` for inline math
and `$$...$$` for a centered block, both written straight into the markdown
body:

```markdown
Euler's identity, $e^{i\pi} + 1 = 0$, relates five constants in one line.

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$
```

Euler's identity, $e^{i\pi} + 1 = 0$, relates five constants in one line.

$$
\int_0^1 x^2 \, dx = \frac{1}{3}
$$

A `$` immediately followed or preceded by whitespace is left alone (so
"$5 and $10" isn't misread as a formula) - typeset math always sits flush
against both delimiters.

## Plugin extensions

Admonitions, footnotes and definition lists cover the common cases, but
bx-markdown itself has no opinion beyond those three - any other Flexmark
extension can be registered directly against it with `markdownRegisterExtension()`,
independent of BX Docs. See bx-markdown's own readme for details.
