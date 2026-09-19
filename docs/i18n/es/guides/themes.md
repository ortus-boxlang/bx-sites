---
title: Temas
order: 1
icon: phosphor-duotone:palette
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
| `docsy` | CSS escrito a mano, bifurcado de `material` | Look de manual de referencia azul marino inspirado en Read the Docs/Docsy |
| `slate` | CSS escrito a mano, bifurcado de `material` | Inspirado en Stripe/Slate - una barra lateral permanentemente oscura sin importar el modo claro/oscuro |
| `docusaurus` | CSS escrito a mano, bifurcado de `material` | Barra de navegación de ancho completo, coloreada y llamativa, inspirada en Docusaurus, tarjetas redondeadas |
| `justthedocs` | CSS escrito a mano, bifurcado de `material` | Minimalismo inspirado en Just the Docs - el cuadro de búsqueda vive en la parte superior de la barra lateral |
| `vuepress` | CSS escrito a mano, bifurcado de `material` | Acento verde inspirado en VuePress, esquinas suaves y redondeadas |
| `gitbook` | CSS escrito a mano, bifurcado de `material` | Columna de lectura centrada inspirada en GitBook, encabezados con serifa |
| `notion` | CSS escrito a mano, bifurcado de `material` | Barra lateral sin bordes inspirada en Notion, interfaz casi en escala de grises, amplio espacio en blanco |

Los siete temas bifurcados de `material` de arriba reutilizan las mismas
plantillas BoxLang de `material` sin cambios (layout.bxm/page.bxm/search.bxm)
salvo por un renombrado con prefijo de clase CSS acotado - solo
`assets/style.css` difiere (y, en el caso de `justthedocs`, una línea
`<bx:include>` reubicada que mueve el cuadro de búsqueda a la barra
lateral), así que heredan el mismo conjunto completo de funciones y el
mismo comportamiento apto para sitios sin conexión que ya tiene `material`.

El propio CSS/JS de cada tema incorporado (el paquete CSS/JS de Bootstrap,
highlight.js, Alpine.js, lunr.js para el proveedor de búsqueda `local`
predeterminado, y Mermaid cuando `mermaid` está activado) se incluye con
este módulo y se copia directamente en cada `site/` construido - sin CDN,
sin necesidad de acceso a internet para ver un sitio construido. El
propio motor de utilidades del tema `tailwind` (un compilador JIT del
lado del cliente, no una hoja de estilo estática) y otras funciones
opcionales que actives tú mismo (`math`, búsqueda de Algolia, Google
Analytics) siguen cargándose desde un CDN o una API alojada - consulta
[Sitios sin conexión a internet](#sitios-sin-conexión-a-internet-air-gapped) más abajo.

`bootstrap`, `material` y `tailwind` aplican la misma paleta de marca de
BoxLang (un degradado `#00FF78 -> #00DBFF` y un acento `#FFF500`); los
siete temas de galería debajo de ellos usan cada uno su propia paleta
distinta, inspirada en la plataforma de la que toman su look - consulta la
tabla de arriba. Los diez incluyen, sin importar la paleta, el mismo
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
  [Extensiones de Markdown](markdown.md#bloques-de-código).
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
  updated"**, cuando las opciones `repo`/`lastUpdated` de `bxsites.yaml`
  están configuradas. Consulta [Configuración](../configuration.md#repo).
- **Un enlace "Download Markdown"**, junto a "Edit this page" - la fuente
  `.md` en bruto de cada página se publica junto a su HTML construido
  (`guides/themes.md` situado junto a `guides/themes/index.html`), de modo
  que ella misma (o un LLM) pueda leer la página como Markdown simple
  directamente en lugar de analizar el HTML renderizado. Siempre activo,
  sin configuración necesaria. Consulta
  [Primeros Pasos](../getting-started.md#descargar-una-página-como-markdown).
- **Un pie de página opcional** (copyright, enlaces `social`, un crédito
  "Built with BxSites") cuando el `footer` de `bxsites.yaml` es `true`.
  Consulta [Configuración](../configuration.md#footer).
- **Un selector de versión**, que aparece automáticamente en cuanto un
  proyecto tiene una carpeta `docs/versions/` con más de una versión en
  ella. Consulta [Configuración](../configuration.md#versionado).
- **Un `404.html` con el tema aplicado**, servido automáticamente por la
  mayoría de los alojamientos estáticos (incluido GitHub Pages) para
  cualquier ruta sin coincidencia. Añade un `404.md` en la raíz de `docs/`
  (o `src/`) para sustituir su título y contenido por los tuyos - nunca se
  compila como una página normal (sin entrada en el nav, sin URL en
  `sitemap.xml`), solo se renderiza en su lugar como `site/404.html`.
- **Un logo y favicon personalizados**, cuando `theme.logo`/
  `theme.favicon` de `bxsites.yaml` están configurados. Consulta
  [Configuración](../configuration.md#theme).
- **Una barra lateral de navegación colapsable**, opcional mediante
  `theme.options.navCollapsible`. Consulta
  [Configuración](../configuration.md#theme).
- **Google Analytics**, cuando `analytics` de `bxsites.yaml` está
  configurado. Consulta [Configuración](../configuration.md#analytics).
- **Tarjetas para compartir en redes sociales** (metaetiquetas Open Graph
  + Twitter Card), obtenidas del frontmatter `description` de cada página
  (o la `description` general del sitio) y su propio `ogImage` (o el
  general del sitio) - generadas automáticamente por página de forma
  opcional mediante `generateOgImages` de `bxsites.yaml`. Consulta
  [Configuración](../configuration.md#ogimage).
- **Etiquetas de página, un icono y una línea de resumen**, todo opcional
  mediante el propio frontmatter de una página - las etiquetas se
  renderizan como insignias que enlazan a un índice `/tags/` de todo el
  sitio. Consulta [Primeros Pasos](../getting-started.md#añadir-páginas).
- **Una navegación explícita personalizada**, en `bxsites.yaml` o en su
  propio `docs/nav.json`, que reemplaza la inferencia por carpetas en
  sitios grandes. Consulta [Configuración](../configuration.md#nav).
- **CSS/JS adicional**, inyectado mediante `extraCss`/`extraJs` de
  `bxsites.yaml`. Consulta
  [Configuración](../configuration.md#extracss--extrajs).
- **Cuadros de aviso (nota/advertencia/consejo/...)**, activos por
  defecto en el markdown de cualquier página, incluidas variantes
  colapsables - sin configuración necesaria. Consulta
  [Extensiones de Markdown](markdown.md#admoniciones).
- **Notas al pie y listas de definiciones**, opcionales mediante
  `markdown` de `bxsites.yaml`. Consulta
  [Extensiones de Markdown](markdown.md#notas-al-pie).
- **Pestañas de contenido**, **números de línea de código/líneas
  resaltadas/títulos** y **marcadores de diff/marcos de terminal** para
  bloques de código, sin configuración necesaria. Consulta
  [Extensiones de Markdown](markdown.md#pestañas-de-contenido).
- **Diagramas Mermaid**, opcionales mediante `mermaid` de `bxsites.yaml`.
  Consulta [Extensiones de Markdown](markdown.md#diagramas).
- **Matemáticas** (KaTeX), opcional mediante `math` de `bxsites.yaml`.
  Consulta [Extensiones de Markdown](markdown.md#matemáticas).

Define cuál usa un proyecto en `bxsites.yaml`:

=== "YAML"
    ```yaml title="bxsites.yaml"
    theme: { name: material }
    ```

=== "JSON"
    ```json title="bxsites.json"
    { "theme": { "name": "material" } }
    ```

=== "TOML"
    ```toml title="bxsites.toml"

    [theme]
    name = "material"
    ```

## Instalar un tema publicado

Un tema publicado en ForgeBox se instala sin nada más que el propio
binario `bxSites` - no hace falta `box`/CommandBox. Explora lo ya
publicado bajo la categoría
[`bxsites-themes`](https://www.forgebox.io/type/bxsites-themes) en
ForgeBox:

```bash title="Uso"
bxSites install:theme --name=bx-sites-theme-blog1 [--version=1.0.0]
```

Esto descarga el zip del paquete y lo extrae en
`.themes/bx-sites-theme-blog1/` dentro de la raíz de contenido del
proyecto (consulta
[Origen del Contenido](content-source.md#dónde-vive-una-sobrescritura-de-tema)),
validando que cumple el contrato `ThemeProvider` de abajo antes de
terminar. Un proyecto puede tener varios temas instalados en paralelo de
esta forma, y cambiar entre ellos únicamente por nombre:

=== "YAML"
    ```yaml title="bxsites.yaml"
    theme: { name: bx-sites-theme-blog1 }
    ```

=== "JSON"
    ```json title="bxsites.json"
    { "theme": { "name": "bx-sites-theme-blog1" } }
    ```

=== "TOML"
    ```toml title="bxsites.toml"

    [theme]
    name = "bx-sites-theme-blog1"
    ```

Un tema no necesita ninguna participación de módulo/cargador de clases de
BoxLang (a diferencia de un plugin) - son archivos puros, así que no hay
un paso de activación separado como sí tiene `install:plugin`; configurar
`theme.name` es la única conexión necesaria. Consulta
[`install:theme`](../cli-reference.md#installtheme) en la referencia de
la CLI.

¿Partes de un tema construido para otro generador de sitios estáticos?
Consulta [Importar un tema](theme-import.md) - `theme:import` convierte
mecánicamente los propios archivos de plantilla de un tema de
mkdocs/jekyll/hugo en un scaffold `.themes/<name>/` de mejor esfuerzo.

## Sitios sin conexión a internet (air-gapped)

Un sitio construido funciona sin ningún acceso a internet por defecto,
para `bootstrap`, `material` y los siete temas bifurcados de `material`
(`docsy`, `slate`, `docusaurus`, `justthedocs`, `vuepress`, `gitbook`,
`notion`) con el proveedor de búsqueda `local` predeterminado: el propio
CSS/JS de Bootstrap, highlight.js, Alpine.js y lunr.js vienen todos
incluidos con este módulo
(`resources/assets/vendor/`) y se copian directamente en
`site/assets/vendor/` en el momento de la construcción - sin ninguna
etiqueta `<script>`/`<link>` a un CDN en ningún lugar del HTML generado
para ninguno de ellos. Activar la clave `mermaid` de `bxsites.yaml` incluye
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
- La opción `math` de `bxsites.yaml` carga KaTeX (tanto su JS como sus
  propios archivos de fuente) desde un CDN cuando está activada.
- `searchProvider.provider: "algolia"` y `analytics.provider: "google"`
  se comunican inherentemente con una API alojada/un endpoint de
  seguimiento - incluir el archivo JS localmente no eliminaría esa
  dependencia.

Si tu entorno de despliegue realmente no tiene ningún acceso a internet,
limítate a `bootstrap`/`material`/uno de los siete temas bifurcados de
`material`, al proveedor de búsqueda `local` predeterminado, evita los
diagramas Mermaid con diseño `elk` si `mermaid` está activado, y deja
desactivados `math`/Algolia/Analytics.

Consulta [Iconos](icons.md) para saber cómo el propio frontmatter `icon`
de una página (o el propio `icon` de una entrada de `nav.json`) se
resuelve en un emoji, un icono con nombre de una de las ocho bibliotecas
incluidas, o el SVG propio de un proyecto.

## El contrato de `ThemeProvider`

Un tema es simplemente una carpeta con:

- **`layout.bxm`** (obligatorio) - el shell HTML exterior + la
  navegación. Recibe `variables.page`, `variables.nav`,
  `variables.siteConfig`, `variables.themeDir` y `variables.basePath` en
  el ámbito, e incluye la plantilla de cuerpo resuelta mediante
  `#variables.themeDir#/#variables.bodyFile#` (`page.bxm`, salvo que una
  página/tipo de contenido resuelva a otra cosa - consulta
  [Múltiples layouts por página](#multiples-layouts-por-pagina) más abajo).
  `variables.basePath` es siempre una
  ruta relativa a la raíz que termina en `/` (`/` por defecto,
  `/my-docs/` cuando el `baseURL` de `bxsites.yaml` lo sobrescribe) -
  antepón ese prefijo a cada `href`/`src` interno, en lugar de codificar
  una `/` inicial de forma fija, para que el tema siga funcionando cuando
  el sitio se sirva desde una subruta.
- **`page.bxm`** (obligatorio) - el cuerpo del artículo. Renderiza
  `variables.page.contentHtml` - el markdown ya convertido.
- **`search.bxm`** (opcional) - el marcado del cuadro de búsqueda,
  incluido por `layout.bxm` solo cuando `search` de `bxsites.yaml` es
  `true`. Consulta [Búsqueda](search.md).
- **`blog.bxm`** (opcional) - un shell exterior alternativo para las
  propias páginas de listado/categoría/archivo/autor/estadísticas del
  blog. Recurre a `layout.bxm` cuando un tema no lo tiene. Consulta
  [Múltiples layouts por página](#multiples-layouts-por-pagina).
- **`blog-page.bxm`** (opcional) - un cuerpo alternativo para una entrada
  de blog individual, renderizado igualmente bajo el `layout.bxm` normal
  del tema. Recurre a `page.bxm` cuando un tema no lo tiene.
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
un selector cuando `variables.versions.len() gt 1`. Todos los temas
incorporados obtienen sus iconos de repositorio/redes sociales de una
pequeña tabla de búsqueda SVG compartida,
`<bx:include template="#variables.moduleAssetsDir#/icons.bxm">` (define
`bxsitesIcon( name )`, uno de `github`, `twitter`/`x`, `rss`, `youtube`,
`linkedin`, `facebook`, `bluesky`, `threads`, `slack`, `patreon`,
`email`, `edit`, `clock`, recurriendo a un glifo de enlace genérico) - un
tema personalizado puede incluirlo de la misma forma, o proporcionar sus
propios iconos por completo.

Una carpeta de tema a la que le falte cualquiera de los archivos
obligatorios falla de inmediato con un error claro `BxSites.InvalidTheme`
en el momento de la construcción, en lugar de un confuso error de
plantilla en lo profundo del renderizado. `blog.bxm`/`blog-page.bxm`
nunca son obligatorios - la misma forma "opcional, con reserva" que ya
tiene `search.bxm`.

## Múltiples layouts por página

Un tema puede ofrecer más de un shell exterior y más de una plantilla de
cuerpo, permitiendo que un blog (o cualquier otro tipo de contenido)
tenga un aspecto distinto del resto del sitio mientras reutiliza el mismo
chrome y los mismos assets del tema. Dos cadenas de resolución
independientes:

- **Shell exterior** - siempre `layout.bxm`, salvo en las propias
  páginas de listado/categoría/archivo/autor/estadísticas del blog, que
  usan `blog.bxm` cuando el tema activo lo tiene. Esta cadena sigue el
  tipo de contenido - no hay clave de frontmatter para ella.
- **Cuerpo** - `page.bxm` por defecto. Una entrada de blog usa
  `blog-page.bxm` cuando el tema activo lo tiene. En cualquier caso, el
  propio frontmatter de una página siempre gana cuando establece uno:

```markdown title="docs/marketing/press-release.md"
---
title: We raised a Series A
layout: press-release
---
```

`layout: press-release` renderiza el cuerpo de esta página concreta a
través de `.theme/press-release.bxm` (o el propio del tema incorporado
activo, si tiene uno) en lugar de `page.bxm` - todavía dentro del shell
`layout.bxm` normal del sitio. Un `layout:` que nombre un archivo que el
tema activo no tiene recurre a `page.bxm` en lugar de hacer fallar la
construcción, así que cambiar de tema nunca rompe una página que nombró
el layout personalizado propio de otro tema.

`bootstrap` incluye `blog.bxm`/`blog-page.bxm` como ejemplo funcional
para copiar; los demás temas incorporados todavía no, y recurren a
`layout.bxm`/`page.bxm` para el contenido del blog del mismo modo que lo
haría cualquier override `.theme/` incompleto.

### Qué layout/cuerpo está activo

Cualquier `.bxm` a través del cual se renderiza una página - `layout.bxm`,
`page.bxm`, `blog.bxm`, `blog-page.bxm`, o uno personalizado propio de un
proyecto - puede leer qué archivos se resolvieron realmente, de la misma
forma directa en que ya lee `variables.page`/`variables.data`:

- `variables.layoutFile` - el shell exterior en uso, p. ej. `"layout.bxm"`
  o `"blog.bxm"`
- `variables.bodyFile` - el cuerpo en uso, p. ej. `"page.bxm"`,
  `"blog-page.bxm"`, o uno nombrado por frontmatter
- `variables.page.layout` - el propio valor bruto del frontmatter
  `layout:` de la página, si estableció uno; `""` en caso contrario

Útil como gancho para una clase del body, o para ramificar sin una
plantilla separada:

```bx title=".theme/layout.bxm"
<body class="layout-#reReplace( variables.bodyFile, '\.bxm$', '' )#">
```

```bx title=".theme/page.bxm"
<bx:if variables.bodyFile == "blog-page.bxm">
	<!-- chrome exclusivo de entradas de blog -->
</bx:if>
```

## Personalizar colores sin sobrescribir un tema

Para un ajuste de color/fuente, bifurcar todo un tema es excesivo - cada
tema incorporado lee su paleta de un puñado de propiedades CSS
personalizadas en `:root`, redeclaradas bajo `[data-theme="dark"]` para
el modo oscuro. El [`extraCss`](../configuration.md#extracss--extrajs)
de `bxsites.yaml` se carga *después* de la propia hoja de estilo del tema,
así que una redeclaración con la misma especificidad en él gana sin
tocar `resources/themes/` en absoluto:

=== "YAML"
    ```yaml title="bxsites.yaml"
    extraCss: [ assets/brand.css ]
    ```

=== "JSON"
    ```json title="bxsites.json"
    { "extraCss": ["assets/brand.css"] }
    ```

=== "TOML"
    ```toml title="bxsites.toml"
    extraCss = [ "assets/brand.css" ]
    ```

```css
/* docs/assets/brand.css - copiado a site/assets/brand.css en el momento de la construcción */
:root {
	--bxsites-gradient-start: #7C3AED;
	--bxsites-gradient-end: #DB2777;
	--bxsites-accent: #FBBF24;
	--bxsites-link: #7C3AED;
	--bxsites-link-hover: #9F5AF0;
}

[data-theme="dark"] {
	--bxsites-link: #C4B5FD;
	--bxsites-link-hover: #DDD6FE;
}
```

El propio conjunto del tema `bootstrap`
(`resources/themes/bootstrap/assets/style.css`) es
`--bxsites-gradient-start`/`-end`, `--bxsites-accent`, `--bxsites-bg`,
`--bxsites-text`, `--bxsites-sidebar-bg`, `--bxsites-sidebar-text`,
`--bxsites-border`, `--bxsites-link`, `--bxsites-link-hover`,
`--bxsites-code-bg`, `--bxsites-step-marker-bg`, `--bxsites-step-marker-text`,
`--bxsites-step-line`, `--bxsites-step-success-bg`/`-text` y
`--bxsites-step-warning-bg`/`-text`/`--bxsites-step-danger-bg`/`-text` y el
[conjunto `--bxsites-table-*`](tables.md#tematización), que pinta la
tarjeta, la franja de encabezado, los separadores y las tintas de
cebra/hover de una tabla renderizada.
Todo tema incorporado garantiza `--bxsites-gradient-start`/`-end`,
`--bxsites-accent` y los conjuntos `--bxsites-step-*` y `--bxsites-table-*`
bajo esos nombres exactos, así que `extraCss` siempre puede redirigir el color de marca/los
acentos del stepper sin importar el tema - pero solo `bootstrap`, `slate`
y `notion` también exponen
`--bxsites-bg`/`-text`/`-sidebar-bg`/`-sidebar-text`/`-border`/`-link`/`-link-hover`/`-code-bg`
bajo esos nombres (`justthedocs` alias todos menos los dos `-sidebar-*` de
la misma forma). El resto de los temas incorporados (`material`,
`tailwind`, `docsy`, `docusaurus`, `vuepress`, `gitbook`) usan sus propios
nombres de propiedad personalizada internos para ese segundo grupo (por
ejemplo, el propio `assets/style.css` de material usa
`--md-bg`/`--md-ink`/`--md-link`/...) - abre el `assets/style.css` propio
de ese tema para encontrar sus nombres reales antes de sobrescribir uno de
ellos mediante `extraCss`. Cualquier cosa más allá del color/fuente
(diseño, añadir/quitar elementos de interfaz) necesita una sobrescritura
real o un tema personalizado - ver abajo.

El resto respalda el bloque de directiva
[`::: stepper`/`::: step`](content-blocks.md#stepper) -
`--bxsites-step-marker-bg`/`-text` son el color de fondo/texto del
círculo numerado por defecto (`bootstrap`/`material` lo configuran por
defecto al propio `--bxsites-accent` del tema; `tailwind` usa un par
verde azulado/menta dedicado ya que no tiene un único token de acento
compartido), `--bxsites-step-line` es la línea que conecta los pasos, y
los pares `-success`/`-warning`/`-danger` respaldan el propio atributo
opcional `color="..."` de un paso - a diferencia del marcador por
defecto, estos tres son el mismo par fijo de fondo/texto tanto en modo
claro como oscuro (una insignia autocontenida, no ligada al acento de
marca del tema), así que no hay ninguna sobrescritura
`[data-theme="dark"]` que redeclarar:

```css
:root {
	--bxsites-step-marker-bg: #7C3AED;
	--bxsites-step-marker-text: #fff;
	--bxsites-step-success-bg: #059669;
	--bxsites-step-success-text: #fff;
}

[data-theme="dark"] {
	--bxsites-step-marker-bg: #C4B5FD;
	--bxsites-step-marker-text: #1b1f21;
}
```

## Banner hero de la página de inicio

Todo tema incorporado incluye CSS para un banner de página de inicio a
todo lo ancho, con una imagen de titular y botones de llamada a la
acción - el propio `docs/index.md` de este mismo sitio lo usa. No hay
ningún bloque de directiva ni configuración para ello, solo HTML plano
que cualquier página puede colocar (una página de inicio es simplemente
una página normal, con `order: 1` o de otro modo la primera en la
navegación):

```markdown
<div class="bxsites-hero">
	<img class="bxsites-hero__banner" src="assets/home-banner.jpg" alt="...">
	<div class="bxsites-hero__actions">
		<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="getting-started.md">Get Started</a>
		<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="https://github.com/your/repo">View on GitHub</a>
	</div>
</div>
```

`bxsites-hero__btn--primary`/`--secondary` son los dos mismos estilos de
acento que ya usa cada tema en otros lugares - intercambia, quita o añade
botones libremente, y redimensiona/reemplaza la propia imagen de
`bxsites-hero__banner` mediante un `src` relativo a `docs/assets/`, de la
misma forma en que se resuelve cualquier otra imagen.

## Sobrescribir un tema

Coloca tu propio `layout.bxm` + `page.bxm` (y opcionalmente `search.bxm` /
`assets/`) en una carpeta `.theme/` dentro de la raíz de contenido de tu
proyecto - `docs/.theme/`, `src/.theme/`, o `<source>/.theme/` según lo
que resuelva `source` (consulta [Origen del Contenido](content-source.md)),
no en la raíz misma del proyecto. BxSites prefiere una sobrescritura
`.theme/` en la raíz de contenido tanto sobre un tema instalado en
`.themes/<name>/` como sobre cualquier tema incorporado, siempre que
satisfaga el contrato anterior - los temas incorporados bajo el propio
`resources/themes/` de este módulo son un buen punto de partida para
copiar y adaptar. Orden de resolución completo: `.theme/` (esta sección)
-> `.themes/theme.name/` ([un tema instalado](#instalar-un-tema-publicado),
si `theme.name` coincide con uno) -> un tema incorporado con el nombre
`theme.name`.

Un ejemplo trabajado - partir de `bootstrap` e intercambiar su paleta de
marca y su fuente de encabezados por las tuyas, manteniendo todo lo demás
(navegación, búsqueda, modo oscuro, resaltado de código, ...) exactamente
como ya funciona:

```markdown
my-project/
├── bxsites.yaml
└── docs/
    ├── index.md
    └── .theme/                    ← content-root override, checked before any built-in theme
        ├── layout.bxm              ← copied from resources/themes/bootstrap/layout.bxm
        ├── page.bxm                 ← copied from resources/themes/bootstrap/page.bxm, unchanged
        ├── search.bxm                ← copied unchanged
        └── assets/
            └── style.css               ← copied from bootstrap's assets/style.css, then edited
```

1. Copia los tres archivos `.bxm` y `assets/style.css` desde
   `resources/themes/bootstrap/` de este módulo a `docs/.theme/` de tu
   proyecto (o `src/.theme/`, o `<source>/.theme/`, según dónde esté
   realmente tu raíz de contenido).
2. Edita solo lo que necesites cambiar. Para intercambiar la paleta de
   marca y la fuente, eso es solo la parte superior de
   `.theme/assets/style.css`:

   ```css title="docs/.theme/assets/style.css" linenums="1"
   :root {
   	--bxsites-gradient-start: #7C3AED;  /* was #00FF78 */
   	--bxsites-gradient-end: #DB2777;    /* was #00DBFF */
   	--bxsites-accent: #FBBF24;          /* was #FFF500 */
   }

   body {
   	font-family: "Inter", system-ui, sans-serif;  /* was "Poppins" */
   }
   ```

3. Ejecuta `bxSites build` (o `serve` mientras iteras) - BxSites
   recoge `.theme/` automáticamente, sin necesidad de cambiar
   `bxsites.yaml` (una carpeta `.theme/` en la raíz de contenido siempre
   tiene precedencia sobre el tema incorporado nombrado en `theme.name`). Todo
   lo que no tocaste - el renderizado de la navegación, la búsqueda, el
   interruptor de modo oscuro, las anotaciones de código - sigue
   funcionando exactamente como lo hacía en el tema `bootstrap` original,
   ya que sigue siendo exactamente el mismo marcado `layout.bxm`/
   `page.bxm` por debajo.

La carpeta `.theme/` de un proyecto es todo o nada, sin embargo - en
cuanto BxSites encuentra una, se usa en lugar del tema incorporado por
completo, así que igual necesita su propio `layout.bxm` + `page.bxm`
aunque lo único que hayas cambiado sea `assets/style.css` (una carpeta a
la que le falte cualquiera de los dos falla de inmediato con
`BxSites.InvalidTheme` en lugar de recurrir silenciosamente al otro).
Para un ajuste solo de CSS/sin `.bxm`, usa
[`extraCss`](#personalizar-colores-sin-sobrescribir-un-tema) en su lugar -
se superpone a cualquier tema que nombre `bxsites.yaml`, sin ninguna
carpeta `.theme/` involucrada en absoluto. `.theme/` es para cuando
también necesitas cambiar el propio marcado, que se cubre a continuación.

## Escribir un tema desde cero

Un tema solo necesita los dos archivos obligatorios, así que aquí hay uno
genuinamente mínimo - sin Bootstrap/Tailwind, sin modo oscuro, sin
interfaz de búsqueda - para mostrar exactamente qué es obligatorio frente
a lo que añaden los temas incorporados. Guarda ambos como
`docs/.theme/layout.bxm` y `docs/.theme/page.bxm` en tu proyecto (o bajo
la raíz de contenido a la que resuelva tu `source`) - una carpeta
`.theme/` en la raíz de contenido se recoge automáticamente (como
arriba), sin necesidad de cambiar `bxsites.yaml`:

```bx title="docs/.theme/layout.bxm" linenums="1"
<!-- docs/.theme/layout.bxm -->
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
<bx:include template="#variables.themeDir#/#variables.bodyFile#">
<bx:output>
	</main>
</body>
</html>
</bx:output>
```

```bx title="docs/.theme/page.bxm" linenums="1"
<!-- docs/.theme/page.bxm -->
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
`search` de `bxsites.yaml` es `true` - consulta [Búsqueda](search.md)),
un interruptor de modo oscuro (copia el par `x-data`/`x-init` de
Alpine.js de la etiqueta `<body>` de `resources/themes/bootstrap/layout.bxm`
y el bloque CSS `[data-theme="dark"]` correspondiente), migas de pan/
etiquetas/enlaces anterior-siguiente (`page.bxm` en cualquier tema
incorporado muestra el patrón - cada uno es solo un `if` alrededor de una
pequeña función de renderizado, todas impulsadas por campos ya presentes
en `variables.page`), o una carpeta `assets/` para tu propio CSS/JS,
copiada a `site/assets/theme/` automáticamente en el momento de la
construcción.
