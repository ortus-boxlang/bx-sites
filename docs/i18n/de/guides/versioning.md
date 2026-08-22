---
title: Versionierung
order: 7.5
icon: phosphor-duotone:git-branch
summary: Baue Docs für mehr als eine Version gleichzeitig - lege einen Versions-Snapshot an, und jedes Theme erhält kostenlos einen Versionsumschalter.
tags: [anleitungen, versionierung]
---

# Versionierung

Versionierte Docs sind Convention over Configuration - es gibt keinen
`bxsites.json`-Schlüssel, um sie einzuschalten. Lege einen
`docs/versions/`-Ordner an, und jeder direkte Unterordner darin wird als
eigener, vollständig eigenständiger Doc-Baum gebaut, neben deinem
regulären `docs/` (das immer als "Latest" gebaut wird):

```text title="docs/-Layout"
docs/
├── index.md
├── guides/
└── versions/
    ├── 1.0/
    │   ├── index.md
    │   └── guides/
    └── 2.0/
        ├── index.md
        └── guides/
```

Jeder Versionsordner ist ein normaler, `docs/`-förmiger Baum - seine
eigene `index.md`, seine eigene Navigation, seine eigenen Seiten -
gebaut nach `site/versions/<name>/`, mit jedem internen Link
entsprechend vorangestellt, und teilt sich die einzige eigene
`bxsites.json`-Konfiguration/das Theme des Projekts. Eine lose Datei,
direkt unter `docs/versions/` abgelegt (nicht innerhalb eines
Unterordners), wird ignoriert.

## Eine neue Version anlegen

`version:new` erstellt einen Snapshot des *aktuellen* `docs/`-Baums nach
`docs/versions/<name>/` - der übliche Workflow ist: die Docs für eine
Version fertigstellen, direkt bevor du mit dem Schreiben der Docs für
die nächste beginnst eine Version anlegen, sodass der Snapshot genau
das einfriert, was ausgeliefert wurde:

```bash title="Terminal"
bxSites version:new --name=1.0
```

- `--name` (erforderlich) - das Versionsordner-/Label, z. B. `1.0`

Der Snapshot schließt `assets/`, `versions/`, `i18n/` und `blog/` aus -
jedes davon ist ein eigener, separat geladener Baum, kein Teil des
eigenen Inhalts einer Version, sie werden also nie hineindupliziert.

Es gibt kein entsprechendes "Rückgängig machen"-Verb und kein anderes
Verb zielt auf eine bestimmte Version - `page:new`/`page:rename`/
`post:new`/etc. arbeiten immer gegen den Haupt-`docs/`-Baum. Das
Bearbeiten der eigenen Seiten einer bereits angelegten Version (etwa das
Beheben eines Tippfehlers in `docs/versions/1.0/guides/setup.md`) ist
schlicht das direkte Bearbeiten dieser Datei, genau wie bei jeder
anderen Seite.

## Was gebaut wird

Jede Version wird nach `site/versions/<name>/` gebaut, mit eigener
Navigation, Breadcrumbs, Vorherige-/Nächste-Links, und `editUri`s korrekt
auf den eigenen Quellpfad dieser Version bezogen. Versionsnamen sortieren
**neueste zuerst, numerisch** statt alphabetisch - `2.0` sortiert vor
`10.0` - und jedes integrierte Theme rendert automatisch ein
Versionsumschalter-Dropdown im Header, sobald mehr als eine Version
existiert (der Haupt-"Latest"-Baum zählt als eine), nichts, wozu man
sich anmelden müsste. Der Versionswechsel hält dich, wenn möglich, auf
der äquivalenten Seite des eigenen Baums.

`sitemap.xml` und `llms.txt` enthalten die Seiten jeder Version neben
denen der Hauptwebsite - eine Version ist ein vollwertiger, vollständig
crawlbarer/verlinkbarer Teil der Website, kein verstecktes Archiv.

## Zusammenspiel mit i18n

Eine Version kann ebenfalls übersetzt werden - siehe
["Versionierte und übersetzte Docs"](i18n.md#versioned-and-translated-docs)
im eigenen i18n-Kapitel für die Konvention
`docs/versions/<name>/i18n/<code>/`, die die eigene Struktur einer
Version genauso spiegelt, wie das oberste `docs/i18n/<code>/`
`docs/` selbst spiegelt.

## Was (vorerst) außen vor bleibt {#whats-out-of-scope-for-now}

- **Die Suche ist pro Baum begrenzt, nicht über Versionen hinweg
  vereinheitlicht.** Der standardmäßige `local`-Suchanbieter schreibt
  während eines echten `build` eine eigene, separate
  `search-index.json` pro Baum - `site/search-index.json` für
  "Latest", `site/versions/2.0/search-index.json` für Version `2.0`,
  und so weiter - sodass die Suche eines Besuchers immer nur die
  Version abdeckt, die er gerade liest, nie alle Versionen auf einmal.
  Die eigenständigen CLI-Verben `search-index`/`search:query` gehen
  noch einen Schritt weiter und laden immer nur den Haupt-`docs/`-Baum,
  egal wie viele Versionen existieren, da sie für eine schnelle
  Überprüfung gegen deine aktuellen Docs in Arbeit gedacht sind, nicht
  für einen vollständigen Build - führe zuerst `build` aus, wenn du den
  echten eigenen Index einer Version brauchst. Der
  `pagefind`-Suchanbieter ist die Ausnahme: Er crawlt die *gesamte*
  gebaute `site/` in einem Durchgang, Versionen eingeschlossen - siehe
  [Suche](search.md#other-search-providers).
- **Kein Deprecated-/EOL-Flag, kein eigenes Label.** Der
  Umschalter-Eintrag einer Version ist immer nur sein Ordnername - es
  gibt keine Konfiguration, um eine als nicht mehr unterstützt zu
  markieren oder ihr angezeigtes Label unabhängig vom Ordner
  umzubenennen. Eine alte Version zu archivieren bedeutet, ihren Ordner
  an Ort und Stelle zu lassen (oder ihn zu entfernen und die
  defekten Links in Kauf zu nehmen, genau wie beim Entfernen jeder
  anderen Seite).
</content>
