---
title: Iconos
order: 1.5
icon: phosphor-duotone:shapes
tags: [guías, temas, iconos]
---

# Iconos

El propio frontmatter `icon` de una página (mostrado junto a su título, y
junto a su entrada en la barra lateral de navegación) acepta ya sea un
emoji/texto corto simple - la forma original, todavía totalmente
compatible - o un icono con nombre de una de las ocho bibliotecas
autoalojadas, todas con licencia MIT/ISC e incluidas con este módulo
(~16.200 iconos combinados, sin CDN, sin nada añadido al peso de una
página construida más allá de los pocos iconos que realmente usa -
consulta IconResolver.bx):

```markdown title="Frontmatter"
---
icon: rocket
---
```

```markdown title="Frontmatter"
---
icon: lucide:rocket
---
```

```markdown title="Frontmatter"
---
icon: phosphor-bold:rocket
---
```

El `rocket` sin prefijo usa por defecto [Phosphor](https://phosphoricons.com/),
peso regular. Phosphor incluye sus seis pesos propios, cada uno con su
propio prefijo: `phosphor-thin:`, `phosphor-light:`, `phosphor:` (regular,
igual que el nombre sin prefijo), `phosphor-bold:`, `phosphor-fill:` y
`phosphor-duotone:`. Usa el prefijo `lucide:` para
[Lucide](https://lucide.dev/icons/), o `tabler:` para
[Tabler](https://tabler.io/icons) en su lugar. Explora la propia galería
de cada sitio para el nombre exacto - coincide exactamente con el propio
nombre de archivo incluido en este módulo (minúsculas, con guiones, por
ejemplo `book-open`, `arrow-up-right`; el propio sitio de Phosphor
muestra un selector de peso - cada una de sus seis opciones allí es uno
de los seis prefijos `phosphor[-weight]:` de este módulo).

Font Awesome deliberadamente no es una de ellas - su estilo Duotone (y la
mayor parte de su conjunto de iconos desde la v6 en adelante) es exclusivo
de la versión Pro, no disponible bajo una licencia que este módulo pudiera
incluir y redistribuir de forma gratuita.

El propio SVG de un proyecto también funciona - colócalo en
`docs/assets/icons/my-icon.svg` y referéncialo como `icon: custom:my-icon`.

Una entrada de [nav.json](../configuration.md#nav) también puede definir
su propio `icon`, sobrescribiendo el propio frontmatter de la página de
destino solo para esa entrada:

```json title="docs/nav.json"
{ "title": "Guides", "path": "guides/index.md", "icon": "lucide:book-open" }
```

Los mismos valores `[library:]name`/emoji funcionan en cualquier otro
lugar donde se acepte un `icon`, como una [tarjeta de bloque de
contenido](content-blocks.md#tarjetas) - resuelto de la misma forma, a
través de la misma caché compartida, de modo que referenciar el mismo
icono dos veces a lo largo de una compilación solo lee su archivo SVG una
vez.
