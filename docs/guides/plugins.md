---
title: Plugins
order: 6
tags: [guides, plugins]
---

# Plugins

A BX Docs plugin is nothing more than another BoxLang module - its own
`box.json` + `ModuleConfig.bx`, installed as a sibling of `bx-docs` in the
same runtime (`box install` into the project, the same way `bx-markdown`/
`bx-esapi` already are). No plugin API to import, no separate registry -
BoxLang's own module system *is* the plugin system.

Installing a module alone never activates it as a plugin, though - a
project opts one in explicitly by BoxLang module name, via `bxdocs.json`'s
[`plugins`](../configuration.md#plugins) array:

```json
{ "plugins": [ "myBxDocsPlugin" ] }
```

## Writing a plugin

A plugin module needs exactly one thing beyond the usual `box.json`/
`ModuleConfig.bx` a BoxLang module already has: a `models/BxDocsPlugin.bx`
class. Every method on it is optional - implement only the hooks you need,
BX Docs checks for each one before calling it:

```bx
// models/BxDocsPlugin.bx
class {

	struct function onConfig( required struct config ) {
		// Mutate/return the site config, right after bxdocs.json is loaded.
		return arguments.config
	}

	string function onPageMarkdown( required string markdown, required struct page, required struct config ) {
		// Mutate a page's raw markdown before conversion - the same
		// pre-processing seam BX Docs' own content tabs/math/code
		// annotations use internally (TabsProcessor.bx et al.).
		return arguments.markdown
	}

	string function onPageHtml( required string html, required struct page, required struct config ) {
		// Mutate a page's rendered HTML after conversion.
		return arguments.html
	}

	array function onNav( required array nav, required struct config ) {
		// Mutate the nav tree (NavBuilder.build()'s own shape: an array of
		// { title, url, order, children } nodes).
		return arguments.nav
	}

	void function onBuildComplete( required string siteDir, required struct config ) {
		// Fires once, after everything is written to siteDir - no return value.
	}

}
```

Hooks run in `bxdocs.json`'s own `plugins` array order, and (except
`onBuildComplete`) each one's return value replaces the value the next
hook (or BX Docs itself) sees - a plugin only needs to return what it was
given if it has nothing to change.

`onPageMarkdown`/`onPageHtml` run once per page, for every doc tree BX
Docs builds (the main `docs/` tree and every `docs/versions/<name>/`
tree). `onConfig`/`onNav`/`onBuildComplete` are also applied by the
standalone `search-index` verb where relevant (`onConfig`, since it can
change `markdown`/other settings the index build depends on).

## When each hook fires

```mermaid
sequenceDiagram
    participant Build as build verb
    participant Plugin as your plugin
    Build->>Plugin: onConfig(config)
    Build->>Build: build the nav tree
    Build->>Plugin: onNav(nav, config)
    loop every page
        Build->>Plugin: onPageMarkdown(markdown, page, config)
        Build->>Build: Markdown() + built-in extensions
        Build->>Plugin: onPageHtml(html, page, config)
    end
    Build->>Build: write site/
    Build->>Plugin: onBuildComplete(siteDir, config)
```

## A minimal example

`examples/hello-plugin/` in this repo is a complete, working plugin
module - `box install`-able as-is - that adds a `<!-- rendered by
hello-plugin -->` comment to every page and appends a build-summary line
to `site/hello-plugin.txt` once the build finishes. Use it as a starting
skeleton, or read it for a worked example of the folder layout:

```
hello-plugin/
├── box.json              # boxlang.moduleName is what bxdocs.json's [plugins] references
├── ModuleConfig.bx        # a normal, otherwise-empty BoxLang module descriptor
└── models/
    └── BxDocsPlugin.bx    # onPageHtml() + onBuildComplete()
```

## Errors

- `BxDocs.PluginNotFound` - a name in `bxdocs.json`'s `plugins` array
  isn't an installed/activated BoxLang module.
- `BxDocs.InvalidPlugin` - the module exists, but has no
  `models/BxDocsPlugin.bx` class.
