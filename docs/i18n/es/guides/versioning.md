---
title: Versionado
order: 7.5
icon: phosphor-duotone:git-branch
summary: Publica documentación de más de un lanzamiento a la vez - crea una instantánea de versión, y cada tema obtiene un selector de versión gratis.
tags: [guías, versionado]
---

# Versionado

La documentación versionada es convención antes que configuración - no
hay ninguna clave de `bxsites.yaml` que activar. Añade una carpeta
`docs/versions/`, y cada subcarpeta directa dentro de ella se construye
como su propio árbol de documentación totalmente autocontenido, junto a
tu `docs/` regular (que siempre se construye como "Latest"):

```text title="docs/ layout"
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

Cada carpeta de versión es un árbol normal con la forma de `docs/` - su
propio `index.md`, su propia nav, sus propias páginas - construido en
`site/versions/<name>/` con cada enlace interno prefijado
correspondientemente, y compartiendo la única configuración/tema de
`bxsites.yaml` del proyecto. Un archivo suelto colocado directamente bajo
`docs/versions/` (no dentro de una subcarpeta) se ignora.

## Crear una nueva versión

`version:new` toma una instantánea del árbol *actual* de `docs/` en
`docs/versions/<name>/` - el flujo de trabajo habitual es: termina la
documentación de un lanzamiento, crea una versión justo antes de empezar
a escribir la documentación del siguiente, de modo que la instantánea
congela exactamente lo que se publicó:

```bash title="Terminal"
bxSites version:new --name=1.0
```

- `--name` (obligatorio) - la carpeta/etiqueta de la versión, por
  ejemplo `1.0`

La instantánea excluye `assets/`, `versions/`, `i18n/` y `blog/` - cada
una de ellas es su propio árbol cargado por separado, no parte del
propio contenido de una versión, así que nunca se duplican dentro de
ella.

No hay ningún verbo equivalente para "deshacer una versión" y ningún
otro verbo apunta a una versión específica -
`page:new`/`page:rename`/`post:new`/etc. siempre operan contra el árbol
principal `docs/`. Editar las propias páginas de una versión ya creada
(corregir una errata en `docs/versions/1.0/guides/setup.md`, por
ejemplo) es simplemente editar ese archivo directamente, igual que
cualquier otra página.

## Qué se construye

Cada versión se construye en `site/versions/<name>/`, con su propia nav,
migas de pan, enlaces anterior/siguiente, y `editUri` correctamente
delimitados a la propia ruta de origen de esa versión. Los nombres de
versión se ordenan **de más nueva a más antigua, numéricamente** en
lugar de alfabéticamente - `2.0` se ordena antes que `10.0` - y cada
tema incorporado renderiza automáticamente un desplegable selector de
versión en la cabecera en cuanto existe más de una versión (el árbol
principal "Latest" cuenta como una), sin nada que activar. Cambiar de
versión te mantiene en el árbol de la página equivalente cuando es
posible.

`sitemap.xml` y `llms.txt` incluyen las páginas de cada versión junto a
las del sitio principal - una versión es una parte de primera clase,
totalmente rastreable/enlazable del sitio, no un archivo oculto.

## Publicar una versión por defecto en la raíz del sitio

Una vez que un proyecto tiene una versión real y publicada a la que
dirigir a la gente, `docs/` en sí mismo suele estar a mitad de camino
escribiendo la *siguiente* - no es donde debería aterrizar un visitante
primerizo. `versions.default` nombra en su lugar una carpeta
`docs/versions/<name>/` para construirla en la raíz del sitio:

```yaml title="bxsites.yaml" linenums="1"
versions:
  default: "1.0.x"
```

Una vez configurado:

- `docs/versions/1.0.x/` se construye en la raíz del sitio (`/`), no en
  `/versions/1.0.x/` - nunca se duplica en ambos sitios.
- El árbol `docs/` simple - el que siempre se construyó antes en la raíz
  - se construye en cambio en `/next/`, totalmente navegable/enlazable,
  solo que ya no es la versión por defecto. Útil para escribir/revisar a
  la vista la documentación del próximo lanzamiento sin que parezca que
  ya se ha publicado.
- El selector de versión muestra `1.0.x (Current)` seleccionado en la
  raíz, luego cada una de las demás carpetas `docs/versions/*`, luego un
  separador y una entrada `Next` que apunta a `/next/` en último lugar -
  las versiones publicadas primero, con el árbol en curso aparte, al
  final, en lugar de encajado en segundo lugar.
- Las páginas de `/next/` quedan excluidas de `sitemap.xml`, y
  `robots.txt` recibe una línea `Disallow: /next/` - un árbol en curso
  no debería competir con la documentación real en los resultados de
  búsqueda. Por lo demás sigue siendo una parte completamente normal y
  accesible del sitio (su propio índice de búsqueda, su propia página de
  etiquetas, su propio soporte de `redirects`).
- `/next/` no obtiene sus propios subárboles de idioma en la v1 -
  `docs/i18n/<code>/` sigue traduciendo la misma carpeta física `docs/`
  de siempre, pero por ahora solo la construcción del idioma por defecto
  se publica bajo `/next/`.

Un `versions.default` mal configurado (que nombra una carpeta que en
realidad no existe bajo `docs/versions/`) hace que la construcción falle
con un error claro de `BxSites.UnknownDefaultVersion`, en lugar de caer
silenciosamente a otra cosa.

Los lanzamientos de parche (1.0.1, 1.0.2, ...) son solo ediciones en el
propio sitio de la carpeta `docs/versions/1.0.x/` ya creada -
`versions.default` no cambia y no se crea ninguna versión nueva. Solo un
incremento real de minor/major (`1.1`, `2.0`) justifica `version:new`
creando una carpeta nueva, con `versions.default` pasando a apuntar a
ella.

## Combinar con i18n

Consulta [i18n: "Docs versionados y traducidos"](i18n.md#docs-versionados-y-traducidos)
para la propia convención `docs/versions/<name>/i18n/<code>/`, que
refleja la propia estructura de una versión exactamente de la misma
forma que el `docs/i18n/<code>/` de nivel superior refleja el propio
`docs/`.

## Qué queda fuera de alcance (por ahora)

- **La búsqueda está delimitada por árbol, no unificada entre
  versiones.** El proveedor de búsqueda `local` por defecto escribe un
  `search-index.json` separado por árbol durante una construcción real -
  `site/search-index.json` para "Latest", `site/versions/2.0/search-index.json`
  para la versión `2.0`, y así sucesivamente - así que la búsqueda de un
  visitante solo cubre la versión que está leyendo en ese momento, nunca
  todas las versiones a la vez. Los verbos independientes de la CLI
  `search-index`/`search:query` van un paso más allá y solo cargan el
  árbol principal `docs/` sin importar cuántas versiones existan, ya que
  están pensados para una comprobación rápida contra tu documentación
  actual en curso, no una construcción completa - ejecuta `build`
  primero si necesitas el índice real de una versión concreta. El
  proveedor de búsqueda `pagefind` es la excepción: rastrea todo el
  `site/` construido en un solo paso, versiones incluidas - consulta
  [Búsqueda](search.md#otros-proveedores-de-búsqueda).
- **Sin marcador de obsoleto/fin de soporte, sin etiqueta
  personalizada.** La entrada del selector de una versión siempre es
  simplemente el nombre de su carpeta - no hay ninguna configuración
  para marcar una como no compatible o renombrar su etiqueta mostrada de
  forma independiente a la carpeta. Archivar una versión antigua
  significa dejar su carpeta en su sitio (o eliminarla y aceptar los
  enlaces rotos, igual que al eliminar cualquier otra página).
