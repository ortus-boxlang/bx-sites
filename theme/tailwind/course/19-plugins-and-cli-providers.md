---
title: Plugins & CLI Providers
summary: Extending bx-sites with a BoxLang module of your own - build hooks and new commands.
icon: phosphor-duotone:puzzle-piece
tags: [course]
---

# Plugins & CLI Providers

Everything so far has been configuration and content - no code. When a
project needs real extension points, bx-sites offers two, both plain
BoxLang modules.

## Plugins

A plugin hooks into the build lifecycle - transforming nav, injecting
content, running a step after the build completes. A project registers
one in `bxsites.yaml`:

```yaml title="bxsites.yaml"
plugins:
  - my-custom-plugin
```

The plugin itself is a small BoxLang class implementing whichever
lifecycle methods it needs - `onBuildComplete`, `applyOnNav`, and more -
leaving everything it doesn't touch exactly as bx-sites would have
produced it anyway.

## CLI providers

For a new `bxSites <verb>` command entirely - not a build-time hook, a
whole new thing to run - a CLI provider registers it from a module the
same way. This is how `deploy`, `publish`, and every other built-in verb
in this course are themselves implemented; a project's own provider
looks no different.

Full authoring guide for both: [Plugins](../guides/plugins.md) and
[CLI Providers](../guides/cli-providers.md).
