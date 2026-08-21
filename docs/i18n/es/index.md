---
title: Inicio
order: 1
---

# BX Docs

BX Docs es un módulo de BoxLang que genera sitios de documentación
estáticos a partir de Markdown, en el espíritu de [mkdocs](https://www.mkdocs.org/) y
[mkdocs-material](https://squidfunk.github.io/mkdocs-material/).

Este mismo sitio está construido con BX Docs, a partir de los archivos
Markdown en la propia carpeta `docs/` de este repositorio - consulta
[Primeros Pasos](getting-started.md) para construirlo tú mismo.

## Aspectos destacados

- **Markdown como entrada, HTML estático como salida.** Apúntalo a una
  carpeta `docs/` y genera un sitio completo en `site/` - sin necesidad de
  servidor para alojarlo.
- **La estructura de carpetas es la estructura de navegación.** Anida
  carpetas y archivos bajo `docs/` y la navegación se construye sola, en
  el orden que definas mediante el frontmatter.
- **Tres temas incorporados.** `bootstrap` (el predeterminado), `material`
  y `tailwind` - todos comparten la misma paleta de marca de BoxLang, y
  todos se pueden sobrescribir con tu propio tema.
- **Búsqueda estática del lado del cliente.** Un cuadro de búsqueda
  impulsado por [lunr.js](https://lunrjs.com/), conectado a un índice de
  búsqueda generado en el momento de `build` - el mismo enfoque que usa
  mkdocs por defecto, sin dependencia de servidor.
- **Markdown gestionado por [bx-markdown](https://github.com/ortus-boxlang/bx-markdown).**
  BX Docs no analiza el Markdown por sí mismo; delega en bx-markdown y le
  reenvía directamente las opciones de tu propio `bxdocs.json`.
- **Un sistema de plugins construido sobre el propio sistema de módulos de
  BoxLang.** Un plugin es simplemente otro módulo de BoxLang instalado -
  no hay una API de plugins separada que aprender.
- **Migra directamente desde GitBook o mkdocs.** `bxDocs migrate
  --source=... --from=gitbook|mkdocs` convierte una exportación de
  GitBook o un proyecto mkdocs existente en un proyecto bx-docs
  funcional con un solo comando.

## A dónde ir a continuación

- [Primeros Pasos](getting-started.md) - instala, crea un proyecto, constrúyelo y sírvelo
- [Referencia de la CLI](cli-reference.md) - todos los verbos y sus opciones
- [Configuración](configuration.md) - la referencia completa de `bxdocs.json`
- [Temas](guides/themes.md) - los temas incorporados y cómo escribir el tuyo propio
- [Búsqueda](guides/search.md) - cómo funciona el índice de búsqueda estático
- [Desplegar en GitHub Pages](guides/deployment.md) - el flujo de trabajo de GitHub Actions incorporado
- [Extensiones de Markdown](guides/markdown.md) - admoniciones, notas al pie, listas de definiciones, pestañas de contenido, matemáticas y anotaciones de código, y diagramas Mermaid
- [Plugins](guides/plugins.md) - extiende BX Docs con tu propio módulo de BoxLang
- [Migrar desde GitBook](guides/migrating-from-gitbook.md) - convierte una exportación de GitBook en un proyecto bx-docs con un solo comando
- [Migrar desde mkdocs](guides/migrating-from-mkdocs.md) - convierte un proyecto mkdocs en un proyecto bx-docs con un solo comando
- [Lanzamientos](releases/index.md) - política de versionado y novedades de cada versión
