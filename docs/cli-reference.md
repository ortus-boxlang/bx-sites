---
title: CLI Reference
order: 3
icon: ⌨️
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
bxDocs new [path] [--name=...] [--theme=bootstrap|material|tailwind] [--description=...]
```

- `--name` - the site name written into `bxdocs.json` (defaults to the target directory's name)
- `--theme` - defaults to `bootstrap`
- `--description` - the site description written into `bxdocs.json`

## `build`

Render `docs/**.md` into a static site in `site/`. Also builds the search
index (unless `search` is `false` in `bxdocs.json`, or `searchProvider` is
set to a provider - like `algolia` - that doesn't use it, see
[Search](guides/search.md)) and copies theme + `docs/assets/**` into `site/`.

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

Remove `site/` and any build cache, leaving `docs/` and `bxdocs.json` alone.

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

Converts a GitBook export - a `SUMMARY.md` table of contents plus its
`.md` files, GitBook's own on-disk sync format - into this project's
`docs/` tree: `SUMMARY.md` becomes `docs/nav.json`, `{% block %}` syntax
becomes its bx-docs equivalent (`::: name` directives, or the native
`=== "Title"` tabs / `!!! type` admonition syntax where a closer match
already exists - see [Markdown Extensions](guides/markdown.md#gitbook-style-blocks)),
`README.md` files become `index.md`, and `.gitbook/assets/**` is copied to
`docs/assets/gitbook/`.

```bash
bxDocs migrate --source=/path/to/gitbook-export
```

- `--source` (required) - path to the GitBook export's root directory (must contain `SUMMARY.md`)

Prints a summary of pages converted and, when anything couldn't be
auto-converted (an unsupported block like `{% prompt %}`, an unrecognized
hint style, a column width that isn't a plain length), a list of exactly
what needs a manual look - nothing is silently dropped, an unrecognized
block is left in its original `{% %}` syntax in the migrated file instead.
A destination file or `docs/nav.json` that already exists is overwritten
(also reported), so review the migrated output before committing it.
