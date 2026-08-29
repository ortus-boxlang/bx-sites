---
title: Icone
order: 1.5
icon: phosphor-duotone:shapes
tags: [guide, temi, icone]
---

# Icone

Il frontmatter `icon` di una pagina (mostrato accanto al suo titolo, e
accanto alla sua voce nella nav laterale) accetta sia un'emoji/testo breve
semplice - la forma originale, ancora pienamente supportata - sia
un'icona con nome da una delle otto librerie autoospitate, tutte con
licenza MIT/ISC e incluse in questo modulo (circa 16.200 icone
combinate, nessuna CDN, nulla di aggiunto al peso di una pagina compilata
oltre alla manciata di icone effettivamente usate - vedi IconResolver.bx):

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

Un semplice `rocket` ricade su [Phosphor](https://phosphoricons.com/),
peso regolare. Phosphor include tutti e sei i suoi pesi, ciascuno con il
proprio prefisso: `phosphor-thin:`, `phosphor-light:`, `phosphor:`
(regolare, uguale al nome nudo), `phosphor-bold:`, `phosphor-fill:` e
`phosphor-duotone:`. Usa il prefisso `lucide:` per
[Lucide](https://lucide.dev/icons/), oppure `tabler:` per
[Tabler](https://tabler.io/icons). Sfoglia la galleria di ciascun sito
per il nome esatto - corrisponde esattamente al nome file incluso in
questo modulo (minuscolo, con trattini, ad es. `book-open`,
`arrow-up-right`; il sito di Phosphor mostra un selettore di peso -
ciascuna delle sue sei opzioni lì corrisponde a uno dei sei prefissi
`phosphor[-weight]:` di questo modulo).

Font Awesome non è deliberatamente incluso tra queste - il suo stile
Duotone (e la maggior parte del suo set di icone dalla v6 in poi) è
disponibile solo con Pro, non disponibile con una licenza che questo
modulo possa includere e ridistribuire gratuitamente.

Anche un SVG del tuo progetto funziona - mettilo in
`docs/assets/icons/my-icon.svg` e riferiscilo come `icon: custom:my-icon`.

Una voce di [nav.json](../configuration.md#nav) può impostare la propria
`icon`, sovrascrivendo il frontmatter proprio della pagina di destinazione
per quella singola voce:

```json title="docs/nav.json"
{ "title": "Guides", "path": "guides/index.md", "icon": "lucide:book-open" }
```

Gli stessi valori `[libreria:]nome`/emoji funzionano ovunque altrove venga
accettata un'`icon`, come una [card di un blocco di contenuto](content-blocks.md#card) -
risolta allo stesso modo, attraverso la stessa cache condivisa, cosicché
riferirsi alla stessa icona due volte in una stessa build ne legge il file
SVG una sola volta.
