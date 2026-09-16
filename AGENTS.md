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
- Use the native BoxLang TestBox runner at `./testbox/run`; its streaming flag
  is `--stream` (not `--streaming`).
- Run all normal specs with `./testbox/run --stream` or use
  `./testbox/run --reporter=ANTJunit --verbose` for CI-style output.
- Select bundles with `--bundles=<dot-notated-bundle>`; use
  `--filter-bundles=<pattern>` only to filter discovered bundles. For example:
  `./testbox/run --bundles=tests.specs.cli.NewSpec --stream`.
- Use `--show-failed-only --hide-skipped` to keep focused streaming output
  concise, and `--slow-threshold-ms=<n>` or `--top-slowest=<n>` to investigate
  slow specs.
- The full dogfood documentation build is opt-in. Normal tests skip
  `DogfoodDocsSpec` without building the docs; run it explicitly with:
  `BXSITES_RUN_DOGFOOD_TESTS=true ./testbox/run --bundles=tests.specs.DogfoodDocsSpec --stream`.
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

## Available Skills

The repository ships task-specific agent skills in `.agents/skills`. Before
implementing, reviewing, or debugging work covered by one of these areas, read
the relevant `SKILL.md` and follow its guidance. Prefer the most specific skill
available when more than one applies.

### BoxLang Core

- `boxlang-core-dev-async-tasks`: BoxFuture, AsyncService, executors, schedulers, and async lifecycle callbacks.
- `boxlang-core-dev-bif-development`: Custom BoxLang built-in functions and module registration.
- `boxlang-core-dev-component-development`: Custom BoxLang components and tag registration.
- `boxlang-core-dev-interceptors`: Interceptors, observer events, pools, and registration.
- `boxlang-core-dev-logging`: LoggingService, BoxLangLogger, and structured logging configuration.
- `boxlang-core-dev-module-development`: ModuleConfig lifecycle, metadata, BIFs, interceptors, and packaging.
- `boxlang-core-dev-runtime-architecture`: BoxLang runtime, scopes, types, parsing, contexts, and class loading.
- `boxlang-scheduled-tasks`: Scheduler DSL, cron/frequency constraints, lifecycle callbacks, and scheduled HTTP work.
- `boxlang-security`: BoxLang security settings, validation, file uploads, secrets, and OWASP concerns.
- `boxlang-templating`: `.bxm` templates, mixed HTML/BoxLang, and template components.
- `boxlang-web-development`: BoxLang web applications, HTTP handling, REST, sessions, CSRF, and servers.
- `boxlang-zip`: ZIP creation and extraction with the `bx:zip` component.

### BoxLang Modules And Integrations

- `bx-docbox`: DocBox API documentation generation and output strategies.
- `bx-esapi`: OWASP ESAPI encoding, decoding, and HTML sanitization.
- `bx-ftp`: FTP, FTPS, SFTP, SSH keys, and connection pools.
- `bx-image`: Image creation and manipulation with bx-image.
- `bx-mail`: Mail components, multipart messages, SMTP, signing, and encryption.
- `bx-pdf`: PDF documents, sections, headers, footers, saving, and encryption.
- `bx-rss`: RSS/Atom feed reading and creation.
- `bx-web-support`: Mock web servers, requests, and web-context tests.
- `bx-yaml`: YAML serialization, deserialization, files, and BoxLang classes.

### CommandBox

- `commandbox-config-settings`: Global CommandBox settings and environment overrides.
- `commandbox-deploying`: CommandBox production deployment, Docker, CI, and hosting.
- `commandbox-developing`: Custom commands, namespaces, WireBox, modules, and interceptors.
- `commandbox-embedded-server`: Embedded server configuration, SSL, bindings, aliases, and profiles.
- `commandbox-package-management`: `box.json`, ForgeBox packages, dependencies, locks, and publishing.
- `commandbox-setup`: Installing and configuring CommandBox and Java runtimes.
- `commandbox-task-runners`: Task runners, targets, lifecycle hooks, jobs, watchers, and shell integration.
- `commandbox-testing`: CommandBox and TestBox integration, runners, reporters, and coverage.
- `commandbox-usage`: CommandBox commands, namespaces, settings, recipes, aliases, and shell usage.

### Testing

- `boxlang-testing`: BoxLang TestBox tests, BDD, xUnit, MockBox, fixtures, async tests, and CLI execution.
- `testbox-assertions`: `$assert` methods, custom assertions, type, collection, exception, and numeric checks.
- `testbox-bdd`: BDD suites, lifecycle hooks, labels, focused/skipped specs, and data binding.
- `testbox-cbmockdata`: Realistic mock data, nested objects, arrays, and custom suppliers.
- `testbox-expectations`: Fluent `expect()` matchers, collection modes, negation, and custom matchers.
- `testing-fixtures`: Shared fixtures, factories, test data builders, and fixture lifecycle.
- `testbox-listeners`: Test run listener callbacks and lifecycle reporting.
- `testbox-mockbox`: MockBox mocks, stubs, spies, verification, properties, and query simulation.
- `testbox-reporters`: TestBox reporter selection, options, and custom reporters.
- `testbox-runners`: TestBox CLI, BoxLang, web, programmatic, streaming, watcher, and filtering options.
- `testbox-unit-xunit`: xUnit test classes, lifecycle methods, `$assert`, and AAA structure.
- `testing-coverage`: Coverage configuration, reporting, CI integration, and interpretation.
- `testing-fixtures`: Shared fixtures, factories, test data builders, and fixture lifecycle.

### Engineering And Supporting Tools

- `code-documenter`: Developer documentation, API references, runbooks, and documentation consistency.
- `code-reviewer`: Reviews focused on correctness, security, maintainability, performance, and test risk.
- `gitbook-docs-expert`: GitBook frontmatter, hints, content references, embeds, tabs, and navigation.
- `github-action-authoring`: Composite GitHub Actions, runner support, PATH issues, and CI jobs.
- `java-expert`: Java services, libraries, concurrency, performance, dependencies, and hardening.
- `junit-expert`: JUnit 5 lifecycle, parameterized tests, assertions, extensions, and build integration.
- `mockito-expert`: Mockito mocks, stubs, spies, matchers, captors, and strict stubbing.
- `ortus-java-coding-standards`: Ortus formatting, naming, structure, and code-style conventions.
- `security-expert`: Secure system design, threat modeling, secrets, authentication, and authorization.

## Change Discipline

- Prefer small, template-safe changes and preserve public APIs and generated
  output conventions.
- Update related metadata together when changing names, versions, slugs, or
  build tokens: `ModuleConfig.bx`, `box.json`, `Build.bx`, `readme.md`, and
  `changelog.md` as applicable.
- Do not commit generated `build/`, `site/`, test-result, or temporary files.
- Keep this file focused on repository-wide rules. Put task-specific workflows
  in a scoped instruction file or skill instead.
