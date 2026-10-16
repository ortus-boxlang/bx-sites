---
title: Multi-Domain-Monorepos
order: 0.6
icon: phosphor-duotone:stack
tags: [anleitungen, konfiguration, deployment]
---

# Multi-Domain-Monorepos

Mehr als eine unabhängige Website aus einem einzigen Git-Repository zu
betreiben - etwa eine Marketing-Website und eine separate Docs-Website,
oder eine Handvoll Produkt-Websites, die sich der Einfachheit halber ein
Repo teilen - braucht nichts Besonderes von bxSites. Jede Website ist
einfach ihre eigene **Projekt-Wurzel**: ihr eigenes `bxsites.yaml` plus
ihr eigener Content-Ordner, unabhängig gebaut, ausgeliefert und deployt,
indem bxSites auf genau diesen einen Ordner gerichtet wird. Ein
"Monorepo mit mehreren Domains" ist schlicht ein Repository, das mehrere
dieser Projekt-Wurzeln nebeneinander enthält.

## Das Muster

Der eigene Ort von `bxsites.yaml` ist immer dort, wohin die explizite
Projekt-Wurzel der CLI zeigt - das aktuelle Arbeitsverzeichnis, oder ein
explizites `--projectRoot=<path>` (oder ein bloßer positionaler Pfad). Es
gibt keine Aufwärtssuche durch übergeordnete Verzeichnisse und kein
separates Konzept einer "Repo-Wurzel" gegenüber einer "Projekt-Wurzel" -
jedes Verb löst pro Aufruf einfach eine Projekt-Wurzel auf und sucht dort
direkt nach `bxsites.yaml` (oder `.yml`/`.toml`/`.json`). Ein Monorepo mit
mehreren Domains ist nichts weiter als ein Repository, das mehrere davon
enthält, jede für sich unabhängig vollständig:

```text title="Project structure"
my-monorepo/
├── marketing/
│   ├── bxsites.yaml        ← source: .  (or docs - marketing's own choice)
│   ├── index.md
│   ├── about.md
│   └── .theme/               ← marketing's own theme override, if any
└── docs-site/
    ├── bxsites.yaml        ← source: docs
    └── docs/
        ├── index.md
        ├── guides/
        └── .theme/            ← docs-site's own theme override, if any
```

Jedes von `marketing/` und `docs-site/` oben ist ein vollständiges,
eigenständiges bxSites-Projekt - mit eigenem `bxsites.yaml`, eigenem
Content-Root (aufgelöst über den eigenen `source`-Schlüssel dieses
Projekts, oder automatische Erkennung - siehe
[Content-Quelle](content-source.md)) und einer eigenen
`.theme`/`.themes`-Überschreibung, die innerhalb *dieses* Content-Root
lebt. Nichts davon ist neu oder monorepo-spezifisch; es ist genau das
Ein-Projekt-Wurzel-Verhalten, das bxSites schon immer hatte, nur mit mehr
als einer Projekt-Wurzel im selben Repository eingecheckt.

Verschachtele sie, wie es zum Repo passt - als Geschwister an der Wurzel
(wie oben), unter einem gemeinsamen `sites/`-Elternordner, oder wo sonst
sinnvoll; bxSites interessiert sich nur für den Pfad, den du ihm über
`--projectRoot` übergibst, nicht dafür, wo dieser Pfad relativ zum Rest
des Repos liegt.

## Eine Domain bauen

Richte `--projectRoot` (oder einen bloßen positionalen Pfad) auf die
Projekt-Wurzel, die du bauen willst - jedes Verb akzeptiert das, nicht
nur `build`:

```bash frame="terminal" title="Terminal"
bxSites build --projectRoot=marketing
bxSites build --projectRoot=docs-site
```

Jeder Befehl löst sein eigenes `bxsites.yaml`, seinen eigenen Content-Root
und seine eigene Theme-Überschreibung völlig unabhängig auf - das Bauen
von `marketing/` rührt niemals die eigene `site/`-Ausgabe, Konfiguration
oder das Theme von `docs-site/` an, und umgekehrt. Es gibt keinen
gemeinsamen Build-Schritt und keine domainübergreifende
Reihenfolge-Vorgabe; baue, welche Domains sich geändert haben, in
welcher Reihenfolge du willst.

## Eine Domain als Vorschau ausliefern

`serve` funktioniert genauso - es zeigt zu jedem Zeitpunkt die Vorschau
genau einer Projekt-Wurzel:

```bash frame="terminal" title="Terminal"
bxSites serve --projectRoot=docs-site
```

Um eine andere Domain als Vorschau anzuzeigen, stoppe `serve` und starte
es erneut mit einem anderen `--projectRoot` (oder aus einem anderen
Arbeitsverzeichnis). Zwei Domains, die beide gleichzeitig eine
Live-Vorschau brauchen, benötigen einfach zwei separate
`serve`-Prozesse, jeder mit eigenem `--projectRoot` und (bei
gleichzeitigem Lauf) eigenem `--port`.

## Jede Domain in CI bauen

Da jede Domain ein unabhängiger `bxSites build --projectRoot=<path>`-Aufruf
ist, iteriert CI einfach über die Liste der Projekt-Wurzeln:

```yaml title=".github/workflows/build-sites.yml" linenums="1"
name: Build sites
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        project: [marketing, docs-site]
    steps:
      - uses: actions/checkout@v4
      - name: Install BoxLang + bx-sites
        run: |
          /bin/bash -c "$(curl -fsSL https://install.boxlang.io)"
          export BOXLANG_INSTALL_HOME="/usr/local/boxlang"
          export PATH="/root/.boxlang/bin:/usr/local/bin:$PATH"
          install-bx-module bx-sites
      - name: Build ${{ matrix.project }}
        run: bxSites build --projectRoot=${{ matrix.project }}
      - uses: actions/upload-artifact@v4
        with:
          name: site-${{ matrix.project }}
          path: ${{ matrix.project }}/site/
```

Eine einfache Bash-Schleife funktioniert außerhalb eines Matrix-Builds
genauso gut, und macht es leicht, den gesamten Job fehlschlagen zu
lassen, sobald eine einzige Domain nicht baut:

```bash frame="terminal" title="Terminal"
for project in marketing docs-site; do
	echo "Building $project..."
	bxSites build --projectRoot="$project" || exit 1
done
```

Die eigene `site/`-Ausgabe jeder Domain wird auf dieselbe Weise deployt
wie die eines Einzel-Website-Projekts - siehe
[Deployment](deployment.md) - nur eben einmal pro Domain, gerichtet auf
die eigenen `deployments/*.json` dieser Domain und ihren eigenen
`<project>/site/`-Ordner.

## Keine domainübergreifende Kollision

Weil `.theme`/`.themes` innerhalb des eigenen Content-Root jeder Domain
liegen (siehe
[Content-Quelle: Wo eine Theme-Überschreibung lebt](content-source.md#wo-eine-theme-überschreibung-lebt))
statt in einer bloßen, gemeinsamen Projekt-Wurzel, kann jede von zwei
Domains im selben Monorepo ihre eigene Theme-Überschreibung tragen, ohne
jedes Risiko, dass eine die andere überschattet - `marketing/.theme/`
und `docs-site/docs/.theme/` sind zwei vollständig getrennte Ordner,
unabhängig voneinander vom Build der jeweiligen Domain aufgelöst.
Dasselbe gilt für alles andere Projektbezogene - `bxsites.yaml`,
`deployments/*.json`, `docs/versions/`, `docs/i18n/` - die eigene Kopie
jeder Domain gehört exakt dieser Domain, ohne dass etwas geteilt wird,
außer du skriptest das Teilen selbst (zum Beispiel, indem du eine
gemeinsame `extraCss`-Datei vor dem Bauen in jede Domain kopierst).
