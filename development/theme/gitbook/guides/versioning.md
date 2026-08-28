---
title: Versioning
order: 7.5
icon: phosphor-duotone:git-branch
summary: Ship docs for more than one release at once - cut a version snapshot, and every theme gets a version switcher for free.
tags: [guides, versioning]
---

# Versioning

Versioned docs are convention over configuration - there's no `bxsites.yaml`
key to turn on. Add a `docs/versions/` folder, and each direct subfolder
inside it is built as its own fully self-contained doc tree, alongside your
regular `docs/` (which always builds as "Latest"):

```text title="docs/ layout"
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
`bxsites.yaml` config/theme. A loose file placed directly under
`docs/versions/` (not inside a subfolder) is ignored.

## Cutting a new version

`version:new` snapshots the *current* `docs/` tree into `docs/versions/<name>/`
- the usual workflow is: finish the docs for a release, cut a version right
before you start writing docs for the next one, so the snapshot freezes
exactly what shipped:

```bash title="Terminal"
bxSites version:new --name=1.0
```

- `--name` (required) - the version folder/label, e.g. `1.0`

The snapshot excludes `assets/`, `versions/`, `i18n/`, and `blog/` - each of
those is its own separately-loaded tree, not part of a version's own
content, so they're never duplicated into it.

There's no equivalent "un-cut" verb and no other verb targets a specific
version - `page:new`/`page:rename`/`post:new`/etc. always operate against
the main `docs/` tree. Editing an already-cut version's own pages (fixing a
typo in `docs/versions/1.0/guides/setup.md`, say) is just editing that file
directly, the same as any other page.

## What gets built

Every version builds to `site/versions/<name>/`, with its own nav,
breadcrumbs, prev/next links, and `editUri`s scoped correctly to that
version's own source path. Version names sort **newest-first, numerically**
rather than alphabetically - `2.0` sorts before `10.0` - and every
built-in theme renders a version-switcher dropdown in the header
automatically once more than one version exists (the main "Latest" tree
counts as one), nothing to opt into. Switching version keeps you on the
equivalent page's own tree when possible.

`sitemap.xml` and `llms.txt` include every version's pages alongside the
main site's - a version is a first-class, fully crawlable/linkable part of
the site, not a hidden archive.

## Composing with i18n

A version can be translated too - see [i18n's own "Versioned and
translated docs"](i18n.md#versioned-and-translated-docs) for the
`docs/versions/<name>/i18n/<code>/` convention, which mirrors a version's
own structure exactly the way top-level `docs/i18n/<code>/` mirrors
`docs/` itself.

## What's out of scope (for now)

- **Search is scoped per tree, not unified across versions.** The default
  `local` search provider writes a separate `search-index.json` per tree
  during a real `build` - `site/search-index.json` for "Latest",
  `site/versions/2.0/search-index.json` for version `2.0`, and so on - so
  a visitor's search only ever covers the version they're currently
  reading, never every version at once. The standalone `search-index`/
  `search:query` CLI verbs go a step further and only ever load the main
  `docs/` tree regardless of how many versions exist, since they're meant
  for a quick check against your current work-in-progress docs, not a full
  build - run `build` first if you need a real version's own index. The
  `pagefind` search provider is the exception: it crawls the *entire*
  built `site/` in one pass, versions included - see
  [Search](search.md#other-search-providers).
- **No deprecated/EOL flag, no custom label.** A version's switcher entry
  is always just its folder name - there's no config for marking one
  unsupported or renaming its displayed label independent of the folder.
  Archiving an old version means leaving its folder in place (or removing
  it and accepting the broken links, same as removing any other page).
