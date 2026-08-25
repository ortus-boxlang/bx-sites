---
title: OpenAPI / Swagger
order: 4.6
icon: phosphor-duotone:plug
tags: [guides, openapi, api, gitbook]
---

# OpenAPI / Swagger

An interactive [Swagger UI](https://swagger.io/tools/swagger-ui/) widget for
an OpenAPI/Swagger spec, using the same `::: name ... :::` container syntax
as every block in [Content Blocks](content-blocks.md) - GitBook's own
OpenAPI block's direct equivalent. `src` is resolved the same
`docs/assets/`-relative way `::: file`'s own `src` is (see
[Content Blocks](content-blocks.md#file)). Both JSON and YAML specs work;
Swagger UI parses either entirely client-side; no OpenAPI parsing happens
anywhere in this module. Requires `bxsites.yaml`'s
[`openapi`](../configuration.md#openapi) set to `true` - unset, this
placeholder renders but stays inert (Swagger UI's own JS/CSS is never
copied into `site/` at all, keeping every other project's build exactly
as small as before this feature existed):

```markdown title="Example" linenums="1"
::: openapi src="assets/openapi/example.yaml" title="Bookshelf API"
:::
```

::: openapi src="assets/openapi/example.yaml" title="Bookshelf API"
:::

The widget above is this exact page, live, rendering the small example spec
this guide ships at `docs/assets/openapi/example.yaml` - open it in your
own project's `docs/assets/` (or point `src` at wherever your own spec
already lives) to see it with your own API instead.

Only `SwaggerUIBundle`'s own base layout is vendored - no topbar/"Explore"
bar letting a reader type in a *different* spec (a `::: openapi` block is
meant to always show the one spec its author pointed it at), so every
operation, its request/response schemas, and "Try it out" (which calls the
spec's own `servers[0].url` directly from the visitor's browser - make
sure that server allows CORS from wherever your docs are hosted) render
straight from your existing spec with no rewriting needed.

## One operation inline

Add `operation="METHOD /path"` to drop just that one endpoint into a
regular page - handy mid-tutorial, without sending the reader off to the
full reference:

```markdown title="Example" linenums="1"
::: openapi src="assets/openapi/example.yaml" operation="GET /books"
:::
```

::: openapi src="assets/openapi/example.yaml" operation="GET /books"
:::

Still the exact same Swagger UI widget as the full block above (same spec,
same client-side-only rendering - `operation` never triggers any OpenAPI
parsing on our side either); every other operation is simply hidden and
this one auto-expanded, by reading Swagger UI's own already-rendered
markup. `operation`'s method is case-insensitive; its path must match the
spec's own path exactly (`{param}` placeholders and all).

## Documenting an API without a spec file

`::: openapi` always needs a real OpenAPI/Swagger document at `src` -
there's no manual, spec-less version of this block for hand-describing a
single endpoint. GitBook itself doesn't have one either anymore: its own
equivalent, the "API method" block, was deprecated in February 2024 in
favor of always importing a real spec. If you don't have one yet:

- Write just enough spec to cover the page you're on. A single `paths`
  entry with its own minimal `info`/`servers` (see
  `docs/assets/openapi/example.yaml` for how little that actually takes)
  already gets you the interactive widget and "Try it out" for that one
  endpoint - grow it into a full spec later; nothing about the block
  itself changes.
- Or skip the widget entirely and describe the endpoint as ordinary
  content - a parameters table, a fenced ```` ```http ```` /```` ```json ````
  request/response pair, walked through with a
  [stepper](content-blocks.md#stepper) if that helps. Every other content
  block and Markdown extension is available on any page regardless of
  whether `openapi` is turned on at all.
