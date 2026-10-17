# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

----

## [Unreleased]

### Changed

* Requires `bx-yaml` 1.1.0 or later, which fixed YAML lists coming back wrapped in an extra array. bx-sites no longer repairs them itself (the repair flattened a list holding exactly one inner list), and a clear `BxSites.UnsupportedYamlModule` error replaces silent double wrapped lists when an older `bx-yaml` is installed.

### Added

* First release
* `imageGallery: true` now makes every content image click-to-enlarge (not only `::: image-gallery` items); arrows cycle through all images on the page, `class="no-zoom"` opts out
* `docbox` verb - generates a BoxLang/CFML API reference into the content
  directory from DocBox's own JSON output, with the class metadata DocBox's
  JSON strategy drops (declared properties, implemented interfaces,
  class annotations, per-function `@return` text) merged back in. Needs the
  `bx-docbox` module.
* `coldbox` verb - documents a ColdBox application from its conventions on
  disk without booting it: routes (including `resources()` expansion and
  module entry points), handlers with their actions and the routes that
  reach them, models with their WireBox injections and the binder's own
  mappings, modules, interceptors, and scheduled tasks.
* `docbox` and `coldbox` configuration blocks, with validation.
* `bxSitesDocBoxDoc` (Gradle) and `bxsites:docbox` (Maven) wrap the
  `docbox` verb for JVM projects whose sources include BoxLang/CFML
  classes. There is deliberately no ColdBox equivalent: a ColdBox
  application is built through CommandBox, not a Java build tool.

### Fixed

* Bootstrap theme home page in dark mode: the "Get Started" button took the light page text color on the bright green gradient (about 1.2:1). It now uses the dark text (14:1), and the muted-2 text color passes 4.5:1 in both modes
* `build`/`serve` crashed on Windows with a `PatternSyntaxException` in any
  project with a blog post or with responsive images enabled -
  `BlogDiscoverer`, `ContentLinter` and `ImageVariantGenerator` derived a
  file's docs-relative path by handing an absolute directory straight to
  `reReplace()` as its *pattern*; a Windows path's backslashes (`\U`, `\d`,
  ...) are regex escapes, not literal separators. Fixed via a shared
  `PathRelativizer`, the same safe substring-based approach `DocsLoader`
  already used. `serve`'s live-reload watcher had the same root cause in a
  milder form - a mixed-separator prefix check that silently always missed
  on Windows, degrading every edit to a full cache-clearing rebuild instead
  of the fast single-page path.
* The Gradle/Maven plugins' subprocess launcher never found `java.home`'s
  own `java` launcher on Windows (only `java.exe` exists there), so every
  Windows invocation of `build`/`serve`/every other verb silently fell back
  to a bare `java` PATH lookup instead of guaranteed relaunching on the
  same JVM.
* The OpenAPI output example guide (and its four translations) linked to
  `../assets/openapi/example.yaml`, one directory level too shallow for the
  page's own built (clean-URL) location - broken since the guide was
  added.

* `coldbox` told a reader to install `bx-docbox` whenever class metadata was
  missing, including when the module was installed and the DocBox run had
  simply failed. The failure is now reported with its real cause, on the
  pages and in the verb's output, and the install advice is kept for the
  case that actually calls for it.

* Spring controller-scan pages emitted a raw table whose rows carried their
  own Alpine `x-show` attributes; those never worked, because
  `TableWrapProcessor` injects its own into every row of a table with ten
  or more rows and the Markdown renderer entity-escapes a `<tr>`'s
  attribute values. Those pages now use a plain pipe table, which picks up
  bx-sites' own table filter.
