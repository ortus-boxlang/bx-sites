---
title: Content Source
order: 0.5
icon: phosphor-duotone:folder-open
tags: [guides, configuration]
---

# Content Source

Every project has exactly one content root - the folder bxSites scans for
`.md` pages, `assets/`, `blog/`, `i18n/`, `versions/`, and everything else
covered elsewhere in these docs. This guide covers how that folder is
found, how to point it somewhere else with `source`, how to keep stray
files out of the scan with `exclude`, and where a project's own theme
override lives relative to it.

## Auto-detection (the default)

With no `source` key set at all, bxSites looks for `docs/` first, then
`src/`, and uses whichever one actually exists on disk - the same
long-standing convention covered in
[Getting Started](../getting-started.md#add-pages). This is fine for most
projects and needs no config at all.

## The `source` config key

Set `source` in `bxsites.yaml` to skip auto-detection and say explicitly
where your content lives:

=== "YAML"
    ```yaml title="bxsites.yaml"
    source: docs
    ```

=== "JSON"
    ```json title="bxsites.json"
    { "source": "docs" }
    ```

=== "TOML"
    ```toml title="bxsites.toml"
    source = "docs"
    ```

`source` accepts:

- `docs` or `src` - the same two conventional names auto-detection already
  checks, just spelled out explicitly instead of inferred.
- Any other folder name - `content`, `pages`, `website`, whatever fits your
  project. Auto-detection only ever looks for `docs`/`src`; a custom name
  always needs an explicit `source`.
- `.` - the project root itself is the content root, with no subfolder at
  all. Useful for a project that's *only* a docs site - nothing else in
  the repo - where adding a `docs/` layer on top would just be one more
  folder to navigate. `build`/`serve`/every other verb then scans the
  whole project root for `.md` pages, exactly as they'd scan `docs/`
  otherwise.

`bxSites new` always writes an explicit `source:` into the `bxsites.yaml`
it scaffolds (`docs` by default, or whatever `--source=...` you passed) -
see [Getting Started](../getting-started.md#scaffold-a-project) - so a
freshly-created project is never ambiguous about where its content lives,
even before auto-detection would come into play.

One name is off-limits regardless: `source: site` always fails, since
`site/` is bxSites' own generated build output - every build removes and
recreates it, so letting it double as a source folder too would mean a
build deleting its own content.

## The `BxSites.SourceNotConfigured` error

If `source` is left unset **and** neither `docs/` nor `src/` exists on
disk, the build fails loudly instead of silently falling back to the
project root:

```text
BxSites.SourceNotConfigured: No docs/ or src/ folder found, and no
[source] set in bxsites.yaml - set source: docs, source: src, or
source: . (if your whole repo is the content) to tell bxSites where
your content lives
```

This is deliberate - guessing "the project root must be the content"
whenever neither conventional folder exists would silently sweep up
things like `README.md`, a `CHANGELOG.md`, CI config, or a repo's own
source code into a build the moment someone renamed `docs/` to something
else, or ran bxSites against a repo that was never meant to be a docs
site at all. The fix is always one line in `bxsites.yaml`:

=== "YAML"
    ```yaml title="bxsites.yaml"
    source: .
    ```

=== "JSON"
    ```json title="bxsites.json"
    { "source": "." }
    ```

=== "TOML"
    ```toml title="bxsites.toml"
    source = "."
    ```

(or `source: docs`/`source: src` if you meant one of those and the folder
just doesn't exist yet - create it, or point `source` at wherever the
content actually lives).

## Excluding files and folders

bxSites always excludes a handful of names from the content scan on its
own - `.git`, `.github`, `node_modules`, `boxlang_modules`, `site`,
`.theme`, `.themes`, and its own config file (`bxsites.yaml`/`.yml`/
`.toml`/`.json`, `box.json`) - the same way it already excludes
`assets/`, `versions/`, `i18n/`, `blog/`, and `includes/` from being
scanned as regular pages. `exclude` adds your own names on top of that
list:

=== "YAML"
    ```yaml title="bxsites.yaml"
    source: .
    exclude:
      - tests
      - build
      - CONTRIBUTING.md
    ```

=== "JSON"
    ```json title="bxsites.json"
    {
    	"source": ".",
    	"exclude": ["tests", "build", "CONTRIBUTING.md"]
    }
    ```

=== "TOML"
    ```toml title="bxsites.toml"
    source = "."
    exclude = [ "tests", "build", "CONTRIBUTING.md" ]
    ```

Each entry is a bare name, matched the same way the built-in exclusions
are - at the root of the content folder, or anywhere underneath it.

This is most useful paired with `source: .`. Once the whole repository is
the content root, everything in it that isn't itself a page needs to be
named explicitly - a `tests/` folder, a `build/` output directory,
tooling config, or anything else that would otherwise get scanned and
published as if it were a doc page. `exclude` is deliberately *not*
pre-populated with `README.md`/`LICENSE.md`/`CHANGELOG.md`, though - a
project is free to have a real content page at exactly one of those
names (this module's own `docs/license.md`, for one), so if your
`source: .` project doesn't want its root `README.md`/`LICENSE.md`/
`CHANGELOG.md` published as a page, opt out of each by name via
`exclude` instead of relying on it happening automatically.

See [Configuration: `exclude`](../configuration.md#exclude) for the full
reference entry.

## Where a theme override lives

A project's own theme override - a hand-authored `.theme/` (see
[Themes: Overriding a theme](themes.md#overriding-a-theme)) or an
`install:theme`-installed `.themes/<name>/` (see
[Themes: Installing a published theme](themes.md#installing-a-published-theme)) -
lives **inside the resolved content root**, not at the bare project root:
`<contentRoot>/.theme/` and `<contentRoot>/.themes/<name>/`, where
`<contentRoot>` is wherever `source` (or auto-detection) resolves to -
`docs/`, `src/`, a custom folder name, or the project root itself for
`source: .`.

```text title="Project structure"
my-project/
├── bxsites.yaml          ← source: docs
└── docs/                 ← the resolved content root
    ├── index.md
    ├── assets/
    └── .theme/            ← lives inside docs/, not at the project root
        ├── layout.bxm
        └── page.bxm
```

Keeping `.theme`/`.themes` inside the content root rather than at the
bare project root matters most once a repository has more than one
project root in it - see
[Multi-Domain Monorepos](multi-domain.md) for that pattern. Each
project root's own theme override then lives unambiguously next to the
content it themes, with no question of which domain a bare top-level
`theme/` folder would have belonged to.
