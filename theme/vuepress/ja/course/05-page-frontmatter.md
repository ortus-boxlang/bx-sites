---
title: Page Frontmatter
summary: The small YAML block at the top of a page - title, order, tags, and more.
icon: phosphor-duotone:note-pencil
tags: [course]
---

# Page Frontmatter

Every page can start with a small frontmatter block - plain YAML,
fenced by `---`:

```markdown title="docs/guides/deployment.md" linenums="1"
---
title: Deployment
order: 2
tags: [guides, deployment]
icon: 🚀
summary: Everything you need to publish a built site.
---

# Deployment

Your content here.
```

None of it is required - a page with no frontmatter at all still
builds fine, using sensible fallbacks (title from the filename, order
from position, no tags). The fields worth knowing from day one:

- **`title`** - overrides the nav/page title (otherwise derived from the
  filename)
- **`order`** - controls sibling ordering in the nav; lower sorts first
- **`tags`** - rendered as clickable badges under the title, collected
  into a site-wide `/tags/` index; also boosts search relevance
- **`icon`** - a plain emoji, or a named icon from a bundled library -
  see [Icons](../guides/icons.md)
- **`summary`** - a one-line lead-in shown under the title (distinct
  from `description`, which is meta-tag-only)
- **`hidden`** - `true` excludes a page from the nav and search without
  excluding it from the build

## Frontmatter as data

Anything you put in frontmatter - including a custom field bx-sites
itself doesn't know about - is reachable in the page's own Markdown as
`{{ page.frontmatter.<key> }}`, and `title`/`summary`/etc. directly as
`{{ page.title }}`. You'll use this in [lesson 10](10-variables-and-magic-functions.md)
when magic functions come up.

Full field reference, including `description`/`ogImage`/`toc`, lives in
[Getting Started: Add pages](../getting-started.md#add-pages).
