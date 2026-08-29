---
title: Ein Theme importieren
order: 6.5
icon: phosphor-duotone:arrows-left-right
tags: [anleitungen, themes, migration]
---

# Ein Theme importieren

`bxSites theme:import` wandelt ein Theme aus dem Ökosystem eines anderen
statischen Site-Generators in ein bx-sites-Theme-Gerüst unter
`themes/<name>/` um - ein bestmöglicher Ausgangspunkt, kein
verlustfreier Ein-Befehl-Port. Es deckt die drei Ökosysteme ab, deren
Theme-Struktur auf den eigenen `layout.bxm`+`page.bxm`-Vertrag von
bx-sites abbildbar ist (siehe
[Themes](themes.md#der-themeprovider-vertrag)):

- **`mkdocs`** - Jinja2-Templates (natives mkdocs und mkdocs-material
  verwenden beide `base.html`+`main.html`)
- **`jekyll`** - Liquid-Templates (`_layouts/default.html`+
  `_layouts/page.html`)
- **`hugo`** - Go-Templates (`layouts/_default/baseof.html`+
  `layouts/_default/single.html`)

Ein React-/Vue-Komponenten-basiertes Theme (Docusaurus, VuePress,
Gatsby, ...) hat hier keine Entsprechung - es gibt keine Template-*Datei*,
die sich mechanisch übersetzen ließe, da das Theme aus kompilierten
UI-Komponenten besteht statt aus serverseitig gerendertem Markup. Eines
davon zu portieren bedeutet, es von Grund auf als bx-sites-Theme neu zu
verfassen (siehe
[Ein Theme von Grund auf schreiben](themes.md#ein-theme-von-grund-auf-schreiben)),
nicht zu konvertieren.

```bash frame="terminal" title="Terminal"
bxSites theme:import --source=mkdocs --path=/path/to/mkdocs-theme --name=my-imported-theme
```

- `--source` (erforderlich) - `mkdocs`, `jekyll` oder `hugo`
- `--path` (erforderlich) - der eigene Wurzelordner des Quell-Themes (der,
  der sein Layout-Template enthält, nicht das gesamte mkdocs-/jekyll-/
  hugo-*Projekt* - siehe
  [Migration von mkdocs](migrating-from-mkdocs.md)/
  [Migration von GitBook](migrating-from-gitbook.md) für die Konvertierung
  des *Inhalts* eines Projekts, eine andere Aufgabe als die Konvertierung
  seines *Themes*)
- `--name` (erforderlich) - der Zielname, geschrieben nach
  `themes/<name>/` (dieselbe
  [Installiertes-Theme-Konvention](themes.md#ein-veröffentlichtes-theme-installieren),
  die `install:theme` verwendet) - setze `theme.name` in `bxsites.yaml`
  darauf, sobald du mit dem Ergebnis zufrieden bist

Ein erneuter Lauf gegen denselben `--name` ist sicher -
`layout.bxm`/`page.bxm` werden überschrieben und neu gefundene
Asset-Ordner zusammengeführt, sodass das Iterieren (Quelle oder Mapping
anpassen, erneut ausführen) der normale Workflow ist, kein
Einmal-Vorgang.

## Was tatsächlich konvertiert wird

Die Ausgabe des Befehls meldet genau, was passiert ist - welche
Quelldatei zu `layout.bxm`/`page.bxm` wurde (oder einen Hinweis, dass
keine gefunden wurde, falls das Quell-Theme keinen der oben genannten
konventionellen Dateinamen verwendet), welche Asset-Ordner (`css/`,
`js/`, `static/`, ...) unverändert nach `themes/<name>/assets/` kopiert
wurden, und eine nummerierte Liste von allem, was einen manuellen Blick
braucht.

Innerhalb einer Template-Datei ist dies ein **mechanischer,
bestmöglicher Übersetzer** (`JinjaLikeTranslator.bx` für die gemeinsame
Jinja2-/Liquid-Syntax von mkdocs/jekyll, `GoTemplateTranslator.bx` für
hugos Go-Templates) - kein echter Parser für beide Sprachen. Was er
verarbeitet:

- Variablenausgabe (`{{ page.title }}` / Hugos `{{ .Title }}`),
  abgebildet gegen eine kleine, feste Tabelle der gängigen Felder
  (Seitentitel/-inhalt/-beschreibung, Website-Name/-beschreibung,
  Basis-URL, Navigation) - alles außerhalb dieser Tabelle wird als
  `<!--- TODO: ... --->`-Marker belassen, statt geraten zu werden.
- `if`/`elif`/`else`/`endif` (mkdocs/jekyll) oder `if`/`else if`/`else`/`end`
  (hugo), übersetzt in echte `<bx:if>`/`<bx:elseif>`/`<bx:else>`-Struktur
  - immer strukturell gültig, selbst wenn die *Bedingung* selbst auf
  etwas außerhalb der Mapping-Tabelle verweist (stattdessen als Warnung
  gekennzeichnet, da es schlimmer wäre, das umgebende `if` defekt zu
  lassen, als eine Bedingung, die ein Mensch noch prüfen muss).
- `for x in list`/`endfor` (mkdocs/jekyll) oder `range`/`end` (hugo),
  auf dieselbe Weise in `<bx:loop>` übersetzt. Hugos `range` bindet `.`
  im üblichen Fall ohne benannte Schleifenvariable an jedes Element neu -
  das erzeugte `<bx:loop>` verwendet immer einen synthetischen Namen
  `item`, und eine feste Warnung weist darauf hin, dass ein bloßes
  `.Field` *innerhalb* des Schleifenkörpers das eigene Feld des
  Range-Elements in Go meint, was nicht automatisch auf `item.Field`
  umgestellt werden kann.
- Kommentare (`{# ... #}`/`{% comment %}` bei Jinja2/Liquid,
  `{{/* ... */}}` bei Go), vollständig entfernt.

Was bewusst **nicht** übersetzt wird, immer als TODO-Marker belassen
(oder, innerhalb einer Bedingung, wo das Belassen roher, unübersetzter
Syntax ungültiges BoxLang erzeugen würde, durch einen syntaktisch
sicheren Platzhalter ersetzt - `false` für eine Bedingung, `[]` für den
Listenausdruck einer Schleife - auf dieselbe Weise gekennzeichnet):

- Ein Filter/eine Pipeline (`{{ page.title | upper }}`,
  `{{ .Title | truncate 100 }}`) - Filter-Semantik variiert zu stark, um
  sicher zu raten. Es lohnt sich trotzdem, das manuell zu prüfen, da ein
  Filter mit einer offensichtlich sicheren BoxLang-Entsprechung
  (`upper` → `ucase()`) häufig genug vorkommt, um eine schnelle manuelle
  Korrektur zu sein.
- Template-Vererbung (Jinja2s `{% extends %}`/`{% block %}`, Hugos
  `{{ block }}`/`{{ define }}`) und Includes/Partials (`{% include %}`)
  - keine automatische Möglichkeit, diese auf den eigenen
  Einzeldatei-Vertrag `layout.bxm`+`page.bxm` von bx-sites abzubilden.
- Hugos `{{ with .X }}` - bindet `.` für den eigenen Körper an einen
  neuen Kontext, ohne jede bx-sites-Entsprechung, wird also unübersetzt
  belassen, statt als strukturell gültiges, aber semantisch falsches
  `<bx:if>` ausgegeben zu werden.
- Eine Go-Bedingung, die keine einzelne Feldreferenz ist (Go schreibt
  boolesche Logik als Präfix-Funktionsaufrufe -
  `{{ if and .A .B }}`, `{{ if eq .Type "post" }}` - die keine
  BoxLang-Infix-Entsprechung haben; nur die `.Field`-Tokens darin zu
  ersetzen würde weiterhin ungültigen BoxLang-Text hinterlassen, daher
  wird die gesamte Bedingung stattdessen durch den Platzhalter ersetzt).
- Jede Variablenreferenz, die nicht in der festen Mapping-Tabelle steht.

## Nach dem Import

Das Gerüst ist ein Ausgangspunkt, kein fertiges Theme - arbeite die
gemeldeten TODO-Marker und Warnungen durch, und prüfe es dann gegen den
[ThemeProvider-Vertrag](themes.md#der-themeprovider-vertrag) auf
dieselbe Weise, wie es auch ein handgeschriebenes Theme müsste
(`layout.bxm`+`page.bxm` erforderlich, `search.bxm` optional). Keine der
Seiten-Feature-Konventionen, die jedes integrierte Theme implementiert
(Dunkelmodus, Breadcrumbs, Vorherige/Nächste, die Suchbox, ...) kommt
automatisch mit - das eigene Markup des Quell-Themes dafür, falls
vorhanden, durchlief dieselbe mechanische Übersetzung wie alles andere
und braucht dieselbe Überprüfung.
