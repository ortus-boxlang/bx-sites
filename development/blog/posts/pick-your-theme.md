---
title: Pick Your Theme
date: 2026-07-14
authors: [lmajano]
categories: [Getting Started, Themes]
tags: [themes, bootstrap, material, tailwind, customization]
summary: Ten built-in themes, all sharing the same feature set, so picking one is about look and feel, not tradeoffs.
description: A tour of BX Sites' ten built-in themes - the original three plus a seven-theme gallery expansion - how to switch between them, and how to override or customize one without forking it.
image: assets/blog/pick-your-theme-cover.svg
---

**Update:** this post originally covered the three themes BX Sites launched with. The lineup has since grown into a full ten-theme gallery - the table and advice below now cover all ten.

One question I get a lot after someone runs `bxSites new` for the first time: "which theme should I actually pick?" The honest answer is that it barely matters at the feature level - all ten built-in themes ship the exact same set of capabilities. It's purely a question of which one matches your project's own visual identity.

<!-- more -->

## The ten built-in themes

| Theme | Base | Notes |
|---|---|---|
| `bootstrap` (default) | [Bootstrap 5](https://getbootstrap.com/), vendored | Poppins font, brand gradient navbar |
| `material` | Hand-rolled Material-style CSS | Card layout, elevation shadows, Roboto font |
| `tailwind` | [Tailwind Play CDN](https://tailwindcss.com/) | Utility-class driven, no build step |
| `docsy` | Hand-rolled CSS, forked from `material` | Read the Docs/Docsy-inspired navy-blue reference-manual look |
| `slate` | Hand-rolled CSS, forked from `material` | Stripe/Slate-inspired - a permanently dark sidebar regardless of light/dark mode |
| `docusaurus` | Hand-rolled CSS, forked from `material` | Docusaurus-inspired bold full-width colored navbar, rounded cards |
| `justthedocs` | Hand-rolled CSS, forked from `material` | Just the Docs-inspired minimalism - search box lives at the top of the sidebar |
| `vuepress` | Hand-rolled CSS, forked from `material` | VuePress-inspired green accent, soft rounded corners |
| `gitbook` | Hand-rolled CSS, forked from `material` | GitBook-inspired centered reading column, serif headings |
| `notion` | Hand-rolled CSS, forked from `material` | Notion-inspired borderless sidebar, near-grayscale UI, generous whitespace |

You can see all ten side by side, live, right now: this very docs site builds and deploys every one of them at once, with `bootstrap` at the root and the other nine one click away via the theme switcher next to the dark-mode toggle - see [Themes](../../guides/themes.md) for the full tour.

Every one of them ships with the same page furniture out of the box: an "On this page" table of contents generated from your `h2`/`h3` headings, breadcrumbs, prev/next links, syntax-highlighted code blocks with a copy button, a dark/light toggle that applies before first paint (no flash of the wrong theme), a version switcher once you have more than one version, and a language switcher once you have more than one locale. None of that is theme-specific - it's baked into the shared `ThemeProvider` contract every theme implements. The seven gallery themes are all forked from `material` - same BoxLang templates, only the CSS repainted - so they inherit that same full feature set for free.

## Switching themes

One line in your config:

```yaml title="bxsites.yaml"
theme: { name: material }
```

Rebuild (or let `bxSites serve` pick it up automatically) and you're done. There's no content migration involved because a theme only ever touches how `variables.page.contentHtml` gets laid out - your Markdown doesn't change at all.

## A note on offline/air-gapped sites

If your deployment target has genuinely zero internet access, stick with any theme except `tailwind` - that's the one exception in the lineup: its utility engine is a client-side JIT compiler loaded from `cdn.tailwindcss.com`, since it isn't a static stylesheet this module can vendor the same way. Every other theme, `bootstrap`/`material` and all seven gallery themes forked from `material`, vendors everything it needs - CSS/JS bundle, highlight.js, Alpine.js, and lunr.js for search - straight into `site/assets/vendor/` at build time.

## Customizing without forking

For a color or font tweak, you don't need to fork a whole theme. Every built-in theme reads its palette off a handful of CSS custom properties on `:root`:

```yaml title="bxsites.yaml"
extraCss: [ assets/brand.css ]
```

```css title="docs/assets/brand.css" linenums="1"
/* docs/assets/brand.css */
:root {
	--bxsites-gradient-start: #7C3AED;
	--bxsites-gradient-end: #DB2777;
	--bxsites-accent: #FBBF24;
}
```

`extraCss` loads after the theme's own stylesheet, so a same-specificity re-declaration wins without touching anything under `resources/themes/`.

## When you need real control

If you need to change actual markup - not just color - copy a built-in theme's `layout.bxm`/`page.bxm`/`assets/` into a project-level `theme/` folder. BX Sites always prefers a project `theme/` override over the built-in one, as long as it satisfies the two required files (`layout.bxm` and `page.bxm`). It's genuinely the same files the built-in themes ship, just sitting in your own project where you can edit them freely.

I still default new projects to `bootstrap` almost every time - it's a safe, familiar baseline - but `material`'s card layout is a great fit for API-reference-heavy docs, and I've reached for `tailwind` more than once on smaller marketing-adjacent sites where I wanted full utility-class control. Since the gallery grew, I've also been reaching for `slate` on anything that wants a permanently-dark sidebar without fighting the light/dark toggle, and `gitbook` when a project's tone is closer to a book than a reference manual.

Which theme did you land on for your own project, and did you end up touching `extraCss`, or a full `theme/` override?
