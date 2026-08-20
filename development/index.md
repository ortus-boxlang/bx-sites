---
title: Home
order: 1
icon: phosphor-duotone:house
summary: Point BX Docs at a docs/ folder. Get a fast, themeable, static site out - complete with search, i18n, and a markdown toolkit built for real documentation.
toc: false
---

<div class="bxdocs-hero">
	<img class="bxdocs-hero__banner" src="assets/home-banner.jpg" alt="BX Docs - Write. Build. Publish Beautiful Docs. The official documentation engine for BoxLang. Markdown Powered, Beautiful Themes, Blazing Fast Search, Developer Focused.">
	<div class="bxdocs-hero__actions">
		<a class="bxdocs-hero__btn bxdocs-hero__btn--primary" href="getting-started.md">Get Started</a>
		<a class="bxdocs-hero__btn bxdocs-hero__btn--secondary" href="https://github.com/ortus-boxlang/bx-docs">View on GitHub</a>
	</div>
</div>

This very site is built by BX Docs, from the Markdown files in this
repository's own `docs/` folder.

::: cards
::: card title="Markdown in, static HTML out" icon="phosphor-duotone:file-html"
Point it at a `docs/` folder and it renders a complete site into `site/` -
no server required to host it.
:::
::: card title="Folder structure is nav structure" icon="phosphor-duotone:tree-structure"
Nest folders and files under `docs/` and the navigation builds itself, in
the order you set via frontmatter.
:::
::: card title="Three built-in themes" icon="phosphor-duotone:palette" href="guides/themes.md"
`bootstrap`, `material` and `tailwind` - all sharing the same BoxLang brand
palette, and all overridable with your own theme.
:::
::: card title="Static, client-side search" icon="phosphor-duotone:magnifying-glass" href="guides/search.md"
A lunr.js-powered search box, wired against a search index built at
`build` time - no server dependency.
:::
::: card title="A real plugin system" icon="phosphor-duotone:puzzle-piece" href="guides/plugins.md"
A plugin is just another installed BoxLang module - no separate plugin API
to learn.
:::
::: card title="Migrate straight from GitBook" icon="phosphor-duotone:swap" href="guides/migrating-from-gitbook.md"
`bxDocs migrate --source=...` converts a GitBook export into a working
bx-docs project in one command.
:::
:::

## See it, don't just read about it

BX Docs' own Markdown toolkit, in action right here on the homepage - not a
screenshot, the real thing:

::: stepper
::: step "Install"
`install-bx-module bx-docs`
:::
::: step "Scaffold"
`boxlang module:bxDocs new`
:::
::: step "Build & serve"
`boxlang module:bxDocs serve`
:::
:::

::: columns
::: column
!!! tip "Callouts for every occasion"
    Twelve canonical admonition types - `note`, `tip`, `warning`, `danger`
    and more - each with its own accent color, plus a `???` collapsible
    variant. See [Markdown Extensions](guides/markdown.md#admonitions).
:::
::: column
!!! faq "Content tabs, math, diagrams"
    Grouped code tabs, KaTeX math, Mermaid diagrams, footnotes and
    definition lists all ship out of the box - see
    [Markdown Extensions](guides/markdown.md).
:::
:::

## Where to go next

::: cards
::: card title="Getting Started" icon="phosphor-duotone:rocket-launch" href="getting-started.md"
Install, scaffold a project, and build and serve it.
:::
::: card title="CLI Reference" icon="phosphor-duotone:terminal-window" href="cli-reference.md"
Every verb and its options.
:::
::: card title="Configuration" icon="phosphor-duotone:gear-six" href="configuration.md"
The full `bxdocs.json` reference.
:::
::: card title="Markdown Extensions" icon="phosphor-duotone:markdown-logo" href="guides/markdown.md"
Admonitions, tabs, cards, callouts, math and Mermaid diagrams.
:::
::: card title="Deploying to GitHub Pages" icon="phosphor-duotone:cloud-arrow-up" href="guides/deployment.md"
The built-in GitHub Actions workflow.
:::
::: card title="Releases" icon="phosphor-duotone:tag" href="releases/index.md"
Versioning policy and what's new per release.
:::
:::
