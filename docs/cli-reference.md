---
title: CLI Reference
order: 3
icon: phosphor-duotone:terminal-window
summary: Every bxDocs verb and its flags.
tags: [reference, cli]
---

# CLI Reference

```bash title="Usage"
bxDocs <verb> [options]
```

`box install bx-docs` drops a standalone `bxDocs` script on your `PATH`
(via `box.json`'s `boxlang.executable`), so every verb below can be run
either that short way, or as `boxlang module:bxdocs <verb>` - both run the
exact same thing; use the longer form anywhere the `PATH` shim isn't set
up (a CI runner, a module registered by hand):

```bash title="Usage (no PATH shim)"
boxlang module:bxdocs <verb> [options]
```

Every verb accepts `--projectRoot=<path>` (or a bare positional path) to
target a project other than the current directory, and the two global
flags below can appear before any verb.

## Global options

| Flag | Description |
|---|---|
| `-h`, `--help` | Show usage and exit |
| `-v`, `--version` | Show the module version and exit |

## `new`

Scaffold a docs project.

```bash title="Usage"
bxDocs new [path] [--name=...] [--theme=bootstrap|material|tailwind] [--description=...] [--format=yaml|json]
```

- `--name` - the site name written into the site config (defaults to the target directory's name)
- `--theme` - defaults to `bootstrap`
- `--description` - the site description written into the site config
- `--format` - `yaml` (default, scaffolds `bxdocs.yaml`) or `json` (scaffolds `bxdocs.json`) - see [Configuration](configuration.md)

## `build`

Render `docs/**.md` into a static site in `site/`. Also builds the search
index (unless `search` is `false` in the site config, or `searchProvider` is
set to a provider - like `algolia`/`pagefind` - that doesn't use it, see
[Search](guides/search.md)), runs the `pagefind` CLI against the finished
`site/` when `searchProvider.provider` is `"pagefind"`, and copies theme +
`docs/assets/**` into `site/`.

```bash frame="terminal" title="Terminal"
bxDocs build
```

## `serve`

Build and serve the site locally with live reload.

```bash title="Usage"
bxDocs serve [--port=8080] [--host=127.0.0.1]
```

Runs in the foreground until interrupted (Ctrl+C).

## `search-index`

Rebuild `site/search-index.json` standalone, without re-rendering pages or
copying assets. `build` already runs this same step automatically - this
verb exists for when you only need to refresh the index.

```bash frame="terminal" title="Terminal"
bxDocs search-index
```

## `clean`

Remove `site/` and any build cache, leaving `docs/` and the site config alone.

```bash frame="terminal" title="Terminal"
bxDocs clean
```

## `gh-deploy`

Builds the site, then force-pushes it to a `gh-pages`-style branch - one
commit per deploy, no accumulated history on that branch, matching mkdocs'
own `mkdocs gh-deploy` convention. Requires the project to be a git
repository with a configured remote; never touches your own current branch
or working tree (it does the push from a throwaway `git worktree`).

```bash title="Usage"
bxDocs gh-deploy [--branch=gh-pages] [--remote=origin] [--message="..."]
```

- `--branch` - defaults to `gh-pages`
- `--remote` - defaults to `origin`
- `--message` - the branch's single commit message, defaults to `"Deploy site via bxDocs gh-deploy"`

See [Deployment](guides/deployment.md) for the full GitHub Pages setup
(enabling Pages for the branch, `baseURL`, etc.).

## `migrate`

Converts an existing docs project into this one - `--from` picks the
source format, `gitbook` (the default) or `mkdocs`.

```bash frame="terminal" title="Terminal" linenums="1"
bxDocs migrate --source=/path/to/gitbook-export
bxDocs migrate --source=/path/to/mkdocs-project --from=mkdocs
```

- `--source` (required) - path to the export/project's root directory (must contain `SUMMARY.md` for `gitbook`, `mkdocs.yml` for `mkdocs`)
- `--from` - `gitbook` (default) or `mkdocs`

### `--from=gitbook` (default)

A GitBook export - a `SUMMARY.md` table of contents plus its `.md` files,
GitBook's own on-disk sync format - into this project's `docs/` tree:
`SUMMARY.md` becomes `docs/nav.json`, `{% block %}` syntax becomes its
bx-docs equivalent (`::: name` directives, or the native `=== "Title"`
tabs / `!!! type` admonition syntax where a closer match already exists -
see [Markdown Extensions](guides/markdown.md#gitbook-style-blocks)),
`README.md` files become `index.md`, and `.gitbook/assets/**` is copied to
`docs/assets/gitbook/`.

### `--from=mkdocs`

An mkdocs project - `mkdocs.yml` plus its `docs/` folder - into a
complete bx-docs project: `mkdocs.yml` becomes `bxdocs.yaml` +
`docs/nav.json`, and every page is copied across largely unchanged, since
mkdocs-material's own admonition/tabs/math/code-annotation syntax already
*is* bx-docs' own native syntax - see
[Migrating from mkdocs](guides/migrating-from-mkdocs.md). Non-`.md` assets
(images commonly sitting next to the page that uses them, mkdocs has no
single asset-folder convention) are relocated to `docs/assets/mkdocs/` and
their references rewritten.

### Both

Prints a summary of pages (and, for mkdocs, assets) converted and, when
anything couldn't be auto-converted, a list of exactly what needs a
manual look - nothing is silently dropped. A destination file,
`bxdocs.yaml`, or `docs/nav.json` that already exists is overwritten
(also reported), so review the migrated output before committing it.

## `check`

A CI-grade content quality gate over an already-built `site/` - run `build`
first. Checks for:

- **Broken internal links/images** - any `<a href>`/`<img src>` pointing at
  a page or asset that doesn't exist in `site/`. Fails the check.
- **Missing alt text** - any `<img>` with no `alt` attribute at all. An
  empty `alt=""` (the correct markup for a purely decorative image) is not
  flagged. Fails the check.
- **Orphaned pages** - pages that exist in `site/` but aren't reachable by
  following links from any tree's own homepage (the main site's
  `index.html`, and each version's/locale's own). Informational only -
  never fails the check, since a page a project deliberately left out of
  its own nav (e.g. frontmatter `hidden: true`) is *supposed* to only be
  reachable by a direct link.

```bash frame="terminal" title="Terminal" linenums="1"
bxDocs build
bxDocs check
```

Exits `1` when there are any broken links/images or missing-alt images,
`0` otherwise (orphaned pages never affect the exit code). Deliberately
internal-links-only - it does not make HTTP requests to check external
URLs, which belongs in a dedicated link-checking tool run as its own job.

## `stats`

A read-only summary report of an already-built `site/` - run `build`
first. Reports:

- **Pages and words** - total page count and a rough word count (tags
  stripped, same "good enough for an estimate" standard as the blog's own
  reading-time figure), plus a per-tree breakdown once there's more than
  one tree (a version, or a non-default locale).
- **Versions and locales** - names of every `docs/versions/`/non-default
  `docs/i18n/` folder.
- **Blog** - post/category/author/year-active counts, straight off
  `site/blog/`'s own folder shape (so it always matches what was actually
  published, drafts excluded) - `none` when there's no blog.
- **Tags** - the number of distinct tags across the whole site.
- **Search index** - entry count and file size of `search-index.json`, or
  `none` when search is off or a non-local provider is active.
- **Site output** - total file count and on-disk size of the built `site/`.

```bash
bxDocs build
bxDocs stats
```

Always exits `0` - purely informational, nothing here is a pass/fail gate
(that's `check`'s job).

## `doctor`

A one-shot environment/config health check - the "run this before filing a
bug report" verb. Checks the JVM version, that `docs/` exists, that
`bxdocs.json`/`.yaml` actually parses and validates, that the required
BoxLang modules (`bx-markdown`, `bx-esapi`, `bx-yaml`, `bx-image`) are
installed and activated, and - if a project-level `theme/` override
exists - that it satisfies the two-required-file `layout.bxm`/`page.bxm`
contract.

```bash frame="terminal" title="Terminal"
bxDocs doctor
```

Exits `1` if any check fails, `0` otherwise. Nothing here mutates a
project - purely diagnostic.

## `post:new`

Scaffold a new blog post at `docs/blog/posts/<slug>.md`.

```bash title="Usage"
bxDocs post:new --title="My New Post" [--slug=...] [--date=...] [--authors=...] [--categories=...] [--tags=...] [--draft]
```

- `--title` (required) - also becomes the post's frontmatter `title`
- `--slug` - defaults to a slugified `--title`
- `--date` - defaults to today (`yyyy-MM-dd`)
- `--authors`, `--categories`, `--tags` - comma-separated
- `--draft` - defaults to `true` (pass `--!draft` to publish immediately)

See [Blog](guides/blog.md) for the full frontmatter reference.

## `version:new`

Snapshot the current `docs/` tree into `docs/versions/<name>/`, excluding
`assets/`, `versions/`, `i18n/`, and `blog/` (each is its own separately
loaded tree, not part of the snapshot).

```bash title="Usage"
bxDocs version:new --name=1.0
```

- `--name` (required) - the version folder/label, e.g. `1.0`

See [Configuration's "Versioning" section](configuration.md#versioning).

## `i18n:status`

Reports per-locale translation coverage - for every configured locale,
how many of the default tree's pages exist (at the same relative path)
under `docs/i18n/<code>/`, and which ones are still missing.

```bash frame="terminal" title="Terminal"
bxDocs i18n:status
```

Always exits `0` - purely informational.

## `i18n:new`

Scaffold a new `docs/i18n/<code>/` locale folder, seeding an `index.md`
copied from the default locale's own `index.md` when one exists.

```bash title="Usage"
bxDocs i18n:new --code=es
```

- `--code` (required) - the locale code, e.g. `es`, `fr`, `pt-BR`

See [Internationalization](guides/i18n.md) for wiring the new locale into
`bxdocs.json`'s `i18n.locales`.

## `page:new`

Scaffold a single docs page at an arbitrary path under `docs/`, with the
requested frontmatter already filled in.

```bash title="Usage"
bxDocs page:new --path=guides/setup.md [--title=...] [--description=...] [--icon=...] [--tags=...] [--order=...]
```

- `--path` (required) - `docs/`-relative, must end in `.md`
- `--title`, `--description`, `--icon`, `--order` - written into frontmatter
- `--tags` - comma-separated

## `plugin:new`

Scaffold a plugin module skeleton (`box.json`, `ModuleConfig.bx`, a
`models/BxDocsPlugin.bx` with every hook stubbed out) mirroring
`examples/hello-plugin/`.

```bash title="Usage"
bxDocs plugin:new --name=my-analytics-plugin [--dest=...]
```

- `--name` (required) - the plugin's module name/slug
- `--dest` - defaults to `<projectRoot>/<name>`

See [Plugins](guides/plugins.md) for the hook reference and how to wire the
finished plugin into `bxdocs.json`'s `plugins` array.

## `theme:new`

Eject one of the built-in themes (`bootstrap`, `material`, `tailwind`) into
the project's own `theme/` folder for customizing, matching mkdocs'
`--theme` eject workflow.

```bash title="Usage"
bxDocs theme:new --theme=material
```

- `--theme` (required) - `bootstrap`, `material`, or `tailwind`

Fails rather than overwriting an existing `theme/`. See
[Themes](guides/themes.md) for the override contract (`layout.bxm` +
`page.bxm`).

## `page:rename`

Move a docs page from one path to another, rewriting every relative
Markdown link across `docs/**` that pointed at the old path - the same
file-relative link-rot problem the built HTML side already solves
(`check`), applied to raw Markdown source at rename time instead.

```bash title="Usage"
bxDocs page:rename --from=guides/old-name.md --to=guides/new-name.md
```

- `--from` (required) - the page's current `docs/`-relative path
- `--to` (required) - its new `docs/`-relative path

Only bare `[text](relative/path.md)`-style links are rewritten - absolute
URLs, `mailto:`, and pure in-page anchors are left alone. `docs/assets/**`
is never scanned.

## `blog:drafts`

Lists every blog post whose frontmatter sets `draft: true` - `build`
always skips drafts, so this is the only place their existence is
surfaced.

```bash frame="terminal" title="Terminal"
bxDocs blog:drafts
```

Always exits `0`.

## `blog:find`

Filters blog posts by author/category/tag/date range, without running a
full `build`.

```bash title="Usage"
bxDocs blog:find [--author=...] [--category=...] [--tag=...] [--since=...] [--until=...] [--drafts]
```

- `--author`, `--category`, `--tag` - case-insensitive exact match against any of the post's own values
- `--since`, `--until` - a date; only posts on/after `--since` and/or on/before `--until` match
- `--drafts` - include draft posts too (excluded by default)

Every filter is optional and independent - passing none lists every
published post.

## `search:query`

Runs a keyword query against an already-built `site/search-index.json` -
run `build` or `search-index` first. Ranks results using the same
relative field weighting the client-side search widget uses (title,
then tags, then headings, then body), so you can sanity-check what a
real visitor's search would surface without opening a browser.

```bash title="Usage"
bxDocs search:query --query="getting started" [--limit=10]
```

- `--query` (required) - space-separated search terms
- `--limit` - maximum results to return, defaults to `10`

## `lint`

A pre-build content quality pass over raw `docs/` Markdown source,
distinct from `check` (which only inspects an already-built `site/`).
Checks for:

- **Heading level skips** - a page body jumping straight from `##` to
  `####` with no `###` in between (confusing structure, and bad for
  accessibility). Lines inside a fenced code block are never mistaken for
  headings.
- **Blog post date issues** - a `docs/blog/posts/**` post with a
  missing or invalid frontmatter `date` (`build` itself throws on this the
  moment it loads posts - `lint` surfaces it as a finding instead).

```bash frame="terminal" title="Terminal"
bxDocs lint
```

Exits `1` when either check finds anything, `0` otherwise.
