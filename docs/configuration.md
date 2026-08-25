---
title: Configuration
order: 4
icon: phosphor-duotone:gear-six
summary: Every site config key, what it defaults to, and what it does.
tags: [reference, configuration]
---

# Configuration

Every project has one site config at its root - `bxsites.yaml` (or `.yml`),
the default/preferred format, or `bxsites.json` for a project that wants to
stay on it. Both are fully supported and produce the exact same result;
`bxSites new` scaffolds `bxsites.yaml` unless `--format=json` is passed (see
[Getting Started](getting-started.md#config-file-format)). If a project
somehow has more than one, `bxsites.yaml` wins, then `bxsites.yml`, then
`bxsites.json`.

```yaml title="bxsites.yaml" linenums="1"
name: "My Docs"
description: ""
baseURL: "/"
theme:
  name: bootstrap
  options: {}
  logo: ""
  favicon: ""
search: true
searchProvider:
  provider: local
  algolia: { appId: "", apiKey: "", indexName: "", insights: false }
nav: []
markdown:
  enableAdmonition: true
repo:
  url: ""
  editUri: ""
social: []
footer: false
lastUpdated: false
mermaid: false
math: false
analytics:
  provider: ""
  id: ""
ogImage: ""
generateOgImages: false
extraCss: []
extraJs: []
assets:
  fingerprint: true
  bundle: true
  images: { enabled: true, widths: [400, 800, 1200, 1600], formats: [original, webp] }
plugins: []
i18n:
  defaultLocale: { code: en, label: English }
  locales: []
blog:
  postsPerPage: 10
  feed: true
variables: {}
```

The equivalent `bxsites.json`, for a project that prefers it:

```json title="bxsites.json" linenums="1"
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
	"searchProvider": {
		"provider": "local",
		"algolia": { "appId": "", "apiKey": "", "indexName": "", "insights": false }
	},
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
	"assets": {
		"fingerprint": true,
		"bundle": true,
		"images": { "enabled": true, "widths": [400, 800, 1200, 1600], "formats": ["original", "webp"] }
	},
	"plugins": [],
	"i18n": {
		"defaultLocale": { "code": "en", "label": "English" },
		"locales": []
	},
	"blog": {
		"postsPerPage": 10,
		"feed": true
	},
	"variables": {}
}
```

Only `name` is required - everything else falls back to the defaults shown
above. A partial `theme` object is merged one level deep, so
`{theme: {name: material}}` alone still keeps the default (empty)
`options`. Every key below is named/shaped identically in both formats -
the rest of this page just shows YAML snippets, matching `bxSites new`'s
own default format, but every one of them reads the same in JSON.

## `name`

The site name, shown in the header/brand mark and page titles. Required.

## `description`

An optional site description, used as the fallback `<meta name="description">`
and `og:description` for any page that doesn't set its own `description`
frontmatter (see [Getting Started](getting-started.md#add-pages)).

## `baseURL`

Controls how every internal link, asset path and nav entry is prefixed, and
doubles as the site's canonical URL for `sitemap.xml`, `robots.txt`,
`llms.txt`, and every page's own `<link rel="canonical">` tag.

- Left blank or `"/"` (the default) - links stay root-relative (`/page/`),
  and neither `sitemap.xml`, a `Sitemap:` line in `robots.txt`, an
  absolute-URL `llms.txt`, nor a `<link rel="canonical">` tag is generated
  (there's no canonical domain to build them from).
- A bare path, e.g. `"my-docs"` or `"/my-docs/"` - the site is assumed to be
  served from that sub-path, and every internal link, nav entry and asset
  is prefixed with it (`/my-docs/page/`). Still no `sitemap.xml`/canonical
  tags, since there's still no absolute domain.
- A full URL, e.g. `"https://docs.example.com/"` - the path portion
  (`/` here) is used the same way a bare path would be, **and**
  `sitemap.xml` is written at build time with every non-hidden page's
  absolute URL under that domain, `robots.txt` gains a `Sitemap:` line
  pointing at it, and every page gets its own correct
  `<link rel="canonical">` (a version/locale tree's own page still points
  at *that tree's own* URL, not the main site's).

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

## `robots.txt`

Every build writes a `robots.txt` to the site root - no config key needed
unless you want to change its default, permissive behavior:

```json title="bxsites.json"
{ "robots": false }
```

- `true` (the default) - `Allow: /` for every crawler, plus a `Sitemap:`
  line pointing at `sitemap.xml` when `baseURL` is a full URL (see above).
- `false` - `Disallow: /` for every crawler instead, and no `Sitemap:`
  line - the common "don't index this staging/internal deploy at all" need.
  This is a *crawler* opt-out only, not access control - the site is still
  fully reachable by anyone with the URL; see
  [Deployment](guides/deployment.md#restricting-who-can-reach-your-site) if you actually need to restrict who
  can reach it at all.

Need more than the on/off toggle - specific disallowed paths, multiple
`Sitemap:` lines, a `Crawl-delay`, per-user-agent rules? Drop your own
`robots.txt` right next to `index.md` (`docs/robots.txt`, or `src/robots.txt`
for a `src/`-based project - see [`docs/` or `src/`](getting-started.md#add-pages))
and it's copied through byte-for-byte instead of the generated one, on every
build - the `robots` key above is ignored entirely once this file exists.

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

    ```yaml
    theme: { options: { colorMode: dark } }
    ```
  - `theme.options.navCollapsible` - `false` (the default) renders every nav
    section always expanded, as today. `true` gives every section with
    children a toggle button the visitor can click to collapse/expand it -
    whether that section is a bare group heading (a folder with no
    `index.md`) or links to its own page. The section containing the page
    you're currently on always starts open, regardless of `navExpandAll`,
    so navigating there never buries the very link you're on.
  - `theme.options.navExpandAll` - only relevant when `navCollapsible` is
    `true`. `true` (the default) starts every section open; `false` starts
    every section collapsed, except the one containing the current page.

    ```yaml
    theme: { options: { navCollapsible: true, navExpandAll: false } }
    ```
  - `theme.options.tocPosition` - where a page's own "On this page" table of
    contents renders. `"top"` (the default) renders it inline, at the top of
    the article, same as today. `"sticky"` moves it into its own right-hand
    column that stays in view while the article scrolls underneath it - the
    same "On this page" list, just pinned, which helps on long pages. The
    pinned column only fits on wide viewports (it's hidden below the point a
    3-column layout would get cramped); below that width `sticky` mode
    instead renders a collapsible "On this page" bar pinned to the top of
    the viewport while scrolling - tap to expand the list, same treatment
    VitePress/GitBook use on mobile - so the TOC stays reachable at every
    viewport width, it just changes shape depending on how much room there is.

    ```yaml
    theme: { options: { tocPosition: sticky } }
    ```
  - `theme.options.pageMetaPosition` - where the edit-this-page/download-
    markdown/last-updated row renders relative to a page's own content.
    `"bottom"` (the default) renders it as a small footer note right before
    the article ends. `"top"` renders it up near the title instead, the same
    place it always rendered before this option existed.

    ```yaml
    theme: { options: { pageMetaPosition: top } }
    ```

## `search`

`true` (the default) builds a static search index and wires up the search
box; `false` skips both entirely - no `search-index.json`, no search UI, no
extra JS shipped. See [Search](guides/search.md).

## `searchProvider`

Which search UI `search: true` wires up:

- `provider` - `"local"` (the default) is bx-sites' own static/client-side
  search (`search-index.json` + lunr.js, see [Search](guides/search.md#local-the-default)).
  `"algolia"` wires up [Algolia DocSearch](guides/search.md#algolia)
  instead, and `"pagefind"` wires up [Pagefind](guides/search.md#pagefind).
  Any other value is a project's own custom provider, wired up by a
  `theme/` override - see [Search](guides/search.md#other-search-providers).
- `algolia` - required when `provider` is `"algolia"`: `appId`, `apiKey`
  (the *search-only* public API key, not an admin key) and `indexName`,
  exactly as Algolia's own DocSearch client expects them. `insights`
  (`false` by default) turns on DocSearch's click/conversion analytics.

  ```yaml title="bxsites.yaml" linenums="1"
  search: true
  searchProvider:
    provider: algolia
    algolia:
      appId: ABC123
      apiKey: a1b2c3d4e5f6...
      indexName: my-docs
  ```

- `pagefind` - both keys optional when `provider` is `"pagefind"`: `bin`
  (default `"pagefind"`) is the CLI executable name/path, resolved against
  `PATH` when it's a bare name; `options` is an array of extra raw CLI
  flags passed straight through. The `pagefind` CLI itself must already be
  installed and on `PATH` - BxSites shells out to it (like `git` for
  `lastUpdated`/`gh-deploy`), it doesn't install it for you.

  ```yaml title="bxsites.yaml" linenums="1"
  search: true
  searchProvider:
    provider: pagefind
    pagefind: { bin: pagefind, options: [] }
  ```

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

A `title`-only entry with `children` and no `path` is exactly a menu
container/section label - a non-clickable heading that just groups its
children, the same role GitBook's "MAIN COMPONENTS" plays in its own
sidebar:

```yaml title="bxsites.yaml" linenums="1"
nav:
  - index.md
  - title: Main Components
    children:
      - title: Quick Start
        path: guides/setup.md
      - guides/deployment.md
```

Give that same group entry a `path` instead and it becomes a normal linked
section (its own landing page, plus children) rather than a bare label - both
shapes nest under `theme.options.navCollapsible` the same way (see above).

For a nav large enough that it clutters `bxsites.yaml`, move it to its own
`docs/nav.json` file instead - same array shape, just as the whole file's
top-level content:

```json title="docs/nav.json" linenums="1"
[
	"index.md",
	{ "title": "Guides", "children": [ "guides/setup.md" ] }
]
```

`bxsites.yaml`'s own `nav`, when non-empty, always wins over `docs/nav.json`.
Only the main tree honors either - a `docs/versions/<name>/` tree always
infers its nav from its own folder structure, even when the main tree has
an explicit one.

## `redirects`

`[]` (the default) - site-wide `from`/`to` old-URL redirects, only ever
applied to the main tree:

```yaml title="bxsites.yaml" linenums="1"
redirects:
  - from: old-guide
    to: guides/new-guide/
```

- `redirects[].from` - the old pretty-URL segment a static redirect stub
  gets written at (no leading/trailing slash, no extension)
- `redirects[].to` - a root-relative path (resolved against `baseURL`) or
  a full `https://` URL

A page's own frontmatter `redirect_from` is the per-page, per-tree
alternative (works inside a version/locale tree too) - see
[Redirects](guides/redirects.md) for the full picture, including how
`page:rename` stamps it on automatically.

## `markdown`

Forwarded as-is to [bx-markdown](https://github.com/ortus-boxlang/bx-markdown)'s
own module settings before each page renders. BxSites doesn't redefine or
validate these keys; whatever you put here is bx-markdown's own option set,
straight through - so this list can drift from bx-markdown's own as it
evolves. Tables, `~~strikethrough~~`, `- [ ]` task-list checkboxes and the
in-page table of contents are always on, with no toggle. The one exception
is `enableAdmonition` - bx-markdown itself defaults it to `false`, but BX
Docs defaults it to `true` (see the [Markdown Extensions guide](guides/markdown.md)).

| Key | Default | Effect |
|---|---|---|
| `enableAdmonition` | `true` *(BxSites default; bx-markdown's own default is `false`)* | `!!!`/`???`/`???+` callout blocks - see the [Markdown Extensions guide](guides/markdown.md#admonitions) |
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
| `fencedCodeLanguageClassPrefix` | `"language-"` | Class prefix bx-sites's client-side syntax highlighter (and Mermaid, see below) key off of, e.g. ` ```js ` -> `class="language-js"` |
| `tableOptions.columnSpans` | `true` | Honors `colspan`-style merged table cells |
| `tableOptions.appendMissingColumns` | `true` | Pads a short row out to the header's column count |
| `tableOptions.discardExtraColumns` | `true` | Drops extra cells in an over-long row |
| `tableOptions.className` | `"table"` | CSS class on every rendered `<table>` |
| `tableOptions.headerSeparationColumnMatch` | `true` | Requires the `---` separator row to match the header's column count |

Every rendered table also gets a responsive-scroll/sticky-header wrapper automatically, with no config key of its own - see [Tables](guides/markdown.md#responsive-scroll-and-a-sticky-header).

```yaml title="bxsites.yaml" linenums="1"
markdown:
  enableFootnotes: true
  enableDefinitionLists: true
  anchorLinks: false
  enableYouTubeTransformer: true
```

## `repo`

Adds a repository icon link to the header (every built-in theme) and,
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

```yaml title="bxsites.yaml"
repo: { url: "https://github.com/acme/docs", editUri: "edit/main/docs/" }
```

## `social`

An array of social/external links rendered in the footer (see
[`footer`](#footer) - has no effect unless it's also turned on). Each entry
needs a `url`; `icon` selects from a small built-in icon set (`github`,
`twitter`/`x`, `youtube`, `linkedin`, `facebook`, `bluesky`, `threads`,
`slack`, `patreon`, `rss`, `email`, falling back to a generic link glyph
for anything else), and `label` sets the link's accessible name/tooltip
(defaults to `icon`, then `"Link"`).

```yaml title="bxsites.yaml" linenums="1"
social:
  - { url: "https://twitter.com/acme", icon: twitter, label: Twitter }
  - { url: "https://acme.com/rss.xml", icon: rss, label: RSS }
```

## `footer`

`false` (the default) - no footer at all. `true` adds one to every page:
a copyright line (`© <year> <site name>`), the `social` links (if any),
and a "Built with BxSites" credit.

```yaml title="bxsites.yaml"
footer: true
```

## `lastUpdated`

`false` (the default) - no last-updated date. `true` adds a "Last updated"
line next to the edit link (or on its own, if `repo.editUri` isn't set),
sourced from `git log` on each page's own Markdown file at build time.
Silently omitted for a page git has no history for - a fresh `git init`
with no commits yet, a build running from a downloaded zip with no `.git`
at all, or git not being installed on the build machine - rather than
breaking the build.

```yaml title="bxsites.yaml"
lastUpdated: true
```

## `analytics`

Wires up pageview analytics. Currently supports Google Analytics
(`gtag.js`) only:

- `analytics.provider` - `"google"` to enable it; left blank (the default),
  no analytics script is shipped at all.
- `analytics.id` - the Google Analytics measurement ID (e.g. `"G-ABC123"`).
  Required when `provider` is `"google"`.

```yaml title="bxsites.yaml"
analytics: { provider: google, id: "G-ABC123" }
```

## `ogImage`

Path/URL to a default social-card image, rendered as `og:image` (and paired
with a `twitter:card` of `summary_large_image`) on every page that doesn't
override it - resolved the same way as `theme.logo` (relative paths are
prefixed with `baseURL`, absolute URLs are used as-is). Left blank (the
default) and `generateOgImages` off, no `og:image`/`twitter:card` tags are
rendered.

```yaml title="bxsites.yaml"
ogImage: assets/social-card.png
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

```yaml title="bxsites.yaml"
generateOgImages: true
```

## `extraCss` / `extraJs`

Arrays of extra stylesheet/script URLs to include on every page, appended
after the theme's own assets - each entry is resolved the same way as
`theme.logo` (a relative path is prefixed with `baseURL`; an absolute URL
is used as-is). `extraJs` entries are loaded with `defer`.

```yaml title="bxsites.yaml" linenums="1"
extraCss: [ assets/custom.css ]
extraJs: [ assets/custom.js ]
```

When `assets.bundle` is on (the default), a local `extraCss`/`extraJs`
list like the one above is bundled into one fingerprinted file each,
instead of one `<link>`/`<script>` tag per entry - see [`assets`](#assets)
below.

## `assets`

```yaml title="bxsites.yaml" linenums="1"
assets:
  fingerprint: true
  bundle: true
  images:
    enabled: true
    widths: [ 400, 800, 1200, 1600 ]
    formats: [ original, webp ]
```

The asset pipeline - image resizing/WebP via
[bx-image](https://github.com/ortus-boxlang/bx-image) (a required
dependency, installed alongside bx-markdown/bx-esapi) and CSS/JS
bundling. Everything here is on by default with reasonable settings - a
fresh `bxSites new` project needs to touch none of this. See
[Responsive Images](guides/images.md) for the full picture, including
what deliberately isn't covered (AVIF, animated GIFs, SVGs).

- `assets.fingerprint` - `true` (the default). Content-hash-names every
  generated image variant and CSS/JS bundle (e.g.
  `screenshot-800w.a3f9c2e1.webp`, `bundle.a3f9c2e1.css`) so they can be
  served with safe, far-future cache headers - a project's build changes
  the file's own name only when its content actually changes. Does not
  rename a project's own original files under `docs/assets/` - only
  pipeline-generated output gets fingerprinted, so anything else that
  references an asset by its plain filename (a `::: file` download card,
  a raw markdown link) keeps working unchanged.
- `assets.bundle` - `true` (the default). Concatenates `extraCss`/`extraJs`
  into one fingerprinted file each - pure BoxLang/JVM, no Node/esbuild
  toolchain. Falls back to today's exact per-URL `<link>`/`<script>`
  behavior, untouched, the moment any entry in the list is an external
  URL (a CDN link) or names a file that doesn't exist - see
  [Responsive Images](guides/images.md#css-js-bundling).
- `assets.images.enabled` - `true` (the default). Every eligible
  `docs/assets/**` image (`.png`/`.jpg`/`.jpeg`) gets resized/WebP
  variants generated via bx-image, and every matching `<img>` gets
  rewritten into a `<picture>` with `srcset`. Set `false` to fall back
  to plain, unprocessed image copying, exactly as before this feature
  existed.
- `assets.images.widths` - breakpoints to generate, in pixels. A width at
  or above a given image's own width is skipped automatically for that
  image - nothing is ever upscaled.
- `assets.images.formats` - `"original"` keeps the source format as the
  `<img>` fallback; `"webp"` adds a same-size `<source type="image/webp">`
  variant. Both on by default.

## `mermaid`

`false` (the default) - no [Mermaid](https://mermaid.js.org/) diagram
support shipped at all. `true` loads `mermaid.js` client-side and renders
every ` ```mermaid ` fenced code block as a diagram. See
[Markdown Extensions](guides/markdown.md#diagrams) for the syntax.

```yaml title="bxsites.yaml"
mermaid: true
```

## `math`

`false` (the default) - no [KaTeX](https://katex.org/) shipped at all.
`true` loads it client-side and typesets `$...$`/`$$...$$` written directly
into a page's markdown. See
[Markdown Extensions](guides/markdown.md#math) for the syntax.

```yaml title="bxsites.yaml"
math: true
```

Admonitions (note/warning/tip-style callout boxes), content tabs, and
fenced-code `hl_lines`/`linenums`/`title` annotations are always available
in every page's markdown, no config needed - see
[Markdown Extensions](guides/markdown.md#admonitions).

## `openapi`

`false` (the default) - no [Swagger UI](https://swagger.io/tools/swagger-ui/)
shipped at all. `true` loads it client-side and renders every
`::: openapi src="..."` content block as an interactive widget for the
referenced OpenAPI/Swagger spec (JSON or YAML). See
[Content Blocks](guides/content-blocks.md#openapi--swagger) for the syntax.

```yaml title="bxsites.yaml"
openapi: true
```

## `plugins`

`[]` (the default) - an array of BoxLang module names to activate as
plugins. Installing a plugin module (`box install`) never activates it on
its own; it has to be named here too. See [Plugins](guides/plugins.md)
for how to write one.

```yaml title="bxsites.yaml"
plugins: [ myBxSitesPlugin ]
```

## `i18n`

Metadata for the [`docs/i18n/<code>/`](guides/i18n.md) locale-folder
convention - a locale builds automatically once its folder exists;
`i18n` just supplies its display label/direction for the language
switcher.

- `i18n.defaultLocale` - `{ "code", "label", "flag", "strings" }` for the
  project's own regular `docs/` tree, defaulting to `{ "code": "en", "label": "English" }`.
  Only needs setting when your default locale isn't English.
- `i18n.locales` - `[]` (the default) - an array of `{ "code", "label", "dir", "flag", "strings" }`
  for every other locale. `code` doubles as the `docs/i18n/<code>/` folder
  name and the built URL prefix - letters/digits/hyphens only (`es`,
  `pt-BR`, `zh-Hans`). `dir` is `"ltr"` (the default) or `"rtl"`. `flag` is
  an optional emoji override for the language switcher's flag icon - most
  common codes already resolve to a sensible flag on their own. `strings`
  overrides that locale's own theme-chrome UI text (search placeholder,
  "On this page," the 404 page, ...) - see
  [Internationalization](guides/i18n.md#theme-chrome-ui-strings) for the
  full key list; `de`/`es`/`it`/`ja` already ship a built-in translation,
  so `strings` is only needed to override a key or add another locale.

```yaml title="bxsites.yaml" linenums="1"
i18n:
  defaultLocale: { code: en, label: English }
  locales:
    - { code: es, label: Español }
    - { code: ar, label: العربية, dir: rtl }
```

See [Internationalization](guides/i18n.md) for the full picture -
untranslated-page fallback, the language switcher, and what isn't
translated yet.

## `blog`

Options for the [blog](guides/blog.md) - itself a by-convention feature
(`docs/blog/posts/`), no key here required to turn it on.

- `blog.postsPerPage` - `10` (the default) - how many posts per page on
  `/blog/`, every category page, and every `/blog/archive/<year>/` page
  before it moves to `.../page/2/`.
- `blog.feed` - `true` (the default) - whether `/blog/feed.xml` (RSS 2.0)
  is written. Only meaningful with an absolute `baseURL`, same requirement
  as `sitemap.xml`.
- `blog.feedLimit` - `25` (the default) - caps `/blog/feed.xml` to this
  many most-recent posts. `0` means unlimited (every post, in full). Most
  feed readers only care about what's new, so an unbounded feed on a blog
  with hundreds of posts just wastes bandwidth on every poll - see
  [Blog: Feed](guides/blog.md#feed).

```yaml title="bxsites.yaml"
blog: { postsPerPage: 10, feed: true, feedLimit: 25 }
```

See [Blog](guides/blog.md) for post/author frontmatter, categories,
featured images, and SEO/social metadata.

## `variables`

`{}` (the default) - an object of reusable values, any shape, referenced
from any Markdown page as `{{ dotted.path }}`. See
[Variables & Magic Functions](guides/variables-and-functions.md).

```yaml title="bxsites.yaml"
variables:
  company: "Ortus Solutions"
  product: { name: "BoxLang", supportEmail: "support@example.com" }
```

```markdown title="docs/index.md"
Welcome to {{ company }}! We build {{ product.name }}.
```

A `docs/functions.bxs` file (no config key of its own - by convention,
same as `docs/nav.json`/`docs/blog/authors.yml`) adds BoxLang "magic
functions" alongside `variables` - callable the same way, as
`{{ $name(...) }}`. See
[Variables & Magic Functions](guides/variables-and-functions.md#magic-functions).

## Versioning

Versioned docs are convention over configuration - there's no `bxsites.yaml`
key for it. Add a `docs/versions/<name>/` folder and it builds automatically
as its own doc tree, with a version switcher every theme renders for free
once more than one version exists. See [Versioning](guides/versioning.md)
for the full picture - cutting a new version with `version:new`, how
versions sort and build, and what's out of scope (per-tree search
scoping, no deprecated/EOL flag).
