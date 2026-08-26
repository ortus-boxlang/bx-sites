# ⚡︎ BX Sites

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

Write your content in Markdown. BX Sites turns it into a complete, themed, searchable website - ready to deploy.

It's a general-purpose static site generator, not just for documentation - docs, a blog, a marketing site, a knowledge base, anything Markdown can express, all built the same way, with the same themes, search and i18n. Built in BoxLang on top of [bx-markdown](https://github.com/ortus-boxlang/bx-markdown), in the spirit of [mkdocs](https://www.mkdocs.org/): point it at a `docs/` folder (or `src/`, if that reads better for your project) and get a themed, searchable static site out. Already on GitBook or mkdocs? `bxSites migrate --source=...` converts an existing export/project straight into a bx-sites one - see [Migrating from GitBook](docs/guides/migrating-from-gitbook.md) or [Migrating from mkdocs](docs/guides/migrating-from-mkdocs.md).

----

## Quick Start

Needs the [BoxLang](https://boxlang.io) runtime installed first - either
the quick installer (`curl -fsSL https://install.boxlang.io/ | bash`) or
[BVM](https://boxlang.ortusbooks.com/getting-started/installation/boxlang-version-manager-bvm)
(`curl -fsSL https://install-bvm.boxlang.io/ | bash`). See
[Getting Started](docs/getting-started.md#prerequisite-install-boxlang) for
details.

```bash
# OS Binary
install-bx-module bx-sites

# CommandBox
box install bx-sites

# Scaffold a new docs project (docs/ + bxsites.yaml)
bxSites new my-docs
cd my-docs

# Build the static site to site/
bxSites build

# Or build and serve locally with live reload while you write
bxSites serve
```

See [Getting Started](docs/getting-started.md) for the full walkthrough.

## Usage

`box install` drops a standalone `bxSites` script on your `PATH` (via
`box.json`'s `boxlang.executable`), so every verb can be run either that
short way, or as `boxlang bxSites <verb>` - both run the exact same
thing; use the longer form anywhere the `PATH` shim isn't set up (a CI
runner, a module registered by hand):

```bash
bxSites <verb> [options]
# or, equivalently:
boxlang bxSites <verb> [options]
```

| Verb | Purpose |
|---|---|
| `new` | Scaffold a docs project (`docs/` + `bxsites.yaml`, defaulting to the `bootstrap` theme; `--format=json` for `bxsites.json` instead) |
| `build` | Render `docs/**.md` into a static site in `site/`, including the search index, `sitemap.xml`, `llms.txt` and assets. Needs bx-markdown, bx-esapi, bx-yaml and bx-image installed |
| `serve` | Build and serve the site locally with live reload (needs bx-markdown, bx-esapi, bx-yaml and bx-image too) |
| `search-index` | Rebuild `site/search-index.json` standalone (also runs automatically during `build`) |
| `clean` | Remove `site/` and any build cache |
| `migrate` | Convert an existing GitBook export or mkdocs project into `docs/` + `nav.json` (`--from=gitbook`, the default, or `--from=mkdocs`) |
| `stats` | Read-only summary report on a built `site/`: page/word counts, versions/locales, blog, tags, search index, site size |
| `doctor` | Environment/config health check: JVM, `docs/` (or `src/`), config validity, required modules, theme override |
| `post:new` | Scaffold a new blog post at `docs/blog/posts/<slug>.md` |
| `version:new` | Snapshot `docs/` into a new `docs/versions/<name>/` |
| `i18n:status` | Per-locale translation coverage report against the default tree |
| `i18n:new` | Scaffold a new `docs/i18n/<code>/` locale |
| `page:new` | Scaffold a single docs page at an arbitrary path |
| `plugin:new` | Scaffold a plugin module skeleton |
| `install:plugin` | Download a plugin from ForgeBox into project-local `boxlang_modules/` |
| `theme:new` | Eject a built-in theme into project `theme/` for customizing |
| `install:theme` | Download a theme from ForgeBox into project-local `themes/<name>/` |
| `theme:import` | Best-effort convert a mkdocs/jekyll/hugo theme's own template files into a `themes/<name>/` scaffold |
| `page:rename` | Move a docs page and rewrite every relative link that pointed at it |
| `blog:drafts` | List every blog post whose frontmatter sets `draft: true` |
| `blog:find` | Filter blog posts by author/category/tag/date range |
| `search:query` | Query a built `search-index.json` and rank results |
| `lint` | Pre-build content checks: heading level skips, blog posts missing a valid date |
| `deploy` | Build and ship `site/` to a real target (s3, azure, gcs, firebase, ftp, sftp, rsync, netlify, vercel, cloudflare-pages, local, github-pages); no args deploys every `deployments/*.json` entry; `--verbose` |
| `package` | Build and zip `site/` into a single archive (`--output=<path>`, defaults to `site.zip`) |

Every verb accepts `--projectRoot=<path>` (or a bare positional path) to target a project other than the current directory. Run `bxSites --help` for full usage.

## Documentation

This repository documents itself with BX Sites - see `bxsites.yaml` and `docs/` at the repo root, published at:

- **[ortus-boxlang.github.io/bx-sites](https://ortus-boxlang.github.io/bx-sites/)** - stable docs, built from `main`
- **[ortus-boxlang.github.io/bx-sites/development](https://ortus-boxlang.github.io/bx-sites/development/)** - latest/unreleased docs, built from `development`

Both are built with all ten built-in themes side by side (`bootstrap` at the root, every other theme under `theme/<name>/`) - this doubles as a theme gallery - use the switcher next to the dark-mode toggle to flip between them on any page. CI builds each theme as its own parallel job (see `.github/workflows/pages.yml`); `./buildMultiTheme.sh` reproduces the same gallery layout locally for a quick preview.

Or read the source directly:

- [Getting Started](docs/getting-started.md)
- [CLI Reference](docs/cli-reference.md)
- [Configuration](docs/configuration.md) - the full site config reference (`bxsites.yaml`, the default, or `bxsites.json`)
- Guides: [Themes](docs/guides/themes.md) · [Search](docs/guides/search.md) · [Deployment](docs/guides/deployment.md) · [Migrating from GitBook](docs/guides/migrating-from-gitbook.md)
- [Releases](docs/releases/index.md) - versioning policy and what's new per release

See [MODULE_SPEC.md](MODULE_SPEC.md) for the design spec driving this module's development.

## Directory Structure

- `.github/workflows` - CI: tests (`tests.yml`), PR checks (`pr.yml`), snapshot/release builds (`snapshot.yml`, `release.yml`), and publishing this repo's own docs to GitHub Pages (`pages.yml`)
- `models` - the module's own source: `models/cli` (one dispatcher per `bxSites` verb), `models/config` (site config loader/validator - `bxsites.yaml`/`.yml`/`.json`), `models/build` (project scaffolding + the docs/nav/markdown/theme/search/sitemap build pipeline), `models/deploy` (the `deploy` verb's pluggable targets - S3, Azure, GCS, Firebase, FTP/SFTP, rsync, Netlify, Vercel, Cloudflare Pages, local, GitHub Pages)
- `resources/themes` - built-in themes (native BoxLang `.bxm` templates + assets), ten in total: `bootstrap` (default), `material`, `tailwind`, plus seven `material`-forked themes (`docsy`, `slate`, `docusaurus`, `justthedocs`, `vuepress`, `gitbook`, `notion`) - all with the BoxLang brand palette, dark mode, breadcrumbs and code-copy buttons applied out of the box. A project can override any of them via its own `theme/` folder (same `layout.bxm` + `page.bxm` contract - see [Themes](docs/guides/themes.md))
- `resources/assets` - module-wide shared client-side assets: the search widget (`search.js`) and the copy-code button (`copy-code.js`)
- `docs` / `bxsites.yaml` - this repository's own docs, built by BX Sites itself (`boxlang bxSites build`)
- `tests/specs` - TestBox specs, one bundle per class under `models/`
- `bifs`, `components`, `interceptors` - unused by this module today, kept for BoxLang module convention
- `box.json` - package metadata used to publish to ForgeBox
- `ModuleConfig.bx` - this module's configuration/CLI entry point

## Local Building

`Build.bx` packages this module for distribution to ForgeBox: it produces a zip in `build/` containing everything needed to run the module (`box.json`, `ModuleConfig.bx`, and the rest of the module's own files).

It also produces a second, self-contained artifact - `build/artifacts/bx-sites-<version>-with-deps.zip` - that additionally bundles every runtime dependency from `box.json`'s `dependencies` block (`bx-markdown`, `bx-esapi`, `bx-yaml`, `bx-image`) inside a `modules/` folder alongside the module itself, using BoxLang's [module inception](https://boxlang.ortusbooks.com/boxlang-framework/module-development/module-inception): a module's own `modules/` folder is discovered and activated before the module itself, so this artifact needs nothing pre-installed to run standalone - just drop it into a `modules/` (or `boxlang_modules/`) folder on its own. The primary `bx-sites-<version>.zip` artifact - and the `box forgebox publish` step, which publishes from `build/module` - are unaffected; the bundled dependencies only ever land in the `-with-deps` artifact, built from a separate `build/module-with-deps` copy.

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
2. Register the module so BoxLang can resolve its `bxsites.*` source classes: symlink this repo into your BoxLang home's `modules/` folder - that's `~/.boxlang/modules` unless `$BOXLANG_HOME` is set to something else (CI pins it to the checkout's own `.boxlang/`, per `.github/workflows/tests.yml`):
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
