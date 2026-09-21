---
title: Origen del Contenido
order: 0.5
icon: phosphor-duotone:folder-open
tags: [guías, configuración]
---

# Origen del Contenido

Cada proyecto tiene exactamente una raíz de contenido - la carpeta que
bxSites recorre en busca de páginas `.md`, `assets/`, `blog/`, `i18n/`,
`versions/`, y todo lo demás cubierto en el resto de estos documentos.
Esta guía cubre cómo se encuentra esa carpeta, cómo apuntarla a otro
lugar con `source`, cómo mantener fuera del recorrido los archivos
sueltos con `exclude`, y dónde vive la propia sobrescritura de tema de un
proyecto en relación con ella.

## Autodetección (el comportamiento por defecto)

Sin ninguna clave `source` establecida, bxSites busca primero `docs/`,
luego `src/`, y usa la que realmente exista en disco - la misma
convención de siempre cubierta en
[Primeros Pasos](../getting-started.md#añadir-páginas). Esto es
suficiente para la mayoría de los proyectos y no necesita ninguna
configuración.

## La clave de configuración `source`

Establece `source` en `bxsites.yaml` para saltarte la autodetección y
decir explícitamente dónde vive tu contenido:

=== "YAML"
    ```yaml title="bxsites.yaml"
    source: docs
    ```

=== "JSON"
    ```json title="bxsites.json"
    { "source": "docs" }
    ```

=== "TOML"
    ```toml title="bxsites.toml"
    source = "docs"
    ```

`source` acepta:

- `docs` o `src` - los mismos dos nombres convencionales que la
  autodetección ya comprueba, solo que escritos explícitamente en lugar
  de inferidos.
- Cualquier otro nombre de carpeta - `content`, `pages`, `website`, lo
  que mejor se ajuste a tu proyecto. La autodetección solo busca
  `docs`/`src`; un nombre personalizado siempre necesita un `source`
  explícito.
- `.` - la propia raíz del proyecto es la raíz de contenido, sin ninguna
  subcarpeta. Útil para un proyecto que es *solo* un sitio de
  documentación - nada más en el repositorio - donde añadir una capa
  `docs/` encima sería solo una carpeta más que navegar.
  `build`/`serve`/cualquier otro verbo entonces recorre toda la raíz del
  proyecto en busca de páginas `.md`, exactamente como recorrerían
  `docs/` de otro modo.

`bxSites new` siempre escribe un `source:` explícito en el `bxsites.yaml`
que genera (`docs` por defecto, o lo que sea que hayas pasado con
`--source=...`) - consulta
[Primeros Pasos](../getting-started.md#crear-la-estructura-de-un-proyecto)
- así que un proyecto recién creado nunca es ambiguo sobre dónde vive su
contenido, incluso antes de que la autodetección entre en juego.

Un nombre queda fuera de los límites sin importar qué: `source: site`
siempre falla, ya que `site/` es la propia salida de construcción
generada de bxSites - cada construcción la elimina y la recrea, así que
dejar que también sirviera como carpeta de origen significaría que una
construcción borrara su propio contenido.

## El error `BxSites.SourceNotConfigured`

Si `source` se deja sin establecer **y** ni `docs/` ni `src/` existen en
disco, la construcción falla de forma explícita en lugar de recurrir
silenciosamente a la raíz del proyecto:

```text
BxSites.SourceNotConfigured: No docs/ or src/ folder found, and no
[source] set in bxsites.yaml - set source: docs, source: src, or
source: . (if your whole repo is the content) to tell bxSites where
your content lives
```

Esto es deliberado - adivinar que "la raíz del proyecto debe ser el
contenido" cada vez que no existe ninguna de las dos carpetas
convencionales, recogería silenciosamente cosas como `README.md`, un
`CHANGELOG.md`, la configuración de CI, o el propio código fuente de un
repositorio en una construcción, en cuanto alguien renombrara `docs/` a
otra cosa, o ejecutara bxSites contra un repositorio que nunca estuvo
pensado como un sitio de documentación. La solución siempre es una línea
en `bxsites.yaml`:

=== "YAML"
    ```yaml title="bxsites.yaml"
    source: .
    ```

=== "JSON"
    ```json title="bxsites.json"
    { "source": "." }
    ```

=== "TOML"
    ```toml title="bxsites.toml"
    source = "."
    ```

(o `source: docs`/`source: src` si te referías a una de esas y la
carpeta simplemente todavía no existe - créala, o apunta `source` a
donde realmente vive el contenido).

## Excluir archivos y carpetas

bxSites siempre excluye por sí solo un puñado de nombres del recorrido
de contenido - `.git`, `.github`, `node_modules`, `boxlang_modules`,
`site`, `.theme`, `.themes`, y su propio archivo de configuración
(`bxsites.yaml`/`.yml`/`.toml`/`.json`, `box.json`) - de la misma forma
en que ya excluye `assets/`, `versions/`, `i18n/`, `blog/`, e
`includes/` de ser recorridos como páginas normales. `exclude` añade tus
propios nombres encima de esa lista:

=== "YAML"
    ```yaml title="bxsites.yaml"
    source: .
    exclude:
      - tests
      - build
      - CONTRIBUTING.md
    ```

=== "JSON"
    ```json title="bxsites.json"
    {
    	"source": ".",
    	"exclude": ["tests", "build", "CONTRIBUTING.md"]
    }
    ```

=== "TOML"
    ```toml title="bxsites.toml"
    source = "."
    exclude = [ "tests", "build", "CONTRIBUTING.md" ]
    ```

Cada entrada es un nombre simple, comparado de la misma forma en que lo
son las exclusiones integradas - en la raíz de la carpeta de contenido, o
en cualquier lugar debajo de ella.

Esto es más útil combinado con `source: .`. En cuanto todo el
repositorio es la raíz de contenido, todo lo que haya en él que no sea
en sí mismo una página necesita nombrarse explícitamente - una carpeta
`tests/`, un directorio de salida `build/`, configuración de
herramientas, o cualquier otra cosa que de otro modo sería recorrida y
publicada como si fuera una página de documentación. Sin embargo,
`exclude` deliberadamente *no* viene pre-poblado con
`README.md`/`LICENSE.md`/`CHANGELOG.md` - un proyecto es libre de tener
una página de contenido real con exactamente uno de esos nombres (el
propio `docs/license.md` de este módulo, por ejemplo), así que si tu
proyecto con `source: .` no quiere que su `README.md`/`LICENSE.md`/
`CHANGELOG.md` de la raíz se publique como página, opta por excluirlo
por nombre mediante `exclude` en lugar de confiar en que ocurra
automáticamente.

Consulta [Configuración: `exclude`](../configuration.md#exclude) para la
entrada de referencia completa.

## Dónde vive una sobrescritura de tema

La propia sobrescritura de tema de un proyecto - un `.theme/` escrito a
mano (consulta
[Temas: Sobrescribir un tema](themes.md#sobrescribir-un-tema)) o un
`.themes/<name>/` instalado mediante `install:theme` (consulta
[Temas: Instalar un tema publicado](themes.md#instalar-un-tema-publicado))
- vive **dentro de la raíz de contenido resuelta**, no en la raíz misma
del proyecto: `<raízDeContenido>/.theme/` y
`<raízDeContenido>/.themes/<name>/`, donde `<raízDeContenido>` es donde
sea que resuelva `source` (o la autodetección) - `docs/`, `src/`, un
nombre de carpeta personalizado, o la propia raíz del proyecto para
`source: .`.

```text title="Estructura del proyecto"
my-project/
├── bxsites.yaml          ← source: docs
└── docs/                 ← la raíz de contenido resuelta
    ├── index.md
    ├── assets/
    └── .theme/            ← vive dentro de docs/, no en la raíz del proyecto
        ├── layout.bxm
        └── page.bxm
```

Mantener `.theme`/`.themes` dentro de la raíz de contenido en lugar de en
la raíz misma del proyecto importa sobre todo en cuanto un repositorio
tiene más de una raíz de proyecto - consulta
[Monorepos Multi-Dominio](multi-domain.md) para ese patrón. La propia
sobrescritura de tema de cada raíz de proyecto vive entonces sin
ambigüedad junto al contenido al que da estilo, sin ninguna duda sobre a
qué dominio habría pertenecido una carpeta `theme/` compartida en el
nivel superior.
