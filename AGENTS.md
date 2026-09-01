# Project Guidelines

## Purpose

This repository contains the `bx-sites` BoxLang module, its static-site
generator, and the documentation site that dogfoods it. Keep changes focused
on the module's public CLI, build output, tests, documentation, and packaging
contracts.

## Architecture

- `ModuleConfig.bx` owns module metadata, runtime activation, CLI argument
  parsing, and verb dispatch.
- `models/build/` contains the build pipeline and content processors.
- `models/cli/` contains one dispatcher class per CLI verb.
- `models/config/` contains configuration and source-directory resolution.
- `models/deploy/` contains deployment contracts and target implementations;
  `models/publish/` contains the bxSites Cloud publisher.
- `resources/assets/` and `resources/themes/` are packaged runtime resources.
- `docs/` is this repository's site source, `tests/specs/` contains TestBox
  specs, and `tests/support/` contains test doubles and fixtures.
- Keep implementation BoxLang-first. Add Java libraries or compiled classes
  only when they are genuinely required as packaged runtime input.

### Project folders

- A consuming project uses `docs/` or `src/` as its content source directory.
  `SourceDirResolver` checks `docs/` first, then `src/`, and defaults to
  `docs/` when neither exists.
- `site/` is always generated build output. Never treat it as a source folder;
  builds remove and recreate it.
- Deployment configuration belongs under `deployments/`, not `deploy/`, to
  avoid colliding with the `deploy` CLI verb.
- `bxsites.yaml` is the preferred project configuration format. JSON remains
  supported through `bxsites.json` and `--format=json`; `docs/nav.json` is
  always JSON because it is parsed separately as a navigation override.

## Build And Test

- Install dependencies with `box install --verbose --nosave` when reproducing
  CI locally.
- Run the focused TestBox suite with:
  `./testbox/run --reporter=ANTJunit --verbose`.
- TestBox's runner does not reliably return a failing process exit code. When
  consuming its results in automation, inspect the generated JUnit XML for
  nonzero `failures` or `errors`, as `.github/workflows/tests.yml` does.
- Package the module with `boxlang Build.bx --version=<version>
  --buildId=<id> --branch=<branch>`. Preserve token replacement, source
  exclusions, the primary artifact, the with-dependencies artifact, and
  checksum generation. Generated files belong under `build/`.
- For a real local site build, use `boxlang bxSites build`. The repository's
  `buildMultiTheme.sh` is local preview tooling only; it builds the ten themes
  with separate Git worktrees and requires `boxlang`, `yq`, and a Git checkout.
- Changes to the real build path should be checked with a real build, not only
  the TestBox fakes. CI also verifies that a successful-looking build produced
  non-empty `site/` output because CLI errors can be swallowed during dispatch.

## Documentation And Locales

- Keep `docs/i18n/{de,es,it,ja}/` synchronized with the English documentation
  tree. Any documentation change under `docs/` needs the equivalent translated
  update in each locale mirror unless the task explicitly scopes the change to
  English.
- New examples should use YAML by default and should match the behavior of a
  freshly scaffolded `bxSites new` project.
- Preserve the distinction between authored source under `docs/` or `src/` and
  generated output under `site/`.

## BoxLang Conventions

- Avoid private helper names that collide with built-in functions, and qualify
  helper calls when name resolution could be ambiguous.
- An arrow closure has its own `arguments` scope. Capture outer arguments in a
  local variable before using them inside `filter`, `map`, `some`, or similar
  callbacks.
- Do not mix positional and named arguments in one call. Use one style for the
  complete call.
- BoxLang string literals use doubled delimiters rather than backslash escapes.
  Interpolation with `#...#` works in both quote styles; construct literal hash
  delimiters with `char( 35 )` when a string would otherwise contain a pair.
- `dateFormat()` masks are case-sensitive: `MM` is month and `mm` is minutes.
- `directoryList(path, true, "path")` can include directories; filter them when
  a file-only result is required.
- Use the module mapping (`bxsites`) for runtime class lookup, not the ForgeBox
  slug (`bx-sites`).
- CLI primary values should use `--flag=value`; a bare first positional can be
  interpreted as a project-root override by `ModuleConfig.bx`.

## GitHub Actions

- `.github/workflows/tests.yml` installs BoxLang dependencies, links this
  checkout into `BOXLANG_HOME/modules`, runs the TestBox suite, and uploads
  JUnit results.
- `.github/workflows/pages.yml` builds the ten built-in themes in a matrix,
  verifies each `site/` before publishing, and assembles the theme gallery.
  The workflow detects whether `main` exists before splitting ownership of the
  published root and `/next/` content between `main` and `development`.
- Keep workflow changes aligned with the module's actual packaging and build
  behavior; do not rely on a green CLI exit code alone for site builds.

## Change Discipline

- Prefer small, template-safe changes and preserve public APIs and generated
  output conventions.
- Update related metadata together when changing names, versions, slugs, or
  build tokens: `ModuleConfig.bx`, `box.json`, `Build.bx`, `readme.md`, and
  `changelog.md` as applicable.
- Do not commit generated `build/`, `site/`, test-result, or temporary files.
- Keep this file focused on repository-wide rules. Put task-specific workflows
  in a scoped instruction file or skill instead.
