---
title: Introduction
summary: What bx-sites is, who it's for, and what this course covers.
icon: phosphor-duotone:hand-waving
tags: [course]
---

# Introduction

bx-sites is a static site generator, powered by [BoxLang](https://boxlang.io) -
point it at a folder of Markdown, and it builds a fast, fully static
website: docs, a blog, or both. No server, no database, no client-side
framework required to read it - just HTML, CSS, and a little vanilla JS
for the parts that need it (search, dark mode, the copy button you'll
meet in a few lessons).

If you've used Hugo, Jekyll, Docusaurus, MkDocs, or GitBook, the shape
will feel familiar: Markdown files in, a `site/` folder of plain HTML
out. What's different is what happens in between - ten built-in themes
to choose from, a family of GitBook-style content blocks Markdown alone
doesn't have, reusable data and variables, and a build that's fast
because it's just BoxLang running on the JVM, not a bundler chewing
through a dependency graph.

## What this course covers

Twenty short lessons, in order, each building on the last:

- **Lessons 1-5** get a real site running - install, scaffold, understand
  the folder layout, write your first page.
- **Lessons 6-13** cover authoring - everything Markdown can do here that
  plain CommonMark can't: content blocks, tables, images, reusable data,
  loops and conditionals, interactivity.
- **Lessons 14-19** cover the rest of the platform - themes, search,
  API docs, blogging, versioning, translations, plugins.
- **Lesson 20** ships it - building, deploying, and publishing for real.

Every lesson is short on purpose. Where a topic goes deeper than a
lesson can cover, you'll get a link to the full guide - this course is
the map, not the territory.

## Before you start

You don't need to know BoxLang to use bx-sites - writing docs/a blog
needs nothing but Markdown. BoxLang only shows up if you reach for
[magic functions](../guides/variables-and-functions.md#magic-functions)
or a [plugin](../guides/plugins.md) later on, and even then, it's plain,
readable script - nothing like the ceremony of a full framework.

Ready? The lesson pager below moves you straight to install.
