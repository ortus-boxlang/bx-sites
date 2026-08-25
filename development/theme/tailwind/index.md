---
title: Home
order: 1
icon: phosphor-duotone:house
summary: Point BxSites at a docs/ folder. Get a fast, themeable static site out - documentation, a marketing site, a blog, or anything else Markdown can express - complete with search, i18n, and a markdown toolkit built for real content.
toc: false
---

<div class="bxsites-hero">
	<img class="bxsites-hero__banner" src="assets/home-banner.jpg" alt="BxSites - Write. Build. Publish Beautiful Docs. The official documentation engine for BoxLang. Markdown Powered, Beautiful Themes, Blazing Fast Search, Developer Focused.">
	<div class="bxsites-hero__actions">
		<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="getting-started.md">Get Started</a>
		<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="https://github.com/ortus-boxlang/bx-sites">View on GitHub</a>
	</div>
</div>

This very site is built by BxSites, from the Markdown files in this
repository's own `docs/` folder.

BxSites isn't only for reference documentation - it's a general-purpose
**static site generator**. A marketing site, a blog, a knowledge base, a
product site, a personal site: anything you can write in Markdown builds
the same way, through the same themes, search, and i18n.

::: cards
::: card title="Markdown in, static HTML out" icon="phosphor-duotone:file-html"
Point it at a `docs/` folder and it renders a complete site into `site/` -
no server required to host it.
:::
::: card title="Folder structure is nav structure" icon="phosphor-duotone:tree-structure"
Nest folders and files under `docs/` and the navigation builds itself, in
the order you set via frontmatter.
:::
::: card title="Ten built-in themes" icon="phosphor-duotone:palette" href="guides/themes.md"
A full gallery - `bootstrap`, `material`, `tailwind`, and seven more inspired
by Docsy, Stripe, Docusaurus, Just the Docs, VuePress, GitBook and Notion -
all overridable with your own theme.
:::
::: card title="Static, client-side search" icon="phosphor-duotone:magnifying-glass" href="guides/search.md"
A MiniSearch-powered search box (fuzzy matching, prefix search) wired
against a search index built at `build` time - no server dependency.
:::
::: card title="A blog, out of the box" icon="lucide:newspaper" href="guides/blog.md"
Drop posts under `docs/blog/posts/` and get authors, categories, year
archives, RSS feeds, and per-post featured images - zero config required.
:::
::: card title="Fast, air-gapped by default" icon="phosphor-duotone:wifi-slash" href="guides/themes.md#air-gapped-offline-sites"
Fingerprinted CSS/JS bundling and responsive images out of the box, plus
Bootstrap, highlight.js, Alpine.js, MiniSearch and (opt-in) Mermaid all
vendored - a built site needs zero outbound requests by default.
:::
::: card title="A real plugin system" icon="phosphor-duotone:puzzle-piece" href="guides/plugins.md"
A plugin is just another installed BoxLang module - no separate plugin API
to learn.
:::
::: card title="Plugins & themes, published on ForgeBox" icon="phosphor-duotone:package" href="guides/plugins.md#installing-a-published-plugin"
`install:plugin` and `install:theme` download a published package straight
into your project - browse `bxsites-plugins` and `bxsites-themes` on
ForgeBox.
:::
::: card title="Import an existing theme" icon="phosphor-duotone:arrows-left-right" href="guides/theme-import.md"
`theme:import --source=mkdocs|jekyll|hugo` converts another generator's own
theme templates into a bx-sites scaffold to build on, instead of starting
from scratch.
:::
::: card title="Migrate from GitBook or mkdocs" icon="phosphor-duotone:swap" href="guides/index.md"
`bxSites migrate --source=... --from=gitbook|mkdocs` converts an existing
GitBook export or mkdocs project into a working bx-sites project in one
command.
:::
:::

## See it, don't just read about it

BxSites' own Markdown toolkit, in action right here on the homepage - not a
screenshot, the real thing:

::: stepper
::: step "Install"
`install-bx-module bx-sites`
:::
::: step "Scaffold"
`bxSites new`
:::
::: step "Build & serve"
`bxSites serve`
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
The full `bxsites.yaml` reference.
:::
::: card title="Markdown Extensions" icon="phosphor-duotone:markdown-logo" href="guides/markdown.md"
Admonitions, tabs, cards, callouts, math and Mermaid diagrams.
:::
::: card title="Blog" icon="lucide:newspaper" href="guides/blog.md"
Posts, authors, categories, archives, RSS, drafts, and a stats page.
:::
::: card title="Responsive Images & Asset Pipeline" icon="phosphor-duotone:image" href="guides/images.md"
Automatic image resizing/WebP, and fingerprinted CSS/JS bundling.
:::
::: card title="Deploying to GitHub Pages" icon="phosphor-duotone:cloud-arrow-up" href="guides/deployment.md"
The built-in GitHub Actions workflow.
:::
::: card title="Releases" icon="phosphor-duotone:tag" href="releases/index.md"
Versioning policy and what's new per release.
:::
:::

## Need a hand building your site?

BxSites is free and open source - but if you'd rather have the team who
builds it do the work, [Ortus Solutions](https://www.ortussolutions.com)
offers professional services and consulting for documentation sites,
migrations, and any other static site built with BxSites.

<div class="bxsites-hero__actions">
	<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="mailto:consulting@ortussolutions.com">Email consulting@ortussolutions.com</a>
	<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="services.md">Consulting & Professional Services</a>
</div>
