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
