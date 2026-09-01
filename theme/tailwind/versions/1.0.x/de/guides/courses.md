---
title: Kurse
order: 12.6
icon: phosphor-duotone:graduation-cap
tags: [anleitungen, kurse]
---

# Kurse

Ein **Kurs** verwandelt eine Reihe von Seiten in eine geführte,
nummerierte Abfolge - Lektion 1, Lektion 2, Lektion 3 ... - mit einem
eigenen, automatisch erzeugten nummerierten Index, einer eigenen,
kursbezogenen "Lesson N of M"-Vorherige-/Nächste-Navigation (unabhängig
von der globalen Seite-zu-Seite-Reihenfolge der Website) und, sobald
eine Leserin eine Lektion öffnet, einem im eigenen Browser verfolgten
Fortschritt: welche Lektionen sie bereits abgeschlossen hat, sowie einem
"Continue where you left off"-Link zurück zur zuletzt besuchten Lektion.

## Das Manifest

Füge eine `docs/data/courses.yaml`-Datei hinzu (`.yml`/`.json`
funktionieren ebenfalls - siehe [Datendateien](data-files.md)). Jeder
Top-Level-Schlüssel ist ein Kurs; sein `lessons`-Array listet die
eigenen Seiten dieses Kurses, in Reihenfolge - die Array-Position *ist*
die Lektionsnummer:

```yaml title="docs/data/courses.yaml"
getting-started:
  title: "Getting Started with BoxLang"
  description: "A guided walkthrough from install to your first deployed site."
  lessons:
    - guides/course/introduction.md
    - guides/course/windows-installation.md
    - guides/course/mac-installation.md
    - guides/course/creating-a-new-site.md
```

Jeder `lessons`-Eintrag ist ein zu `docs/` relativer Pfad-String,
dieselbe Relativpfad-Konvention, die auch `nav.json` selbst verwendet.
Der eigene Titel/die eigene Zusammenfassung einer Lektion stammen aus
*der eigenen Frontmatter dieser Seite* - nicht im Manifest dupliziert -
sodass das Umbenennen eines Seitentitels oder das Bearbeiten ihrer
Zusammenfassung automatisch im Kursindex reflektiert wird. Mehrere Kurse
bedeuten schlicht mehrere Top-Level-Schlüssel in derselben Datei.

## Der Index

Platziere eine einzelne Zeile an einer beliebigen Stelle in deinem
Markdown, um den eigenen nummerierten Index dieses Kurses zu rendern:

```markdown
::: course id="getting-started" :::
```

Das rendert ein einziges echtes, semantisches `<ol>` - ein nummerierter
Link pro Lektion, jeder mit dem eigenen Titel und der eigenen
Zusammenfassung dieser Lektion - plus (zunächst versteckt, erst
clientseitig befüllt, sobald eine Leserin tatsächlich begonnen hat)
einen Fortschrittsbalken und einen "Continue where you left off"-Link.
Eine `id` mit Tippfehler, oder ein Kurs, dessen Lektionen nicht alle
existieren, degradiert zu einem kleinen, sichtbaren Hinweis, statt den
Build scheitern zu lassen.

## Lektionsseiten

Jede Seite, die in den `lessons` eines Kurses aufgeführt ist, erhält
automatisch einen `course`-Kontext (`page.course` - siehe
[Kontextvariablen](variables-and-functions.md#kontextvariablen)) mit
ihrer eigenen Position, ihrem eigenen Titel und einer *kursbezogenen*
Vorherige-/Nächste-Navigation - `page.course.prevLesson`/`.nextLesson`
bewegen sich immer nur innerhalb dieses einen Kurses, anders als das
globale [`page.prevPage`/`.nextPage`](variables-and-functions.md#kontextvariablen)
der Website, das unabhängig von jedem Kurs den gesamten Nav-Baum
durchläuft. Eine Lektion muss nicht angeben, zu welchem Kurs sie gehört
oder wo - das Manifest ist der eine Ort, an dem das entschieden wird,
und eine Seite kann nicht versehentlich in zwei Kursen landen (ein
Autorenfehler, den der Build mit einem klaren Fehler abfängt - siehe
[Fehler](#fehler)).

Derzeit rendert das Bootstrap-Theme diese kursbezogene Navigation - ein
"Lesson N of M"-Badge, einen kursbezogenen Vorherige-/Nächste-Pager und
einen "Mark complete"-Umschalter - direkt auf der Lektionsseite. Jedes
andere integrierte Theme berechnet `page.course` weiterhin korrekt (ein
Projekt auf einem davon kann es also bereits über ein eigenes
[Theme-Override](themes.md#ein-theme-überschreiben) sichtbar machen);
natives Chrome in den übrigen integrierten Themes steht auf der
Roadmap.

## Fortschrittsverfolgung

Sobald eine Leserin eine Lektion öffnet, teilt ein eigener, versteckter
Marker auf der Seite `course-progress.js` (in jedem integrierten Theme
gemeinsam genutzt, immer eingebunden) mit, den Besuch zu erfassen -
keine Konfiguration, kein Opt-in. Der Fortschritt lebt vollständig im
eigenen `localStorage` dieses Browsers, unter
`bxsites-course-progress-<courseId>`:

```json
{
  "firstStarted": "2026-08-30T14:02:11.000Z",
  "lastVisited": { "url": "/guides/course/mac-installation/", "at": "2026-08-30T14:22:03.000Z" },
  "completed": {
    "/guides/course/introduction/": "2026-08-30T14:05:00.000Z",
    "/guides/course/windows-installation/": "2026-08-30T14:12:44.000Z"
  }
}
```

Eine Lektion wird automatisch als abgeschlossen markiert, sobald ihre
Seite besucht wird; der "Mark complete"-/"Mark incomplete"-Umschalter
erlaubt es einer Leserin, eine versehentliche automatische Markierung
rückgängig zu machen oder eine Lektion später erneut zu markieren. Der
Kursindex liest dieselben Daten, um seine Häkchen, seinen
Fortschrittsbalken ("N of M complete") und den Fortsetzen-Link zu
befüllen.

Das ist eine reine clientseitige Erweiterung, aufgesetzt auf einen
Kurs, der auch ohne sie bereits vollständig funktioniert - sowohl der
nummerierte Index als auch der kursbezogene Vorherige-/Nächste-Pager
werden serverseitig gerendert, sodass eine Leserin mit deaktiviertem
JavaScript, oder ein Such-Crawler, weiterhin das vollständige
Grundfeature sieht: jede Lektion, korrekt nummeriert, korrekt verlinkt.
Für das Funktionieren eines Kurses ist die Fortschrittsverfolgung nicht
erforderlich; ist Storage überhaupt nicht verfügbar (privates Surfen,
blockierte Website-Daten), degradiert das stillschweigend zu "kein
Fortschritt gemerkt", niemals zu einem Fehler.

Der Fortschritt ist pro Browser, ohne Konto oder Backend dahinter - er
synchronisiert sich nicht geräteübergreifend, und es gibt keine
serverseitige Aufzeichnung darüber, wer was gelesen hat. Wenn das eine
echte Anforderung für dein Projekt ist, liegt das außerhalb dessen, was
dieses Feature heute leistet.

## Später erweitern

Zwei Dinge, die dieses Feature bewusst **noch nicht** baut, für die es
aber schon so geformt ist, dass es hineinwachsen kann, ohne ein
bestehendes `courses.yaml` zu brechen:

- **Quizze zwischen Lektionen.** Jede aufgelöste Lektion trägt intern
  bereits einen `type` (derzeit immer `"lesson"`) - eine zukünftige
  Version kann neben reinen Strings auch einen `lessons`-Eintrag
  akzeptieren, der ein kleines Objekt statt eines bloßen Pfad-Strings
  ist (z. B. `{ path: ..., type: "quiz" }`), ohne dass an einem Kurs,
  der ausschließlich bloße Pfade auflistet, irgendetwas geändert
  werden müsste.
- **Ein abschließender Test/eine Bewertung am Ende eines Kurses.** Das
  Manifest-Schema reserviert (ignoriert aber) einen optionalen
  Top-Level-Schlüssel `finalTest` pro Kurs, eigens damit das später
  landen kann, ohne eine rückwärtsinkompatible Schemaänderung -
  verwende diesen Schlüssel in deinem eigenen Manifest für nichts
  anderes.

## Warum ein Manifest, nicht Frontmatter?

Die Lektionen eines Kurses werden einmal deklariert, in `courses.yaml`
- nicht als ein über die eigene Frontmatter jeder Lektion verstreutes
Feld `course: getting-started`. Ein Pro-Seite-Feld wäre eine zweite,
nicht durchgesetzte Quelle der Wahrheit neben dem Manifest, und dass
die beiden sich widersprechen (die Frontmatter einer Lektion nennt
einen Kurs, das Manifest listet sie in einem anderen - oder gar
keinem) ist genau die Art von stillem Auseinanderdriften, die dieses
Design vermeidet. Das Manifest ist der eine Ort, an dem die Form eines
Kurses - welche Lektionen, in welcher Reihenfolge - entschieden wird;
eine Lektionsseite selbst muss nie wissen, zu welchem Kurs sie gehört,
oder wo.

## Geltungsbereich

- Ein Kurs, dessen `lessons` nicht *alle* als echte Seiten im gerade
  gebauten Baum existieren, wird für diesen Baum stillschweigend
  übersprungen, niemals ein Build-Fehler - das ist wichtig, weil
  `docs/data/courses.yaml` einmal, projektweit, geladen wird (derselbe
  Geltungsbereich, den [Datendateien](data-files.md#geltungsbereich)
  bereits hat), und unverändert über jeden Versions-/Locale-Baum hinweg
  wiederverwendet wird; ein bloßer `docs/versions/<name>/`-Snapshot
  enthält die Lektionsdateien eines Kurses möglicherweise überhaupt
  nicht.
- Eine Lektion kann nur zu einem Kurs gehören - denselben Pfad unter
  zwei verschiedenen Kursen aufzulisten, ist ein echter Autorenfehler
  und wirft einen Fehler (siehe [Fehler](#fehler)).
- Keine verschachtelten Kurse/Kurse mit mehreren Tracks, keine
  Pro-Version-Kursmanifeste mit einer je Version unterschiedlichen
  Lektionsreihenfolge, in dieser ersten Version.

## Fehler

- `BxSites.InvalidConfig` - `docs/data/courses.yaml` hat ein
  Formproblem: Ein Kurswert ist kein Objekt, hat kein `title`, sein
  `lessons` ist kein nicht-leeres Array von Pfad-Strings, oder derselbe
  Lektionspfad ist unter mehr als einem Kurs aufgeführt.
