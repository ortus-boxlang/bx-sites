---
title: Migrar desde GitBook
order: 7
icon: phosphor-duotone:swap
tags: [guías, migración, gitbook]
---

# Migrar desde GitBook

`bxSites migrate` convierte una exportación de GitBook - una tabla de
contenidos `SUMMARY.md` más sus archivos `.md`, el propio formato de
sincronización en disco de GitBook (el mismo que escribe GitHub/Git
Sync) - en un árbol `docs/` de bx-sites, en un solo comando. Todo lo que
admite el sistema de bloques de contenido de GitBook se corresponde con
algo que bx-sites ya tiene (consulta
[Bloques de Contenido](content-blocks.md)), así que el
resultado no es un borrador aproximado - es un sitio funcional.

## Obtener una exportación de GitBook

`bxSites migrate` lee directamente el propio formato de archivos de
GitBook, así que cualquiera de estos funciona como `--source`:

- Un repositorio al que GitBook está sincronizado por Git (configuración
  del Space → **GitSync**) - apunta `--source` a tu clon local.
- La propia descarga **Export → Markdown** de GitBook, descomprimida.

En cualquier caso, `--source` debe ser el directorio que contiene
directamente `SUMMARY.md`.

## Ejecutar la migración

```bash
# 1. Scaffold a fresh bx-sites project (skip this if you already have one)
bxSites new my-docs
cd my-docs

# 2. Migrate the GitBook export into it
bxSites migrate --source=/path/to/gitbook-export

# 3. Build and look at the result
bxSites serve
```

`migrate` imprime cuántas páginas convirtió y, cuando algo necesitó una
decisión de criterio, exactamente qué y dónde:

```
Migrated 14 page(s) from [/path/to/gitbook-export] into my-docs/docs/, wrote my-docs/docs/nav.json

2 item(s) need a manual look:
  - guides/advanced.md: Unsupported GitBook block [{% conditional-content %}] - left in its original syntax, needs manual conversion
  - guides/layout.md: Column width="one-third" is not a plain length/percentage - dropped, review manually
```

Nada se descarta jamás silenciosamente - un bloque que esta herramienta
no sabe cómo convertir se deja en el archivo migrado en su sintaxis
`{% %}` original, así que el contenido sigue ahí y sigue siendo fácil de
encontrar (busca `{%` en el árbol `docs/` migrado una vez que hayas
terminado). Volver a ejecutar `migrate` sobrescribe cualquier archivo o
`docs/nav.json` que haya escrito antes, así que es seguro corregir tu
exportación de origen y volver a ejecutarlo.

## Qué se convierte automáticamente

| GitBook | Se convierte en |
|---|---|
| `SUMMARY.md` | `docs/nav.json` (formato de [sobrescritura de nav](../configuration.md#nav)), conservando el anidamiento |
| `README.md` (cualquier carpeta) | `index.md` - la propia convención de índice de carpeta de bx-sites |
| El frontmatter `title`/`description`/`tags` de una página | Se traslada sin cambios al propio frontmatter de bx-sites del archivo migrado |
| `.gitbook/assets/**` | `docs/assets/gitbook/**`, con cada referencia reescrita para que coincida |
| `{% hint style="..." %}` | `!!! type` - una [admonición](markdown.md#admoniciones) nativa |
| `{% tabs %}` / `{% tab title="..." %}` | `=== "Title"` - [pestañas de contenido](markdown.md#pestañas-de-contenido) nativas |
| `{% cards %}` / `{% card %}` | [`::: cards` / `::: card`](content-blocks.md#tarjetas) |
| `{% columns %}` / `{% column width="..." %}` | [`::: columns` / `::: column`](content-blocks.md#columnas) |
| `{% stepper %}` / `{% step %}` | [`::: stepper` / `::: step`](content-blocks.md#stepper) - el título se toma del propio primer encabezado del paso |
| `{% file src="..." %}` | [`::: file`](content-blocks.md#archivo) |
| `{% embed url="..." %}` | [`::: embed`](content-blocks.md#incrustación) |
| `{% content-ref url="..." %}` | [`::: page-link`](content-blocks.md#enlace-de-página) |
| `{% details %}` / `{% expand %}` | [`::: expandable`](content-blocks.md#expandible) |
| `{% prompt description="..." icon="..." defaultExpanded="..." %}` | [`::: prompt`](content-blocks.md#prompt) - `openInAIProviders` se descarta, se reporta como advertencia cuando estaba activado |

Un bloque mostrado como un ejemplo literal en fence en tu contenido de
GitBook (en lugar de usarse de verdad) se deja correctamente intacto, sin
malinterpretarse como el bloque real.

## Qué necesita revisión manual

Un puñado de bloques de GitBook no tiene ningún equivalente en bx-sites y
se dejan en su sintaxis `{% %}` original en lugar de adivinarse:
**Conditional content** (visibilidad basada en cuenta de GitBook, no es
un concepto que tenga bx-sites) y la barra de búsqueda **Ask AI**.
Cualquier otra cosa que esta herramienta no
reconozca - un bloque con un error tipográfico, una función de GitBook
añadida después de que se escribiera esta herramienta - recibe el mismo
tratamiento: se deja tal cual, se reporta como advertencia.

Algunas decisiones de criterio más pequeñas se reportan de la misma
forma: un `style` de `hint` no reconocido (recurre a `note`), o un
`width` de `column` que no es una longitud/porcentaje CSS simple
(descartado en lugar de confiarse literalmente).

**Los iconos de página no se migran automáticamente.** La propia
documentación de GitBook no confirma que la asignación de icono de una
página (establecida mediante el selector de iconos de su editor)
realmente sobreviva a una exportación de Git-Sync en absoluto - si el
frontmatter exportado de un proyecto realmente tiene un campo `icon`,
`migrate` lo traslada de forma oportunista, pero no lo esperes para la
mayoría de las exportaciones reales. Establece los iconos a mano después
en su lugar - ya sea el propio frontmatter de una página, o el
[propio `icon` de una entrada de `docs/nav.json`](../configuration.md#nav)
- usando un [icono con nombre](themes.md#iconos) de una de las ocho
bibliotecas incluidas (sin necesidad de hacer coincidir los propios
iconos basados en Font Awesome de GitBook; elige el nombre que se vea
mejor en la propia galería de [Phosphor](https://phosphoricons.com/)
-cualquiera de sus seis pesos-, [Lucide](https://lucide.dev/icons/) o
[Tabler](https://tabler.io/icons)).

## Después de migrar

El `docs/nav.json` migrado es un archivo simple de
[sobrescritura de nav](../configuration.md#nav) - edítalo como cualquier
otro, o elimínalo para volver a la propia convención de
estructura-de-carpetas-es-estructura-de-navegación de bx-sites. Desde aquí
es un proyecto bx-sites normal: elige un [tema](themes.md), revisa
[`bxsites.yaml`](../configuration.md), y [despliega](deployment.md) cuando
estés satisfecho con él.
