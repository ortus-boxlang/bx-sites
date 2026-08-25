---
title: CLI Providers
order: 6.2
icon: phosphor-duotone:terminal-window
tags: [guides, plugins, cli]
---

# CLI Providers

A [plugin](plugins.md) hooks into the *build* lifecycle - config, nav, page
markdown/HTML, post-build. A **CLI provider** is the sibling extension
point for the *command* lifecycle: it lets an installed, activated BoxLang
module register its own `bxSites <verb>` commands, without touching
`bx-sites` itself.

Same activation model as a plugin - a module opts in by name, via
`bxsites.yaml`'s own [`plugins`](../configuration.md#plugins) array:

```yaml title="bxsites.yaml"
plugins: [ myBxSitesAddon ]
```

A module can implement `models/BxSitesPlugin.bx`, `models/BxSitesCliProvider.bx`,
both, or neither - installing/activating a module is one step; which
contracts it implements decides what it actually extends.

## Writing a CLI provider

A CLI provider needs exactly one thing beyond the usual `box.json`/
`ModuleConfig.bx`: a `models/BxSitesCliProvider.bx` class exposing a single
`verbs()` method, returning a struct of verb name → dispatch info:

```bx title="models/BxSitesCliProvider.bx" linenums="1"
// models/BxSitesCliProvider.bx
class {

	struct function verbs() {
		return {
			"cloud:publish" : {
				class       : "models.cli.cloud.Publish@myBxSitesAddon",
				description : "Build (if needed) and publish via the configured deploy target"
			},
			"cloud:status" : {
				class       : "models.cli.cloud.Status@myBxSitesAddon",
				description : "Show license/entitlement and last deploy status"
			}
		}
	}

}
```

Each dispatch class follows the exact same shape as a core verb class
under `bx-sites`' own `models/cli/` - a `struct function run( struct options )`
returning `{ exitCode, message }`:

```bx title="models/cli/cloud/Publish.bx" linenums="1"
class {
	struct function run( struct options ) {
		// arguments.options carries the same parsed-flags-plus-projectRoot
		// shape every core verb receives - see the CLI reference's
		// "How dispatch works" section.
		return { exitCode : 0, message : "Published #arguments.options.projectRoot#" }
	}
}
```

### The `@myBxSitesAddon` suffix is required

A bare dotted path like `"models.cli.cloud.Publish"` only resolves
relative to `bx-sites`' own module root - it's how core verbs reference
`models/cli/Build.bx` and friends, but it **cannot** reach into a
different module. A provider's own verb classes must always self-supply
their module's `@<mapping>` suffix, exactly as shown above. This is also
why registering into `bx-sites`' own literal verb table isn't something a
provider can spoof its way into - the class path has to name its own
module explicitly.

## Verb names: single-token and two-token ("compound")

A verb name is registered as one colon-joined string, the same convention
core already uses for `post:new`/`i18n:status`/`page:rename`. `bxSites`
also accepts the equivalent **two space-separated argv tokens** as sugar
over that same registration - `bxSites cloud publish` and
`bxSites cloud:publish` dispatch identically, once `"cloud:publish"` is a
registered verb name. There's no separate two-word registration mechanism
to learn; register `"cloud:publish"`, and both spellings work for free.

## Precedence and failure modes

- **Core always wins.** If a provider registers a verb name that collides
  with one of `bx-sites`' own built-in verbs, the core verb is dispatched
  and the provider's entry is silently ignored - a provider can add new
  commands, never shadow an existing one.
- **First provider wins on a collision between two providers.** If two
  different activated modules both register the same verb name, whichever
  is listed earlier in `bxsites.yaml`'s `plugins` array wins.
- **Discovery never breaks core dispatch.** A missing/malformed
  `bxsites.yaml`, a project that doesn't exist yet (e.g. running `--help`
  outside any project), a module listed in `plugins` with no
  `BxSitesCliProvider.bx` of its own, or a provider whose `verbs()` throws
  - none of these are errors. They're all treated the same way an
  unactivated plugin is: the core verb table is simply left untouched, and
  every built-in `bxSites` command keeps working on its own.

## A minimal example

```text title="myBxSitesAddon/ layout"
myBxSitesAddon/
├── box.json                          # boxlang.moduleName is what bxsites.yaml's [plugins] references
├── ModuleConfig.bx                    # a normal BoxLang module descriptor
└── models/
    ├── BxSitesPlugin.bx               # optional - build-lifecycle hooks, see plugins.md
    ├── BxSitesCliProvider.bx          # verbs()
    └── cli/
        └── cloud/
            ├── Publish.bx             # run( options )
            └── Status.bx              # run( options )
```

See [Plugins](plugins.md) for the build-lifecycle side of the same
module, and the [CLI reference](../cli-reference.md) for every verb core
itself ships.
