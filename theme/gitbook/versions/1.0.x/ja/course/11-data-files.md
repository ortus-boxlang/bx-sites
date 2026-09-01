---
title: Data Files
summary: Reusable structured data - a team roster, a pricing table - reachable from every page.
icon: phosphor-duotone:database
tags: [course]
---

# Data Files

Reusable variables (last lesson) are great for a flat, one-off fact -
awkward for anything with real shape, like a team roster or a pricing
table. Data files fill that gap.

Drop a `docs/data/*.yaml` file in your project - its whole content
becomes reachable as `data.<file>`:

```yaml title="docs/data/team.yaml"
- name: Luis Majano
  role: CEO
- name: Jon Clausen
  role: CTO
```

```markdown title="Anywhere in docs/"
{{ data.team[1].name }} is our {{ data.team[1].role }}.
```

A file's parsed root can be an object *or* an array, used exactly as
parsed - no fixed shape to conform to. This is also exactly what powers
the course you're reading right now: every lesson's title, order, and
link in the numbered index a few pages back came from
`docs/data/courses.yaml`, not hand-written HTML.

## Consuming data

A scalar `{{ data.x.y }}` reference works anywhere. For looping over
data - a team grid, a pricing table - there are three paths, covered in
the next lesson and beyond: a magic function looping it with real
BoxLang, a `::: for` block straight in Markdown, or feeding it to Alpine
for a client-side interactive version.

Full reference, including scope (loaded once, project-wide) and error
handling: [Data Files](../guides/data-files.md).
