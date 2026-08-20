---
title: Migration von GitBook
order: 7
tags: [anleitungen, migration, gitbook]
---

# Migration von GitBook

`bxDocs migrate` wandelt einen GitBook-Export - ein
`SUMMARY.md`-Inhaltsverzeichnis plus dessen `.md`-Dateien, GitBooks
eigenes Sync-Format auf der Festplatte (dasselbe, das GitHub/Git Sync
schreibt) - mit einem Befehl in einen bx-docs-`docs/`-Baum um. Alles, was
GitBooks Content-Block-System unterstützt, bildet auf etwas ab, das
bx-docs bereits hat (siehe
[Markdown-Erweiterungen](markdown.md#gitbook-style-blocks)), das Ergebnis
ist also kein grober Entwurf - es ist eine funktionierende Website.

## Einen GitBook-Export beschaffen

`bxDocs migrate` liest GitBooks eigenes Dateilayout direkt, sodass jedes
der folgenden als `--source` funktioniert:

- Ein Repository, mit dem GitBook per Git-Sync verbunden ist
  (Space-Einstellungen → **GitSync**) - zeige `--source` auf deinen
  lokalen Clone.
- GitBooks eigener **Export → Markdown**-Download, entpackt.

So oder so sollte `--source` das Verzeichnis sein, das direkt `SUMMARY.md`
enthält.

## Die Migration ausführen

```bash
# 1. Scaffold a fresh bx-docs project (skip this if you already have one)
bxDocs new my-docs
cd my-docs

# 2. Migrate the GitBook export into it
bxDocs migrate --source=/path/to/gitbook-export

# 3. Build and look at the result
bxDocs serve
```

`migrate` gibt aus, wie viele Seiten konvertiert wurden, und, wenn etwas
eine Ermessensentscheidung erforderte, genau was und wo:

```
Migrated 14 page(s) from [/path/to/gitbook-export] into my-docs/docs/, wrote my-docs/docs/nav.json

2 item(s) need a manual look:
  - guides/advanced.md: Unsupported GitBook block [{% prompt %}] - left in its original syntax, needs manual conversion
  - guides/layout.md: Column width="one-third" is not a plain length/percentage - dropped, review manually
```

Nichts wird jemals stillschweigend verworfen - ein Block, den dieses Tool
nicht zu konvertieren weiß, wird in der migrierten Datei in seiner
ursprünglichen `{% %}`-Syntax belassen, der Inhalt ist also weiterhin
vorhanden und leicht zu finden (durchsuche den migrierten `docs/`-Baum
nach `{%`, wenn du fertig bist). Ein erneuter Lauf von `migrate`
überschreibt jede Datei oder `docs/nav.json`, die er zuvor geschrieben
hat, es ist also sicher, deinen Quell-Export zu korrigieren und es erneut
auszuführen.

## Was automatisch konvertiert wird

| GitBook | Wird zu |
|---|---|
| `SUMMARY.md` | `docs/nav.json` ([Nav-Override](../configuration.md#nav)-Format), Verschachtelung bleibt erhalten |
| `README.md` (beliebiger Ordner) | `index.md` - bx-docs' eigene Ordner-Index-Konvention |
| Die `title`/`description`/`tags`-Frontmatter einer Seite | Unverändert in die eigene bx-docs-Frontmatter der migrierten Datei übernommen |
| `.gitbook/assets/**` | `docs/assets/gitbook/**`, mit jeder Referenz entsprechend umgeschrieben |
| `{% hint style="..." %}` | `!!! type` - eine native [Admonition](markdown.md#admonitions) |
| `{% tabs %}` / `{% tab title="..." %}` | `=== "Title"` - native [Content-Tabs](markdown.md#content-tabs) |
| `{% cards %}` / `{% card %}` | [`::: cards` / `::: card`](markdown.md#cards) |
| `{% columns %}` / `{% column width="..." %}` | [`::: columns` / `::: column`](markdown.md#columns) |
| `{% stepper %}` / `{% step %}` | [`::: stepper` / `::: step`](markdown.md#stepper) - Titel wird aus der eigenen ersten Überschrift des Schritts übernommen |
| `{% file src="..." %}` | [`::: file`](markdown.md#file) |
| `{% embed url="..." %}` | [`::: embed`](markdown.md#embed) |
| `{% content-ref url="..." %}` | [`::: page-link`](markdown.md#page-link) |
| `{% details %}` / `{% expand %}` | [`::: expandable`](markdown.md#expandable) |

Ein Block, der in deinem GitBook-Inhalt als reines Beispiel in einem
Fenced-Code-Block gezeigt wird (statt tatsächlich verwendet zu werden),
wird korrekt in Ruhe gelassen und nicht als der echte Block missverstanden.

## Was einen manuellen Blick braucht

Eine Handvoll GitBook-Blöcke hat überhaupt keine bx-docs-Entsprechung und
wird in ihrer ursprünglichen `{% %}`-Syntax belassen, statt geraten zu
werden: **Prompt** (ein KI-Generierungsblock - es gibt nichts, wogegen man
ihn nach der Migration ausführen könnte), **bedingter Inhalt**
(GitBook-Konto-basierte Sichtbarkeit, kein Konzept, das bx-docs hat), und
die **Ask-AI**-Suchleiste. Alles andere, das dieses Tool nicht erkennt -
ein vertippter Block, eine GitBook-Funktion, die nach der Entstehung
dieses Tools hinzugefügt wurde - erhält dieselbe Behandlung: unverändert
belassen, als Warnung gemeldet.

Ein paar kleinere Ermessensentscheidungen werden auf dieselbe Weise
gemeldet: ein nicht erkannter `hint`-`style` (fällt auf `note` zurück),
oder eine `column`-`width`, die keine reine CSS-Länge/-Prozentangabe ist
(wird verworfen, statt wörtlich vertraut zu werden).

**Seiten-Icons werden nicht automatisch migriert.** GitBooks eigene Docs
bestätigen nicht, dass die Icon-Zuweisung einer Seite (über den
Icon-Picker des eigenen Editors gesetzt) einen Git-Sync-Export überhaupt
übersteht - wenn die exportierte Frontmatter eines Projekts tatsächlich
ein `icon`-Feld hat, übernimmt `migrate` es opportunistisch, erwarte das
aber bei den meisten echten Exports nicht. Setze Icons stattdessen im
Nachhinein von Hand - entweder in der eigenen Frontmatter einer Seite,
oder im [eigenen `icon` eines `docs/nav.json`-Eintrags](../configuration.md#nav)
- mit einem [benannten Icon](themes.md#icons) aus einer der acht
mitgelieferten Bibliotheken (es muss nicht zu GitBooks eigenen,
Font-Awesome-basierten Icons passen; wähle einfach den Namen, der in der
eigenen Galerie von [Phosphor](https://phosphoricons.com/) - in jeder
seiner sechs Stärken - [Lucide](https://lucide.dev/icons/) oder
[Tabler](https://tabler.io/icons) richtig aussieht).

## Nach der Migration

Die migrierte `docs/nav.json` ist eine reine
[Nav-Override](../configuration.md#nav)-Datei - bearbeite sie wie jede
andere, oder lösche sie, um auf bx-docs' eigene Konvention
Ordnerstruktur-ist-Navigationsstruktur zurückzufallen. Von hier an ist es
ein normales bx-docs-Projekt: wähle ein [Theme](themes.md), überprüfe
[`bxdocs.json`](../configuration.md) und [deploye](deployment.md), sobald
du zufrieden bist.
