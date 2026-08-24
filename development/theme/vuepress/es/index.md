---
title: Inicio
order: 1
icon: phosphor-duotone:house
summary: Apunta BX Sites a una carpeta docs/. Obtén un sitio estático rápido y personalizable - documentación, un sitio de marketing, un blog o cualquier otra cosa que Markdown pueda expresar - completo con búsqueda, i18n y un conjunto de herramientas Markdown pensado para contenido real.
toc: false
---

<div class="bxsites-hero">
	<img class="bxsites-hero__banner" src="assets/home-banner.jpg" alt="BX Sites - Escribe. Construye. Publica documentación hermosa. El motor de documentación oficial de BoxLang. Impulsado por Markdown, temas hermosos, búsqueda ultrarrápida, enfocado en desarrolladores.">
	<div class="bxsites-hero__actions">
		<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="getting-started.md">Comenzar</a>
		<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="https://github.com/ortus-boxlang/bx-sites">Ver en GitHub</a>
	</div>
</div>

Este mismo sitio está construido con BX Sites, a partir de los archivos
Markdown en la propia carpeta `docs/` de este repositorio.

BX Sites no es solo para documentación de referencia - es un
**generador de sitios estáticos** de propósito general. Un sitio de
marketing, un blog, una base de conocimiento, un sitio de producto, un sitio
personal: todo lo que puedas escribir en Markdown se construye de la misma
forma, a través de los mismos temas, búsqueda e i18n.

::: cards
::: card title="Markdown como entrada, HTML estático como salida" icon="phosphor-duotone:file-html"
Apúntalo a una carpeta `docs/` y genera un sitio completo en `site/` - sin
necesidad de servidor para alojarlo.
:::
::: card title="La estructura de carpetas es la estructura de navegación" icon="phosphor-duotone:tree-structure"
Anida carpetas y archivos bajo `docs/` y la navegación se construye sola,
en el orden que definas mediante el frontmatter.
:::
::: card title="Diez temas incorporados" icon="phosphor-duotone:palette" href="guides/themes.md"
Una galería completa - `bootstrap`, `material`, `tailwind` y siete más
inspirados en Docsy, Stripe, Docusaurus, Just the Docs, VuePress, GitBook y
Notion - todos sobrescribibles con tu propio tema.
:::
::: card title="Búsqueda estática del lado del cliente" icon="phosphor-duotone:magnifying-glass" href="guides/search.md"
Un cuadro de búsqueda impulsado por lunr.js, conectado a un índice de
búsqueda generado en el momento de `build` - sin dependencia de servidor.
:::
::: card title="Un blog, listo de fábrica" icon="lucide:newspaper" href="guides/blog.md"
Coloca entradas bajo `docs/blog/posts/` y obtén autores, categorías,
archivos anuales, feeds RSS e imágenes destacadas por entrada - sin
configuración necesaria.
:::
::: card title="Rápido y sin conexión por defecto" icon="phosphor-duotone:wifi-slash" href="guides/themes.md#sitios-sin-conexión-a-internet-air-gapped"
Empaquetado de CSS/JS con huella digital e imágenes responsivas listos de
fábrica, además de Bootstrap, highlight.js, Alpine.js, lunr.js y (opcional)
Mermaid, todos incluidos localmente - un sitio construido no necesita
ninguna solicitud saliente por defecto.
:::
::: card title="Un sistema de plugins real" icon="phosphor-duotone:puzzle-piece" href="guides/plugins.md"
Un plugin es simplemente otro módulo de BoxLang instalado - no hay una API
de plugins separada que aprender.
:::
::: card title="Plugins y temas, publicados en ForgeBox" icon="phosphor-duotone:package" href="guides/plugins.md#instalar-un-plugin-publicado"
`install:plugin` e `install:theme` descargan un paquete publicado
directamente a tu proyecto - explora `bxsites-plugins` y `bxsites-themes`
en ForgeBox.
:::
::: card title="Importa un tema existente" icon="phosphor-duotone:arrows-left-right" href="guides/theme-import.md"
`theme:import --source=mkdocs|jekyll|hugo` convierte las propias plantillas
de tema de otro generador en un scaffold de bx-sites sobre el que construir,
en lugar de empezar desde cero.
:::
::: card title="Migra desde GitBook o mkdocs" icon="phosphor-duotone:swap" href="guides/index.md"
`bxSites migrate --source=... --from=gitbook|mkdocs` convierte una
exportación de GitBook o un proyecto mkdocs existente en un proyecto
bx-sites funcional con un solo comando.
:::
:::

## Míralo, no solo leas sobre ello

El propio conjunto de herramientas Markdown de BX Sites, en acción aquí
mismo en la página de inicio - no es una captura de pantalla, es lo real:

::: stepper
::: step "Instalar"
`install-bx-module bx-sites`
:::
::: step "Crear estructura"
`bxSites new`
:::
::: step "Construir y servir"
`bxSites serve`
:::
:::

::: columns
::: column
!!! tip "Callouts para cada ocasión"
    Doce tipos de admonición canónicos - `note`, `tip`, `warning`, `danger`
    y más - cada uno con su propio color de acento, además de una variante
    colapsable `???`. Consulta
    [Extensiones de Markdown](guides/markdown.md#admoniciones).
:::
::: column
!!! faq "Pestañas de contenido, matemáticas, diagramas"
    Pestañas de código agrupadas, matemáticas con KaTeX, diagramas Mermaid,
    notas al pie y listas de definiciones, todo incluido de fábrica -
    consulta [Extensiones de Markdown](guides/markdown.md).
:::
:::

## A dónde ir a continuación

::: cards
::: card title="Primeros Pasos" icon="phosphor-duotone:rocket-launch" href="getting-started.md"
Instala, crea un proyecto, constrúyelo y sírvelo.
:::
::: card title="Referencia de la CLI" icon="phosphor-duotone:terminal-window" href="cli-reference.md"
Todos los verbos y sus opciones.
:::
::: card title="Configuración" icon="phosphor-duotone:gear-six" href="configuration.md"
La referencia completa de `bxsites.yaml`.
:::
::: card title="Extensiones de Markdown" icon="phosphor-duotone:markdown-logo" href="guides/markdown.md"
Admoniciones, pestañas, tarjetas, callouts, matemáticas y diagramas
Mermaid.
:::
::: card title="Blog" icon="lucide:newspaper" href="guides/blog.md"
Entradas, autores, categorías, archivos, RSS, borradores y una página de
estadísticas.
:::
::: card title="Imágenes Responsivas y Pipeline de Recursos" icon="phosphor-duotone:image" href="guides/images.md"
Redimensionado automático de imágenes/WebP, y empaquetado de CSS/JS con
huella digital.
:::
::: card title="Desplegar en GitHub Pages" icon="phosphor-duotone:cloud-arrow-up" href="guides/deployment.md"
El flujo de trabajo de GitHub Actions incorporado.
:::
::: card title="Lanzamientos" icon="phosphor-duotone:tag" href="releases/index.md"
Política de versionado y novedades de cada lanzamiento.
:::
:::

## ¿Necesitas ayuda para construir tu sitio?

BX Sites es libre y de código abierto - pero si prefieres que el equipo
que lo construye haga el trabajo, [Ortus Solutions](https://www.ortussolutions.com)
ofrece servicios profesionales y consultoría para sitios de documentación,
migraciones y cualquier otro sitio estático construido con BX Sites.

<div class="bxsites-hero__actions">
	<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="mailto:consulting@ortussolutions.com">Escribe a consulting@ortussolutions.com</a>
	<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="services.md">Consultoría y Servicios Profesionales</a>
</div>
