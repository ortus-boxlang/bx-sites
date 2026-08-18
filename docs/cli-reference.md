---
title: CLI Reference
order: 3
icon: ⌨️
summary: Every boxlang module:bxDocs verb and its flags.
tags: [reference, cli]
---

# CLI Reference

```bash
boxlang module:bxDocs <verb> [options]
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
boxlang module:bxDocs new [path] [--name=...] [--theme=bootstrap|material|tailwind] [--description=...]
```

- `--name` - the site name written into `bxdocs.json` (defaults to the target directory's name)
- `--theme` - defaults to `bootstrap`
- `--description` - the site description written into `bxdocs.json`

## `build`

Render `docs/**.md` into a static site in `site/`. Also builds the search
index (unless `search` is `false` in `bxdocs.json`) and copies theme +
`docs/assets/**` into `site/`.

```bash
boxlang module:bxDocs build
```

## `serve`

Build and serve the site locally with live reload.

```bash
boxlang module:bxDocs serve [--port=8080] [--host=127.0.0.1]
```

Runs in the foreground until interrupted (Ctrl+C).

## `search-index`

Rebuild `site/search-index.json` standalone, without re-rendering pages or
copying assets. `build` already runs this same step automatically - this
verb exists for when you only need to refresh the index.

```bash
boxlang module:bxDocs search-index
```

## `clean`

Remove `site/` and any build cache, leaving `docs/` and `bxdocs.json` alone.

```bash
boxlang module:bxDocs clean
```

## `gh-deploy`

Builds the site, then force-pushes it to a `gh-pages`-style branch - one
commit per deploy, no accumulated history on that branch, matching mkdocs'
own `mkdocs gh-deploy` convention. Requires the project to be a git
repository with a configured remote; never touches your own current branch
or working tree (it does the push from a throwaway `git worktree`).

```bash
boxlang module:bxDocs gh-deploy [--branch=gh-pages] [--remote=origin] [--message="..."]
```

- `--branch` - defaults to `gh-pages`
- `--remote` - defaults to `origin`
- `--message` - the branch's single commit message, defaults to `"Deploy site via bxDocs gh-deploy"`

See [Deployment](guides/deployment.md) for the full GitHub Pages setup
(enabling Pages for the branch, `baseURL`, etc.).
