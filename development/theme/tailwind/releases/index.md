---
title: Release Policy
order: 6
---

# Release Policy

BX Docs follows [Semantic Versioning](https://semver.org/) - the version in
[`box.json`](https://github.com/ortus-boxlang/bx-docs/blob/development/box.json)
is what gets published to [ForgeBox](https://forgebox.io/) and tagged in the
repo for every release.

- **`development`** is the working branch - every merge there triggers a
  snapshot build (`-snapshot` version suffix), published for early testing
  but not meant for production use.
- **`main`** is the stable branch - a push there cuts a real, tagged
  release: the `[Unreleased]` section of the project's own
  [`changelog.md`](https://github.com/ortus-boxlang/bx-docs/blob/main/changelog.md)
  is finalized under that version number, a Git tag and GitHub Release are
  created from it, and the module is published to ForgeBox.

A "what's new" page for each version is generated automatically as part of
that release process - pulled straight from its `changelog.md` section - and
appears in this section going forward. The same notes are also attached to
its [GitHub Release](https://github.com/ortus-boxlang/bx-docs/releases).
