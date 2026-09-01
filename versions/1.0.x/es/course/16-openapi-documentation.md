---
title: OpenAPI Documentation
summary: An interactive Swagger UI widget for a full spec, or a single operation inline.
icon: phosphor-duotone:plug
tags: [course]
---

# OpenAPI Documentation

Documenting an API alongside the rest of your docs needs one content
block, using the same `::: name ... :::` syntax from
[lesson 7](07-content-blocks.md):

```markdown title="Example"
::: openapi src="assets/openapi/api.yaml" :::
```

That renders a full, interactive Swagger UI widget, right on the page -
both JSON and YAML specs work, and Swagger UI parses the spec entirely
client-side, so no OpenAPI parsing happens at build time at all.

## A single operation, inline

Documenting one endpoint in context - inside a guide, next to the prose
explaining it - doesn't need the full widget:

```markdown title="Example"
::: openapi src="assets/openapi/api.yaml" operation="GET /users/{id}" :::
```

There's no manual, spec-less version of this block for hand-describing a
single endpoint without a real spec file - if you don't have one yet, a
minimal spec covering just the page you're on is the fastest path.

Full attribute reference and how `src` resolves relative to a nested
page: [OpenAPI / Swagger](../guides/openapi.md).
