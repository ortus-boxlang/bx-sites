---
title: Configuration
order: 4
icon: ⚙️
summary: Every bxdocs.json key, what it defaults to, and what it does.
tags: [reference, configuration]
---

# Configuration

Every project has one `bxdocs.json` at its root:

```json
{
	"name": "My Docs",
	"description": "",
	"baseURL": "/",
	"theme": {
		"name": "bootstrap",
		"options": {},
		"logo": "",
		"favicon": ""
	},
	"search": true,
	"nav": [],
	"markdown": { "enableAdmonition": true },
	"repo": {
		"url": "",
		"editUri": ""
	},
	"social": [],
	"footer": false,
	"lastUpdated": false,
	"mermaid": false,
	"math": false,
	"analytics": {
		"provider": "",
		"id": ""
	},
	"ogImage": "",
	"generateOgImages": false,
	"extraCss": [],
	"extraJs": [],
	"plugins": [],
	"i18n": {
		"defaultLocale": { "code": "en", "label": "English" },
		"locales": []
	}
}
```

Only `name` is required - everything else falls back to the defaults shown
above. A partial `theme` object is merged one level deep, so
`{"theme":{"name":"material"}}` alone still keeps the default (empty)
`options`.

## `name`

The site name, shown in the header/brand mark and page titles. Required.

## `description`

An optional site description, used as the fallback `<meta name="description">`
and `og:description` for any page that doesn't set its own `description`
frontmatter (see [Getting Started](getting-started.md#add-pages)).

## `baseURL`

Controls how every internal link, asset path and nav entry is prefixed, and
doubles as the site's canonical URL for `sitemap.xml` and `llms.txt`.

- Left blank or `"/"` (the default) - links stay root-relative (`/page/`),
  and neither `sitemap.xml` nor an absolute-URL `llms.txt` is generated
  (there's no canonical domain to build them from).
- A bare path, e.g. `"my-docs"` or `"/my-docs/"` - the site is assumed to be
  served from that sub-path, and every internal link, nav entry and asset
  is prefixed with it (`/my-docs/page/`). Still no `sitemap.xml`, since
  there's still no absolute domain.
- A full URL, e.g. `"https://docs.example.com/"` - the path portion
  (`/` here) is used the same way a bare path would be, **and**
  `sitemap.xml` is written at build time with every non-hidden page's
  absolute URL under that domain.

`llms.txt` (see [below](#llmstxt)) is always written; it just prefers an
absolute URL when `baseURL` provides one.

## `llms.txt`

Every build writes a `llms.txt` to the site root - a plain Markdown index of
every non-hidden page, following the emerging
[llms.txt](https://llmstxt.org) convention for helping LLM-based tools
navigate a site without crawling its rendered HTML. There's no config key
for this; it's generated automatically, using an absolute URL per link when
`baseURL` is a full URL, or a `basePath`-relative one otherwise.

## `sitemap.xml`

Written at the site root, but only when `baseURL` is a full URL (see
above) - a sitemap needs an absolute domain to be meaningful. Lists every
non-hidden page per the [sitemaps.org](https://www.sitemaps.org/) protocol.

## `theme`

- `theme.name` - one of the built-in themes (`bootstrap`, `material`,
  `tailwind`), or the name of a custom theme you provide via a `theme/`
  folder at the project root (see [Themes](guides/themes.md))
- `theme.logo` - path/URL to an image shown next to the site name in the
  header brand mark (in place of the default "⚡" glyph) - a relative path
  (e.g. `"assets/logo.svg"`, resolved against `docs/assets/`) is prefixed
  with `baseURL` like any other internal asset; an absolute URL is used
  as-is. Left blank (the default), the header shows "⚡ &lt;site name&gt;".
- `theme.favicon` - path/URL to a favicon, resolved the same way as
  `theme.logo`. Left blank (the default), no `<link rel="icon">` is
  rendered at all (falling back to the browser's own default behavior).
- `theme.options` - theme-specific options, read by every built-in theme:
  - `theme.options.colorMode` - `"auto"` (the default), `"light"` or
    `"dark"`. Controls which mode a first-time visitor sees before they've
    picked one themselves via the header's dark/light toggle - `"auto"`
    follows their OS preference, `"light"`/`"dark"` pins a fixed default.
    Once a visitor toggles the switch, their own choice (stored in
    `localStorage`) always wins on later visits, regardless of this setting.

    ```json
    { "theme": { "options": { "colorMode": "dark" } } }
    ```
  - `theme.options.navCollapsible` - `false` (the default) renders every nav
    section heading always expanded, as today. `true` renders each nav
    section (a folder with no `index.md`) as a native `<details>`/`<summary>`
    disclosure the visitor can collapse - no JS framework involved.
  - `theme.options.navExpandAll` - only relevant when `navCollapsible` is
    `true`. `true` (the default) starts every section open; `false` starts
    every section collapsed.

    ```json
    { "theme": { "options": { "navCollapsible": true, "navExpandAll": false } } }
    ```

## `search`

`true` (the default) builds a static search index and wires up the search
box; `false` skips both entirely - no `search-index.json`, no search UI, no
extra JS shipped. See [Search](guides/search.md).

## `nav`

By default, nav is inferred from `docs/`'s own folder/file structure (with
`order`/`hidden` frontmatter) - fine for small sites, but a large one can
outgrow it: an explicit nav lets you title, group and order pages however
you want, independent of where their files actually live.

An empty array (the default) means "infer from folder structure". A
non-empty array replaces that inference entirely - array order becomes nav
order, and a page not referenced anywhere in it is still built, just not
linked from the nav (same as `hidden: true`). Each entry is either:

- a bare docs/-relative path string, e.g. `"guides/setup.md"` - title comes
  from that page's own frontmatter/filename, same as folder-inference would
  give it
- an object `{ "title", "path", "icon", "children" }` - `path`, `icon` and
  `children` are all optional; a `title`-only entry with no `path` is an
  unlinked group heading (like a folder with no `index.md` today), and an
  explicit `title`/`icon` always overrides the linked page's own
  title/icon in the nav (the page's real `<h1>`/`<title>` is untouched -
  only the nav label/icon changes) - see [Themes: Icons](guides/themes.md#icons)
  for what an `icon` value can be

```json
{
	"nav": [
		"index.md",
		{
			"title": "Guides",
			"children": [
				{ "title": "Quick Start", "path": "guides/setup.md" },
				"guides/deployment.md"
			]
		}
	]
}
```

For a nav large enough that it clutters `bxdocs.json`, move it to its own
`docs/nav.json` file instead - same array shape, just as the whole file's
top-level content:

```json
[
	"index.md",
	{ "title": "Guides", "children": [ "guides/setup.md" ] }
]
```

`bxdocs.json`'s own `nav`, when non-empty, always wins over `docs/nav.json`.
Only the main tree honors either - a `docs/versions/<name>/` tree always
infers its nav from its own folder structure, even when the main tree has
an explicit one.

## `markdown`

Forwarded as-is to [bx-markdown](https://github.com/ortus-boxlang/bx-markdown)'s
own module settings before each page renders. BX Docs doesn't redefine or
validate these keys; whatever you put here is bx-markdown's own option set,
straight through - so this list can drift from bx-markdown's own as it
evolves. Tables, `~~strikethrough~~`, `- [ ]` task-list checkboxes and the
in-page table of contents are always on, with no toggle. The one exception
is `enableAdmonition` - bx-markdown itself defaults it to `false`, but BX
Docs defaults it to `true` (see the [Markdown Extensions guide](guides/markdown.md)).

| Key | Default | Effect |
|---|---|---|
| `enableAdmonition` | `true` *(BX Docs default; bx-markdown's own default is `false`)* | `!!!`/`???`/`???+` callout blocks - see the [Markdown Extensions guide](guides/markdown.md#admonitions) |
| `enableFootnotes` | `false` | `[^label]` footnote references - see the [Markdown Extensions guide](guides/markdown.md#footnotes) |
| `enableDefinitionLists` | `false` | `Term\n:   Definition` lists - see the [Markdown Extensions guide](guides/markdown.md#definition-lists) |
| `autoLinkUrls` | `true` | Auto-links bare URLs and email addresses |
| `anchorLinks` | `true` | Adds a clickable anchor link to every heading |
| `anchorSetId` | `true` | Stamps an `id` attribute onto every heading |
| `achorSetName` *(sic)* | `true` | Stamps a `name` attribute onto every heading |
| `anchorWrapText` | `false` | Wraps the whole heading text in the anchor link, instead of just a bare marker |
| `anchorClass` | `"anchor"` | CSS class on the anchor `<a>` |
| `anchorPrefix` / `anchorSuffix` | `""` | Raw HTML injected immediately before/after the heading text |
| `enableYouTubeTransformer` | `false` | Auto-embeds bare YouTube links as a player |
| `codeStyleHTMLOpen` / `codeStyleHTMLClose` | `"<code>"` / `"</code>"` | Wrapper HTML around inline code spans |
| `fencedCodeLanguageClassPrefix` | `"language-"` | Class prefix bx-docs's client-side syntax highlighter (and Mermaid, see below) key off of, e.g. ` ```js ` -> `class="language-js"` |
| `tableOptions.columnSpans` | `true` | Honors `colspan`-style merged table cells |
| `tableOptions.appendMissingColumns` | `true` | Pads a short row out to the header's column count |
| `tableOptions.discardExtraColumns` | `true` | Drops extra cells in an over-long row |
| `tableOptions.className` | `"table"` | CSS class on every rendered `<table>` |
| `tableOptions.headerSeparationColumnMatch` | `true` | Requires the `---` separator row to match the header's column count |

```json
{
	"markdown": {
		"enableFootnotes": true,
		"enableDefinitionLists": true,
		"anchorLinks": false,
		"enableYouTubeTransformer": true
	}
}
```

## `repo`

Adds a repository icon link to the header (all three built-in themes) and,
when both keys are set, an "Edit this page" link on every page.

- `repo.url` - your repo's URL, e.g. `"https://github.com/acme/docs"`.
  Renders the header icon link on its own; leave blank to omit it entirely.
- `repo.editUri` - the path segment between the repo URL and a page's own
  source path, e.g. `"edit/main/docs/"` (GitHub's own "edit" URL
  convention). Combined with `repo.url` and a page's `docs/`-relative
  source path to build its edit link - e.g. with the example above,
  `docs/guides/setup.md` gets
  `https://github.com/acme/docs/edit/main/docs/guides/setup.md`. Requires
  `repo.url` too; leave blank to omit edit links while still showing the
  header icon.

```json
{ "repo": { "url": "https://github.com/acme/docs", "editUri": "edit/main/docs/" } }
```

## `social`

An array of social/external links rendered in the footer (see
[`footer`](#footer) - has no effect unless it's also turned on). Each entry
needs a `url`; `icon` selects from a small built-in icon set (`github`,
`twitter`/`x`, `youtube`, `linkedin`, `facebook`, `bluesky`, `threads`,
`slack`, `patreon`, `rss`, `email`, falling back to a generic link glyph
for anything else), and `label` sets the link's accessible name/tooltip
(defaults to `icon`, then `"Link"`).

```json
{
	"social": [
		{ "url": "https://twitter.com/acme", "icon": "twitter", "label": "Twitter" },
		{ "url": "https://acme.com/rss.xml", "icon": "rss", "label": "RSS" }
	]
}
```

## `footer`

`false` (the default) - no footer at all. `true` adds one to every page:
a copyright line (`© <year> <site name>`), the `social` links (if any),
and a "Built with BX Docs" credit.

```json
{ "footer": true }
```

## `lastUpdated`

`false` (the default) - no last-updated date. `true` adds a "Last updated"
line next to the edit link (or on its own, if `repo.editUri` isn't set),
sourced from `git log` on each page's own Markdown file at build time.
Silently omitted for a page git has no history for - a fresh `git init`
with no commits yet, a build running from a downloaded zip with no `.git`
at all, or git not being installed on the build machine - rather than
breaking the build.

```json
{ "lastUpdated": true }
```

## `analytics`

Wires up pageview analytics. Currently supports Google Analytics
(`gtag.js`) only:

- `analytics.provider` - `"google"` to enable it; left blank (the default),
  no analytics script is shipped at all.
- `analytics.id` - the Google Analytics measurement ID (e.g. `"G-ABC123"`).
  Required when `provider` is `"google"`.

```json
{ "analytics": { "provider": "google", "id": "G-ABC123" } }
```

## `ogImage`

Path/URL to a default social-card image, rendered as `og:image` (and paired
with a `twitter:card` of `summary_large_image`) on every page that doesn't
override it - resolved the same way as `theme.logo` (relative paths are
prefixed with `baseURL`, absolute URLs are used as-is). Left blank (the
default) and `generateOgImages` off, no `og:image`/`twitter:card` tags are
rendered.

```json
{ "ogImage": "assets/social-card.png" }
```

A page's own frontmatter `ogImage` (see [Getting Started](getting-started.md#add-pages))
always wins over this site-wide default for that one page.

### `generateOgImages`

`false` (the default) - no per-page cards. `true` renders a real 1200x630
PNG social card for every page that doesn't already have its own
frontmatter `ogImage` - the page's title on the brand gradient, written to
`site/assets/og/<page>.png` - instead of every page sharing one generic
site-wide image. Pure `java.awt`/`javax.imageio` under the hood (part of
any JVM BoxLang runs on), so this needs no headless browser, external
service, or network access at build time.

```json
{ "generateOgImages": true }
```

## `extraCss` / `extraJs`

Arrays of extra stylesheet/script URLs to include on every page, appended
after the theme's own assets - each entry is resolved the same way as
`theme.logo` (a relative path is prefixed with `baseURL`; an absolute URL
is used as-is). `extraJs` entries are loaded with `defer`.

```json
{
	"extraCss": [ "assets/custom.css" ],
	"extraJs": [ "assets/custom.js" ]
}
```

## `mermaid`

`false` (the default) - no [Mermaid](https://mermaid.js.org/) diagram
support shipped at all. `true` loads `mermaid.js` client-side and renders
every ` ```mermaid ` fenced code block as a diagram. See
[Markdown Extensions](guides/markdown.md#diagrams) for the syntax.

```json
{ "mermaid": true }
```

## `math`

`false` (the default) - no [KaTeX](https://katex.org/) shipped at all.
`true` loads it client-side and typesets `$...$`/`$$...$$` written directly
into a page's markdown. See
[Markdown Extensions](guides/markdown.md#math) for the syntax.

```json
{ "math": true }
```

Admonitions (note/warning/tip-style callout boxes), content tabs, and
fenced-code `hl_lines`/`linenums`/`title` annotations are always available
in every page's markdown, no config needed - see
[Markdown Extensions](guides/markdown.md#admonitions).

## `plugins`

`[]` (the default) - an array of BoxLang module names to activate as
plugins. Installing a plugin module (`box install`) never activates it on
its own; it has to be named here too. See [Plugins](guides/plugins.md)
for how to write one.

```json
{ "plugins": [ "myBxDocsPlugin" ] }
```

## `i18n`

Metadata for the [`docs/i18n/<code>/`](guides/i18n.md) locale-folder
convention - a locale builds automatically once its folder exists;
`i18n` just supplies its display label/direction for the language
switcher.

- `i18n.defaultLocale` - `{ "code", "label", "flag" }` for the project's own
  regular `docs/` tree, defaulting to `{ "code": "en", "label": "English" }`.
  Only needs setting when your default locale isn't English.
- `i18n.locales` - `[]` (the default) - an array of `{ "code", "label", "dir", "flag" }`
  for every other locale. `code` doubles as the `docs/i18n/<code>/` folder
  name and the built URL prefix - letters/digits/hyphens only (`es`,
  `pt-BR`, `zh-Hans`). `dir` is `"ltr"` (the default) or `"rtl"`. `flag` is
  an optional emoji override for the language switcher's flag icon - most
  common codes already resolve to a sensible flag on their own.

```json
{
	"i18n": {
		"defaultLocale": { "code": "en", "label": "English" },
		"locales": [
			{ "code": "es", "label": "Español" },
			{ "code": "ar", "label": "العربية", "dir": "rtl" }
		]
	}
}
```

See [Internationalization](guides/i18n.md) for the full picture -
untranslated-page fallback, the language switcher, and what isn't
translated yet.

## Versioning

Versioned docs are convention over configuration - there's no `bxdocs.json`
key for it. Add a `docs/versions/` folder, and each direct subfolder inside
it is built as its own fully self-contained doc tree, alongside your
regular `docs/` (which always builds as "Latest"):

```
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

Each version folder is a normal `docs/`-shaped tree - its own `index.md`,
its own nav, its own pages - built into `site/versions/<name>/` with every
internal link prefixed accordingly, and sharing the project's single
`bxdocs.json` config/theme. Version names sort newest-first, numerically
rather than alphabetically (so `2.0` sorts before `10.0`), and every theme
renders a version-switcher dropdown in the header automatically once more
than one version exists - nothing to opt into. A loose file placed directly
under `docs/versions/` (not inside a subfolder) is ignored.

`sitemap.xml` and `llms.txt` include every version's pages alongside the
main site's.
