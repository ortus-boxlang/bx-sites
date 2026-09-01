---
title: Installation
summary: Installing the BoxLang runtime and the bx-sites module itself.
icon: phosphor-duotone:download-simple
tags: [course]
---

# Installation

bx-sites is a [BoxLang](https://boxlang.io) module, so there are two
things to install: the BoxLang runtime itself, then bx-sites on top of
it.

## 1. Install BoxLang

The quickest path, on macOS/Linux:

```bash title="Terminal"
curl -fsSL https://install.boxlang.io/ | bash
```

Prefer to manage multiple BoxLang versions side by side? Use BVM (the
BoxLang Version Manager) instead:

```bash title="Terminal"
curl -fsSL https://install-bvm.boxlang.io/ | bash
bvm install latest && bvm use latest
```

Windows and Homebrew installers are covered in
[BoxLang's own installation docs](https://boxlang.ortusbooks.com/getting-started/installation).

## 2. Install bx-sites

With BoxLang in place, install the module itself - either via BoxLang's
own installer:

```bash title="Terminal"
install-bx-module bx-sites
```

or via [CommandBox](https://commandbox.ortusbooks.com/), if you already
have it:

```bash title="Terminal"
box install bx-sites
```

Either one pulls in bx-sites' own dependencies (Markdown rendering,
HTML-encoding, YAML parsing, the responsive-image pipeline) automatically
and drops a `bxSites` command on your `PATH`.

## Verify

```bash title="Terminal"
bxSites --help
```

If that prints the list of available commands, you're set - on to
scaffolding a real project. Full detail (including running without the
`PATH` shim, e.g. on a CI runner) lives in
[Getting Started: Install](../getting-started.md#install).
