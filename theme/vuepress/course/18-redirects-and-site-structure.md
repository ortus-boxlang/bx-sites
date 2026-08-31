---
title: Redirects & Site Structure
summary: Keep an old URL working after you move, rename, or restructure a page.
icon: phosphor-duotone:signpost
tags: [course]
---

# Redirects & Site Structure

Docs move. A page gets renamed, a guide gets split in two, a whole
section gets reorganized - and every link anyone ever shared to the old
URL should keep working.

`bxsites.yaml`'s `redirects` list maps an old path to its new one:

```yaml title="bxsites.yaml"
redirects:
  - from: /old-guide/
    to: /guides/new-guide/
```

Each redirect builds as a real static HTML page at the old URL with a
meta-refresh and canonical link to the new one - no server-side rewrite
rules needed, works on any static host.

## The `nav` you've been using all along

Since [lesson 4](04-content-organization.md), every example has used
inferred nav (folder structure -> sidebar). The same `nav.json`/`nav` key
that can override that entirely also groups content into named sections
- exactly how this course's own lessons stay out of the main sidebar
while still being fully linked and navigable through their own numbered
index and scoped prev/next pager.

Full redirect syntax and nav override reference:
[Redirects](../guides/redirects.md) and [`nav`](../configuration.md#nav).
