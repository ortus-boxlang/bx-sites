# ⚡︎ BX Docs

```
|:------------------------------------------------------:|
| ⚡︎ B o x L a n g ⚡︎
| Dynamic : Modular : Productive |
| :----------------------------: |
```

<blockquote>
	Copyright Since 2023 by Ortus Solutions, Corp
	<br>
	<a href="https://www.boxlang.io">www.boxlang.io</a> |
	<a href="https://www.ortussolutions.com">www.ortussolutions.com</a>
</blockquote>

<p>&nbsp;</p>

Static documentation site generator for BoxLang, built on bx-markdown - in the spirit of [mkdocs](https://www.mkdocs.org/): write Markdown in `docs/`, get a themed, searchable static site out.

----

## Quick Start

```bash
# Install this module and its dependencies, via CommandBox
box install bx-docs
box install bx-markdown
box install bx-esapi

# Scaffold a new docs project (docs/ + bxdocs.json)
boxlang module:bxDocs new my-docs
cd my-docs

# Build the static site to site/
boxlang module:bxDocs build

# Or build and serve locally with live reload while you write
boxlang module:bxDocs serve
```

See [Getting Started](docs/getting-started.md) for the full walkthrough.

## Usage

```bash
boxlang module:bxDocs <verb> [options]
```

| Verb | Purpose |
|---|---|
| `new` | Scaffold a docs project (`docs/` + `bxdocs.json`, defaulting to the `bootstrap` theme) |
| `build` | Render `docs/**.md` into a static site in `site/`, including the search index, `sitemap.xml`, `llms.txt` and assets. Needs bx-markdown and bx-esapi installed |
| `serve` | Build and serve the site locally with live reload (needs bx-markdown and bx-esapi too) |
| `search-index` | Rebuild `site/search-index.json` standalone (also runs automatically during `build`) |
| `clean` | Remove `site/` and any build cache |

Every verb accepts `--projectRoot=<path>` (or a bare positional path) to target a project other than the current directory. Run `boxlang module:bxDocs --help` for full usage.

## Documentation

This repository documents itself with BX Docs - see `bxdocs.json` and `docs/` at the repo root, published at:

- **[ortus-boxlang.github.io/bx-docs](https://ortus-boxlang.github.io/bx-docs/)** - stable docs, built from `main`
- **[ortus-boxlang.github.io/bx-docs/development](https://ortus-boxlang.github.io/bx-docs/development/)** - latest/unreleased docs, built from `development`

Or read the source directly:

- [Getting Started](docs/getting-started.md)
- [CLI Reference](docs/cli-reference.md)
- [Configuration](docs/configuration.md) - the full `bxdocs.json` reference
- Guides: [Themes](docs/guides/themes.md) · [Search](docs/guides/search.md) · [Deploying to GitHub Pages](docs/guides/deployment.md)
- [Releases](docs/releases/index.md) - versioning policy and what's new per release

See [MODULE_SPEC.md](MODULE_SPEC.md) for the design spec driving this module's development.

## Directory Structure

- `.github/workflows` - CI: tests (`tests.yml`), PR checks (`pr.yml`), snapshot/release builds (`snapshot.yml`, `release.yml`), and publishing this repo's own docs to GitHub Pages (`pages.yml`)
- `models` - the module's own source: `models/cli` (one dispatcher per `bxDocs` verb), `models/config` (`bxdocs.json` loader/validator), `models/build` (project scaffolding + the docs/nav/markdown/theme/search/sitemap build pipeline)
- `resources/themes` - built-in themes (native BoxLang `.bxm` templates + assets): `bootstrap` (default), `material`, `tailwind` - all with the BoxLang brand palette, dark mode, breadcrumbs and code-copy buttons applied out of the box. A project can override any of them via its own `theme/` folder (same `layout.bxm` + `page.bxm` contract - see [Themes](docs/guides/themes.md))
- `resources/assets` - module-wide shared client-side assets: the search widget (`search.js`) and the copy-code button (`copy-code.js`)
- `docs` / `bxdocs.json` - this repository's own docs, built by BX Docs itself (`boxlang module:bxDocs build`)
- `tests/specs` - TestBox specs, one bundle per class under `models/`
- `bifs`, `components`, `interceptors` - unused by this module today, kept for BoxLang module convention
- `box.json` - package metadata used to publish to ForgeBox
- `ModuleConfig.bx` - this module's configuration/CLI entry point

## Local Building

`Build.bx` packages this module for distribution to ForgeBox: it produces a zip in `build/` containing everything needed to run the module (`box.json`, `ModuleConfig.bx`, and the rest of the module's own files).

```bash
boxlang Build.bx --version=1.1.0
```

| Option    | Required | Default Value    | Description                        |
| --------- | -------- | ---------------- | ---------------------------------- |
| `version` | No       | `1.0.0`          | The version of the module.         |
| `branch`  | No       | `development`    | The branch being built.            |
| `buildId` | No       | UUID (generated) | A unique identifier for the build. |

## Running Tests

1. With CommandBox installed, install TestBox: `box install`
2. Register the module so BoxLang can resolve its `bxdocs.*` source classes: symlink this repo into your BoxLang home's `modules/` folder - that's `~/.boxlang/modules` unless `$BOXLANG_HOME` is set to something else (CI pins it to the checkout's own `.boxlang/`, per `.github/workflows/tests.yml`):
   ```bash
   mkdir -p "${BOXLANG_HOME:-$HOME/.boxlang}/modules"
   ln -s "$(pwd)" "${BOXLANG_HOME:-$HOME/.boxlang}/modules/$(basename "$(pwd)")"
   ```
3. With the BoxLang CLI installed, run tests using `./testbox/run`

## Version Management

This module uses [SemVer](https://semver.org/) for versioning. The version is stored in `box.json`, used to publish to ForgeBox, and bumped automatically by the release workflow, which also tags the repo for each release.

## GitHub Actions Automation

- `pr.yml` - runs the test suite against every pull request
- `tests.yml` - the reusable test-suite workflow (`./testbox/run`), called by both `pr.yml` and `snapshot.yml`
- `snapshot.yml` - on every push to `development`: runs tests, then builds and publishes a snapshot release
- `release.yml` - builds and publishes a release to ForgeBox (a stable release from `main`, or a snapshot when called from `snapshot.yml`); requires a `FORGEBOX_API_TOKEN` secret
- `pages.yml` - builds and publishes this repo's own dogfooded docs to GitHub Pages (see [Deploying to GitHub Pages](docs/guides/deployment.md))
- `cron.yml` - runs the test suite daily against `development`

## Ortus Sponsors

BoxLang is a professional open-source project and it is completely funded by the [community](https://patreon.com/ortussolutions) and [Ortus Solutions, Corp](https://www.ortussolutions.com). Ortus Patreons get many benefits like a cfcasts account, a FORGEBOX Pro account and so much more. If you are interested in becoming a sponsor, please visit our patronage page: [https://patreon.com/ortussolutions](https://patreon.com/ortussolutions)

### THE DAILY BREAD

> "I am the way, and the truth, and the life; no one comes to the Father, but by me (JESUS)" Jn 14:1-12
