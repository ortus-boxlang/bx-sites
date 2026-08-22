---
title: Suche
order: 2
tags: [anleitungen, suche]
---

# Suche

Die Suche von BX Sites ist vollständig statisch und clientseitig - derselbe
Ansatz, den [mkdocs](https://www.mkdocs.org/) standardmäßig verwendet: ein
einmal zur `build`-Zeit erstellter Index, und [lunr.js](https://lunrjs.com/)
übernimmt die eigentliche Suche im Browser des Besuchers. Es gibt keinen
Server, keine Datenbank und keinen externen Suchdienst.

## Wie es funktioniert

1. Zur `build`-Zeit durchläuft `SearchIndexer` jede nicht versteckte Seite
   und schreibt `site/search-index.json`: ein Eintrag pro Seite mit ihrem
   `title`, ihrer `url`, den `tags` aus der Frontmatter, dem Text jeder
   Überschrift auf der Seite und einer gekürzten Klartext-Kopie ihres
   Inhalts (HTML-Tags entfernt).
2. Das `search.bxm`-Partial jedes Themes rendert eine Suchbox;
   `layout.bxm` bindet sie (und die Skripte `lunr.js` + gemeinsames
   `search.js`) nur ein, wenn `search` in `bxsites.json` `true` ist.
3. Im Browser lädt das gemeinsame `assets/search.js`-Widget einmalig
   `search-index.json`, baut daraus einen `lunr`-Index (`title` am
   höchsten gewichtet, dann `tags` aus der Frontmatter, dann `headings`,
   dann der reine Fließtext) und durchsucht ihn bei jedem Tastendruck neu
   - kein Netzwerk-Roundtrip pro Anfrage.

## Tastaturkürzel

- **`/`** fokussiert die Suchbox von überall auf der Seite (außer du
  tippst bereits in ein anderes Feld) - dieselbe Konvention, die
  [mkdocs-material](https://squidfunk.github.io/mkdocs-material/)
  verwendet.
- **`Escape`** schließt das Ergebnis-Dropdown und entfernt den Fokus von
  der Suchbox.

## Ausschalten

```json
{ "search": false }
```

Überspringt den Aufbau von `search-index.json` vollständig und
überspringt die Suchbox, das vendorierte `lunr.js`-Skript sowie das
gemeinsame `search.js`-Widget auf jeder gerenderten Seite - ein Projekt
mit deaktivierter Suche liefert überhaupt nichts Suchbezogenes aus.

## Nur den Index neu aufbauen

```bash
bxSites search-index
```

Nützlich, wenn du nur `search-index.json` auffrischen musst - `build`
erledigt das bereits als einen seiner eigenen Schritte, du musst dies
also nach einem normalen Build nicht separat ausführen.
