---
title: Monorepos Multi-Dominio
order: 0.6
icon: phosphor-duotone:stack
tags: [guías, configuración, despliegue]
---

# Monorepos Multi-Dominio

Ejecutar más de un sitio independiente desde un único repositorio git -
digamos, un sitio de marketing y un sitio de documentación separado, o un
puñado de sitios de producto que por conveniencia comparten un
repositorio - no necesita nada especial de bxSites. Cada sitio es
simplemente su propia **raíz de proyecto**: su propio `bxsites.yaml` más
su propia carpeta de contenido, construida, servida y desplegada de
forma independiente apuntando bxSites a esa única carpeta. Un "monorepo
con varios dominios" es sencillamente un repositorio que contiene varias
de estas raíces de proyecto, una junto a la otra.

## El patrón

La propia ubicación de `bxsites.yaml` es siempre donde sea que apunte la
raíz de proyecto explícita de la CLI - el directorio de trabajo actual, o
un `--projectRoot=<path>` explícito (o una ruta posicional simple). No
hay ninguna búsqueda ascendente de directorios ni ningún concepto
separado de "raíz del repositorio" frente a "raíz del proyecto" - cada
verbo simplemente resuelve una raíz de proyecto por invocación y busca
`bxsites.yaml` (o `.yml`/`.toml`/`.json`) directamente dentro de ella. Un
monorepo con varios dominios no es más que un repositorio que contiene
varias de estas, cada una completamente independiente:

```text title="Estructura del proyecto"
my-monorepo/
├── marketing/
│   ├── bxsites.yaml        ← source: .  (o docs - decisión propia de marketing)
│   ├── index.md
│   ├── about.md
│   └── .theme/               ← sobrescritura de tema propia de marketing, si la tiene
└── docs-site/
    ├── bxsites.yaml        ← source: docs
    └── docs/
        ├── index.md
        ├── guides/
        └── .theme/            ← sobrescritura de tema propia de docs-site, si la tiene
```

Cada uno de `marketing/` y `docs-site/` arriba es un proyecto bxSites
completo y autocontenido - su propio `bxsites.yaml`, su propia raíz de
contenido (resuelta por la propia clave `source` de ese proyecto, o por
autodetección - consulta [Origen del Contenido](content-source.md)), y su
propia sobrescritura `.theme`/`.themes` viviendo dentro de *esa* raíz de
contenido. Nada de esto es nuevo ni específico de monorepos; es el mismo
comportamiento de una-sola-raíz-de-proyecto que bxSites siempre ha
tenido, solo que con más de una raíz de proyecto guardada en el mismo
repositorio.

Anídalas de la forma que mejor convenga al repositorio - hermanas en la
raíz (como arriba), bajo un `sites/` compartido, o donde sea que tenga
más sentido; a bxSites solo le importa la ruta que le pases mediante
`--projectRoot`, no dónde esté esa ruta en relación con el resto del
repositorio.

## Construir un dominio

Apunta `--projectRoot` (o una ruta posicional simple) a la raíz de
proyecto que quieras construir - todos los verbos lo aceptan, no solo
`build`:

```bash frame="terminal" title="Terminal"
bxSites build --projectRoot=marketing
bxSites build --projectRoot=docs-site
```

Cada comando resuelve su propio `bxsites.yaml`, su propia raíz de
contenido, y su propia sobrescritura de tema de forma totalmente
independiente - construir `marketing/` nunca toca el `site/` de salida,
la configuración, ni el tema de `docs-site/`, y viceversa. No hay ningún
paso de construcción compartido ni ningún requisito de orden entre
dominios; construye los dominios que hayan cambiado, en el orden que
prefieras.

## Previsualizar un dominio

`serve` funciona de la misma forma - previsualiza exactamente una raíz de
proyecto a la vez:

```bash frame="terminal" title="Terminal"
bxSites serve --projectRoot=docs-site
```

Para previsualizar un dominio distinto, detén `serve` y vuelve a
ejecutarlo con un `--projectRoot` diferente (o desde un directorio de
trabajo distinto). Dos dominios que necesiten previsualización en vivo al
mismo tiempo solo necesitan dos procesos `serve` separados, cada uno con
su propio `--projectRoot` y (si se ejecutan simultáneamente) su propio
`--port`.

## Construir todos los dominios en CI

Como cada dominio es una invocación independiente de
`bxSites build --projectRoot=<path>`, CI simplemente recorre en bucle la
lista de raíces de proyecto:

```yaml title=".github/workflows/build-sites.yml" linenums="1"
name: Build sites
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        project: [marketing, docs-site]
    steps:
      - uses: actions/checkout@v4
      - name: Install BoxLang + bx-sites
        run: |
          /bin/bash -c "$(curl -fsSL https://install.boxlang.io)"
          export BOXLANG_INSTALL_HOME="/usr/local/boxlang"
          export PATH="/root/.boxlang/bin:/usr/local/bin:$PATH"
          install-bx-module bx-sites
      - name: Build ${{ matrix.project }}
        run: bxSites build --projectRoot=${{ matrix.project }}
      - uses: actions/upload-artifact@v4
        with:
          name: site-${{ matrix.project }}
          path: ${{ matrix.project }}/site/
```

Un bucle bash simple funciona igual de bien fuera de una construcción con
matriz, y hace fácil fallar todo el job en cuanto un dominio falla al
construirse:

```bash frame="terminal" title="Terminal"
for project in marketing docs-site; do
	echo "Building $project..."
	bxSites build --projectRoot="$project" || exit 1
done
```

La propia salida `site/` de cada dominio se despliega de la misma forma
en que se despliega la de un proyecto de un solo sitio - consulta
[Despliegue](deployment.md) - solo que una vez por dominio, apuntando a
los propios `deployments/*.json` de ese dominio y a su propia carpeta
`<project>/site/`.

## Sin colisión entre dominios

Como `.theme`/`.themes` viven dentro de la propia raíz de contenido de
cada dominio (consulta
[Origen del Contenido: Dónde vive una sobrescritura de tema](content-source.md#dónde-vive-una-sobrescritura-de-tema))
en lugar de en una raíz de proyecto compartida y desnuda, dos dominios en
el mismo monorepo pueden cada uno llevar su propia sobrescritura de tema
sin ningún riesgo de que uno tape al otro - `marketing/.theme/` y
`docs-site/docs/.theme/` son dos carpetas completamente separadas,
resueltas de forma independiente por la construcción de cada dominio. Lo
mismo aplica a todo lo demás con alcance de proyecto -
`bxsites.yaml`, `deployments/*.json`, `docs/versions/`, `docs/i18n/` - la
propia copia de cada dominio es exactamente la suya, sin nada compartido
a menos que decidas programar tú mismo ese compartir (por ejemplo,
copiando un archivo `extraCss` común a cada dominio antes de construir).
