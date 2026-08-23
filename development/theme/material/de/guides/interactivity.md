---
title: Interaktivität mit Alpine.js
order: 9
icon: phosphor-duotone:lightning
tags: [anleitungen, alpine, interaktivitat]
---

# Interaktivität mit Alpine.js

Jede von BX Sites gebaute Seite lädt bereits [Alpine.js](https://alpinejs.dev/)
- es treibt den eingebauten Dunkelmodus-Umschalter und das
Sprachdropdown in jedem der drei integrierten Themes an. Genau dieselbe
Alpine-Instanz steht auch deinem eigenen Seiteninhalt kostenlos zur
Verfügung: keine `bxsites.json`-Einstellung zum Umlegen, kein
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

Alpine ist für den interaktiven Inhalt gedacht, den diese nicht
abdecken - alles mit eigenem clientseitigem Zustand.

## Ein Kopieren-in-die-Zwischenablage-Button

Ein häufiger Fall: ein Button neben einem Installationsbefehl, der ihn
kopiert und die Kopie bestätigt:

```markdown title="Copy button" linenums="1"
<div x-data="{ copied: false }">
  <button type="button" @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
    <span x-show="!copied">Copy install command</span>
    <span x-show="copied" x-cloak>Copied!</span>
  </button>
</div>
```

<div x-data="{ copied: false }">
  <button type="button" class="btn btn-sm btn-outline-secondary" @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
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
  `mermaid`/`math` in `bxsites.json` ausschalten.
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
</content>
