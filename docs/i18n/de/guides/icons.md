---
title: Icons
order: 1.5
icon: phosphor-duotone:shapes
tags: [anleitungen, themes, icons]
---

# Icons

Die eigene `icon`-Frontmatter einer Seite (angezeigt neben ihrem Titel und
neben ihrem Eintrag in der Sidebar-Navigation) akzeptiert entweder ein
reines Emoji/einen kurzen Text - die ursprüngliche, weiterhin vollständig
unterstützte Form - oder ein benanntes Icon aus einer von acht selbst
gehosteten Bibliotheken, alle MIT-/ISC-lizenziert und mit diesem Modul
mitgeliefert (~16.200 Icons insgesamt, kein CDN, kein zusätzliches Gewicht
für eine gebaute Seite über die tatsächlich verwendete Handvoll Icons
hinaus - siehe IconResolver.bx):

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

Ein reines `rocket` verwendet standardmäßig [Phosphor](https://phosphoricons.com/),
reguläre Stärke. Phosphor liefert alle sechs eigenen Stärken, jede mit
eigenem Präfix: `phosphor-thin:`, `phosphor-light:`, `phosphor:` (regulär,
identisch mit dem reinen Namen), `phosphor-bold:`, `phosphor-fill:` und
`phosphor-duotone:`. Stelle `lucide:` voran für [Lucide](https://lucide.dev/icons/),
oder `tabler:` für [Tabler](https://tabler.io/icons). Durchsuche die
jeweilige eigene Galerie der Website nach dem exakten Namen - er stimmt
genau mit dem vendorierten Dateinamen dieses Moduls überein
(Kleinbuchstaben, mit Bindestrichen, z. B. `book-open`, `arrow-up-right`;
Phosphors eigene Website zeigt einen Stärke-Umschalter - jede ihrer sechs
Optionen dort entspricht einem der sechs `phosphor[-weight]:`-Präfixe
dieses Moduls).

Font Awesome ist bewusst nicht dabei - sein Duotone-Stil (und der
Großteil seines Icon-Sets ab v6) ist Pro-only, nicht unter einer Lizenz
verfügbar, unter der dieses Modul sie kostenlos bündeln und
weiterverbreiten könnte.

Auch eine eigene SVG-Datei eines Projekts funktioniert - lege sie unter
`docs/assets/icons/my-icon.svg` ab und referenziere sie als
`icon: custom:my-icon`.

Ein [nav.json](../configuration.md#nav)-Eintrag kann ebenfalls ein
eigenes `icon` setzen, das die eigene Frontmatter der Zielseite für genau
diesen einen Eintrag überschreibt:

```json title="docs/nav.json"
{ "title": "Guides", "path": "guides/index.md", "icon": "lucide:book-open" }
```

Dieselben `[bibliothek:]name`/Emoji-Werte funktionieren überall sonst,
wo ein `icon` akzeptiert wird, etwa bei einer [Content-Block-Card](content-blocks.md#cards) -
aufgelöst auf dieselbe Weise, über denselben gemeinsamen Cache, sodass
das Referenzieren desselben Icons zweimal innerhalb eines Builds dessen
SVG-Datei nur einmal liest.
