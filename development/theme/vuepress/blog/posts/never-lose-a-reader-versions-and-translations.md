---
title: "Never Lose a Reader: Versions and Translations"
date: 2026-08-04
authors: [lmajano]
categories: [Versioning & i18n]
tags: [versioning, i18n, localization, translations]
summary: A reader landing on the wrong version, or bouncing off an English-only page, is a reader you just lost - versions and locales in BxSites are both pure convention over configuration.
description: How BxSites' by-convention docs/versions/ and docs/i18n/ folders power an automatic version switcher and language switcher, and how the two compose.
image: assets/blog/never-lose-a-reader-versions-and-translations-cover.svg
---

Two of the fastest ways to lose a documentation reader: they land on docs for the wrong version of your software, or they land on a page in a language they don't read well and there's no obvious way out. BxSites handles both the same way it handles most things - a folder convention, no config flag to remember to flip.

<!-- more -->

## Versioning: `docs/versions/`

There's no config key for this - just add a `docs/versions/` folder, and every direct subfolder inside it becomes its own fully self-contained doc tree, built alongside your regular `docs/` (which always builds as "Latest"):

```text title="docs/ with versions"
docs/
├── index.md
├── guides/
└── versions/
    ├── 1.0/
    │   ├── index.md
    │   └── guides/
    └── 2.0/
        ├── index.md
        └── guides/
```

Each version folder is a normal `docs/`-shaped tree, built into `site/versions/<name>/` with every internal link prefixed accordingly, sharing your project's single config and theme. Version names sort newest-first *numerically* rather than alphabetically, so `2.0` correctly sorts before `10.0`. Once more than one version exists, every theme renders a version-switcher dropdown in the header automatically - nothing to opt into. `sitemap.xml` and `llms.txt` include every version's pages alongside the main site's.

## Translations: `docs/i18n/`

Translated content lives in `docs/i18n/<code>/`, mirroring your regular `docs/` tree page-for-page:

```text title="docs/ with translations"
docs/
├── index.md
├── guides/
│   └── setup.md
└── i18n/
    ├── es/
    │   ├── index.md
    │   └── guides/
    │       └── setup.md
    └── ar/
        └── index.md
```

`<code>` becomes both the folder name and the built URL prefix (`docs/i18n/es/guides/setup.md` → `/es/guides/setup/`). Give each locale a display label - and, for a right-to-left language, its own direction - in your config:

```yaml title="bxsites.yaml" linenums="1"
i18n:
  locales:
    - { code: es, label: Español }
    - { code: ar, label: العربية, dir: rtl }
```

Every `docs/i18n/<code>/` folder builds automatically once it exists - `locales` only supplies display metadata, it isn't what turns the feature on.

The detail I like most: a locale doesn't need every page translated before it's usable. A page missing from `docs/i18n/es/` still builds at its expected URL, showing the default locale's content with a small "not yet translated" notice at the top. Nothing 404s, nothing looks half-built mid-translation, and the language switcher always lands you on the *same page* in the target locale, translated or not - never that locale's homepage.

## Where they compose

Put a `docs/versions/<name>/i18n/<code>/` folder next to a version's own pages, mirroring that version's own structure the same way top-level `docs/i18n/<code>/` mirrors `docs/` itself. That builds `site/versions/2.0/es/`. A version's own default-locale pages get a language switcher listing only the locales *that version itself* has translations for - switching version always drops back to that version's own default locale, and switching locale always stays on the current version.

## What's genuinely still English-only

Worth setting expectations here: theme chrome - "Edit this page," "Last updated," the search placeholder - isn't translated per locale yet, only your actual page content is. And there's no machine-translation step; every `docs/i18n/<code>/` file is authored by hand like any other page.

If your project is only single-version and single-language today, none of this costs you anything - both features are entirely opt-in by folder existence. But the day you cut a 2.0, or a translator offers to localize your Getting Started guide (see [Get Your Docs Live in 10 Minutes](get-your-docs-live-in-10-minutes.md)), the switcher is already there waiting.

Are you running multiple versions, multiple locales, or both - and which came first for your project?
