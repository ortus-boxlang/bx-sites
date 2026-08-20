---
title: Configuración
order: 4
icon: ⚙️
summary: Cada clave de bxdocs.json, su valor por defecto y qué hace.
tags: [referencia, configuración]
---

# Configuración

Cada proyecto tiene un único `bxdocs.json` en su raíz:

```json
{
	"name": "My Docs",
	"description": "",
	"baseURL": "/",
	"theme": {
		"name": "bootstrap",
		"options": {},
		"logo": "",
		"favicon": ""
	},
	"search": true,
	"nav": [],
	"markdown": { "enableAdmonition": true },
	"repo": {
		"url": "",
		"editUri": ""
	},
	"social": [],
	"footer": false,
	"lastUpdated": false,
	"mermaid": false,
	"math": false,
	"analytics": {
		"provider": "",
		"id": ""
	},
	"ogImage": "",
	"generateOgImages": false,
	"extraCss": [],
	"extraJs": [],
	"plugins": [],
	"i18n": {
		"defaultLocale": { "code": "en", "label": "English" },
		"locales": []
	}
}
```

Solo `name` es obligatorio - todo lo demás recurre a los valores por
defecto mostrados arriba. Un objeto `theme` parcial se combina un nivel
de profundidad, así que `{"theme":{"name":"material"}}` por sí solo
conserva las `options` por defecto (vacías).

## `name`

El nombre del sitio, mostrado en la marca de la cabecera y en los títulos
de página. Obligatorio.

## `description`

Una descripción de sitio opcional, usada como `<meta name="description">`
y `og:description` de reserva para cualquier página que no defina su
propio frontmatter `description` (consulta
[Primeros Pasos](getting-started.md#add-pages)).

## `baseURL`

Controla cómo se antepone el prefijo a cada enlace interno, ruta de
recurso y entrada de navegación, y también actúa como la URL canónica
del sitio para `sitemap.xml` y `llms.txt`.

- Dejado en blanco o `"/"` (el valor por defecto) - los enlaces
  permanecen relativos a la raíz (`/page/`), y no se genera ni
  `sitemap.xml` ni un `llms.txt` con URL absoluta (no hay un dominio
  canónico a partir del cual construirlos).
- Una ruta simple, por ejemplo `"my-docs"` o `"/my-docs/"` - se asume que
  el sitio se sirve desde esa subruta, y cada enlace interno, entrada de
  navegación y recurso lleva ese prefijo (`/my-docs/page/`). Sigue sin
  generarse `sitemap.xml`, ya que todavía no hay un dominio absoluto.
- Una URL completa, por ejemplo `"https://docs.example.com/"` - la parte
  de la ruta (`/` aquí) se usa de la misma forma que lo haría una ruta
  simple, **y** `sitemap.xml` se escribe en el momento de la construcción
  con la URL absoluta de cada página no oculta bajo ese dominio.

`llms.txt` (consulta [más abajo](#llmstxt)) siempre se escribe; simplemente
prefiere una URL absoluta cuando `baseURL` la proporciona.

## `llms.txt`

Cada construcción escribe un `llms.txt` en la raíz del sitio - un índice
en Markdown simple de cada página no oculta, siguiendo la convención
emergente de [llms.txt](https://llmstxt.org) para ayudar a las
herramientas basadas en LLM a navegar un sitio sin rastrear su HTML
renderizado. No hay clave de configuración para esto; se genera
automáticamente, usando una URL absoluta por enlace cuando `baseURL` es
una URL completa, o una relativa a `basePath` en caso contrario.

## `sitemap.xml`

Se escribe en la raíz del sitio, pero solo cuando `baseURL` es una URL
completa (ver arriba) - un sitemap necesita un dominio absoluto para
tener sentido. Enumera cada página no oculta según el protocolo de
[sitemaps.org](https://www.sitemaps.org/).

## `theme`

- `theme.name` - uno de los temas incorporados (`bootstrap`, `material`,
  `tailwind`), o el nombre de un tema personalizado que proporciones
  mediante una carpeta `theme/` en la raíz del proyecto (consulta
  [Temas](guides/themes.md))
- `theme.logo` - ruta/URL a una imagen mostrada junto al nombre del sitio
  en la marca de la cabecera (en lugar del glifo "⚡" por defecto) - una
  ruta relativa (por ejemplo `"assets/logo.svg"`, resuelta contra
  `docs/assets/`) lleva el prefijo `baseURL` como cualquier otro recurso
  interno; una URL absoluta se usa tal cual. Dejado en blanco (el valor
  por defecto), la cabecera muestra "⚡ &lt;nombre del sitio&gt;".
- `theme.favicon` - ruta/URL a un favicon, resuelta de la misma forma que
  `theme.logo`. Dejado en blanco (el valor por defecto), no se renderiza
  ningún `<link rel="icon">` en absoluto (recurriendo al comportamiento
  por defecto propio del navegador).
- `theme.options` - opciones específicas del tema, leídas por todos los
  temas incorporados:
  - `theme.options.colorMode` - `"auto"` (el valor por defecto), `"light"`
    o `"dark"`. Controla qué modo ve un visitante por primera vez antes de
    haber elegido uno propio mediante el interruptor claro/oscuro de la
    cabecera - `"auto"` sigue la preferencia de su sistema operativo,
    `"light"`/`"dark"` fija un valor por defecto. Una vez que un visitante
    activa el interruptor, su propia elección (guardada en `localStorage`)
    siempre prevalece en visitas posteriores, independientemente de este
    valor.

    ```json
    { "theme": { "options": { "colorMode": "dark" } } }
    ```
  - `theme.options.navCollapsible` - `false` (el valor por defecto)
    renderiza cada encabezado de sección de navegación siempre expandido,
    como hoy. `true` renderiza cada sección de navegación (una carpeta sin
    `index.md`) como un desplegable nativo `<details>`/`<summary>` que el
    visitante puede colapsar - sin ningún framework de JS involucrado.
  - `theme.options.navExpandAll` - solo relevante cuando `navCollapsible`
    es `true`. `true` (el valor por defecto) inicia cada sección abierta;
    `false` inicia cada sección colapsada.

    ```json
    { "theme": { "options": { "navCollapsible": true, "navExpandAll": false } } }
    ```

## `search`

`true` (el valor por defecto) construye un índice de búsqueda estático y
conecta el cuadro de búsqueda; `false` omite ambos por completo - sin
`search-index.json`, sin interfaz de búsqueda, sin JS adicional enviado.
Consulta [Búsqueda](guides/search.md).

## `nav`

Por defecto, la navegación se infiere de la propia estructura de
carpetas/archivos de `docs/` (con el frontmatter `order`/`hidden`) - bien
para sitios pequeños, pero uno grande puede superarla: una navegación
explícita te permite titular, agrupar y ordenar las páginas como quieras,
independientemente de dónde vivan realmente sus archivos.

Un array vacío (el valor por defecto) significa "inferir de la estructura
de carpetas". Un array no vacío reemplaza esa inferencia por completo -
el orden del array se convierte en el orden de la navegación, y una
página no referenciada en ningún lugar de él igualmente se construye,
solo que no se enlaza desde la navegación (igual que `hidden: true`).
Cada entrada es o bien:

- una cadena con una ruta simple relativa a docs/, por ejemplo
  `"guides/setup.md"` - el título proviene del propio frontmatter/nombre
  de archivo de esa página, igual que daría la inferencia por carpetas
- un objeto `{ "title", "path", "icon", "children" }` - `path`, `icon` y
  `children` son todos opcionales; una entrada solo con `title` y sin
  `path` es un encabezado de grupo sin enlace (como una carpeta sin
  `index.md` hoy en día), y un `title`/`icon` explícito siempre sobrescribe
  el título/icono propio de la página enlazada en la navegación (el
  `<h1>`/`<title>` real de la página queda intacto - solo cambia la
  etiqueta/icono de navegación) - consulta
  [Temas: Iconos](guides/themes.md#icons) para lo que puede ser un valor
  de `icon`

```json
{
	"nav": [
		"index.md",
		{
			"title": "Guides",
			"children": [
				{ "title": "Quick Start", "path": "guides/setup.md" },
				"guides/deployment.md"
			]
		}
	]
}
```

Para una navegación lo bastante grande como para saturar `bxdocs.json`,
muévela a su propio archivo `docs/nav.json` en su lugar - la misma forma
de array, simplemente como el contenido de nivel superior de todo el
archivo:

```json
[
	"index.md",
	{ "title": "Guides", "children": [ "guides/setup.md" ] }
]
```

El propio `nav` de `bxdocs.json`, cuando no está vacío, siempre prevalece
sobre `docs/nav.json`. Solo el árbol principal respeta cualquiera de los
dos - un árbol `docs/versions/<name>/` siempre infiere su navegación de su
propia estructura de carpetas, incluso cuando el árbol principal tiene una
explícita.

## `markdown`

Se reenvía tal cual a la propia configuración del módulo de
[bx-markdown](https://github.com/ortus-boxlang/bx-markdown) antes de
renderizar cada página. BX Docs no redefine ni valida estas claves; lo que
sea que pongas aquí es el propio conjunto de opciones de bx-markdown,
directamente - así que esta lista puede divergir de la propia de
bx-markdown a medida que evoluciona. Las tablas, `~~tachado~~`, las
casillas de tarea `- [ ]` y la tabla de contenido en la página están
siempre activas, sin interruptor. La única excepción es
`enableAdmonition` - bx-markdown por sí mismo lo establece en `false` por
defecto, pero BX Docs lo establece en `true` por defecto (consulta la
[guía de Extensiones de Markdown](guides/markdown.md)).

| Clave | Valor por defecto | Efecto |
|---|---|---|
| `enableAdmonition` | `true` *(valor por defecto de BX Docs; el propio valor por defecto de bx-markdown es `false`)* | Bloques de aviso `!!!`/`???`/`???+` - consulta la [guía de Extensiones de Markdown](guides/markdown.md#admonitions) |
| `enableFootnotes` | `false` | Referencias de nota al pie `[^label]` - consulta la [guía de Extensiones de Markdown](guides/markdown.md#footnotes) |
| `enableDefinitionLists` | `false` | Listas `Term\n:   Definition` - consulta la [guía de Extensiones de Markdown](guides/markdown.md#definition-lists) |
| `autoLinkUrls` | `true` | Enlaza automáticamente URL y direcciones de correo sin formato |
| `anchorLinks` | `true` | Añade un enlace de ancla clicable a cada encabezado |
| `anchorSetId` | `true` | Estampa un atributo `id` en cada encabezado |
| `achorSetName` *(sic)* | `true` | Estampa un atributo `name` en cada encabezado |
| `anchorWrapText` | `false` | Envuelve todo el texto del encabezado en el enlace de ancla, en lugar de solo un marcador simple |
| `anchorClass` | `"anchor"` | Clase CSS en el `<a>` de ancla |
| `anchorPrefix` / `anchorSuffix` | `""` | HTML sin procesar inyectado inmediatamente antes/después del texto del encabezado |
| `enableYouTubeTransformer` | `false` | Incrusta automáticamente enlaces de YouTube sin formato como un reproductor |
| `codeStyleHTMLOpen` / `codeStyleHTMLClose` | `"<code>"` / `"</code>"` | HTML envolvente alrededor de los fragmentos de código en línea |
| `fencedCodeLanguageClassPrefix` | `"language-"` | Prefijo de clase del que dependen el resaltador de sintaxis del lado del cliente de bx-docs (y Mermaid, ver abajo), por ejemplo ` ```js ` -> `class="language-js"` |
| `tableOptions.columnSpans` | `true` | Respeta las celdas de tabla combinadas al estilo `colspan` |
| `tableOptions.appendMissingColumns` | `true` | Rellena una fila corta hasta el número de columnas del encabezado |
| `tableOptions.discardExtraColumns` | `true` | Descarta celdas adicionales en una fila demasiado larga |
| `tableOptions.className` | `"table"` | Clase CSS en cada `<table>` renderizada |
| `tableOptions.headerSeparationColumnMatch` | `true` | Exige que la fila separadora `---` coincida con el número de columnas del encabezado |

```json
{
	"markdown": {
		"enableFootnotes": true,
		"enableDefinitionLists": true,
		"anchorLinks": false,
		"enableYouTubeTransformer": true
	}
}
```

## `repo`

Añade un enlace con icono de repositorio a la cabecera (los tres temas
incorporados) y, cuando ambas claves están definidas, un enlace "Edit this
page" en cada página.

- `repo.url` - la URL de tu repositorio, por ejemplo
  `"https://github.com/acme/docs"`. Renderiza el enlace con icono de la
  cabecera por sí solo; déjalo en blanco para omitirlo por completo.
- `repo.editUri` - el segmento de ruta entre la URL del repositorio y la
  ruta de origen propia de una página, por ejemplo `"edit/main/docs/"`
  (la propia convención de URL de "editar" de GitHub). Combinado con
  `repo.url` y la ruta de origen relativa a `docs/` de una página para
  construir su enlace de edición - por ejemplo, con el ejemplo anterior,
  `docs/guides/setup.md` obtiene
  `https://github.com/acme/docs/edit/main/docs/guides/setup.md`. También
  requiere `repo.url`; déjalo en blanco para omitir los enlaces de edición
  mientras sigues mostrando el icono de la cabecera.

```json
{ "repo": { "url": "https://github.com/acme/docs", "editUri": "edit/main/docs/" } }
```

## `social`

Un array de enlaces sociales/externos renderizados en el pie de página
(consulta [`footer`](#footer) - no tiene efecto a menos que también esté
activado). Cada entrada necesita una `url`; `icon` selecciona de un
pequeño conjunto de iconos incorporado (`github`, `twitter`/`x`,
`youtube`, `linkedin`, `facebook`, `bluesky`, `threads`, `slack`,
`patreon`, `rss`, `email`, recurriendo a un glifo de enlace genérico para
cualquier otra cosa), y `label` establece el nombre accesible/tooltip del
enlace (por defecto `icon`, y luego `"Link"`).

```json
{
	"social": [
		{ "url": "https://twitter.com/acme", "icon": "twitter", "label": "Twitter" },
		{ "url": "https://acme.com/rss.xml", "icon": "rss", "label": "RSS" }
	]
}
```

## `footer`

`false` (el valor por defecto) - sin pie de página en absoluto. `true`
añade uno a cada página: una línea de copyright (`© <year> <site name>`),
los enlaces `social` (si los hay), y un crédito "Built with BX Docs".

```json
{ "footer": true }
```

## `lastUpdated`

`false` (el valor por defecto) - sin fecha de última actualización. `true`
añade una línea "Last updated" junto al enlace de edición (o por sí sola,
si `repo.editUri` no está definido), obtenida de `git log` sobre el propio
archivo Markdown de cada página en el momento de la construcción. Se omite
silenciosamente para una página de la que git no tiene historial - un
`git init` reciente sin commits todavía, una construcción ejecutándose
desde un zip descargado sin `.git` en absoluto, o git no estando instalado
en la máquina de construcción - en lugar de romper la construcción.

```json
{ "lastUpdated": true }
```

## `analytics`

Conecta el análisis de vistas de página. Actualmente solo admite Google
Analytics (`gtag.js`):

- `analytics.provider` - `"google"` para activarlo; dejado en blanco (el
  valor por defecto), no se envía ningún script de análisis en absoluto.
- `analytics.id` - el ID de medición de Google Analytics (por ejemplo,
  `"G-ABC123"`). Obligatorio cuando `provider` es `"google"`.

```json
{ "analytics": { "provider": "google", "id": "G-ABC123" } }
```

## `ogImage`

Ruta/URL a una imagen de tarjeta social por defecto, renderizada como
`og:image` (emparejada con un `twitter:card` de `summary_large_image`) en
cada página que no la sobrescriba - resuelta de la misma forma que
`theme.logo` (las rutas relativas llevan el prefijo `baseURL`, las URL
absolutas se usan tal cual). Dejado en blanco (el valor por defecto) y
con `generateOgImages` desactivado, no se renderiza ninguna etiqueta
`og:image`/`twitter:card`.

```json
{ "ogImage": "assets/social-card.png" }
```

El propio `ogImage` del frontmatter de una página (consulta
[Primeros Pasos](getting-started.md#add-pages)) siempre prevalece sobre
este valor por defecto de todo el sitio para esa página en particular.

### `generateOgImages`

`false` (el valor por defecto) - sin tarjetas por página. `true` renderiza
una tarjeta social PNG real de 1200x630 para cada página que aún no tenga
su propio `ogImage` en el frontmatter - el título de la página sobre el
degradado de marca, escrito en `site/assets/og/<page>.png` - en lugar de
que cada página comparta una imagen genérica de todo el sitio. Puro
`java.awt`/`javax.imageio` por debajo (parte de cualquier JVM en la que
se ejecute BoxLang), así que esto no necesita navegador headless, servicio
externo, ni acceso a red en el momento de la construcción.

```json
{ "generateOgImages": true }
```

## `extraCss` / `extraJs`

Arrays de URL de hojas de estilo/scripts adicionales para incluir en cada
página, añadidos después de los propios recursos del tema - cada entrada
se resuelve de la misma forma que `theme.logo` (una ruta relativa lleva el
prefijo `baseURL`; una URL absoluta se usa tal cual). Las entradas de
`extraJs` se cargan con `defer`.

```json
{
	"extraCss": [ "assets/custom.css" ],
	"extraJs": [ "assets/custom.js" ]
}
```

## `mermaid`

`false` (el valor por defecto) - sin soporte de diagramas
[Mermaid](https://mermaid.js.org/) en absoluto. `true` carga `mermaid.js`
del lado del cliente y renderiza cada bloque de código con fence
` ```mermaid ` como un diagrama. Consulta
[Extensiones de Markdown](guides/markdown.md#diagrams) para la sintaxis.

```json
{ "mermaid": true }
```

## `math`

`false` (el valor por defecto) - sin [KaTeX](https://katex.org/) en
absoluto. `true` lo carga del lado del cliente y compone `$...$`/`$$...$$`
escrito directamente en el markdown de una página. Consulta
[Extensiones de Markdown](guides/markdown.md#math) para la sintaxis.

```json
{ "math": true }
```

Las admoniciones (cuadros de aviso al estilo nota/advertencia/consejo),
las pestañas de contenido y las anotaciones de código con fence
`hl_lines`/`linenums`/`title` están siempre disponibles en el markdown de
cualquier página, sin necesidad de configuración - consulta
[Extensiones de Markdown](guides/markdown.md#admonitions).

## `plugins`

`[]` (el valor por defecto) - un array de nombres de módulos de BoxLang
para activar como plugins. Instalar un módulo de plugin (`box install`)
nunca lo activa por sí solo; también tiene que nombrarse aquí. Consulta
[Plugins](guides/plugins.md) para saber cómo escribir uno.

```json
{ "plugins": [ "myBxDocsPlugin" ] }
```

## `i18n`

Metadatos para la convención de carpetas de idioma
[`docs/i18n/<code>/`](guides/i18n.md) - un idioma se construye
automáticamente en cuanto su carpeta existe; `i18n` simplemente
proporciona su etiqueta de visualización/dirección para el selector de
idioma.

- `i18n.defaultLocale` - `{ "code", "label" }` para el propio árbol
  `docs/` regular del proyecto, con el valor por defecto
  `{ "code": "en", "label": "English" }`. Solo hace falta definirlo cuando
  tu idioma predeterminado no es el inglés.
- `i18n.locales` - `[]` (el valor por defecto) - un array de
  `{ "code", "label", "dir" }` para cada otro idioma. `code` cumple una
  doble función como nombre de la carpeta `docs/i18n/<code>/` y como
  prefijo de URL generado - solo letras/dígitos/guiones (`es`, `pt-BR`,
  `zh-Hans`). `dir` es `"ltr"` (el valor por defecto) o `"rtl"`.

```json
{
	"i18n": {
		"defaultLocale": { "code": "en", "label": "English" },
		"locales": [
			{ "code": "es", "label": "Español" },
			{ "code": "ar", "label": "العربية", "dir": "rtl" }
		]
	}
}
```

Consulta [Internacionalización](guides/i18n.md) para el panorama completo
- la reserva de páginas sin traducir, el selector de idioma y lo que
todavía no está traducido.

## Versionado

Los documentos versionados son cuestión de convención, no de
configuración - no hay ninguna clave de `bxdocs.json` para ello. Añade
una carpeta `docs/versions/`, y cada subcarpeta directa dentro de ella se
construye como su propio árbol de documentos totalmente autocontenido,
junto a tu `docs/` regular (que siempre se construye como "Latest"):

```
docs/
├── index.md
├── guides/
└── versions/
    ├── 1.0/
    │   ├── index.md
    │   └── guides/
    └── 2.0/
        ├── index.md
        └── guides/
```

Cada carpeta de versión es un árbol normal con forma de `docs/` - su
propio `index.md`, su propia navegación, sus propias páginas - construido
en `site/versions/<name>/` con cada enlace interno prefijado en
consecuencia, y compartiendo el único `bxdocs.json` de configuración/tema
del proyecto. Los nombres de versión se ordenan de más reciente a más
antiguo, numéricamente en lugar de alfabéticamente (de modo que `2.0` se
ordena antes que `10.0`), y cada tema renderiza automáticamente un
desplegable selector de versión en la cabecera en cuanto existe más de
una versión - no hay nada que activar. Un archivo suelto colocado
directamente bajo `docs/versions/` (no dentro de una subcarpeta) se
ignora.

`sitemap.xml` y `llms.txt` incluyen las páginas de todas las versiones
junto a las del sitio principal.
