---
title: CLI Reference
order: 3
icon: phosphor-duotone:terminal-window
summary: Every bxDocs verb and its flags.
tags: [reference, cli]
---

# CLI Reference

```bash
bxDocs <verb> [options]
```

`box install bx-docs` drops a standalone `bxDocs` script on your `PATH`
(via `box.json`'s `boxlang.executable`), so every verb below can be run
either that short way, or as `boxlang module:bxdocs <verb>` - both run the
exact same thing; use the longer form anywhere the `PATH` shim isn't set
up (a CI runner, a module registered by hand):

```bash
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

```bash
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

```bash
bxDocs build
```

## `serve`

Build and serve the site locally with live reload.

```bash
bxDocs serve [--port=8080] [--host=127.0.0.1]
```

Runs in the foreground until interrupted (Ctrl+C).

## `search-index`

Rebuild `site/search-index.json` standalone, without re-rendering pages or
copying assets. `build` already runs this same step automatically - this
verb exists for when you only need to refresh the index.

```bash
bxDocs search-index
```

## `clean`

Remove `site/` and any build cache, leaving `docs/` and the site config alone.

```bash
bxDocs clean
```

## `gh-deploy`

Builds the site, then force-pushes it to a `gh-pages`-style branch - one
commit per deploy, no accumulated history on that branch, matching mkdocs'
own `mkdocs gh-deploy` convention. Requires the project to be a git
repository with a configured remote; never touches your own current branch
or working tree (it does the push from a throwaway `git worktree`).

```bash
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

```bash
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

```bash
bxDocs build
bxDocs check
```

Exits `1` when there are any broken links/images or missing-alt images,
`0` otherwise (orphaned pages never affect the exit code). Deliberately
internal-links-only - it does not make HTTP requests to check external
URLs, which belongs in a dedicated link-checking tool run as its own job.
