---
title: Temas
order: 1
tags: [guías, temas]
---

# Temas

Los temas son plantillas `.bxm` nativas de BoxLang - no hay un motor de
plantillas ni un paso de compilación separados involucrados.

## Incorporados

| Tema | Base | Notas |
|---|---|---|
| `bootstrap` (predeterminado) | [Bootstrap 5](https://getbootstrap.com/), incluido localmente | Fuente Poppins, barra de navegación con degradado de marca |
| `material` | CSS al estilo Material escrito a mano | Diseño de tarjetas, sombras de elevación, fuente Roboto |
| `tailwind` | [Tailwind Play CDN](https://tailwindcss.com/) | Basado en clases de utilidad, sin paso de compilación |

El propio CSS/JS de cada tema incorporado (el paquete CSS/JS de Bootstrap,
highlight.js, Alpine.js, lunr.js para el proveedor de búsqueda `local`
predeterminado, y Mermaid cuando `mermaid` está activado) se incluye con
este módulo y se copia directamente en cada `site/` construido - sin CDN,
sin necesidad de acceso a internet para ver un sitio construido. El
propio motor de utilidades del tema `tailwind` (un compilador JIT del
lado del cliente, no una hoja de estilo estática) y otras funciones
opcionales que actives tú mismo (`math`, búsqueda de Algolia, Google
Analytics) siguen cargándose desde un CDN o una API alojada - consulta
[Sitios sin conexión a internet](#air-gapped-offline-sites) más abajo.

Los tres aplican la misma paleta de marca de BoxLang: un degradado
`#00FF78 -> #00DBFF` y un acento `#FFF500` - y los tres incluyen el mismo
conjunto de funciones de página:

- **Una tabla de contenido "En esta página"**, generada a partir de los
  propios encabezados `h2`/`h3` de cada página.
- **Migas de pan**, que muestran la cadena de ancestros de una página
  cuando está anidada más de un nivel bajo un ancestro enlazado.
- **Enlaces de página anterior/siguiente** al final del artículo, siguiendo
  el propio orden de lectura de la navegación.
- **Bloques de código con resaltado de sintaxis**, mediante
  [highlight.js](https://highlightjs.org/) más una gramática de BoxLang
  propia (` ```bx `/` ```boxlang `/` ```cfscript `), cada uno con un
  **botón de copiar** - mostrado al pasar el cursor en dispositivos que lo
  admiten, siempre visible en dispositivos táctiles (donde no hay hover
  para revelarlo). Consulta
  [Extensiones de Markdown](markdown.md#code-blocks).
- **Fuentes web autoalojadas** - sin solicitudes a `fonts.googleapis.com`
  al momento de la visualización.
- **Un interruptor de modo claro/oscuro**, impulsado por
  [Alpine.js](https://alpinejs.dev/) para la reactividad. La elección del
  visitante se recuerda en `localStorage` (recurriendo a la preferencia de
  su sistema operativo), y se aplica antes del primer renderizado para
  evitar un destello del tema incorrecto.
- **Una cabecera responsiva** que se mantiene en una sola fila en
  cualquier ancho - una ventana estrecha reduce el cuadro de búsqueda en
  lugar de envolverlo en su propia línea - además de una barra lateral de
  navegación colapsable (un interruptor de hamburguesa en `bootstrap`/
  `material`/`tailwind` por igual).
- **Atajos de teclado** en el cuadro de búsqueda: `/` enfoca la búsqueda
  desde cualquier lugar de la página, y `Escape` cierra los resultados.
  Consulta [Búsqueda](search.md).
- **Un enlace al repositorio y una línea "Edit this page"/"Last
  updated"**, cuando las opciones `repo`/`lastUpdated` de `bxdocs.json`
  están configuradas. Consulta [Configuración](../configuration.md#repo).
- **Un enlace "Download Markdown"**, junto a "Edit this page" - la fuente
  `.md` en bruto de cada página se publica junto a su HTML construido
  (`guides/themes.md` situado junto a `guides/themes/index.html`), de modo
  que ella misma (o un LLM) pueda leer la página como Markdown simple
  directamente en lugar de analizar el HTML renderizado. Siempre activo,
  sin configuración necesaria. Consulta
  [Primeros Pasos](../getting-started.md#downloading-a-page-as-markdown).
- **Un pie de página opcional** (copyright, enlaces `social`, un crédito
  "Built with BX Docs") cuando el `footer` de `bxdocs.json` es `true`.
  Consulta [Configuración](../configuration.md#footer).
- **Un selector de versión**, que aparece automáticamente en cuanto un
  proyecto tiene una carpeta `docs/versions/` con más de una versión en
  ella. Consulta [Configuración](../configuration.md#versioning).
- **Un `404.html` con el tema aplicado**, servido automáticamente por la
  mayoría de los alojamientos estáticos (incluido GitHub Pages) para
  cualquier ruta sin coincidencia.
- **Un logo y favicon personalizados**, cuando `theme.logo`/
  `theme.favicon` de `bxdocs.json` están configurados. Consulta
  [Configuración](../configuration.md#theme).
- **Una barra lateral de navegación colapsable**, opcional mediante
  `theme.options.navCollapsible`. Consulta
  [Configuración](../configuration.md#theme).
- **Google Analytics**, cuando `analytics` de `bxdocs.json` está
  configurado. Consulta [Configuración](../configuration.md#analytics).
- **Tarjetas para compartir en redes sociales** (metaetiquetas Open Graph
  + Twitter Card), obtenidas del frontmatter `description` de cada página
  (o la `description` general del sitio) y su propio `ogImage` (o el
  general del sitio) - generadas automáticamente por página de forma
  opcional mediante `generateOgImages` de `bxdocs.json`. Consulta
  [Configuración](../configuration.md#ogimage).
- **Etiquetas de página, un icono y una línea de resumen**, todo opcional
  mediante el propio frontmatter de una página - las etiquetas se
  renderizan como insignias que enlazan a un índice `/tags/` de todo el
  sitio. Consulta [Primeros Pasos](../getting-started.md#add-pages).
- **Una navegación explícita personalizada**, en `bxdocs.json` o en su
  propio `docs/nav.json`, que reemplaza la inferencia por carpetas en
  sitios grandes. Consulta [Configuración](../configuration.md#nav).
- **CSS/JS adicional**, inyectado mediante `extraCss`/`extraJs` de
  `bxdocs.json`. Consulta
  [Configuración](../configuration.md#extracss--extrajs).
- **Cuadros de aviso (nota/advertencia/consejo/...)**, activos por
  defecto en el markdown de cualquier página, incluidas variantes
  colapsables - sin configuración necesaria. Consulta
  [Extensiones de Markdown](markdown.md#admonitions).
- **Notas al pie y listas de definiciones**, opcionales mediante
  `markdown` de `bxdocs.json`. Consulta
  [Extensiones de Markdown](markdown.md#footnotes).
- **Pestañas de contenido**, **números de línea de código/líneas
  resaltadas/títulos** y **marcadores de diff/marcos de terminal** para
  bloques de código, sin configuración necesaria. Consulta
  [Extensiones de Markdown](markdown.md#content-tabs).
- **Diagramas Mermaid**, opcionales mediante `mermaid` de `bxdocs.json`.
  Consulta [Extensiones de Markdown](markdown.md#diagrams).
- **Matemáticas** (KaTeX), opcional mediante `math` de `bxdocs.json`.
  Consulta [Extensiones de Markdown](markdown.md#math).

Define cuál usa un proyecto en `bxdocs.json`:

```json
{ "theme": { "name": "material" } }
```

## Sitios sin conexión a internet (air-gapped) {#air-gapped-offline-sites}

Un sitio construido funciona sin ningún acceso a internet por defecto,
para los temas `bootstrap` y `material` con el proveedor de búsqueda
`local` predeterminado: el propio CSS/JS de Bootstrap, highlight.js,
Alpine.js y lunr.js vienen todos incluidos con este módulo
(`resources/assets/vendor/`) y se copian directamente en
`site/assets/vendor/` en el momento de la construcción - sin ninguna
etiqueta `<script>`/`<link>` a un CDN en ningún lugar del HTML generado
para ninguno de ellos. Activar la clave `mermaid` de `bxdocs.json` incluye
Mermaid de la misma forma - su paquete `mermaid.min.js` se copia en
`site/assets/vendor/mermaid/` y cada tema incorporado lo carga desde ahí,
de modo que los diagramas se siguen renderizando con cero solicitudes
salientes.

Todavía hay algunas cosas que se comunican con la red, solo cuando tú
mismo las activas:

- El propio motor de utilidades del tema `tailwind` es un compilador JIT
  del lado del cliente cargado desde `cdn.tailwindcss.com` - no es una
  hoja de estilo estática que este módulo pueda incluir de la misma
  forma, así que este tema todavía no es apto para sitios sin conexión.
- El propio motor de diseño de Mermaid carga de forma diferida un
  fragmento adicional, `elk-api.js`, desde jsDelivr - pero solo para los
  tipos de diagrama que optan por el algoritmo de diseño `elk`; el
  `mermaid.min.js` incluido renderiza por sí solo cualquier otro tipo de
  diagrama.
- La opción `math` de `bxdocs.json` carga KaTeX (tanto su JS como sus
  propios archivos de fuente) desde un CDN cuando está activada.
- `searchProvider.provider: "algolia"` y `analytics.provider: "google"`
  se comunican inherentemente con una API alojada/un endpoint de
  seguimiento - incluir el archivo JS localmente no eliminaría esa
  dependencia.

Si tu entorno de despliegue realmente no tiene ningún acceso a internet,
limítate a `bootstrap`/`material`, al proveedor de búsqueda `local`
predeterminado, evita los diagramas Mermaid con diseño `elk` si `mermaid`
está activado, y deja desactivados `math`/Algolia/Analytics.

## Iconos

El propio frontmatter `icon` de una página (mostrado junto a su título, y
junto a su entrada en la barra lateral de navegación) acepta ya sea un
emoji/texto corto simple - la forma original, todavía totalmente
compatible - o un icono con nombre de una de las ocho bibliotecas
autoalojadas, todas con licencia MIT/ISC e incluidas con este módulo
(~16.200 iconos combinados, sin CDN, sin nada añadido al peso de una
página construida más allá de los pocos iconos que realmente usa -
consulta IconResolver.bx):

```markdown
---
icon: rocket
---
```

```markdown
---
icon: lucide:rocket
---
```

```markdown
---
icon: phosphor-bold:rocket
---
```

El `rocket` sin prefijo usa por defecto [Phosphor](https://phosphoricons.com/),
peso regular. Phosphor incluye sus seis pesos propios, cada uno con su
propio prefijo: `phosphor-thin:`, `phosphor-light:`, `phosphor:` (regular,
igual que el nombre sin prefijo), `phosphor-bold:`, `phosphor-fill:` y
`phosphor-duotone:`. Usa el prefijo `lucide:` para
[Lucide](https://lucide.dev/icons/), o `tabler:` para
[Tabler](https://tabler.io/icons) en su lugar. Explora la propia galería
de cada sitio para el nombre exacto - coincide exactamente con el propio
nombre de archivo incluido en este módulo (minúsculas, con guiones, por
ejemplo `book-open`, `arrow-up-right`; el propio sitio de Phosphor
muestra un selector de peso - cada una de sus seis opciones allí es uno
de los seis prefijos `phosphor[-weight]:` de este módulo).

Font Awesome deliberadamente no es una de ellas - su estilo Duotone (y la
mayor parte de su conjunto de iconos desde la v6 en adelante) es exclusivo
de la versión Pro, no disponible bajo una licencia que este módulo pudiera
incluir y redistribuir de forma gratuita.

El propio SVG de un proyecto también funciona - colócalo en
`docs/assets/icons/my-icon.svg` y referéncialo como `icon: custom:my-icon`.

Una entrada de [nav.json](../configuration.md#nav) también puede definir
su propio `icon`, sobrescribiendo el propio frontmatter de la página de
destino solo para esa entrada:

```json
{ "title": "Guides", "path": "guides/index.md", "icon": "lucide:book-open" }
```

## El contrato de `ThemeProvider`

Un tema es simplemente una carpeta con:

- **`layout.bxm`** (obligatorio) - el shell HTML exterior + la
  navegación. Recibe `variables.page`, `variables.nav`,
  `variables.siteConfig`, `variables.themeDir` y `variables.basePath` en
  el ámbito, e incluye el `page.bxm` hermano mediante
  `#variables.themeDir#/page.bxm`. `variables.basePath` es siempre una
  ruta relativa a la raíz que termina en `/` (`/` por defecto,
  `/my-docs/` cuando el `baseURL` de `bxdocs.json` lo sobrescribe) -
  antepón ese prefijo a cada `href`/`src` interno, en lugar de codificar
  una `/` inicial de forma fija, para que el tema siga funcionando cuando
  el sitio se sirva desde una subruta.
- **`page.bxm`** (obligatorio) - el cuerpo del artículo. Renderiza
  `variables.page.contentHtml` - el markdown ya convertido.
- **`search.bxm`** (opcional) - el marcado del cuadro de búsqueda,
  incluido por `layout.bxm` solo cuando `search` de `bxdocs.json` es
  `true`. Consulta [Búsqueda](search.md).
- **`assets/`** (opcional) - CSS/JS del tema, copiado a
  `site/assets/theme/` en el momento de la construcción.

`variables.page.editUrl`/`.lastUpdated` (cadenas vacías cuando no están
configuradas) y `variables.siteConfig.repo`/`.social`/`.footer` también
están siempre disponibles, dando soporte a las funciones de enlace al
repositorio/enlace de edición/última actualización/pie de página
mencionadas arriba - un tema personalizado decide por sí mismo si y cómo
renderizarlas, igual que todo lo demás. `variables.versions`
(`[ { label, url } ]`, con "Latest" primero) y
`variables.currentVersion` (el `label` que se está renderizando en ese
momento) dan soporte al selector de versión - vacío/`"Latest"` para un
proyecto que no está versionado, así que un tema solo necesita renderizar
un selector cuando `variables.versions.len() gt 1`. Los tres temas
incorporados obtienen sus iconos de repositorio/redes sociales de una
pequeña tabla de búsqueda SVG compartida,
`<bx:include template="#variables.moduleAssetsDir#/icons.bxm">` (define
`bxdocsIcon( name )`, uno de `github`, `twitter`/`x`, `rss`, `youtube`,
`linkedin`, `facebook`, `bluesky`, `threads`, `slack`, `patreon`,
`email`, `edit`, `clock`, recurriendo a un glifo de enlace genérico) - un
tema personalizado puede incluirlo de la misma forma, o proporcionar sus
propios iconos por completo.

Una carpeta de tema a la que le falte cualquiera de los archivos
obligatorios falla de inmediato con un error claro `BxDocs.InvalidTheme`
en el momento de la construcción, en lugar de un confuso error de
plantilla en lo profundo del renderizado.

## Personalizar colores sin sobrescribir un tema

Para un ajuste de color/fuente, bifurcar todo un tema es excesivo - cada
tema incorporado lee su paleta de un puñado de propiedades CSS
personalizadas en `:root`, redeclaradas bajo `[data-theme="dark"]` para
el modo oscuro. El [`extraCss`](../configuration.md#extracss--extrajs)
de `bxdocs.json` se carga *después* de la propia hoja de estilo del tema,
así que una redeclaración con la misma especificidad en él gana sin
tocar `resources/themes/` en absoluto:

```json
{ "extraCss": [ "assets/brand.css" ] }
```

```css
/* docs/assets/brand.css - copiado a site/assets/brand.css en el momento de la construcción */
:root {
	--bxdocs-gradient-start: #7C3AED;
	--bxdocs-gradient-end: #DB2777;
	--bxdocs-accent: #FBBF24;
	--bxdocs-link: #7C3AED;
	--bxdocs-link-hover: #9F5AF0;
}

[data-theme="dark"] {
	--bxdocs-link: #C4B5FD;
	--bxdocs-link-hover: #DDD6FE;
}
```

El propio conjunto del tema `bootstrap`
(`resources/themes/bootstrap/assets/style.css`) es
`--bxdocs-gradient-start`/`-end`, `--bxdocs-accent`, `--bxdocs-bg`,
`--bxdocs-text`, `--bxdocs-sidebar-bg`, `--bxdocs-sidebar-text`,
`--bxdocs-border`, `--bxdocs-link`, `--bxdocs-link-hover` y
`--bxdocs-code-bg` - `material` y `tailwind` siguen la misma nomenclatura
`--bxdocs-*` con sus propias pequeñas variaciones. Cualquier cosa más
allá del color/fuente (diseño, añadir/quitar elementos de interfaz)
necesita una sobrescritura real o un tema personalizado - ver abajo.

## Sobrescribir un tema

Coloca tu propio `layout.bxm` + `page.bxm` (y opcionalmente `search.bxm` /
`assets/`) en una carpeta `theme/` en la raíz de tu proyecto. BX Docs
prefiere una sobrescritura `theme/` a nivel de proyecto sobre cualquier
tema incorporado, siempre que satisfaga el contrato anterior - los temas
incorporados bajo el propio `resources/themes/` de este módulo son un
buen punto de partida para copiar y adaptar.

Un ejemplo trabajado - partir de `bootstrap` e intercambiar su paleta de
marca y su fuente de encabezados por las tuyas, manteniendo todo lo demás
(navegación, búsqueda, modo oscuro, resaltado de código, ...) exactamente
como ya funciona:

```markdown
my-project/
├── bxdocs.yaml
├── docs/
└── theme/                    ← project-level override, checked before any built-in theme
    ├── layout.bxm             ← copied from resources/themes/bootstrap/layout.bxm
    ├── page.bxm                ← copied from resources/themes/bootstrap/page.bxm, unchanged
    ├── search.bxm               ← copied unchanged
    └── assets/
        └── style.css              ← copied from bootstrap's assets/style.css, then edited
```

1. Copia los tres archivos `.bxm` y `assets/style.css` desde
   `resources/themes/bootstrap/` de este módulo a `theme/` de tu proyecto.
2. Edita solo lo que necesites cambiar. Para intercambiar la paleta de
   marca y la fuente, eso es solo la parte superior de
   `theme/assets/style.css`:

   ```css
   :root {
   	--bxdocs-gradient-start: #7C3AED;  /* was #00FF78 */
   	--bxdocs-gradient-end: #DB2777;    /* was #00DBFF */
   	--bxdocs-accent: #FBBF24;          /* was #FFF500 */
   }

   body {
   	font-family: "Inter", system-ui, sans-serif;  /* was "Poppins" */
   }
   ```

3. Ejecuta `boxlang module:bxDocs build` (o `serve` mientras iteras) - BX
   Docs recoge `theme/` automáticamente, sin necesidad de cambiar
   `bxdocs.json` (una carpeta `theme/` a nivel de proyecto siempre tiene
   precedencia sobre el tema incorporado nombrado en `theme.name`). Todo
   lo que no tocaste - el renderizado de la navegación, la búsqueda, el
   interruptor de modo oscuro, las anotaciones de código - sigue
   funcionando exactamente como lo hacía en el tema `bootstrap` original,
   ya que sigue siendo exactamente el mismo marcado `layout.bxm`/
   `page.bxm` por debajo.

Una carpeta `theme/` de proyecto es todo o nada, sin embargo - en cuanto
BX Docs encuentra una, se usa en lugar del tema incorporado por completo,
así que igual necesita su propio `layout.bxm` + `page.bxm` aunque lo
único que hayas cambiado sea `assets/style.css` (una carpeta a la que le
falte cualquiera de los dos falla de inmediato con `BxDocs.InvalidTheme`
en lugar de recurrir silenciosamente al otro). Para un ajuste solo de
CSS/sin `.bxm`, usa
[`extraCss`](#customizing-colors-without-a-theme-override) en su lugar -
se superpone a cualquier tema que nombre `bxdocs.json`, sin ninguna
carpeta `theme/` involucrada en absoluto. `theme/` es para cuando también
necesitas cambiar el propio marcado, que se cubre a continuación.

## Escribir un tema desde cero

Un tema solo necesita los dos archivos obligatorios, así que aquí hay uno
genuinamente mínimo - sin Bootstrap/Tailwind, sin modo oscuro, sin
interfaz de búsqueda - para mostrar exactamente qué es obligatorio frente
a lo que añaden los temas incorporados. Guarda ambos como
`theme/layout.bxm` y `theme/page.bxm` en tu proyecto - una carpeta
`theme/` a nivel de proyecto se recoge automáticamente (como arriba), sin
necesidad de cambiar `bxdocs.json`:

```bx
<!-- theme/layout.bxm -->
<bx:script>
	function renderNav( required array nodes ) {
		var html = "<ul>"
		for ( var node in arguments.nodes ) {
			html &= "<li>"
			html &= len( node.url )
				? '<a href="' & variables.basePath & node.url & '">' & encodeForHTML( node.title ) & '</a>'
				: encodeForHTML( node.title )
			if ( node.children.len() ) {
				html &= renderNav( node.children )
			}
			html &= "</li>"
		}
		return html & "</ul>"
	}
</bx:script>
<bx:output>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>#encodeForHTML( variables.page.title )# - #encodeForHTML( variables.siteConfig.name )#</title>
	<link rel="stylesheet" href="#variables.basePath#assets/theme/style.css">
</head>
<body>
	<header><a href="#variables.basePath#">#encodeForHTML( variables.siteConfig.name )#</a></header>
	<nav>#renderNav( variables.nav )#</nav>
	<main>
</bx:output>
<bx:include template="#variables.themeDir#/page.bxm">
<bx:output>
	</main>
</body>
</html>
</bx:output>
```

```bx
<!-- theme/page.bxm -->
<bx:output>
<article>
	<h1>#encodeForHTML( variables.page.title )#</h1>
	#variables.page.contentHtml#
</article>
</bx:output>
```

Eso es un tema completo y funcional - `variables.page.contentHtml` es el
markdown ya convertido (resaltado de sintaxis, admoniciones, pestañas,
matemáticas y todo lo demás), así que no queda nada por analizar, solo
por maquetar. A partir de aquí, añade lo que sea que tengan los temas
incorporados que realmente quieras: `search.bxm` (incluido solo cuando
`search` de `bxdocs.json` es `true` - consulta [Búsqueda](search.md)),
un interruptor de modo oscuro (copia el par `x-data`/`x-init` de
Alpine.js de la etiqueta `<body>` de `resources/themes/bootstrap/layout.bxm`
y el bloque CSS `[data-theme="dark"]` correspondiente), migas de pan/
etiquetas/enlaces anterior-siguiente (`page.bxm` en cualquier tema
incorporado muestra el patrón - cada uno es solo un `if` alrededor de una
pequeña función de renderizado, todas impulsadas por campos ya presentes
en `variables.page`), o una carpeta `assets/` para tu propio CSS/JS,
copiada a `site/assets/theme/` automáticamente en el momento de la
construcción.
