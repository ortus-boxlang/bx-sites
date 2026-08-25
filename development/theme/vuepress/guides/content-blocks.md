---
title: Content Blocks
order: 4.5
icon: phosphor-duotone:squares-four
tags: [guides, markdown, gitbook]
---

# Content Blocks

On top of everything in [Markdown Extensions](markdown.md), BxSites
supports a family of GitBook-style content blocks - handy on its own,
and the reason a GitBook site's content is straightforward to migrate:
each of these maps directly to a GitBook block of the same name. Every
one uses the same `::: name ... :::` container syntax (a bare `:::` on
its own line closes whichever block is currently open) - no
`bxsites.yaml` config needed, always available. A block can nest inside
another (an expandable containing a cards group, for instance) - each
is scanned again for further blocks inside its own content.

## Expandable

A plain collapsible section - no callout icon/color, unlike a
collapsible admonition (`???`, see
[Admonitions](markdown.md#collapsible-admonitions)):

```markdown title="Example" linenums="1"
::: expandable "Is this different from a collapsible admonition?"
Yes - this has no type/icon/color, just a plain expand/collapse section.
Add `open="true"` to start it expanded.
:::
```

::: expandable "Is this different from a collapsible admonition?"
Yes - this has no type/icon/color, just a plain expand/collapse section.
Add `open="true"` to start it expanded.
:::

## Cards

A grid of link cards, each its own `::: card` inside a `::: cards`
wrapper - `title`, `icon`, `image` and `href` are all optional (a card
with no `href` renders as a plain, non-clickable card). `icon` is resolved
the same way frontmatter/nav `icon` values are - a plain emoji, or a named
icon from a bundled library (`icon="phosphor-duotone:rocket-launch"`,
`icon="lucide:rocket"`, ...) - see [Icons](icons.md):

```markdown title="Example" linenums="1"
::: cards
::: card title="Getting Started" icon="phosphor-duotone:rocket-launch" href="../getting-started.md"
Install, scaffold and build your first site.
:::
::: card title="Themes" icon="phosphor-duotone:palette" href="themes.md"
Customize a built-in theme or write your own.
:::
:::
```

::: cards
::: card title="Getting Started" icon="phosphor-duotone:rocket-launch" href="../getting-started.md"
Install, scaffold and build your first site.
:::
::: card title="Themes" icon="phosphor-duotone:palette" href="themes.md"
Customize a built-in theme or write your own.
:::
:::

## Columns

A side-by-side layout - `::: column` accepts an optional `width` (a plain
CSS length/percentage, e.g. `"40%"`); columns with no explicit width
share the row equally:

```markdown title="Example" linenums="1"
::: columns
::: column width="60%"
The wider column.
:::
::: column
The narrower one.
:::
:::
```

::: columns
::: column width="60%"
The wider column.
:::
::: column
The narrower one.
:::
:::

## Stepper

A numbered, connected sequence of steps:

```markdown title="Example" linenums="1"
::: stepper
::: step "Install"
`install-bx-module bx-sites`
:::
::: step "Scaffold"
`bxSites new`
:::
:::
```

::: stepper
::: step "Install"
`install-bx-module bx-sites`
:::
::: step "Scaffold"
`bxSites new`
:::
:::

A step's own optional `color` attribute flags its marker with one of four
semantic colors - the default (no `color`), `success`, `warning` or
`danger` - independent of the step's position in the sequence:

```markdown title="Example" linenums="1"
::: stepper
::: step "Back up your data" color="success"
Routine, safe to run any time.
:::
::: step "Optional: enable telemetry" color="warning"
Skip this one if you're not sure.
:::
::: step "Delete the old install" color="danger"
Irreversible - make sure the backup above finished first.
:::
:::
```

::: stepper
::: step "Back up your data" color="success"
Routine, safe to run any time.
:::
::: step "Optional: enable telemetry" color="warning"
Skip this one if you're not sure.
:::
::: step "Delete the old install" color="danger"
Irreversible - make sure the backup above finished first.
:::
:::

The numbered marker, connecting line, and each of the three `color`
palettes above are themeable independently of the rest of the site's
palette, via CSS custom properties - see [Customizing colors](themes.md#customizing-colors-without-a-theme-override).

## File

A download card for a PDF, video, or any other project asset - `src` is
resolved the same way `theme.logo`/frontmatter `ogImage` already are
(relative to `docs/assets/`):

```markdown title="Example" linenums="1"
::: file src="assets/spec.pdf" title="API Specification"
:::
```

::: file src="assets/og-image.png" title="Site Preview Image"
:::

## Embed

A responsive iframe embed for a recognized provider - currently YouTube,
Vimeo, CodePen, Spotify, Loom and Figma. A URL from anywhere else falls
back to a plain "visit ↗" link card instead of an iframe that would just
refuse to render (most sites block being framed):

```markdown title="Example" linenums="1"
::: embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="A demo"
:::
```

::: embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="A demo"
:::

## Page link

A rich preview card linking to another page - `href` follows the same
file-relative convention as an ordinary [page link](../getting-started.md#linking-between-pages).
Unlike a card, its title/icon/summary are pulled automatically from the
target page's own frontmatter, so it stays in sync if that page is
renamed or its summary changes:

```markdown title="Example" linenums="1"
::: page-link href="../getting-started.md"
:::
```

::: page-link href="../getting-started.md"
:::

## Link preview

A rich preview card for an *external* URL - the same card shape as
`::: page-link`, but for a link that isn't one of this site's own pages, so
there's no page to pull a title/summary from automatically. Every field
comes from the directive's own attributes: only `url` is required, `title`
falls back to the bare URL when omitted, and `description`/`image` are both
optional. There's no build-time fetch of the target URL to auto-fill these
- the same reasoning that keeps [`check`](../cli-reference.md#check) internal-links-only
applies here too, so a slow or unreachable third-party site never affects
build time:

```markdown title="Example" linenums="1"
::: link-preview url="https://boxlang.io" title="BoxLang" description="A dynamic, multi-paradigm JVM language." image="https://boxlang.io/og.png"
:::
```

::: link-preview url="https://boxlang.io" title="BoxLang" description="A dynamic, multi-paradigm JVM language." image="https://boxlang.io/og.png"
:::

## Prompt

A styled container for a reusable AI prompt - bx-sites' own equivalent of
GitBook's [Prompt block](https://gitbook.com/docs/create-content/blocks/prompt).
The block's body *is* the prompt text, written as ordinary Markdown (so
headings, lists, and code inside it still get their own formatting); every
prompt gets a "Copy" button that copies that exact source text, formatting
markup included, ready to paste into whatever AI tool you're using it with.
`description` (an optional one-line summary) and `icon` (resolved the same
way `::: card`'s own `icon` is - defaults to a sparkle glyph when omitted)
are both optional:

```markdown title="Example" linenums="1"
::: prompt description="Summarizes a pull request for a changelog entry" icon="phosphor-duotone:git-pull-request"
Summarize the following pull request diff as a single changelog entry,
written for an end user rather than a developer. Group related changes
together and skip anything purely internal (refactors, tests, CI).
:::
```

::: prompt description="Summarizes a pull request for a changelog entry" icon="phosphor-duotone:git-pull-request"
Summarize the following pull request diff as a single changelog entry,
written for an end user rather than a developer. Group related changes
together and skip anything purely internal (refactors, tests, CI).
:::

Add `expanded="preview"` to clamp a long prompt to a short, fade-out
preview until the reader clicks "Show more", or `expanded="hidden"` to
start it fully collapsed behind a "Show prompt" button - handy for a page
that lists several prompts back to back. Omit `expanded` (or set it to
`"full"`, the default) to always show the whole prompt:

```markdown title="Example" linenums="1"
::: prompt description="A longer, multi-step prompt" expanded="preview"
1. Read the attached error log line by line.
2. For each stack trace, identify the failing module.
3. Group failures by root cause, not by timestamp.
4. Propose one fix per root cause, not per failure.
5. Skip anything that already has an open issue - list those separately.
:::
```

::: prompt description="A longer, multi-step prompt" expanded="preview"
1. Read the attached error log line by line.
2. For each stack trace, identify the failing module.
3. Group failures by root cause, not by timestamp.
4. Propose one fix per root cause, not per failure.
5. Skip anything that already has an open issue - list those separately.
:::

Unlike GitBook's own Prompt block, there's no "Open in AI providers" menu
here - bx-sites never talks to a third-party AI provider, so that part of
GitBook's own block has no equivalent.

## Updates (changelog)

A dated, taggable changelog list - `::: update` accepts `date="YYYY-MM-DD"`
and an optional comma-separated `tags`:

```markdown title="Example" linenums="1"
::: updates
::: update date="2026-01-15" tags="feature,fix"
Added dark mode and fixed a footer alignment bug.
:::
::: update date="2026-01-01"
Initial release.
:::
:::
```

::: updates
::: update date="2026-01-15" tags="feature,fix"
Added dark mode and fixed a footer alignment bug.
:::
::: update date="2026-01-01"
Initial release.
:::
:::

A page with an `::: updates` block also gets its own `feed.xml` (RSS 2.0)
written alongside it once `bxsites.yaml`'s `baseURL` is a full URL - same
requirement as `sitemap.xml` - so readers can subscribe to just that
page's changelog.

## Reusable content (includes)

`::: include src="..."` splices another file's raw Markdown in at that
point. Unlike every block above, this becomes real page content
(headings, paragraphs, its own nested blocks), not something wrapped in
a widget - useful for a warning/notice repeated across several pages.
Put the partial itself under `docs/includes/` - the same reserved-folder
convention as `assets/`/`versions/`/`i18n/`/`blog/`. A file under
`includes/` is never built as its own page and never appears in
nav/search/sitemap/tags - it only exists to be spliced into other pages:

```text title="docs/ layout"
docs/
├── index.md
├── includes/
│   ├── beta-notice.md
│   └── legal/
│       └── terms.md
└── guides/
    └── deep/
        └── setup.md
```

A **bare** `src` (no leading `./` or `../`) always resolves against the
current tree's own `docs/includes/`, no matter how deeply nested the
including page is - `guides/deep/setup.md` above reaches the same file
`index.md` does, both with the exact same `src`:

```markdown title="From either index.md or guides/deep/setup.md"
::: include src="beta-notice.md"
```

A bare `src` can also point into a subfolder of `includes/` itself:

```markdown title="Example"
::: include src="legal/terms.md"
```

Prefix `src` with `./` or `../` instead to reach a page-adjacent
fragment that isn't meant to live in the centralized `includes/`
folder - that form resolves file-relative to the *including* page's own
directory, the same convention as an ordinary page link:

```markdown title="From guides/deep/setup.md, one level up instead of centralized"
::: include src="../local-note.md"
```

A version/locale tree gets its own `includes/` the same way - a page
under `docs/versions/2.0/` resolves a bare `src` against
`docs/versions/2.0/includes/`, and one under `docs/i18n/es/` against
`docs/i18n/es/includes/` - each tree's partials are its own, not shared
with the main tree's `docs/includes/`.

An included file can itself include another (a circular chain throws
`BxSites.CircularInclude` at build time rather than looping forever).

## Conditional content

Shows one of several variants of a block based on a reader's own choice -
"Free" vs. "Pro" instructions on the same page, say. This is a fully
static site with no visitor identity of any kind, so unlike a platform
with a real backend, there's no server-evaluated "who is this reader" -
the reader picks for themself, and their choice is simply remembered in
their own browser (`localStorage`) for every later page too:

```markdown title="Example" linenums="1"
::: audience-switcher key="plan" options="free:Free,pro:Pro"
:::

::: conditional key="plan" value="free"
The Free plan includes basic search.
:::

::: conditional key="plan" value="pro"
The Pro plan adds AI-assisted search and unlimited team seats.
:::
```

::: audience-switcher key="plan" options="free:Free,pro:Pro"
:::

::: conditional key="plan" value="free"
The Free plan includes basic search.
:::

::: conditional key="plan" value="pro"
The Pro plan adds AI-assisted search and unlimited team seats.
:::

`::: conditional key="..." value="..."` marks one variant; `key` is
whatever preference name you're switching on (`"plan"` above, but it
could just as well be `"os"`, `"language"`, anything), and `value` is the
one setting this particular block should show for. Every variant always
renders in the HTML - hidden client-side, never omitted - so a reader with
JavaScript disabled (or a search crawler) still sees every variant rather
than none.

`::: audience-switcher key="..." options="value:Label,value:Label,..."` is
an optional, ready-made control - one button per option, switching every
`::: conditional` block sharing that same `key` immediately, anywhere on
the page. You don't need it at all: a link ending in `?plan=pro` sets the
same preference automatically on load (handy for sharing a direct link to
"the Pro version of this page"), and a project's own theme override can
call `window.bxSitesSetPreference( key, value )` directly to drive it from
custom UI instead.
