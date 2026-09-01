---
title: Interaktivität mit Alpine.js
order: 9
icon: phosphor-duotone:lightning
tags: [anleitungen, alpine, interaktivitat]
---

# Interaktivität mit Alpine.js

Jede von BxSites gebaute Seite lädt bereits [Alpine.js](https://alpinejs.dev/)
- es treibt den eingebauten Dunkelmodus-Umschalter und das
Sprachdropdown in jedem integrierten Theme an. Genau dieselbe
Alpine-Instanz steht auch deinem eigenen Seiteninhalt kostenlos zur
Verfügung: keine `bxsites.yaml`-Einstellung zum Umlegen, kein
`extraJs`-Eintrag hinzuzufügen, kein zusätzliches `<script>`-Tag in
deinem Markdown zu schreiben.

Da [rohes block-level HTML unverändert durchgereicht
wird](images.md#bildunterschriften-ausrichtung-und-rahmung) in deinem Markdown,
kannst du Alpines `x-data`/`x-show`/`@click`/etc.-Attribute direkt auf
jeden HTML-Block legen, und es funktioniert einfach.

## Bevor du zu Alpine greifst

Die meisten "interaktiven" Bedürfnisse haben bereits einen
zweckgebauten Direktiv-Block, für den du selbst kein JS schreiben musst
- greif zuerst zu diesen:

- Ein einklappbarer Bereich → [Expandable](content-blocks.md#expandable)
  oder eine [einklappbare Admonition](markdown.md#einklappbare-admonitions)
- Gruppierter alternativer Inhalt hinter klickbaren Tabs →
  [Content-Tabs](markdown.md#content-tabs)
- Eine nummerierte Schritt-für-Schritt-Anleitung →
  [Stepper](content-blocks.md#stepper)
- Ein gestylter Call-to-Action-Link → [Buttons](content-blocks.md#buttons)
  (der Kopieren-Button unten ist ein *anderer* Fall - er hat überhaupt
  kein `href`, nur clientseitiges Verhalten - genau dafür ist Alpine da)

Alpine ist für den interaktiven Inhalt gedacht, den diese nicht
abdecken - alles mit eigenem clientseitigem Zustand.

## Ein Kopieren-in-die-Zwischenablage-Button

[`::: button`](content-blocks.md#buttons) rendert immer nur einen echten
Link (oder einen inaktiven Platzhalter) - es hat keine Vorstellung davon,
beim Klick beliebiges JS auszuführen. Für
einen Button, der stattdessen tatsächlich *etwas tut*, statt irgendwohin
zu navigieren, hänge stattdessen dessen
`bxsites-button`/`bxsites-button--*`-Klassen an ein schlichtes
HTML-`<button>` - derselbe Look, in jedem integrierten Theme gestylt, nur
mit Alpine statt mit einem `href` verdrahtet. Ein häufiger Fall: ein
Button neben einem Installationsbefehl, der ihn kopiert und die Kopie
bestätigt:

```markdown title="Copy button" linenums="1"
<div x-data="{ copied: false }">
  <button type="button" class="bxsites-button bxsites-button--secondary bxsites-button--small"
    @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
    <span x-show="!copied">Copy install command</span>
    <span x-show="copied" x-cloak>Copied!</span>
  </button>
</div>
```

<div x-data="{ copied: false }">
  <button type="button" class="bxsites-button bxsites-button--secondary bxsites-button--small"
    @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
    <span x-show="!copied">Installationsbefehl kopieren</span>
    <span x-show="copied" x-cloak>Kopiert!</span>
  </button>
</div>

## Ein Live-Filter

Eine Liste clientseitig filtern, ohne Server-Roundtrip:

```markdown title="Live filter" linenums="1"
<div x-data="{ query: '' }">
  <input type="text" x-model="query" placeholder="Filter providers...">
  <ul>
    <li x-show="'local'.includes( query.toLowerCase() )">local (static index, no server)</li>
    <li x-show="'algolia'.includes( query.toLowerCase() )">algolia (hosted DocSearch)</li>
    <li x-show="'pagefind'.includes( query.toLowerCase() )">pagefind (indexed at build time)</li>
  </ul>
</div>
```

`x-model` bindet den Wert des Eingabefelds an den Alpine-Zustand; das
`x-show` jedes `<li>` wertet bei jedem Tastendruck neu aus.

## Eine sortierbare, filterbare Tabelle

Eine [native Pipe-Tabelle](tables.md) ist statisch, sobald sie
gebaut ist - für eine, die ein Leser tatsächlich clientseitig sortieren
und filtern kann, lass stattdessen Alpine die Zeilen
besitzen: leg die Daten in `x-data` ab und rendere sie mit `x-for`, statt
die `| Feature | Status |`-Pipe-Syntax zu schreiben:

```markdown title="Sortable table" linenums="1"
<div x-data="{
  query: '',
  sortKey: 'name',
  sortAsc: true,
  rows: [
    { name: 'Bootstrap', type: 'Components', stars: 4 },
    { name: 'GitBook', type: 'SaaS', stars: 5 },
    { name: 'Docusaurus', type: 'React', stars: 4 },
    { name: 'VuePress', type: 'Vue', stars: 3 }
  ],
  sortBy(key) {
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true
    this.sortKey = key
  },
  get sorted() {
    return [...this.rows]
      .filter(r => r.name.toLowerCase().includes(this.query.toLowerCase()))
      .sort((a, b) => {
        const dir = this.sortAsc ? 1 : -1
        return a[this.sortKey] > b[this.sortKey] ? dir : a[this.sortKey] < b[this.sortKey] ? -dir : 0
      })
  }
}">
  <input type="text" x-model="query" placeholder="Filter by name...">
  <table class="table">
    <thead>
      <tr>
        <th @click="sortBy('name')" style="cursor:pointer">Name</th>
        <th @click="sortBy('type')" style="cursor:pointer">Type</th>
        <th @click="sortBy('stars')" style="cursor:pointer">Stars</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="row in sorted" :key="row.name">
        <tr>
          <td x-text="row.name"></td>
          <td x-text="row.type"></td>
          <td x-text="row.stars"></td>
        </tr>
      </template>
    </tbody>
  </table>
</div>
```

Was so gerendert wird (tippe in das Feld, klicke auf eine
Spaltenüberschrift):

<div x-data="{
  query: '',
  sortKey: 'name',
  sortAsc: true,
  rows: [
    { name: 'Bootstrap', type: 'Components', stars: 4 },
    { name: 'GitBook', type: 'SaaS', stars: 5 },
    { name: 'Docusaurus', type: 'React', stars: 4 },
    { name: 'VuePress', type: 'Vue', stars: 3 }
  ],
  sortBy(key) {
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true
    this.sortKey = key
  },
  get sorted() {
    return [...this.rows]
      .filter(r => r.name.toLowerCase().includes(this.query.toLowerCase()))
      .sort((a, b) => {
        const dir = this.sortAsc ? 1 : -1
        return a[this.sortKey] > b[this.sortKey] ? dir : a[this.sortKey] < b[this.sortKey] ? -dir : 0
      })
  }
}">
  <input type="text" x-model="query" placeholder="Filter by name...">
  <table class="table">
    <thead>
      <tr>
        <th @click="sortBy('name')" style="cursor:pointer">Name</th>
        <th @click="sortBy('type')" style="cursor:pointer">Type</th>
        <th @click="sortBy('stars')" style="cursor:pointer">Stars</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="row in sorted" :key="row.name">
        <tr>
          <td x-text="row.name"></td>
          <td x-text="row.type"></td>
          <td x-text="row.stars"></td>
        </tr>
      </template>
    </tbody>
  </table>
</div>

`rows` ist ein einfaches, direkt in die Seite gebackenes JS-Array - gut
genug für die Art kleiner Referenztabelle, die Docs tatsächlich haben.
`sorted` ist ein Alpine-`get`ter, filtert und sortiert also bei jedem
Tastendruck/Klick neu, ganz ohne zusätzliche Verdrahtung; `sortBy()`
kehrt die Richtung bei einem zweiten Klick auf dieselbe Spalte um. Das
`<table>` hier ist ein von Hand geschriebenes, echtes `<table>`-Tag (es
gibt keine Pipe-Tabellen-Syntax, um Zeilen direkt an Alpine zu übergeben),
also wird es trotzdem automatisch in `.bxsites-table-wrap` eingepackt und
erhält automatisch die Behandlung für [responsives Scrollen und eine
fixierte Kopfzeile](tables.md#responsives-scrollen-und-eine-fixierte-kopfzeile),
genau wie jede Tabelle, die bx-markdown selbst rendert.

Rows von Hand einzutippen funktioniert, aber es ist weiterhin Inhalt, der
innerhalb eines JS-Objektliterals lebt, bearbeitet weit weg vom Rest
deiner wiederverwendbaren Daten. Gehören dieselben Zeilen auch anderswo
in eine gewöhnliche Tabelle, oder auf mehrere Seiten, speist
[wiederverwendbare Daten](data-files.md) plus `$jsonAttr()` echten
`docs/data/*.yaml`-/`.json`-Inhalt in `x-data` ein, statt eines
handgetippten Arrays:

```markdown title="Server-fed rows" linenums="1"
<div x-data="{ query: '', rows: {{ $jsonAttr(data.providers) }} }">
  ...
</div>
```

Dieselbe `x-for`-/`x-model`-/Sortierlogik wie oben, nur gestützt durch
`docs/data/providers.yaml` statt eines in die Seite gebackenen Literals -
siehe [Datendateien: Daten verwenden](data-files.md#daten-verwenden) für
das vollständige Rezept (und warum es `encodeForHtmlAttribute()` braucht,
nicht nur `jsonSerialize()`, um sicher innerhalb eines mit `"..."`
gequoteten Attributs zu landen).

## `x-data`-Grundlagen, falls du neu bei Alpine bist

`x-data` deklariert den eigenen reaktiven Zustand eines Bereichs als
schlichtes JS-Objekt; alles innerhalb dieses Elements kann ihn lesen/
schreiben, und `x-show`/`x-text`/`x-model`/`@click` (Kurzform für
`x-on:click`) reagieren alle auf seine Änderung:

```markdown title="Example" linenums="1"
<div x-data="{ count: 0 }">
  <button type="button" @click="count++">Clicked <span x-text="count"></span> times</button>
</div>
```

Siehe [Alpines eigene Dokumentation](https://alpinejs.dev/start-here) für
die vollständige Liste der Direktiven (`x-if`, `x-for`, `x-transition`
und mehr).

## Wissenswertes

- **Es ist zentral, nicht optional.** Das Theme-Chrome (Dunkelmodus,
  Sprachumschalter) hängt von Alpine ab, es lässt sich also nicht wie
  `mermaid`/`math` in `bxsites.yaml` ausschalten.
- **Version.** Aktuell `alpinejs@3.14.1`, mit diesem Modul vendoriert und
  ausgeliefert von `site/assets/vendor/alpine/` - kein CDN beteiligt.
  Sieh im eigenen `layout.bxm` eines Themes nach, welches genau geladen
  wird, wenn du das exakt wissen musst.
- **Strikte CSP.** Alpines Standard-Build wertet die JS-Ausdrücke
  innerhalb von `x-data`/`@click` etc. direkt aus, was `unsafe-eval`
  unter einer strikten Content-Security-Policy braucht. Wenn dein
  Deployment das nicht erlauben kann, verlass dich in deinem
  Seiteninhalt nicht auf Alpine.
- **Leichtgewichtig halten.** Eine Docs-Seite sollte schnell und einfach
  bleiben - kleine, in sich geschlossene Widgets (ein Kopieren-Button,
  ein Filter, ein Umschalter) passen gut; eine vollständige
  clientseitige App ist nicht der Zweck davon.
