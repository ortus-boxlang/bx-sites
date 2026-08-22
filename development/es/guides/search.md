---
title: Búsqueda
order: 2
tags: [guías, búsqueda]
---

# Búsqueda

La búsqueda de BX Docs es completamente estática y del lado del cliente -
el mismo enfoque que usa [mkdocs](https://www.mkdocs.org/) por defecto:
un índice construido una vez en el momento de `build`, y
[lunr.js](https://lunrjs.com/) haciendo la búsqueda real en el navegador
del visitante. No hay servidor, base de datos ni servicio de búsqueda
externo involucrado.

## Cómo funciona

1. En el momento de `build`, `SearchIndexer` recorre cada página no
   oculta y escribe `site/search-index.json`: una entrada por página con
   su `title`, `url`, las `tags` del frontmatter, el texto de cada
   encabezado de la página, y una copia de texto plano truncada de su
   cuerpo (con las etiquetas HTML eliminadas).
2. El parcial `search.bxm` de cada tema renderiza un cuadro de búsqueda;
   `layout.bxm` solo lo incluye (junto con `lunr.js` y los scripts
   compartidos de `search.js`) cuando `search` de `bxdocs.json` es
   `true`.
3. En el navegador, el widget compartido `assets/search.js` obtiene
   `search-index.json` una vez, construye un índice `lunr` a partir de él
   (`title` con la mayor ponderación, luego las `tags` del frontmatter,
   luego `headings`, luego el texto plano del cuerpo), y vuelve a
   buscar en él en cada pulsación de tecla - sin ida y vuelta de red por
   consulta.

## Atajos de teclado

- **`/`** enfoca el cuadro de búsqueda desde cualquier lugar de la página
  (a menos que ya estés escribiendo en otro campo) - la misma convención
  que usa [mkdocs-material](https://squidfunk.github.io/mkdocs-material/).
- **`Escape`** cierra el desplegable de resultados y quita el foco del
  cuadro de búsqueda.

## Desactivarla

```json
{ "search": false }
```

Omite la construcción de `search-index.json` por completo, y omite el
cuadro de búsqueda, el script incluido/autoalojado de `lunr.js`, y el
widget compartido `search.js` en cada página renderizada - un proyecto
con la búsqueda desactivada no envía nada relacionado con búsqueda en
absoluto.

## Reconstruir solo el índice

```bash
bxDocs search-index
```

Útil si solo necesitas actualizar `search-index.json` - `build` ya hace
esto como uno de sus propios pasos, así que no necesitas ejecutar esto
por separado después de una construcción normal.
