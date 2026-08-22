---
title: Referencia de la CLI
order: 3
icon: phosphor-duotone:terminal-window
summary: Cada verbo de bxSites y sus opciones.
tags: [referencia, cli]
---

# Referencia de la CLI

```bash
bxSites <verb> [options]
```

`box install bx-sites` coloca un script `bxSites` independiente en tu
`PATH` (mediante `boxlang.executable` de `box.json`), de modo que cada
verbo de abajo puede ejecutarse tanto de esa forma corta, como en la
forma `boxlang module:bxsites <verb>` - ambas ejecutan exactamente lo
mismo; usa la forma más larga en cualquier lugar donde el atajo del
`PATH` no esté configurado (un ejecutor de CI, un módulo registrado a
mano):

```bash
boxlang module:bxsites <verb> [options]
```

Cada verbo acepta `--projectRoot=<path>` (o una ruta posicional simple)
para apuntar a un proyecto distinto del directorio actual, y las dos
opciones globales de abajo pueden aparecer antes de cualquier verbo.

## Opciones globales

| Flag | Descripción |
|---|---|
| `-h`, `--help` | Muestra el uso y sale |
| `-v`, `--version` | Muestra la versión del módulo y sale |

## `new`

Crea la estructura de un proyecto de documentación.

```bash
bxSites new [path] [--name=...] [--theme=bootstrap|material|tailwind] [--description=...] [--format=yaml|json]
```

- `--name` - el nombre del sitio escrito en la configuración del sitio (por defecto, el nombre del directorio de destino)
- `--theme` - por defecto `bootstrap`
- `--description` - la descripción del sitio escrita en la configuración del sitio
- `--format` - `yaml` (por defecto, genera `bxsites.yaml`) o `json` (genera `bxsites.json`) - consulta [Configuración](configuration.md)

## `build`

Renderiza `docs/**.md` en un sitio estático en `site/`. También construye
el índice de búsqueda (a menos que `search` sea `false` en la
configuración del sitio) y copia el tema + `docs/assets/**` en `site/`.

```bash
bxSites build
```

## `serve`

Construye y sirve el sitio localmente con recarga en vivo.

```bash
bxSites serve [--port=8080] [--host=127.0.0.1]
```

Se ejecuta en primer plano hasta que se interrumpe (Ctrl+C).

## `search-index`

Reconstruye `site/search-index.json` de forma independiente, sin volver a
renderizar páginas ni copiar recursos. `build` ya ejecuta este mismo paso
automáticamente - este verbo existe para cuando solo necesitas actualizar
el índice.

```bash
bxSites search-index
```

## `clean`

Elimina `site/` y cualquier caché de construcción, dejando intactos
`docs/` y la configuración del sitio.

```bash
bxSites clean
```

## `gh-deploy`

Construye el sitio y luego lo empuja con force-push a una rama al estilo
`gh-pages` - un commit por despliegue, sin historial acumulado en esa
rama, siguiendo la propia convención `mkdocs gh-deploy` de mkdocs.
Requiere que el proyecto sea un repositorio git con un remoto configurado;
nunca toca tu propia rama actual ni tu árbol de trabajo (hace el push
desde un `git worktree` desechable).

```bash
bxSites gh-deploy [--branch=gh-pages] [--remote=origin] [--message="..."]
```

- `--branch` - por defecto `gh-pages`
- `--remote` - por defecto `origin`
- `--message` - el mensaje del único commit de la rama, por defecto `"Deploy site via bxSites gh-deploy"`

Consulta [Despliegue](guides/deployment.md) para la configuración completa
de GitHub Pages (activar Pages para la rama, `baseURL`, etc.).

## `migrate`

Convierte una exportación de GitBook - una tabla de contenidos
`SUMMARY.md` más sus archivos `.md`, el propio formato de sincronización
en disco de GitBook - en el árbol `docs/` de este proyecto: `SUMMARY.md`
se convierte en `docs/nav.json`, la sintaxis `{% block %}` se convierte en
su equivalente de bx-sites (directivas `::: name`, o la sintaxis nativa de
pestañas `=== "Title"` / admoniciones `!!! type` cuando ya existe una
correspondencia más cercana - consulta
[Extensiones de Markdown](guides/markdown.md#gitbook-style-blocks)), los
archivos `README.md` se convierten en `index.md`, y `.gitbook/assets/**`
se copia a `docs/assets/gitbook/`.

```bash
bxSites migrate --source=/path/to/gitbook-export
```

- `--source` (obligatorio) - ruta al directorio raíz de la exportación de GitBook (debe contener `SUMMARY.md`)

Imprime un resumen de las páginas convertidas y, cuando algo no pudo
convertirse automáticamente (un bloque no compatible como
`{% prompt %}`, un estilo de sugerencia no reconocido, un ancho de
columna que no es una longitud simple), una lista de exactamente qué
necesita revisión manual - nada se descarta silenciosamente, un bloque no
reconocido se deja en su sintaxis `{% %}` original en el archivo migrado.
Un archivo de destino o `docs/nav.json` que ya exista se sobrescribe
(también se informa), así que revisa la salida migrada antes de
confirmarla.
