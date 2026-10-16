---
title: AI Agent Instructions
order: 6.4
icon: phosphor-duotone:file-text
summary: Every new project gets an AGENTS.md content-authoring cheat sheet automatically - frontmatter keys, content block directives, and the page-authoring workflow, generated from your project's real theme and source folder.
tags: [guides, ai, agents]
---

# AI Agent Instructions

`bxSites new` writes an `AGENTS.md` at your project's root by default - a
compact cheat sheet covering what most AI coding-agent edits to your content
actually need: recognized frontmatter keys, every `::: name :::` content
block directive with its syntax, the reserved folders, and the basic
`page:new` -> `serve` -> `lint` -> `build` workflow. It's generated from
*your* project's real theme and source folder, not a generic template, and
it's the content-authoring counterpart to the deeper
[AI Agent Skills](ai-agent-skills.md) pack - a quick reference an assistant
can read in one pass, versus skills it loads on demand for a specific task.

This is a different audience than `AGENTS.md` at the root of the **bx-sites
repository itself** - that one teaches an assistant how to work on bx-sites'
own source code. This guide is about the file scaffolded into *your*
generated site project, to help an assistant edit *your* content correctly.

## What gets written

```bash title="Default: AGENTS.md only"
bxSites new my-docs
```

```text title="my-docs/"
my-docs/
├── AGENTS.md
├── .markdownlint.json
├── bxsites.yaml
└── docs/
    ├── assets/
    └── index.md
```

`.markdownlint.json` is always written alongside it - a ruleset tuned for
bx-sites content (relaxes line-length, hard-tab, and bare-URL rules that
would otherwise flag ordinary bx-sites Markdown, like a long content-block
directive line or a code fence with no language tag).

### Choosing which file(s)

Not every project uses Claude Code specifically, so `CLAUDE.md`/`.cursorrules`
are opt-in via `--agents`:

```bash title="Also write CLAUDE.md"
bxSites new my-docs --agents=agents,claude
```

```bash title="Skip the instruction file(s) entirely"
bxSites new my-docs --agents=none
# .markdownlint.json is still written either way
```

| Target | File |
|---|---|
| `agents` (default) | `AGENTS.md` |
| `claude` | `CLAUDE.md` |
| `cursor` | `.cursorrules` |

## Keeping it fresh: `agents:sync`

The generated content sits inside a marked block:

```text title="AGENTS.md"
<!-- bxsites:agents:start -->
...generated cheat sheet...
<!-- bxsites:agents:end -->
```

Edit freely above or below the markers - your own project notes, team
conventions, links to an internal style guide, whatever you want. Run
`agents:sync` anytime (after a bx-sites upgrade adds new directives or
frontmatter keys, or to retrofit a project scaffolded before this feature
existed) and only the marked block gets refreshed:

```bash title="Usage"
bxSites agents:sync
```

Three outcomes per target file, reported back:

- **Created** - the file didn't exist yet.
- **Updated** - markers found, the block between them refreshed, everything
  outside them left untouched.
- **Skipped** - the file exists but has no markers. Nothing is overwritten;
  this is either a file you hand-wrote before this feature existed, or one
  whose markers you removed on purpose to opt it out of future syncs.

`agents:sync` also always (re)writes `.markdownlint.json` to the current
canonical ruleset, and takes the same `--agents=` flag as `new` to target
specific file(s).

## FAQ

??? faq "Will `agents:sync` overwrite my own notes?"
    No - only the text between `<!-- bxsites:agents:start -->` and
    `<!-- bxsites:agents:end -->` is ever replaced. Content you add outside
    those markers, in the same file, is preserved across every sync.

??? faq "I don't want AGENTS.md touched again - how do I opt a file out?"
    Delete (or never add back) the `bxsites:agents:start`/`end` markers.
    `agents:sync` treats a markerless file as hand-authored and reports it
    as skipped rather than overwriting it.

??? faq "Does this replace the AI Agent Skills pack?"
    No - they cover different scopes. This is a single, always-present
    cheat sheet for content authoring; [AI Agent Skills](ai-agent-skills.md)
    (`bxSites skills:install`) is a much deeper, thirteen-skill pack an
    assistant loads on demand, covering everything from theming to
    deployment. Most projects benefit from both.

??? faq "Why isn't there a `::: comments :::` row in the directive table?"
    Reader comments aren't a bx-sites feature yet - the generated file says
    so explicitly, so an assistant doesn't invent syntax that doesn't exist.

## Source

- Generator: `models/build/AgentsFileGenerator.bx`
- CLI verbs: `models/cli/New.bx` (`new`'s `--agents` flag), `models/cli/AgentsSync.bx`
- See [CLI Reference](../cli-reference.md#new) and
  [CLI Reference](../cli-reference.md#agentssync) for the full flag reference.
