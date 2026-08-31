---
title: Blog, Versioning & i18n
summary: A by-convention blog, snapshotting a release's docs, and translating into other languages.
icon: phosphor-duotone:globe
tags: [course]
---

# Blog, Versioning & i18n

Three site-structure features, each opt-in by convention - a folder
appearing is the whole config.

## Blog

Drop Markdown posts under `docs/blog/posts/` and bx-sites builds the
rest: post pages, an index, author pages, category pages, yearly
archives, an RSS feed, and reading-time/word-count stats - all from
frontmatter (`date`, `authors`, `categories`) you're already used to
writing.

## Versioning

Once a real release is cut, `docs/versions/<name>/` snapshots that
version's docs - readers get a version switcher for free, and
`versions.default` in `bxsites.yaml` names which snapshot publishes at
the site root instead of whatever's currently being written toward the
next release (exactly what this project itself does - you're reading
docs from inside its own pre-1.0 `/next/` tree right now, or its default
version, depending on when you're reading this).

## Internationalization (i18n)

`docs/i18n/<locale>/` mirrors your `docs/` tree, translated - a language
switcher appears automatically once a second locale exists. Untranslated
pages fall back to the default locale rather than 404ing, so a partial
translation is never a broken one.

Full detail on each: [Blog](../guides/blog.md),
[Versioning](../guides/versioning.md),
[Internationalization](../guides/i18n.md).
