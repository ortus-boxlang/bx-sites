---
title: Instrucciones para Agentes de IA
order: 6.4
icon: phosphor-duotone:file-text
summary: Cada proyecto nuevo recibe automáticamente una chuleta AGENTS.md para la creación de contenido - claves de frontmatter, directivas de bloques de contenido y el flujo de trabajo de páginas, generada a partir del tema y la carpeta de origen reales de tu proyecto.
tags: [guías, ai, agents]
---

# Instrucciones para Agentes de IA

`bxSites new` escribe por defecto un `AGENTS.md` en la raíz de tu proyecto -
una chuleta compacta que cubre lo que la mayoría de las ediciones de un
agente de codificación con IA realmente necesitan: las claves de
frontmatter reconocidas, cada directiva de bloque de contenido
`::: name :::` con su sintaxis, las carpetas reservadas y el flujo de
trabajo básico `page:new` -> `serve` -> `lint` -> `build`. Se genera a
partir del tema y la carpeta de origen reales de *tu* proyecto, no de una
plantilla genérica, y es el complemento, para la creación de contenido, del
paquete más profundo [Skills de Agentes de IA](ai-agent-skills.md) - una
referencia rápida que un asistente puede leer de una vez, frente a skills
que carga bajo demanda para una tarea concreta.

Esto es un público distinto del `AGENTS.md` en la raíz del **propio
repositorio bx-sites** - ese enseña a un asistente cómo trabajar en el
código fuente de bx-sites en sí. Esta guía trata del archivo generado en
*tu* proyecto de sitio, para ayudar a un asistente a editar *tu* contenido
correctamente.

## Qué se escribe

```bash title="Por defecto: solo AGENTS.md"
bxSites new my-docs
```

```text title="my-docs/"
my-docs/
├── AGENTS.md
├── .markdownlint.json
├── bxsites.yaml
└── docs/
    ├── assets/
    └── index.md
```

`.markdownlint.json` se escribe siempre junto a él - un conjunto de reglas
ajustado al contenido de bx-sites (relaja las reglas de longitud de línea,
tabulaciones y URLs desnudas que de otro modo marcarían Markdown normal de
bx-sites, como una línea larga de directiva de bloque de contenido o un
bloque de código sin lenguaje indicado).

### Elegir qué archivo(s)

No todos los proyectos usan Claude Code en particular, así que
`CLAUDE.md`/`.cursorrules` son opcionales mediante `--agents`:

```bash title="Escribir también CLAUDE.md"
bxSites new my-docs --agents=agents,claude
```

```bash title="Omitir el/los archivo(s) de instrucciones por completo"
bxSites new my-docs --agents=none
# .markdownlint.json se escribe igualmente
```

| Objetivo | Archivo |
|---|---|
| `agents` (por defecto) | `AGENTS.md` |
| `claude` | `CLAUDE.md` |
| `cursor` | `.cursorrules` |

## Mantenerlo actualizado: `agents:sync`

El contenido generado se encuentra dentro de un bloque marcado:

```text title="AGENTS.md"
<!-- bxsites:agents:start -->
...chuleta generada...
<!-- bxsites:agents:end -->
```

Edita libremente por encima o por debajo de los marcadores - tus propias
notas de proyecto, convenciones de equipo, enlaces a una guía de estilo
interna, lo que quieras. Ejecuta `agents:sync` cuando quieras (tras una
actualización de bx-sites que añada nuevas directivas o claves de
frontmatter, o para actualizar un proyecto generado antes de que existiera
esta función) y solo se refresca el bloque marcado:

```bash title="Uso"
bxSites agents:sync
```

Tres resultados posibles por archivo de destino, que se reportan:

- **Created** - el archivo aún no existía.
- **Updated** - se encontraron los marcadores, se refrescó el bloque entre
  ellos, todo lo de fuera quedó intacto.
- **Skipped** - el archivo existe pero no tiene marcadores. No se
  sobrescribe nada; es o bien un archivo que escribiste a mano antes de que
  existiera esta función, o uno cuyos marcadores quitaste a propósito para
  excluirlo de futuras sincronizaciones.

`agents:sync` también reescribe siempre `.markdownlint.json` con el
conjunto de reglas canónico actual, y acepta el mismo flag `--agents=` que
`new` para apuntar a archivo(s) concreto(s).

## Preguntas frecuentes

??? faq "¿`agents:sync` sobrescribirá mis propias notas?"
    No - solo se reemplaza el texto entre `<!-- bxsites:agents:start -->` y
    `<!-- bxsites:agents:end -->`. El contenido que añadas fuera de esos
    marcadores, en el mismo archivo, se conserva en cada sincronización.

??? faq "No quiero que se vuelva a tocar AGENTS.md - ¿cómo excluyo un archivo?"
    Elimina (o no vuelvas a añadir) los marcadores
    `bxsites:agents:start`/`end`. `agents:sync` trata un archivo sin
    marcadores como escrito a mano y lo reporta como omitido en lugar de
    sobrescribirlo.

??? faq "¿Esto sustituye al paquete de Skills de Agentes de IA?"
    No - cubren ámbitos distintos. Esta es una única chuleta, siempre
    presente, para la creación de contenido;
    [Skills de Agentes de IA](ai-agent-skills.md) (`bxSites skills:install`)
    es un paquete mucho más profundo, de trece skills, que un asistente
    carga bajo demanda, cubriendo desde temas hasta despliegue. La mayoría
    de los proyectos se benefician de ambos.

??? faq "¿Por qué no hay una fila `::: comments :::` en la tabla de directivas?"
    Los comentarios de lectores todavía no son una función de bx-sites - el
    archivo generado lo dice explícitamente, para que un asistente no
    invente una sintaxis que no existe.

## Fuente

- Generador: `models/build/AgentsFileGenerator.bx`
- Verbos de la CLI: `models/cli/New.bx` (el flag `--agents` de `new`), `models/cli/AgentsSync.bx`
- Consulta [Referencia de la CLI](../cli-reference.md#new) y
  [Referencia de la CLI](../cli-reference.md#agentssync) para la referencia completa de flags.
