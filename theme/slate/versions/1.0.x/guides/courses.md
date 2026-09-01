---
title: Courses
order: 12.6
icon: phosphor-duotone:graduation-cap
tags: [guides, courses]
---

# Courses

A **course** turns a set of pages into a guided, numbered sequence -
lesson 1, lesson 2, lesson 3... - with its own auto-generated numbered
index, its own scoped "Lesson N of M" prev/next (independent of the
site's global page-to-page order), and, once a reader opens a lesson,
progress tracked in their own browser: which lessons they've completed,
and a "Continue where you left off" link back to the last one they
visited.

## The manifest

Add a `docs/data/courses.yaml` (`.yml`/`.json` also work - see
[Data Files](data-files.md)) file. Each top-level key is one course; its
`lessons` array lists that course's own pages, in order - array position
*is* the lesson number:

```yaml title="docs/data/courses.yaml"
getting-started:
  title: "Getting Started with BoxLang"
  description: "A guided walkthrough from install to your first deployed site."
  lessons:
    - guides/course/introduction.md
    - guides/course/windows-installation.md
    - guides/course/mac-installation.md
    - guides/course/creating-a-new-site.md
```

Every `lessons` entry is a `docs/`-relative path string, the same
relative-path convention `nav.json` itself uses. A lesson's own
title/summary come from *that page's own frontmatter* - not duplicated
into the manifest - so renaming a page's title, or editing its summary,
is reflected in the course index automatically. Multiple courses just
means multiple top-level keys in the same file.

## The index

Drop a single line anywhere in your Markdown to render that course's own
numbered index:

```markdown
::: course id="getting-started" :::
```

This renders one real, semantic `<ol>` - a numbered link per lesson, each
carrying that lesson's own title and summary - plus (initially hidden,
filled in client-side once a reader has actually started) a progress bar
and a "Continue where you left off" link. A typo'd `id`, or a course
whose lessons don't all exist, degrades to a small, visible note rather
than failing the build.

## Lesson pages

Every page listed in a course's `lessons` automatically gets a `course`
context (`page.course` - see
[Context variables](variables-and-functions.md#context-variables)) with
its own position, title, and *scoped* prev/next - `page.course.prevLesson`/
`.nextLesson` only ever move within that one course, unlike the site's
own global [`page.prevPage`/`.nextPage`](variables-and-functions.md#context-variables),
which walks the whole nav tree regardless of any course. A lesson doesn't
need to say which course it belongs to, or where - the manifest is the
one place that's decided, and a page can't accidentally end up in two
courses (an authoring mistake the build catches with a clear error - see
[Errors](#errors)).

Currently, the bootstrap theme renders this scoped navigation - a
"Lesson N of M" badge, a course-scoped prev/next pager, and a "Mark
complete" toggle - directly on the lesson page. Every other built-in
theme still computes `page.course` correctly (so a project on one of them
can already surface it via its own [theme
override](themes.md#overriding-a-theme)); native chrome in the rest of
the built-in themes is on the roadmap.

## Progress tracking

Once a reader opens a lesson, its own hidden marker on the page tells
`course-progress.js` (shared across every built-in theme, always
included) to record the visit - no config, no opt-in. Progress lives
entirely in that browser's own `localStorage`, under
`bxsites-course-progress-<courseId>`:

```json
{
  "firstStarted": "2026-08-30T14:02:11.000Z",
  "lastVisited": { "url": "/guides/course/mac-installation/", "at": "2026-08-30T14:22:03.000Z" },
  "completed": {
    "/guides/course/introduction/": "2026-08-30T14:05:00.000Z",
    "/guides/course/windows-installation/": "2026-08-30T14:12:44.000Z"
  }
}
```

A lesson is marked complete automatically the moment its page is
visited; the "Mark complete"/"Mark incomplete" toggle lets a reader undo
an accidental auto-mark, or come back and re-mark a lesson later. The
course index reads this same data to fill in its checkmarks, its
progress bar ("N of M complete"), and the resume link.

This is a pure client-side enhancement, layered on top of a course
that's already fully working without it - the numbered index and the
scoped prev/next pager are both rendered server-side, so a reader with
JavaScript disabled, or a search crawler, still sees the complete base
feature: every lesson, correctly numbered, correctly linked. Nothing
about progress tracking is required for a course to work; storage being
unavailable at all (private browsing, blocked site data) degrades
silently to "no progress remembered," never an error.

Progress is per-browser, with no account or backend behind it - it
doesn't sync across devices, and there's no server-side record of who's
read what. If that's a real requirement for your project, that's outside
what this feature does today.

## Extending this later

Two things this feature deliberately does **not** build yet, but is
shaped to grow into without breaking an existing `courses.yaml`:

- **Quizzes between lessons.** Every resolved lesson already carries a
  `type` (currently always `"lesson"`) internally - a future version can
  accept a `lessons` entry that's a small object instead of a bare path
  string (e.g. `{ path: ..., type: "quiz" }`) alongside plain strings,
  with no change needed to a course that only ever lists bare paths.
- **A final test/assessment at the end of a course.** The manifest schema
  reserves (but ignores) an optional top-level `finalTest` key per
  course, specifically so this can land later without a breaking schema
  change - don't use that key for anything else in your own manifest.

## Why a manifest, not frontmatter?

A course's lessons are declared once, in `courses.yaml` - not as a
`course: getting-started` field scattered across every lesson's own
frontmatter. A per-page field would be a second, unenforced source of
truth alongside the manifest, and the two disagreeing (a lesson's
frontmatter says one course, the manifest lists it in another - or not at
all) is exactly the kind of silent drift this design avoids. The
manifest is the one place a course's shape - which lessons, in which
order - is decided; a lesson page itself never needs to know which
course it's part of, or where.

## Scope

- A course whose `lessons` don't *all* exist as real pages in the tree
  currently being built is silently skipped for that tree, never a build
  failure - this matters because `docs/data/courses.yaml` is loaded once,
  project-wide (the same scope [Data Files](data-files.md#scope) already
  has), and reused unchanged across every version/locale tree; a bare
  `docs/versions/<name>/` snapshot may not contain a course's lesson
  files at all.
- A lesson can only belong to one course - listing the same path under
  two different courses is a real authoring mistake, and throws (see
  [Errors](#errors)).
- No nested/multi-track courses, no per-version course manifests with a
  different lesson order per version, in this first version.

## Errors

- `BxSites.InvalidConfig` - `docs/data/courses.yaml` has a shape problem:
  a course value isn't an object, is missing a `title`, its `lessons`
  isn't a non-empty array of path strings, or the same lesson path is
  listed under more than one course.
