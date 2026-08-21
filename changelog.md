# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

----

## [Unreleased]

* First iteration of this module
* Added a pluggable `searchProvider` setting in `bxdocs.json` - `"local"` (bx-docs' own static/lunr search) stays the default, `"algolia"` wires up Algolia DocSearch, `"pagefind"` wires up Pagefind (shells out to the `pagefind` CLI after `build`), and any other provider name can be wired up by a project's own theme override
* Added a Cmd/Ctrl+K keyboard shortcut (with a platform-detected `Ctrl K`/`⌘K` hint) to focus/open search, alongside the existing `/` shortcut, for the `local` and `pagefind` providers (`algolia` already gets it for free from DocSearch)
* Made the `::: stepper` directive block's colors themeable via three new CSS custom properties (`--bxdocs-step-marker-bg`, `--bxdocs-step-marker-text`, `--bxdocs-step-line`), overridable via `extraCss` like the rest of each built-in theme's palette - no more hardcoded stepper colors
* Added a `color` attribute to `::: step` (`success`/`warning`/`danger`) so an author can flag individual steps semantically, each backed by its own themeable `--bxdocs-step-<color>-bg`/`-text` CSS custom properties
* Extended `bxDocs migrate` with `--from=mkdocs` - converts an mkdocs project (`mkdocs.yml` + its `docs/` folder) into a complete bx-docs project in one command (`mkdocs.yml` → `bxdocs.json` + `docs/nav.json`, pages copied through unchanged since mkdocs-material's own extended Markdown syntax already is bx-docs' native syntax, assets relocated to `docs/assets/mkdocs/` with references rewritten). `--from=gitbook` (unchanged) stays the default
* Added a `bxDocs check` verb - a CI-grade content quality gate over an already-built `site/`: broken internal links/images and `<img>` tags with no `alt` attribute at all fail the check (exit `1`); pages unreachable from any tree's own homepage nav are reported as orphaned, informationally, without failing the check
* Added `docs/guides/interactivity.md` documenting Alpine.js (already bundled on every page to power the dark-mode toggle and language dropdown) as a first-class way to add reactive content - `x-data`/`x-show`/`@click`/etc. attributes on raw HTML in markdown, worked examples for a copy-to-clipboard button and a live client-side filter
* Vendored Bootstrap's own CSS/JS, highlight.js, Alpine.js and lunr.js (`resources/assets/vendor/`, `vendorAssets.mjs`) and switched every built-in theme's `layout.bxm` to reference them locally instead of a CDN - a site built with the `bootstrap`/`material` theme and the default `local` search provider now works with zero outbound network requests, no configuration needed. `mermaid`/`math`/Algolia search/Google Analytics (opt-in) and the `tailwind` theme's own CDN JIT compiler still require a CDN/hosted API - see `docs/guides/themes.md#air-gapped-offline-sites`
* Versions and locales now compose one level - a `docs/versions/<name>/i18n/<code>/` folder (the same by-convention rule as top-level `docs/i18n/<code>/`, one level down) builds `site/versions/<name>/<code>/`, and a version's own default-locale pages get a language switcher listing only the locales that version itself translates. Switching version always drops back to the target version's own default locale; switching locale always stays on the current version - see `docs/guides/i18n.md`'s "Versioned and translated docs" section
* Added `insert`/`delete` (spelled out in full, not abbreviated) and `frame="terminal"` fenced-code-block attributes, alongside the existing `hl_lines`/`linenums`/`title` - `insert`/`delete` mark added/removed lines with a tinted row and a `+`/`–` gutter marker; `frame="terminal"` swaps the plain title bar for a macOS-style terminal window. No `bxdocs.json` config needed, in all three built-in themes - see `docs/guides/markdown.md#diff-markers-and-terminal-frames`
* Fixed a dark-mode bug in real, pasted `git diff`/`git show` fences (tagged ` ```diff `): highlight.js's vendored `diff` grammar was still using GitHub's *light*-mode `.hljs-addition`/`.hljs-deletion` colors with no dark counterpart, so a real diff in dark mode rendered pale, near-unreadable boxes on a near-black background. Each built-in theme now overrides both under `[data-theme="dark"]`, reusing the same tokens as the new `insert`/`delete` markers above
