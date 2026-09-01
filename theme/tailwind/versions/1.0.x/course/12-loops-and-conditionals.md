---
title: Loops & Conditionals
summary: ::: for and ::: if - looping and branching over data, straight in Markdown.
icon: phosphor-duotone:arrows-clockwise
tags: [course]
---

# Loops & Conditionals

For a loop or a simple truthy check that doesn't need a magic function
at all, `::: for`/`::: if` work straight from Markdown - deliberately
narrow, the same dotted-path philosophy `{{ }}` itself uses:

```markdown title="Example"
::: for member, idx in data.team
{{ idx }}. **{{ member.name }}** - {{ member.role }}
:::
```

`::: for <item>, <index> in <path>` binds using BoxLang's own native
two-variable `for` semantics - item + index for an array, key + value
for a struct, the identical syntax either way.

## Conditionals, with real branching

```markdown title="Example"
::: if data.flags.darkModeDefault
Dark mode is on by default.
::: elseif data.flags.betaBanner
Beta features are enabled.
::: else
Nothing special about this build.
:::
```

The first truthy branch wins; a later branch's own condition is never
even resolved until its own turn comes - a typo'd path only breaks the
build once that branch is actually reached. One trailing `:::` closes
the whole chain, no `:::` needed before each `elseif`/`else`.

Both bodies can nest anything else you've met so far - another
`::: for`, an `::: if`, even a `::: card`.

## Why not just compile Markdown as BoxLang?

A deliberate, considered "no" - keeping Markdown inert-until-`{{ }}`-
substituted is what keeps `docs/**.md` safe for less-trusted
contributors to edit, and keeps a typo a forgiving build error instead
of a hard compile failure. The full reasoning is worth reading once:
[Data Files: Why data files, not BoxLang templates?](../guides/data-files.md#why-data-files-not-boxlang-templates-in-markdown)

Full grammar and error handling:
[Content Blocks: Loop and conditional](../guides/content-blocks.md#loop-and-conditional-data-driven).
