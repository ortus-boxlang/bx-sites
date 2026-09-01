---
title: Images & Icons
summary: Automatic responsive image variants, and icons from eight bundled libraries.
icon: phosphor-duotone:image
tags: [course]
---

# Images & Icons

## Responsive images

A plain Markdown image needs nothing special:

```markdown title="Example"
![A screenshot of the dashboard](assets/dashboard.png)
```

On by default, every local image referenced this way gets resized into
several width variants and a WebP alternative at build time, wired up
via a real `srcset` - the browser picks the right size for its own
viewport, automatically. No config, no separate image pipeline to run.

Captions, alignment, and framing are plain block-level HTML - no
bx-sites-specific syntax needed:

```html title="Example"
<figure>
  <img src="assets/dashboard.png" alt="Dashboard screenshot">
  <figcaption>The dashboard, mid-redesign.</figcaption>
</figure>
```

## Icons

Reference an icon on any page (via frontmatter `icon:`) or nav entry as
a plain emoji, or a named icon from one of eight bundled libraries:

```yaml title="Frontmatter"
icon: 🚀
# or
icon: phosphor-duotone:rocket-launch
```

Every icon in this course's own frontmatter (`icon: phosphor-duotone:...`)
uses this exact syntax - check any lesson's own source. A project can
also register its own custom icon set alongside the bundled ones.

Full detail on variant generation, `assets.images` config, and the full
icon library list: [Responsive Images](../guides/images.md) and
[Icons](../guides/icons.md).
