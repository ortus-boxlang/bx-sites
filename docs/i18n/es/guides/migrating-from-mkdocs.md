---
title: Migrar desde mkdocs
order: 8
icon: phosphor-duotone:swap
tags: [guías, migración, mkdocs]
---

# Migrar desde mkdocs

`bxSites migrate --from=mkdocs` convierte un proyecto mkdocs -
`mkdocs.yml` más su carpeta `docs/` - en un proyecto bx-sites completo,
en un solo comando:

```bash frame="terminal" title="Terminal"
bxSites migrate --source=/path/to/mkdocs-project --from=mkdocs
```

- `--source` (obligatorio) - el directorio raíz del proyecto mkdocs (debe
  contener `mkdocs.yml`)

A diferencia de [migrar desde GitBook](migrating-from-gitbook.md), esto
es sobre todo una traducción de *configuración*, no de *contenido*. La
propia carpeta `docs/` de mkdocs ya usa las convenciones exactas de
bx-sites - el anidamiento de carpetas es estructura de navegación,
`index.md` es la página de inicio propia de una carpeta, y los enlaces
`.md` relativos entre páginas simplemente funcionan. Más aún: la propia
sintaxis de Markdown extendida de mkdocs-material es la *misma sintaxis
textual* que bx-sites ya habla, porque bx-sites se modeló en
mkdocs-material desde el principio (consulta
[Extensiones de Markdown](markdown.md)). Así que los cuerpos de las
páginas se copian byte a byte sin cambios - nada aquí necesita reescribir
admoniciones `!!! note`, pestañas de contenido `=== "Tab"`, ni
matemáticas `$x^2$`, porque ya son sintaxis válida de bx-sites.

## Qué se convierte automáticamente

**`mkdocs.yml` → `bxsites.yaml`:**

| mkdocs.yml | bxsites.yaml |
|---|---|
| `site_name` | `name` |
| `site_description` | `description` |
| `site_url` | `baseURL` |
| `theme.name: material` | `theme.name: "material"` |
| cualquier otro `theme.name` | `theme.name: "bootstrap"` (el propio valor por defecto de bx-sites) - reportado como advertencia, ya que el resultado visual difiere |
| `repo_url` / `edit_uri` | `repo.url` / `repo.editUri` |
| `extra_css` / `extra_javascript` | `extraCss` / `extraJs` |
| `markdown_extensions: [footnotes]` | `markdown.enableFootnotes: true` |
| `markdown_extensions: [def_list]` | `markdown.enableDefinitionLists: true` |
| `markdown_extensions: [pymdownx.arithmatex]` | `math: true` |

Cualquier otra entrada de `markdown_extensions` que la propia sintaxis de
mkdocs-material ya cubra de forma nativa - `admonition`,
`pymdownx.tabbed`, `pymdownx.details`, `pymdownx.superfences`,
`pymdownx.highlight`, `toc`, `attr_list`, y más - no necesita ningún
cambio en `bxsites.yaml` en absoluto; bx-sites ya se comporta así de
fábrica.

**`nav:` → `docs/nav.json`:**

```yaml title="mkdocs.yml" linenums="1"
# mkdocs.yml
nav:
  - Home: index.md
  - Guide:
      - Setup: guide/setup.md
      - Advanced: guide/advanced.md
  - About: about.md
```

se convierte en:

```json title="docs/nav.json" linenums="1"
[
  { "title": "Home", "path": "index.md", "children": [] },
  { "title": "Guide", "path": "", "children": [
    { "title": "Setup", "path": "guide/setup.md", "children": [] },
    { "title": "Advanced", "path": "guide/advanced.md", "children": [] }
  ] },
  { "title": "About", "path": "about.md", "children": [] }
]
```

- una entrada de ruta simple (`- about.md`, sin título explícito)
  también se convierte - su título proviene del propio frontmatter/
  primer encabezado de la página migrada, igual que cualquier entrada de
  `docs/nav.json` de bx-sites sin `title` establecido
- consulta [Configuración: `nav`](../configuration.md#nav) para el
  formato completo

**Páginas y recursos:**

- cada archivo `.md` se copia a la misma ruta bajo `docs/`, sin cambios
- cualquier *otro* archivo (imágenes, PDF, ...) se traslada a
  `docs/assets/mkdocs/<same-relative-path>` - el propio pipeline de
  recursos de bx-sites solo publica `docs/assets/**`, y mkdocs no tiene
  ninguna convención de carpeta de recursos única propia como sí lo es
  el `.gitbook/assets/` de GitBook, así que las imágenes suelen estar
  dispersas junto a las páginas que las usan
- cada referencia a un recurso trasladado - `![diagram](img/diagram.png)`,
  por ejemplo - se reescribe a la ruta relativa correcta que llega a su
  nueva ubicación, teniendo en cuenta la profundidad a la que se
  encuentra la propia página que enlaza (la misma convención de "el
  autor escribe el número correcto de `../`" que ya usa cualquier
  proyecto bx-sites - calculada por ti aquí en lugar de dejarse a un
  buscar-y-reemplazar)

## Qué necesita revisión manual

Reportado como advertencias en la propia salida del comando, nada se
descarta silenciosamente:

- una entrada `markdown_extensions`/`plugins` de mkdocs sin ningún
  equivalente en bx-sites (los propios códigos cortos de emoji de
  mkdocs-material, un plugin de terceros como `awesome-pages` o
  `git-revision-date`) - si necesitas el mismo comportamiento, consulta
  [Plugins](plugins.md)
- la propia personalización de color/fuente de `mkdocs.yml`
  (`theme.palette`/`theme.font`) no tiene ningún equivalente directo -
  consulta
  [Personalizar colores](themes.md#personalizar-colores-sin-sobrescribir-un-tema)
  una vez terminada la migración
- un `theme.name` distinto de `material` (por defecto pasa a `bootstrap`)

## Ejemplo completo

```bash frame="terminal" title="Terminal" linenums="1"
boxlang module:bxSites new --projectRoot=my-docs
boxlang module:bxSites migrate --projectRoot=my-docs --source=../my-mkdocs-project --from=mkdocs
cd my-docs
boxlang module:bxSites serve
```

`migrate` escribe `bxsites.yaml` y el propio `docs/` - el paso `new` de
arriba solo está ahí para obtener una raíz de proyecto con `docs/` lista
para recibirlos; migrate crea `docs/` por sí mismo también, así que no
es estrictamente obligatorio. Revisa las propias advertencias del
comando, y luego usa `serve` para ver el resultado antes de hacer
commit.
