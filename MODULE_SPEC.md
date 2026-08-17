# bx-docs — Module Spec v0.1

A BoxLang module that generates static documentation sites from Markdown, in the spirit of mkdocs + mkdocs-material.

## 1. Identity

- Module name: `bx-docs`
- Slug: `bx-docs`
- BoxLang mapping: `bxdocs`
- Executable name: `bxDocs`

### box.json

```json
{
  "name": "BX Docs",
  "version": "@build.version@+@build.number@",
  "slug": "bx-docs",
  "type": "boxlang-modules",
  "shortDescription": "Static documentation site generator for BoxLang, built on bx-markdown",
  "boxlang": {
    "minimumVersion": "1.0.0",
    "moduleName": "bxdocs",
    "executable": "bxDocs"
  },
  "dependencies": {
    "bx-markdown": "*"
  }
}
```

## 2. Invocation

```
boxlang module:bxDocs <verb> [options]
```

`ModuleConfig.bx` implements `main(args)` following the same verb-dispatch pattern as bx-agents: parsed CLI options (`--flag`, `--flag=value`, `--no-flag`, short forms), `resolveProjectRoot()` precedence (`--projectRoot` > first positional > cwd), one dispatcher class per verb under `models/cli/`.

### Verbs (v1)

| Verb | Purpose |
|---|---|
| `new` | Scaffold a docs project |
| `build` | Render `docs/**.md` → static site in `site/` |
| `serve` | Build + serve locally with live reload |
| `search-index` | Rebuild the search index standalone (also runs automatically during `build`) |
| `clean` | Remove `site/` and any cache |

## 3. Project structure

```
docs/                  # markdown source; folder nesting = nav structure
bx-docs.json           # site config
theme/                 # optional project-level theme override
site/                  # build output (generated)
```

## 4. Config file — bx-docs.json

Site name, description, nav (auto-inferred from folder/file structure, overridable), theme name + theme options, base URL, search on/off, markdown-extension passthrough settings (table options, anchor links, YouTube transformer, code style — all sourced from bx-markdown's existing option set).

## 5. Core pipeline

1. **Loader** — walks `docs/`, reads `.md` files + frontmatter (`title`, `order`, `hidden`)
2. **Parser** — delegates to **bx-markdown** (`MarkdownToHTML()` BIF / `bx:markdown` component); no custom parser
3. **Nav builder** — folder/file structure → nav tree, frontmatter overrides applied
4. **Theme renderer** — invokes the active theme's `.bxm` templates with page data + nav tree in scope
5. **Search indexer** — builds a static JSON index (title, url, headings, truncated body text)
6. **Asset pipeline** — copies theme assets + `docs/assets/` into `site/`

## 6. Theme system

- Themes are native **BoxLang `.bxm` templates** — no separate template engine
- `ThemeProvider` contract: each theme folder provides `layout.bxm`, `page.bxm`, `search.bxm` (or search partial), `assets/` (css/js)
- Built-in themes ship in module `resources/themes/`; custom/project themes resolved relative to project root and referenced by name/path in `bx-docs.json`

### Built-in themes (v1)

- **`bootstrap` (default)** — Bootstrap (latest), restyled with BoxLang brand:
  - Gradient: `#00FF78` → `#00DBFF`
  - Accent: `#FFF500`
  - Font: Poppins
  - BoxLang logo mark
- **`material`** — Material-style, same brand palette applied
- **`tailwind`** — Tailwind-based, same brand palette applied

`new` defaults to `bootstrap` unless `--theme` is passed.

## 7. Search (v1, locked)

- Fully static, client-side — matches mkdocs' default (lunr.js), no server dependency
- Index built at `build` time → `site/search-index.json`
- Each theme wires its own search UI against the shared index format
- Meilisearch integration (bx-meilisearch) explicitly deferred to a future optional add-on, not v1 core

## 8. Open items

None currently blocking. Deferred to later phases:
- Optional `bx-docs-search-meilisearch` add-on
- Versioned docs (multiple doc sets / version switcher)
- Plugin hook system beyond themes (e.g. custom markdown extensions, custom nav sources)

## 9. Phased task breakdown

**Phase 1 — Module skeleton**
- box.json, ModuleConfig.bx `main()` + verb stubs
- bx-docs.json loader/validator
- `new` verb (scaffold project + bootstrap theme default)

**Phase 2 — Core build pipeline**
- Loader + frontmatter parsing
- bx-markdown integration
- Nav builder
- Default theme (`bootstrap`) render path
- `build` verb end to end

**Phase 3 — Theme system**
- Formalize `ThemeProvider` contract
- Add `material`, `tailwind` themes
- Custom/project-level theme override support

**Phase 4 — Search**
- Static index builder
- Client search UI wired per theme
- `search-index` verb

**Phase 5 — serve / clean / polish**
- `serve` verb with live reload
- `clean` verb
- Docs + examples for bx-docs itself (dogfooding)
