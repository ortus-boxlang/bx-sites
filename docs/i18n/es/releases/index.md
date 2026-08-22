---
title: Política de Lanzamientos
order: 6
---

# Política de Lanzamientos

BX Sites sigue el [Versionado Semántico](https://semver.org/) - la
versión en
[`box.json`](https://github.com/ortus-boxlang/bx-sites/blob/development/box.json)
es la que se publica en [ForgeBox](https://forgebox.io/) y se etiqueta en
el repositorio en cada lanzamiento.

- **`development`** es la rama de trabajo - cada fusión allí dispara una
  compilación instantánea (sufijo de versión `-snapshot`), publicada para
  pruebas tempranas pero no pensada para uso en producción.
- **`main`** es la rama estable - un push allí genera un lanzamiento real
  y etiquetado: la sección `[Unreleased]` del propio
  [`changelog.md`](https://github.com/ortus-boxlang/bx-sites/blob/main/changelog.md)
  del proyecto se finaliza bajo ese número de versión, se crean una
  etiqueta de Git y una GitHub Release a partir de ella, y el módulo se
  publica en ForgeBox.

Una página de "novedades" para cada versión se genera automáticamente
como parte de ese proceso de lanzamiento - extraída directamente de su
sección de `changelog.md` - y aparece en esta sección a partir de ese
momento. Las mismas notas también se adjuntan a su
[GitHub Release](https://github.com/ortus-boxlang/bx-sites/releases).
