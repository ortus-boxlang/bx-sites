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

## Skills

- Relevant BoxLang development skills live under `.agents/skills` in the related template repo and should be used when tasks involve BIFs, components, interceptors, async tasks, logging, or runtime architecture.
- Keep AGENTS.md focused on workspace-wide rules. Put task-specific workflows or deeper domain guidance into skills or scoped instruction files instead.
