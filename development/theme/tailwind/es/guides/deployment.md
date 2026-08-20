---
title: Desplegar en GitHub Pages
order: 3
tags: [guías, despliegue]
---

# Desplegar en GitHub Pages

`site/` es un sitio estático simple - aloja donde sea que sirva archivos
estáticos. Este módulo incluye un flujo de trabajo de GitHub Actions
listo para usar (`.github/workflows/pages.yml`) para el caso común:
publicar directamente en GitHub Pages, con `main` y `development`
publicadas como dos versiones del mismo sitio activas de forma
independiente.

Para un proyecto de una sola versión más simple sin ninguna configuración
de CI,
[`bxDocs gh-deploy`](../cli-reference.md#gh-deploy) construye y empuja
`site/` a una rama `gh-pages` en un solo comando, ejecutado desde tu
propia máquina siempre que quieras publicar - sin necesidad de un archivo
de flujo de trabajo. El resto de esta guía cubre el flujo de trabajo de
GitHub Actions que este mismo repositorio usa, para la publicación
automática multiversión en cada push.

## Qué hace

En cada push a `main` o `development` que toque `docs/`, `bxdocs.json`, o
la propia fuente del módulo (cambios de tema/canalización), el flujo de
trabajo:

1. Instala BoxLang + [bx-markdown](https://github.com/ortus-boxlang/bx-markdown)
2. Registra este repositorio como un módulo para que `boxlang module:bxDocs build` se resuelva
3. En cualquier rama que no sea `main`, apunta `baseURL` a
   `.../<branch-name>/` solo para esta construcción (consulta
   [más abajo](#publishing-two-versions-at-once))
4. Ejecuta `boxlang module:bxDocs build`
5. Empuja `site/` a la rama `gh-pages` - `main` a la raíz del sitio,
   `development` a `/development/` - sin tocar la otra versión

También está disponible como un disparador manual (`workflow_dispatch`)
desde la pestaña Actions, para una republicación puntual sin un nuevo
commit.

## Configuración inicial

GitHub Pages necesita apuntar a la rama `gh-pages` antes de que el flujo
de trabajo pueda publicar nada - esto es una configuración del
repositorio, no algo que un archivo de flujo de trabajo pueda activar por
sí solo. La primera ejecución exitosa crea `gh-pages` por ti, así que
haz esto *después* de que el flujo de trabajo se haya ejecutado al menos
una vez:

1. **Settings -> Pages**
2. En **Build and deployment -> Source**, elige **Deploy from a branch**
3. En **Branch**, elige **gh-pages** y **/ (root)**

Después de eso, cada push coincidente construye y despliega
automáticamente. La URL publicada aparece en **Settings -> Pages** en
cuanto se completa el primer despliegue.

## Publicar dos versiones a la vez

`main` se publica en la raíz del sitio
(`https://<user>.github.io/<repo>/`) - trata esto como la documentación
estable/publicada. `development` se publica en `/development/`
(`https://<user>.github.io/<repo>/development/`) - la documentación más
reciente, no publicada. Ambas permanecen activas simultáneamente: el
trabajo de cada rama solo empuja a `gh-pages` con `keep_files: true` y su
propio `destination_dir`, de modo que un despliegue de `development`
nunca sobrescribe el contenido de `main` y viceversa.

El propio `bxdocs.json` de `main` debería tener `baseURL` configurado a
la raíz del sitio (`https://<user>.github.io/<repo>/`); el flujo de
trabajo lo sobrescribe para cualquier otra rama en el momento de la
construcción, así que el `bxdocs.json` de `development` no necesita su
propia entrada `baseURL` para que esto funcione.

Para añadir una tercera rama (por ejemplo, una vista previa de
`release/2.0`), añádela a la lista `on.push.branches` y dale su propio
paso de despliegue `if: github.ref_name == '...'` con
`destination_dir: release-2.0` (o similar) - el patrón es el mismo que el
de `development`.

## Usar esto para tu propio proyecto

Copia `.github/workflows/pages.yml` en tu propio proyecto (ajusta la
línea `modules:` si tu proyecto necesita algo más allá de
`bx-markdown`), activa Pages como arriba, y los push a `main`/
`development` se publicarán de la misma manera. Si solo quieres una
única versión publicada, elimina la rama que no necesites de
`on.push.branches` y su paso de despliegue correspondiente.

## Servir desde una subruta de Pages de proyecto

Un sitio de GitHub *Project* Pages (a diferencia de un sitio *user*
`<user>.github.io`) se sirve desde `https://<user>.github.io/<repo>/`, no
desde la raíz del dominio. Configura `baseURL` en `bxdocs.json` con esa
URL completa para que cada enlace interno, recurso y entrada de
navegación obtenga el prefijo `/<repo>/` que necesita - y para que
también se genere un `sitemap.xml` real:

```json
{ "baseURL": "https://<user>.github.io/<repo>/" }
```

Consulta [Configuración](../configuration.md#baseurl) para el desglose
completo de qué hace `baseURL`. Un sitio de usuario `<user>.github.io`, o
cualquier dominio personalizado asignado a la raíz del sitio, puede dejar
`baseURL` en su valor por defecto (`/`).
