---
title: Multi-Domain Monorepos
order: 0.6
icon: phosphor-duotone:stack
tags: [guides, configuration, deployment]
---

# Multi-Domain Monorepos

Running more than one independent site out of a single git repository -
say, a marketing site and a separate docs site, or a handful of product
sites that happen to share one repo for convenience - needs nothing
special from bxSites. Each site is just its own **project root**: its own
`bxsites.yaml` plus its own content folder, built, served, and deployed
independently by pointing bxSites at that one folder. A "monorepo with
multiple domains" is simply a repository containing several of these
project roots side by side.

## The pattern

`bxsites.yaml`'s own location is always wherever the CLI's explicit
project root points - the current working directory, or an explicit
`--projectRoot=<path>` (or a bare positional path). There's no upward
directory search and no separate concept of a "repo root" versus a
"project root" - every verb just resolves one project root per invocation
and looks for `bxsites.yaml` (or `.yml`/`.toml`/`.json`) directly inside
it. A monorepo with several domains is nothing more than a repository
that contains several of these, each independently complete:

```text title="Project structure"
my-monorepo/
├── marketing/
│   ├── bxsites.yaml        ← source: .  (or docs - marketing's own choice)
│   ├── index.md
│   ├── about.md
│   └── .theme/               ← marketing's own theme override, if any
└── docs-site/
    ├── bxsites.yaml        ← source: docs
    └── docs/
        ├── index.md
        ├── guides/
        └── .theme/            ← docs-site's own theme override, if any
```

Each of `marketing/` and `docs-site/` above is a complete, self-contained
bxSites project - its own `bxsites.yaml`, its own content root (resolved
by that project's own `source` key, or auto-detection - see
[Content Source](content-source.md)), and its own `.theme`/`.themes`
override living inside *that* content root. Nothing here is new or
monorepo-specific; it's the same single-project-root behavior bxSites has
always had, just with more than one project root checked into the same
repository.

Nest them however suits the repo - siblings at the root (as above),
under a shared `sites/` parent, or wherever else makes sense; bxSites
only cares about the path you hand it via `--projectRoot`, not where that
path sits relative to the rest of the repo.

## Building one domain

Point `--projectRoot` (or a bare positional path) at the project root you
want to build - every verb accepts it, not just `build`:

```bash frame="terminal" title="Terminal"
bxSites build --projectRoot=marketing
bxSites build --projectRoot=docs-site
```

Each command resolves its own `bxsites.yaml`, its own content root, and
its own theme override entirely independently - building `marketing/`
never touches `docs-site/`'s own `site/` output, config, or theme, and
vice versa. There's no shared build step and no cross-domain ordering
requirement; build whichever domains changed, in whatever order you like.

## Previewing one domain

`serve` works the same way - it previews exactly one project root at a
time:

```bash frame="terminal" title="Terminal"
bxSites serve --projectRoot=docs-site
```

To preview a different domain, stop `serve` and run it again with a
different `--projectRoot` (or from a different working directory). Two
domains that both need live previewing at once just need two separate
`serve` processes, each with its own `--projectRoot` and (if run
simultaneously) its own `--port`.

## Building every domain in CI

Since each domain is an independent `bxSites build --projectRoot=<path>`
invocation, CI just loops over the list of project roots:

```yaml title=".github/workflows/build-sites.yml" linenums="1"
name: Build sites
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        project: [marketing, docs-site]
    steps:
      - uses: actions/checkout@v4
      - name: Install BoxLang + bx-sites
        run: |
          /bin/bash -c "$(curl -fsSL https://install.boxlang.io)"
          export BOXLANG_INSTALL_HOME="/usr/local/boxlang"
          export PATH="/root/.boxlang/bin:/usr/local/bin:$PATH"
          install-bx-module bx-sites
      - name: Build ${{ matrix.project }}
        run: bxSites build --projectRoot=${{ matrix.project }}
      - uses: actions/upload-artifact@v4
        with:
          name: site-${{ matrix.project }}
          path: ${{ matrix.project }}/site/
```

A plain bash loop works just as well outside a matrix build, and makes it
easy to fail the whole job the moment any one domain fails to build:

```bash frame="terminal" title="Terminal"
for project in marketing docs-site; do
	echo "Building $project..."
	bxSites build --projectRoot="$project" || exit 1
done
```

Each domain's own `site/` output is deployed the same way a single-site
project's is - see [Deployment](deployment.md) - just once per domain,
pointed at that domain's own `deployments/*.json` and its own
`<project>/site/` folder.

## No cross-domain collision

Because `.theme`/`.themes` live inside each domain's own content root
(see [Content Source: Where a theme override lives](content-source.md#where-a-theme-override-lives))
rather than at a bare, shared project root, two domains in the same
monorepo can each carry their own theme override with zero risk of one
shadowing the other - `marketing/.theme/` and `docs-site/docs/.theme/`
are two entirely separate folders, resolved independently by each
domain's own build. The same goes for everything else project-scoped -
`bxsites.yaml`, `deployments/*.json`, `docs/versions/`, `docs/i18n/` -
each domain's own copy is exactly that domain's own, with nothing shared
unless you choose to script the sharing yourself (for example, copying a
common `extraCss` file into each domain before building).
