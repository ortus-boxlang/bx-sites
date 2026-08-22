# Project Guidelines

## Purpose

This repository is the pure BoxLang template for BoxLang modules.
Treat it as a template first: preserve placeholders, setup flow, build script behavior, and distribution structure unless the task explicitly changes the template contract.

## Architecture

- Module metadata and runtime lifecycle live in `ModuleConfig.bx` at the repo root.
- BoxLang module features should follow the existing root folders: `bifs`, `components`, `interceptors`, `tests`, and `lib`.
- This template is BoxLang-first. Keep implementation in BoxLang unless the task specifically involves shipping external Java libraries or compiled classes through `lib`.
- Every module is loaded in its own class loader. When working with jars or classes in `lib`, avoid assumptions about shared classpath state across modules.

## Build And Test

- Use `boxlang Build.bx` for local packaging. Preserve its token replacement, compile, zip, and checksum steps.
- Prefer narrow validation first: run the build script or the module tests relevant to the touched area.
- Tests live under `tests`, and the documented test entry point is `./testbox/run` after installing dependencies with `box install`.
- Keep generated artifacts under `build` only; do not move packaging outputs or source exclusions unless the task explicitly requires it.

## Conventions

- Follow `.editorconfig` indentation and line-ending rules. This repo uses tabs by default, with spaces for YAML.
- Keep `ModuleConfig.bx`, `box.json`, `readme.md`, `changelog.md`, `SetupTemplate.bx`, and `Build.bx` consistent when changing module names, versions, slugs, or template placeholders.
- Prefer small template-safe edits. If a change affects generated modules, update both the implementation and the template placeholders or setup flow that keep the template coherent.
- Treat `lib` as packaged runtime input for jars or compiled classes, not as a place to mirror source that should live in the BoxLang folders.

## BoxLang Gotchas (learned the hard way)

- **Unqualified call to a same-named BIF wins silently.** Calling a private method by its bare name (no `this.`) from another method of the *same* class can resolve to a built-in BIF of the same name instead, with no compile error. Confirmed real BIFs that collide with tempting helper names: `slugify()` (doesn't trim trailing hyphens - wrong for slug generation), `camelCase()` (actually does what you want, so a hand-rolled version is often just dead code), `getBoxRuntime()` (harmless - returns the same singleton). Before naming a private helper something generic (`slugify`, `slug`, `camelCase`, ...), check it isn't a BIF: `try { invoke("", "name", ["x"]); /* IS a BIF */ } catch (any e) { /* not a BIF */ }`.
- **A parameter name shadows a same-named private method.** If a function has a parameter (e.g. `string slug`) and also calls a private method named `slug()`, the unqualified call resolves to the parameter (a string), throwing `"Variable 'slug' of type 'String' is not a function"`. Give the method and the parameter/return-key different names.
- **A literal `#` in a string must be doubled (`##`).** `"# Heading"` breaks the parser (read as starting `#expression#`); use `"## Heading"` for a literal single `#`. Applies anywhere a `#` should appear literally, including inside regex string literals passed to `reFind`/`reReplace` (e.g. `"^#{1,6}"` must be written `"^##{1,6}"`).
- **No backslash escaping in string literals.** `\"` inside a double-quoted string is a literal backslash followed by a quote that terminates the string - it does NOT escape the quote. To embed a literal quote: switch the string's own delimiter to the opposite quote style, or double the delimiter character (`""` inside a double-quoted string, `''` inside a single-quoted string).
- **`dateFormat()` mask letters are case-sensitive.** Lowercase `mm` = minutes; uppercase `MM` = month. `dateFormat(now(), "yyyy-mm-dd")` silently produces garbage dates (e.g. `2026-46-22`).
- **`directoryList(path, true, "path")` with no glob pattern returns directories too**, not just files. Filter with `.filter(path => !directoryExists(path))` when you want files only (established convention, see `MkdocsMigrator.bx`).
- **An arrow closure's `arguments` scope is its own, not the enclosing function's.** Inside `.filter(x => ...)`/`.map(x => ...)`/`.some(x => ...)`, `arguments` refers to the closure's own callback arguments (item/index/array), NOT the outer function's `arguments`. Referencing `arguments.someOuterParam` inside the closure silently looks up a key that was never there (or throws `KeyNotFoundException`). Fix: capture the value into a local `var` before the closure and reference that local, not `arguments.x`, inside it.
- **Can't mix named and positional arguments in one call.** `fn( someVar, includeDrafts = true )` is a parse error ("cannot mix named and positional arguments"). Use all-named (`fn( x : someVar, includeDrafts : true )`) or all-positional.
- **A single `.bxs` script with several `try/catch` blocks can trigger a real compiler bug** (`java.lang.VerifyError: Inconsistent stackmap frames`) unrelated to your actual source code - this hit ad-hoc verification scripts, not the shipped module code. Split scratch test scripts so each has at most one or two try/catch blocks per file.
- **A module's own registry mapping name (`this.mapping` in its `ModuleConfig.bx`) isn't necessarily its box.json/ForgeBox slug.** Confirmed for this environment's installed modules: `bx-markdown` → `bxMarkdown`, `bx-esapi` → `esapi`, `bx-yaml` → `yaml`, `bx-image` → `image`, `bx-docs` → `bxdocs`. Check via `getBoxRuntime().getModuleService().hasModule( mappingName )`, not the slug.
- **`dateCompare(a, b)` is a real BIF** and works as expected on ISO-formatted date strings (`-1`/`0`/`1`) - no need to hand-roll date range comparisons.
- **CLI verbs must use `--flag=value`, never a bare positional**, for their "primary" argument (title/name/path/from/to/etc.) - `ModuleConfig.bx`'s `resolveProjectRoot()` unconditionally treats the first bare positional as a project-root override candidate for every verb.
- **This sandbox couldn't get a working TestBox install** (ForgeBox unreachable even after fixing CommandBox's proxy/cacerts config). Verification here was done via ad-hoc `.bxs` scratch scripts run directly with `boxlang script.bxs`, exercising the model/cli classes' public methods with hand-rolled PASS/FAIL prints - not a substitute for real TestBox runs in CI, but the only option available locally.

## Skills

- Relevant BoxLang development skills live under `.agents/skills` in the related template repo and should be used when tasks involve BIFs, components, interceptors, async tasks, logging, or runtime architecture.
- Keep AGENTS.md focused on workspace-wide rules. Put task-specific workflows or deeper domain guidance into skills or scoped instruction files instead.
