---
title: CLI-Referenz
order: 3
icon: phosphor-duotone:terminal-window
summary: Jedes bxSites-Verb und seine Optionen.
tags: [referenz, cli]
---

# CLI-Referenz

```bash
bxSites <verb> [options]
```

`box install bx-sites` legt ein eigenständiges `bxSites`-Skript in deinem
`PATH` ab (über `boxlang.executable` in `box.json`), sodass jedes Verb
unten entweder auf diese kurze Art ausgeführt werden kann, oder als
`boxlang module:bxsites <verb>` - beide führen genau dasselbe aus; nutze die
längere Form überall dort, wo der `PATH`-Shim nicht eingerichtet ist (ein
CI-Runner, ein von Hand registriertes Modul):

```bash
boxlang module:bxsites <verb> [options]
```

Jedes Verb akzeptiert `--projectRoot=<path>` (oder einen einfachen
positionalen Pfad), um ein anderes Projekt als das aktuelle Verzeichnis
anzusprechen, und die beiden globalen Flags unten können vor jedem Verb
stehen.

## Globale Optionen

| Flag | Beschreibung |
|---|---|
| `-h`, `--help` | Nutzung anzeigen und beenden |
| `-v`, `--version` | Modulversion anzeigen und beenden |

## `new`

Ein Docs-Projekt aufsetzen.

```bash
bxSites new [path] [--name=...] [--theme=bootstrap|material|tailwind] [--description=...] [--format=yaml|json]
```

- `--name` - der in die Website-Konfiguration geschriebene Website-Name (Standard: der Name des Zielverzeichnisses)
- `--theme` - Standard ist `bootstrap`
- `--description` - die in die Website-Konfiguration geschriebene Website-Beschreibung
- `--format` - `yaml` (Standard, erzeugt `bxsites.yaml`) oder `json` (erzeugt `bxsites.json`) - siehe [Konfiguration](configuration.md)

## `build`

Rendert `docs/**.md` zu einer statischen Website in `site/`. Baut
außerdem den Suchindex (sofern `search` in der Website-Konfiguration nicht
`false` ist) und kopiert Theme + `docs/assets/**` nach `site/`.

```bash
bxSites build
```

## `serve`

Baut und liefert die Website lokal mit Live-Reload aus.

```bash
bxSites serve [--port=8080] [--host=127.0.0.1]
```

Läuft im Vordergrund, bis es unterbrochen wird (Strg+C).

## `search-index`

Baut `site/search-index.json` eigenständig neu, ohne Seiten neu zu
rendern oder Assets zu kopieren. `build` führt diesen Schritt bereits
automatisch mit aus - dieses Verb existiert für den Fall, dass du nur den
Index auffrischen musst. Deckt immer nur den Haupt-`docs/`-Baum ab, auch
bei einem Projekt mit `docs/versions/`/`docs/i18n/` - ein echter `build`
schreibt stattdessen den eigenen, begrenzten Index jedes Baums (siehe
[Versionierung](guides/versioning.md#whats-out-of-scope-for-now)).

```bash
bxSites search-index
```

## `clean`

Entfernt `site/` und jeglichen Build-Cache, lässt `docs/` und die
Website-Konfiguration unangetastet.

```bash
bxSites clean
```

## `gh-deploy`

Baut die Website und pusht sie dann per Force-Push in einen
`gh-pages`-artigen Branch - ein Commit pro Deploy, keine angesammelte
Historie auf diesem Branch, passend zu mkdocs' eigener
`mkdocs gh-deploy`-Konvention. Erfordert, dass das Projekt ein
Git-Repository mit konfiguriertem Remote ist; rührt niemals deinen
eigenen aktuellen Branch oder dein Arbeitsverzeichnis an (der Push erfolgt
aus einem temporären `git worktree`).

```bash
bxSites gh-deploy [--branch=gh-pages] [--remote=origin] [--message="..."]
```

- `--branch` - Standard ist `gh-pages`
- `--remote` - Standard ist `origin`
- `--message` - die einzelne Commit-Nachricht des Branches, Standard ist `"Deploy site via bxSites gh-deploy"`

Siehe [Deployment](guides/deployment.md) für die vollständige
GitHub-Pages-Einrichtung (Pages für den Branch aktivieren, `baseURL` usw.).

## `migrate`

Wandelt einen GitBook-Export - ein `SUMMARY.md`-Inhaltsverzeichnis plus
dessen `.md`-Dateien, GitBooks eigenes Sync-Format auf der Festplatte -
in den `docs/`-Baum dieses Projekts um: `SUMMARY.md` wird zu
`docs/nav.json`, `{% block %}`-Syntax wird zu ihrem bx-sites-Äquivalent
(`::: name`-Direktiven, oder die native `=== "Title"`-Tab- bzw.
`!!! type`-Admonition-Syntax, wo bereits eine treffendere Entsprechung
existiert - siehe
[Content-Blöcke](guides/content-blocks.md)),
`README.md`-Dateien werden zu `index.md`, und `.gitbook/assets/**` wird
nach `docs/assets/gitbook/` kopiert.

```bash
bxSites migrate --source=/path/to/gitbook-export
```

- `--source` (erforderlich) - Pfad zum Wurzelverzeichnis des GitBook-Exports (muss `SUMMARY.md` enthalten)

Gibt eine Zusammenfassung der konvertierten Seiten aus und, wenn etwas
nicht automatisch konvertiert werden konnte (ein nicht unterstützter
Block wie `{% prompt %}`, ein nicht erkannter Hint-Stil, eine
Spaltenbreite, die keine reine Länge ist), eine Liste dessen, was manuell
geprüft werden muss - nichts wird stillschweigend verworfen, ein nicht
erkannter Block wird stattdessen in der migrierten Datei in seiner
ursprünglichen `{% %}`-Syntax belassen. Eine bereits existierende
Zieldatei oder `docs/nav.json` wird überschrieben (ebenfalls gemeldet),
prüfe daher die migrierte Ausgabe, bevor du sie committest.
