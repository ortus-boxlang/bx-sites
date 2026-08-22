---
title: Erste Schritte
order: 2
icon: phosphor-duotone:rocket-launch
summary: Installiere das Modul, erstelle ein Projekt und baue deine erste Website.
tags: [anleitungen, einrichtung]
---

# Erste Schritte

## Installation

BX Docs benötigt [bx-markdown](https://github.com/ortus-boxlang/bx-markdown)
für das Rendern von Markdown, [bx-esapi](https://github.com/ortus-boxlang/bx-esapi)
für die HTML-Kodierung und [bx-yaml](https://github.com/ortus-boxlang/bx-yaml)
zum Lesen von `bxdocs.yaml`. Mit installiertem
[CommandBox](https://commandbox.ortusbooks.com/):

```bash
box install bx-docs
box install bx-markdown
box install bx-esapi
box install bx-yaml
```

Oder, ohne CommandBox, installiert BoxLangs eigener Installer alle vier mit
einem Befehl:

```bash
install-bx-module bx-docs bx-markdown bx-esapi bx-yaml
```

`box install`/`install-bx-module` liest `boxlang.executable` aus `box.json`
und legt ein `bxDocs`-Skript in deinem `PATH` ab (in `~/.boxlang/bin`), sodass
jeder Befehl unten entweder als kurzer, eigenständiger Befehl funktioniert:

```bash
bxDocs <verb> [options]
```

oder überall dort, wo BoxLang zwar verfügbar ist, dieser `PATH`-Shim aber
nicht (ein CI-Runner, ein von Hand statt per Installation registriertes
Modul) - beide Formen führen genau dasselbe aus:

```bash
boxlang module:bxdocs <verb> [options]
```

Der Rest dieser Anleitung verwendet die Kurzform.

## Ein Projekt aufsetzen

```bash
bxDocs new my-docs
cd my-docs
```

Das erzeugt:

```
my-docs/
├── docs/
│   ├── assets/
│   └── index.md
└── bxdocs.yaml
```

Übergib `--theme=material` oder `--theme=tailwind`, um mit einem anderen
Standard-Theme zu starten, und `--name="My Project Docs"`, um den
Website-Namen direkt festzulegen - andernfalls leitet `new` ihn aus dem Namen
des Zielverzeichnisses ab.

### Format der Konfigurationsdatei

`bxdocs.yaml` ist das Standard- und bevorzugte Format - es ist das, was `new`
erzeugt, sofern nichts anderes angegeben wird, und jedes Beispiel in dieser
Anleitung und in [Konfiguration](configuration.md) zeigt es zuerst.
`bxdocs.json` wird ebenfalls vollständig unterstützt, für ein Projekt, das
es bevorzugt: übergib `--format=json`, um stattdessen eines zu erzeugen,
oder schreibe/benenne eines einfach selbst von Hand um - der ConfigLoader
löst auf, welche von `bxdocs.yaml`/`.yml`/`.json` tatsächlich vorhanden ist,
in dieser Reihenfolge, ohne dass etwas anderes konfiguriert werden muss, um
zu wechseln. Siehe [Konfiguration](configuration.md) für die vollständige
Schlüsselreferenz in beiden Formaten.

Hast du bereits Inhalte in GitBook? `bxDocs migrate --source=/path/to/export`
wandelt einen GitBook-Export direkt in `docs/` um - siehe
[Migration von GitBook](guides/migrating-from-gitbook.md) - und du kannst
direkt zu [Build](#build) springen.

## Seiten hinzufügen

Jede `.md`-Datei unter `docs/` wird zu einer Seite. Ordnerverschachtelung wird
automatisch zu Navigationsverschachtelung:

```
docs/
├── index.md              -> /
├── guides/
│   ├── index.md          -> /guides/
│   └── deployment.md     -> /guides/deployment/
```

(Eine große Website kann diese abgeleitete Reihenfolge/Gruppierung
vollständig durch eine explizite Navigation ersetzen - siehe
[`nav`](configuration.md#nav).)

### Zwischen Seiten verlinken

Verlinke eine andere Seite auf die übliche mkdocs-Art - ein dateirelativer
Pfad zu ihrer `.md`-Quelldatei, genau als lägen die beiden Dateien
nebeneinander auf der Festplatte (denn genau das tun sie):

```markdown
See [Deployment](guides/deployment.md) or, from that same guide,
[back to Getting Started](../getting-started.md#add-pages).
```

BX Docs schreibt jeden solchen Link zur Build-Zeit auf seine gebaute
Pretty-URL um (`guides/deployment.md` -> `/guides/deployment/index.html`,
Anker und Query-Strings bleiben erhalten), aufgelöst relativ zum eigenen
Ordner der *verlinkenden* Seite - `../`- und Geschwister-Referenzen
funktionieren genau wie bei der Auflösung jedes anderen relativen Pfads.
Das ist auch der Grund, warum der Link weiterhin funktioniert, wenn du die
Datei direkt auf GitHub liest statt auf der gebauten Website: Es ist so
oder so ein echter, gültiger relativer Pfad zu einer echten Datei.
Absolute URLs, `mailto:` sowie Links, die bereits mit `/` beginnen, bleiben
unangetastet.

### Eine Seite als Markdown herunterladen

Zu jeder gebauten Seite wird auch ihre ursprüngliche `.md`-Quelldatei direkt
mit veröffentlicht - `docs/guides/deployment.md` landet als
`site/guides/deployment.md`, direkt neben
`site/guides/deployment/index.html` - mit einem "Markdown herunterladen"-Link
auf der Seite selbst, neben "Diese Seite bearbeiten". Keine Konfiguration
nötig, immer aktiv.

Das folgt derselben Motivation wie [`llms.txt`](../configuration.md#llmstxt) -
ein Mensch (oder eine KI) kann die rohe Markdown-Quelle einer Seite direkt
abrufen, statt gerendertes HTML zu scrapen - und da der gesamte
`docs/`-Baum 1:1 gespiegelt wird, funktionieren auch die relativen Links
einer Seite weiterhin, wenn sie so gelesen wird.

Jede Seite kann mit einem kleinen Frontmatter-Block beginnen:

```markdown
---
title: Deployment
order: 2
hidden: false
description: How to deploy a built BX Docs site.
tags: [guides, deployment]
icon: 🚀
summary: Everything you need to publish a built site.
ogImage: assets/deployment-card.png
---

# Deployment

Your content here.
```

- `title` - überschreibt den Navigations-/Seitentitel (andernfalls aus dem Dateinamen abgeleitet)
- `order` - steuert die Reihenfolge unter Geschwisterelementen in der Navigation (kleinere Werte zuerst; Seiten ohne Angabe sortieren zuletzt, alphabetisch)
- `hidden` - `true` schließt die Seite aus der Navigation (und der Suche) aus, ohne sie vom Build auszuschließen
- `description` - die Social-Card-/Meta-Beschreibung dieser Seite (siehe
  [`ogImage`](configuration.md#ogimage)); fällt, wenn nicht gesetzt, auf die
  websiteweite `description` in der Website-Konfiguration zurück
- `tags` - ein Array von Tags für diese Seite, dargestellt als klickbare
  Badges unter dem Titel und gesammelt in einer websiteweiten
  `/tags/`-Indexseite (wird erst gebaut, sobald mindestens eine Seite Tags
  hat); erhöht außerdem die Suchrelevanz bei passenden Anfragen
- `icon` - wird neben dem Seitentitel und ihrem Navigationseintrag angezeigt -
  ein reines Emoji oder ein benannter Icon-Verweis aus einer mitgelieferten
  Bibliothek (`rocket`, `lucide:rocket`, `tabler:rocket`, oder ein eigenes
  `custom:my-icon` eines Projekts) - siehe
  [Themes: Icons](guides/themes.md#icons)
- `summary` - eine einzeilige Einleitung, die unter dem Titel angezeigt wird
  (zu unterscheiden von `description`, die nur für Meta-Tags gedacht ist und
  nie auf der Seite selbst gerendert wird)
- `ogImage` - überschreibt das Social-Card-Bild nur für diese eine Seite -
  siehe [`ogImage`](configuration.md#ogimage)

Frontmatter-Werte können Inline-Listen (`tags: [a, b, c]`), YAML-artige
Blocklisten (`tags:` gefolgt von eingerückten `- item`-Zeilen) oder
`>`/`|`-Block-Skalare für einen mehrzeiligen Wert sein - es handelt sich
allerdings um einen kleinen, selbst geschriebenen Parser, nicht um
vollständiges YAML, verschachtelte Objekte/Maps werden also nicht
unterstützt.

## Build

```bash
bxDocs build
```

Rendert jede Seite in `docs/` zu einer statischen Website in `site/`, bereit
zum Hosten überall dort, wo statische Dateien ausgeliefert werden können.

## Lokal ausliefern

```bash
bxDocs serve
```

Baut das Projekt, liefert `site/` unter `http://127.0.0.1:8080/` aus und
baut automatisch neu, sobald du eine Änderung unter `docs/`, deiner
`bxdocs.yaml`/`.json`-Website-Konfiguration oder einem projektweiten
`theme/`-Override speicherst - dein Browser lädt von selbst neu. Übergib `--port=3000` oder `--host=0.0.0.0`, um zu ändern,
woran gebunden wird.

## Clean

```bash
bxDocs clean
```

Entfernt `site/` und jeglichen Build-Cache, ohne deine `docs/`-Quelle
anzurühren.
