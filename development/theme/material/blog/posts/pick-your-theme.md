---
title: Pick Your Theme
date: 2026-07-14
authors: [lmajano]
categories: [Getting Started, Themes]
tags: [themes, bootstrap, material, tailwind, customization]
summary: Bootstrap, Material, or Tailwind - all three ship the same feature set, so picking one is about look and feel, not tradeoffs.
description: A tour of BX Docs' three built-in themes, how to switch between them, and how to override or customize one without forking it.
image: assets/blog/pick-your-theme-cover.svg
---

One question I get a lot after someone runs `bxDocs new` for the first time: "which theme should I actually pick?" The honest answer is that it barely matters at the feature level - all three built-in themes ship the exact same set of capabilities. It's purely a question of which one matches your project's own visual identity.

<!-- more -->

## The three built-in themes

| Theme | Base | Notes |
|---|---|---|
| `bootstrap` (default) | [Bootstrap 5](https://getbootstrap.com/), vendored | Poppins font, brand gradient navbar |
| `material` | Hand-rolled Material-style CSS | Card layout, elevation shadows, Roboto font |
| `tailwind` | [Tailwind Play CDN](https://tailwindcss.com/) | Utility-class driven, no build step |

Every one of them ships with the same page furniture out of the box: an "On this page" table of contents generated from your `h2`/`h3` headings, breadcrumbs, prev/next links, syntax-highlighted code blocks with a copy button, a dark/light toggle that applies before first paint (no flash of the wrong theme), a version switcher once you have more than one version, and a language switcher once you have more than one locale. None of that is theme-specific - it's baked into the shared `ThemeProvider` contract every theme implements.

## Switching themes

One line in your config:

```json title="bxdocs.json"
{ "theme": { "name": "material" } }
```

Rebuild (or let `bxDocs serve` pick it up automatically) and you're done. There's no content migration involved because a theme only ever touches how `variables.page.contentHtml` gets laid out - your Markdown doesn't change at all.

## A note on offline/air-gapped sites

If your deployment target has genuinely zero internet access, stick with `bootstrap` or `material`. Both vendor everything they need - Bootstrap's CSS/JS, highlight.js, Alpine.js, and lunr.js for search - straight into `site/assets/vendor/` at build time. `tailwind` is the one exception: its utility engine is a client-side JIT compiler loaded from `cdn.tailwindcss.com`, since it isn't a static stylesheet this module can vendor the same way.

## Customizing without forking

For a color or font tweak, you don't need to fork a whole theme. Every built-in theme reads its palette off a handful of CSS custom properties on `:root`:

```json title="bxdocs.json"
{ "extraCss": ["assets/brand.css"] }
```

```css title="docs/assets/brand.css" linenums="1"
/* docs/assets/brand.css */
:root {
	--bxdocs-gradient-start: #7C3AED;
	--bxdocs-gradient-end: #DB2777;
	--bxdocs-accent: #FBBF24;
}
```

`extraCss` loads after the theme's own stylesheet, so a same-specificity re-declaration wins without touching anything under `resources/themes/`.

## When you need real control

If you need to change actual markup - not just color - copy a built-in theme's `layout.bxm`/`page.bxm`/`assets/` into a project-level `theme/` folder. BX Docs always prefers a project `theme/` override over the built-in one, as long as it satisfies the two required files (`layout.bxm` and `page.bxm`). It's genuinely the same files the built-in themes ship, just sitting in your own project where you can edit them freely.

I still default new projects to `bootstrap` almost every time - it's a safe, familiar baseline - but `material`'s card layout is a great fit for API-reference-heavy docs, and I've reached for `tailwind` more than once on smaller marketing-adjacent sites where I wanted full utility-class control.

Which theme did you land on for your own project, and did you end up touching `extraCss`, or a full `theme/` override?
