---
title: Servidor MCP
order: 6.4
icon: phosphor-duotone:plugs-connected
summary: Activa mcp para escribir un site/mcp-index.json completo y sin truncar en cada build (además de site/mcp-manifest.json y un mcp-nav.json por árbol), para que bxSites Cloud pueda exponer tu sitio publicado a través de un servidor MCP público de solo lectura para agentes de IA - independiente de search/searchProvider.
tags: [guías, mcp, ai]
---

# Servidor MCP

Activa `mcp: true` en `bxsites.yaml` y cada `build` escribirá tres
archivos junto a tus páginas renderizadas - una copia completa y legible
por máquinas del contenido, la navegación y la estructura de árbol de tu
sitio que [bxSites Cloud](https://bxsites.io/cloud) lee para exponer un
servidor [MCP](https://modelcontextprotocol.io/) público y de solo
lectura para tu sitio publicado, la misma idea que
["MCP servers for published docs" de GitBook](https://gitbook.com/docs/ai-for-your-readers/mcp-servers-for-published-docs).
Una vez publicado, los agentes y asistentes de IA (Claude, ChatGPT y
cualquier otro cliente compatible con MCP) pueden buscar, explorar y
recuperar el contenido de tu sitio directamente, en lugar de raspar el
HTML renderizado:

- `site/mcp-index.json` - una entrada de texto completo por página, por
  árbol
- `site/mcp-nav.json` - la propia estructura de navegación de ese árbol,
  por árbol
- `site/mcp-manifest.json` - un índice de todo el sitio con cada árbol
  (sitio principal, versiones, idiomas) y dónde encontrar los archivos
  propios de cada uno indicados arriba

BxSites en sí solo produce los archivos descritos en esta página -
servirlos realmente como un servidor MCP en red es tarea de bxSites
Cloud, no algo que este módulo haga por sí solo.

!!! note "Requiere un plan de pago de bxSites Cloud"
    Generar `mcp-index.json` en sí es gratis y funciona solo con
    `bxSites build`, sin necesidad de una cuenta de Cloud. Exponerlo
    realmente como un servidor MCP activo para un sitio publicado es una
    función de bxSites Cloud disponible solo en sus planes de pago - no
    está incluida en el plan gratuito. Consulta
    [bxsites.io/cloud](https://bxsites.io/cloud) para ver los detalles
    actuales de los planes.

## Activarlo

=== "YAML"
    ```yaml title="bxsites.yaml"
    mcp: true
    ```

=== "JSON"
    ```json title="bxsites.json"
    { "mcp": true }
    ```

=== "TOML"
    ```toml title="bxsites.toml"
    mcp = true
    ```

`false` (predeterminado) omite todo el paso - no se escribe ninguno de
`mcp-index.json`, `mcp-nav.json` ni `mcp-manifest.json`, y `build` no
incurre en ningún costo adicional más allá de comprobar el indicador.

## Independiente de `search`

`mcp` no tiene nada que ver con [`search`/`searchProvider`](search.md) -
son dos interruptores independientes:

- `mcp-index.json` se genera sin importar si `search` es `true` o
  `false`, y sin importar `searchProvider.provider` (`"local"`,
  `"algolia"`, `"pagefind"` o uno personalizado).
- Activar `mcp` nunca cambia nada del cuadro de búsqueda propio de tu
  sitio de cara al visitante, y desactivar `search` nunca deshabilita
  `mcp-index.json`.

Por esto `mcp-index.json` no puede simplemente reutilizar
`search-index.json`: ese archivo solo se genera para el proveedor de
búsqueda `"local"` (un sitio respaldado por Algolia o Pagefind no
produce ningún `search-index.json`, ya que cada uno mantiene su propio
índice en otro lugar), y su campo `body` está deliberadamente truncado -
`search-index.json` se envía al navegador de cada visitante para el
cuadro de búsqueda en la página, así que mantenerlo pequeño importa.
Ninguna de estas restricciones aplica a `mcp-index.json`: se obtiene
desde el servidor por bxSites Cloud, no se envía a los visitantes, y un
cuerpo truncado arriesga que un agente de IA dé una respuesta
incompleta o incorrecta.

## El formato de `mcp-index.json`

Una entrada por cada página no oculta (la misma convención "las páginas
ocultas se excluyen" que usan `search-index.json` y la navegación),
cubriendo tanto las páginas de documentación normales como las entradas
del [blog](blog.md):

```json title="site/mcp-index.json"
[
  {
    "title": "Getting Started",
    "url": "getting-started/index.html",
    "tags": ["guides"],
    "headings": ["Getting Started", "Installation", "Next steps"],
    "body": "Getting Started Installation Run bxSites new to scaffold a project... Next steps ...",
    "markdown": "# Getting Started\n\n## Installation\n\nRun `bxSites new` to scaffold a project...\n\n## Next steps\n\n...",
    "type": "page",
    "categories": [],
    "updatedAt": "2026-08-18T10:15:00.000Z"
  },
  {
    "title": "Announcing bxSites 2.0",
    "url": "blog/announcing-bxsites-2/index.html",
    "tags": ["release"],
    "headings": ["Announcing bxSites 2.0"],
    "body": "Announcing bxSites 2.0 Today we're shipping...",
    "markdown": "# Announcing bxSites 2.0\n\nToday we're shipping...",
    "type": "post",
    "categories": ["Releases"],
    "updatedAt": "2026-08-15"
  }
]
```

| Campo | Descripción |
|---|---|
| `title` | El título de la página (frontmatter `title`, igual que en `search-index.json`) |
| `url` | La ruta URL de la página, relativa a la raíz de su propio árbol - nunca absoluta desde la raíz y sin el `path` propio del árbol (consulta URLs relativas al árbol más abajo) |
| `tags` | El array `tags` del frontmatter de la página |
| `headings` | El texto plano de cada encabezado `h1`-`h6` de la página, en el orden del documento |
| `body` | El contenido de texto plano **completo** de la página, sin etiquetas HTML - nunca truncado |
| `markdown` | El mismo contenido de la página convertido a Markdown desde su HTML renderizado, nunca truncado (consulta Contenido en Markdown más abajo). Falta en un índice generado por una versión anterior de bxSites - usa `body` en ese caso. |
| `type` | `"page"` para una página de documentación normal, `"post"` para una entrada de [blog](blog.md) |
| `categories` | El propio array `categories` del frontmatter de una entrada; siempre `[]` para una página de documentación (las páginas de documentación no tienen categorías) |
| `updatedAt` | El propio `date` del frontmatter de una entrada; el propio `date` del frontmatter de una página de documentación cuando lo define, o si no, la fecha de última modificación de su archivo fuente como instante ISO-8601. `""` cuando ninguno de los dos está disponible. |

Aparte de `markdown`, `type`, `categories` y `updatedAt`, esta es la misma forma de
entrada que usa `search-index.json`, con una diferencia: allí, `body` se
recorta a 400 caracteres con puntos suspensivos al final; aquí, es la
página completa.

## Contenido en Markdown

`markdown` es el contenido renderizado de la página convertido a Markdown,
para que un agente de IA pueda leer encabezados, código, listas y tablas
sin analizar HTML. Se convierte desde el HTML renderizado, no desde el
archivo fuente (que puede contener directivas de compilación y variables),
así que coincide con lo que ven los visitantes. `body` no cambia y sigue
siendo el texto plano que se usa para la búsqueda.

Lo que produce la conversión:

- Encabezados en formato ATX (`# Título`, `## Sección`), sin los enlaces ancla
- Los bloques de código con valla conservan su lenguaje cuando el código
  renderizado lo tiene (una valla `boxlang`); un bloque sin lenguaje sale como bloque de código con sangría
- Listas, listas anidadas, tablas y formato en línea
- Grupos de pestañas: cada panel lleva antes el nombre de su pestaña en negrita (`**YAML**`)
- Avisos: una cita cuya primera línea es el título en negrita
- Imágenes como `![alt](src)`; las imágenes decorativas sin texto alternativo se omiten
- Se eliminan scripts, estilos, sprites svg y controles de formulario
- Los enlaces y las fuentes de imagen se conservan tal como se renderizaron:
  rutas absolutas del sitio que ya llevan la ruta de `baseUrl` de la
  compilación y el prefijo propio del árbol
  (por ejemplo `/versions/0.9/guides/setup/index.html`)

!!! note "Tamaño del índice"
    `markdown` multiplica aproximadamente por dos el tamaño de
    `mcp-index.json`. En este sitio de documentación, las 73 páginas del
    árbol principal pasaron de unos 460 KB a cerca de 1 MB.

## URLs relativas al árbol

`mcp-index.json` se escribe una vez por árbol, y la `url` de cada entrada
es relativa a la raíz de su propio árbol: sin barra inicial, sin prefijo
del árbol, sin ruta de `baseUrl`. La ruta completa de una página es el
`path` del árbol en el manifiesto unido a su `url` (solo la `url` cuando
`path` es `""`):

| Árbol (`path` del manifiesto) | Archivo de índice | `url` de la entrada | Archivo de la página |
|---|---|---|---|
| `""` | `mcp-index.json` | `guides/setup/index.html` | `guides/setup/index.html` |
| `versions/0.9` | `versions/0.9/mcp-index.json` | `guides/setup/index.html` | `versions/0.9/guides/setup/index.html` |
| `es` | `es/mcp-index.json` | `guides/setup/index.html` | `es/guides/setup/index.html` |

Así, la misma `url` aparece en todos los árboles que tienen esa página.
Todo lo que compare una entrada con una ruta de solicitud absoluta del
sitio, como un subárbol protegido con contraseña, debe anteponer primero el
`path` del árbol. Esto solo afecta a `url`: los enlaces y las fuentes de
imagen dentro de `markdown` ya son absolutos del sitio.

## El formato de `mcp-manifest.json`

Escrito una vez por build del sitio (no una vez por árbol),
`site/mcp-manifest.json` enumera cada árbol que obtuvo su propio
`mcp-index.json`/`mcp-nav.json`, para que el servidor MCP de bxSites
Cloud pueda ofrecer herramientas conscientes de versión e idioma sin
tener que adivinar las propias convenciones de directorios de bx-sites:

```json title="site/mcp-manifest.json"
[
  { "path": "", "label": "1.0.x", "version": "1.0.x", "locale": "en", "default": true },
  { "path": "next", "label": "Next", "version": null, "locale": "en", "default": false },
  { "path": "versions/0.9", "label": "0.9", "version": "0.9", "locale": "en", "default": false },
  { "path": "es", "label": "Español", "version": "1.0.x", "locale": "es", "default": false }
]
```

| Campo | Descripción |
|---|---|
| `path` | La ruta propia de este árbol, relativa a la raíz - `""` para el árbol principal en la raíz del sitio, `"next"`/`"versions/<name>"`/`"<localeCode>"`/`"versions/<name>/<localeCode>"` en cualquier otro caso. Únela con `/mcp-index.json` (o `/mcp-nav.json`) para obtener el archivo propio de ese árbol, p. ej. `"versions/0.9/mcp-index.json"` - y solo `"mcp-index.json"` para el de la raíz (`path` es `""` ahí). |
| `label` | Una etiqueta legible para este árbol - la propia etiqueta del selector de versiones (el nombre de `versions.default`, el nombre propio de una versión normal, o `"Latest"`/`"Next"`), combinada con la etiqueta propia del idioma para un sub-árbol de idioma |
| `version` | El nombre de `docs/versions/<name>/` que renderiza este árbol, o `null` cuando no es una versión con nombre (el árbol principal sin versionar, o `/next/`) |
| `locale` | El código de idioma propio de este árbol - `i18n.defaultLocale.code` para un árbol sin sufijo de idioma, o el código propio de ese idioma en caso contrario |
| `default` | `true` para el único árbol que se renderiza en la raíz del sitio - aquel al que llega un visitante/agente de IA sin especificar versión ni idioma |

## El formato de `mcp-nav.json`

Escrito junto al propio `mcp-index.json` de cada árbol (raíz del sitio,
`/next/`, cada árbol `/versions/<name>/`, cada sub-árbol de idioma),
`mcp-nav.json` es la navegación propia de ese árbol - exactamente la
misma estructura anidada `{ title, url, order, icon, children }` con la
que el propio tema renderiza la barra lateral - para que el servidor MCP
de bxSites Cloud pueda ofrecer una herramienta `get_nav`/tabla de
contenidos sin inventar una segunda forma de navegación propia:

```json title="site/mcp-nav.json"
[
  {
    "title": "Getting Started",
    "url": "getting-started/index.html",
    "order": 1,
    "icon": "phosphor-duotone:rocket-launch",
    "children": []
  },
  {
    "title": "Guides",
    "url": "",
    "order": 2,
    "icon": "",
    "children": [
      { "title": "Search", "url": "guides/search/index.html", "order": 1, "icon": "", "children": [] }
    ]
  }
]
```

Un nodo de grupo/carpeta sin `index.md` propio (como `"Guides"` arriba)
tiene un `url` vacío - no es una página, solo un encabezado para sus
`children`.

## Sitios con múltiples versiones e idiomas

Igual que `search-index.json`, `mcp-index.json`/`mcp-nav.json` se
escriben una vez por cada árbol renderizado - el sitio principal,
`/next/` (cuando `versions.default` está definido), cada árbol
`/versions/<name>/` y cada sub-árbol de idioma -, de modo que cada árbol
publicado obtiene su propio par de archivos que cubre solo las páginas y
la navegación de ese árbol. `mcp-manifest.json`, en cambio, se escribe
una vez por build, solo en la raíz del sitio, enumerando cada uno de
esos árboles.
