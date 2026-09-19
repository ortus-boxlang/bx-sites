---
title: Content-Quelle
order: 0.5
icon: phosphor-duotone:folder-open
tags: [anleitungen, konfiguration]
---

# Content-Quelle

Jedes Projekt hat genau einen Content-Root - den Ordner, den bxSites nach
`.md`-Seiten, `assets/`, `blog/`, `i18n/`, `versions/` und allem anderen
durchsucht, was an anderer Stelle in diesen Docs beschrieben wird. Diese
Anleitung behandelt, wie dieser Ordner gefunden wird, wie du ihn mit
`source` woanders hinlenkst, wie du mit `exclude` streunende Dateien aus
dem Scan heraushältst, und wo die eigene Theme-Überschreibung eines
Projekts relativ dazu liegt.

## Automatische Erkennung (der Standard)

Ist überhaupt kein `source`-Schlüssel gesetzt, sucht bxSites zuerst nach
`docs/`, dann nach `src/`, und verwendet, welcher der beiden tatsächlich
auf der Festplatte existiert - dieselbe altbewährte Konvention, die
bereits in [Erste Schritte](../getting-started.md#seiten-hinzufügen)
beschrieben ist. Für die meisten Projekte reicht das, ganz ohne
Konfiguration.

## Der Konfigurationsschlüssel `source`

Setze `source` in `bxsites.yaml`, um die automatische Erkennung zu
überspringen und explizit anzugeben, wo dein Content liegt:

=== "YAML"
    ```yaml title="bxsites.yaml"
    source: docs
    ```

=== "JSON"
    ```json title="bxsites.json"
    { "source": "docs" }
    ```

=== "TOML"
    ```toml title="bxsites.toml"
    source = "docs"
    ```

`source` akzeptiert:

- `docs` oder `src` - dieselben zwei konventionellen Namen, die die
  automatische Erkennung ohnehin bereits prüft, hier nur explizit
  ausgeschrieben statt abgeleitet.
- Jeden anderen Ordnernamen - `content`, `pages`, `website`, was immer zu
  deinem Projekt passt. Die automatische Erkennung sucht ausschließlich
  nach `docs`/`src`; ein eigener Name braucht immer ein explizites
  `source`.
- `.` - das Projekt-Wurzelverzeichnis selbst ist der Content-Root, ganz
  ohne Unterordner. Nützlich für ein Projekt, das *ausschließlich* eine
  Docs-Website ist - sonst nichts weiter im Repo -, bei dem eine
  zusätzliche `docs/`-Ebene obendrauf nur ein weiterer Ordner zum
  Navigieren wäre. `build`/`serve`/jedes andere Verb durchsucht dann das
  gesamte Projekt-Wurzelverzeichnis nach `.md`-Seiten, genau so, wie sie
  sonst `docs/` durchsuchen würden.

`bxSites new` schreibt immer ein explizites `source:` in das
`bxsites.yaml`, das es aufsetzt (standardmäßig `docs`, oder was immer du
über `--source=...` übergeben hast) - siehe
[Erste Schritte](../getting-started.md#ein-projekt-aufsetzen) -, sodass
bei einem frisch angelegten Projekt nie unklar ist, wo sein Content liegt,
selbst bevor die automatische Erkennung überhaupt ins Spiel käme.

Ein Name ist in jedem Fall tabu: `source: site` schlägt immer fehl, da
`site/` die eigene generierte Build-Ausgabe von bxSites ist - jeder Build
entfernt und erzeugt sie neu, sodass sie zugleich als Quellordner zu
verwenden bedeuten würde, dass ein Build seinen eigenen Content löscht.

## Der Fehler `BxSites.SourceNotConfigured`

Bleibt `source` ungesetzt **und** existiert weder `docs/` noch `src/` auf
der Festplatte, schlägt der Build laut fehl, statt stillschweigend auf
das Projekt-Wurzelverzeichnis zurückzufallen:

```text
BxSites.SourceNotConfigured: No docs/ or src/ folder found, and no
[source] set in bxsites.yaml - set source: docs, source: src, or
source: . (if your whole repo is the content) to tell bxSites where
your content lives
```

Das ist Absicht - zu raten "das Projekt-Wurzelverzeichnis muss der
Content sein", sobald keiner der beiden konventionellen Ordner existiert,
würde stillschweigend Dinge wie `README.md`, eine `CHANGELOG.md`,
CI-Konfiguration oder den eigenen Quellcode eines Repos in einen Build
hineinziehen, sobald jemand `docs/` in etwas anderes umbenannt hat, oder
bxSites gegen ein Repo laufen lässt, das nie als Docs-Website gedacht
war. Die Korrektur ist immer eine einzige Zeile in `bxsites.yaml`:

=== "YAML"
    ```yaml title="bxsites.yaml"
    source: .
    ```

=== "JSON"
    ```json title="bxsites.json"
    { "source": "." }
    ```

=== "TOML"
    ```toml title="bxsites.toml"
    source = "."
    ```

(oder `source: docs`/`source: src`, falls du eines davon gemeint hast und
der Ordner einfach noch nicht existiert - lege ihn an, oder richte
`source` auf den Ort, an dem der Content tatsächlich liegt).

## Dateien und Ordner ausschließen

bxSites schließt von sich aus immer eine Handvoll Namen vom Content-Scan
aus - `.git`, `.github`, `node_modules`, `boxlang_modules`, `site`,
`.theme`, `.themes` und die eigene Konfigurationsdatei
(`bxsites.yaml`/`.yml`/`.toml`/`.json`, `box.json`) -, genau so, wie es
bereits `assets/`, `versions/`, `i18n/`, `blog/` und `includes/` davon
ausschließt, als reguläre Seiten gescannt zu werden. `exclude` fügt deine
eigenen Namen zu dieser Liste hinzu:

=== "YAML"
    ```yaml title="bxsites.yaml"
    source: .
    exclude:
      - tests
      - build
      - CONTRIBUTING.md
    ```

=== "JSON"
    ```json title="bxsites.json"
    {
    	"source": ".",
    	"exclude": ["tests", "build", "CONTRIBUTING.md"]
    }
    ```

=== "TOML"
    ```toml title="bxsites.toml"
    source = "."
    exclude = [ "tests", "build", "CONTRIBUTING.md" ]
    ```

Jeder Eintrag ist ein bloßer Name, abgeglichen auf dieselbe Weise wie die
eingebauten Ausschlüsse - an der Wurzel des Content-Ordners, oder
irgendwo darunter.

Am nützlichsten ist das zusammen mit `source: .`. Sobald das gesamte
Repository der Content-Root ist, muss alles darin, was selbst keine Seite
ist, explizit benannt werden - ein `tests/`-Ordner, ein
`build/`-Ausgabeverzeichnis, Tooling-Konfiguration, oder alles andere,
das sonst gescannt und veröffentlicht würde, als wäre es eine Docs-Seite.
`exclude` ist bewusst *nicht* vorab mit `README.md`/`LICENSE.md`/
`CHANGELOG.md` gefüllt, allerdings - ein Projekt darf durchaus eine echte
Content-Seite unter genau einem dieser Namen haben (die eigene
`docs/license.md` dieses Moduls zum Beispiel), also melde bei einem
`source: .`-Projekt, dessen `README.md`/`LICENSE.md`/`CHANGELOG.md` an
der Wurzel nicht als Seite veröffentlicht werden soll, jeden davon
einzeln über `exclude` ab, statt dich darauf zu verlassen, dass es von
selbst passiert.

Siehe [Konfiguration: `exclude`](../configuration.md#exclude) für den
vollständigen Referenzeintrag.

## Wo eine Theme-Überschreibung lebt

Die eigene Theme-Überschreibung eines Projekts - ein handgeschriebenes
`.theme/` (siehe
[Themes: Ein Theme überschreiben](themes.md#ein-theme-überschreiben))
oder ein über `install:theme` installiertes `.themes/<name>/` (siehe
[Themes: Ein veröffentlichtes Theme installieren](themes.md#ein-veröffentlichtes-theme-installieren))
- lebt **innerhalb des aufgelösten Content-Root**, nicht im bloßen
Projekt-Wurzelverzeichnis: `<contentRoot>/.theme/` und
`<contentRoot>/.themes/<name>/`, wobei `<contentRoot>` das ist, worauf
`source` (oder die automatische Erkennung) auflöst - `docs/`, `src/`,
ein eigener Ordnername, oder das Projekt-Wurzelverzeichnis selbst bei
`source: .`.

```text title="Project structure"
my-project/
├── bxsites.yaml          ← source: docs
└── docs/                 ← the resolved content root
    ├── index.md
    ├── assets/
    └── .theme/            ← lives inside docs/, not at the project root
        ├── layout.bxm
        └── page.bxm
```

`.theme`/`.themes` innerhalb des Content-Root zu halten statt im bloßen
Projekt-Wurzelverzeichnis zählt vor allem, sobald ein Repository mehr als
eine Projekt-Wurzel enthält - siehe
[Multi-Domain-Monorepos](multi-domain.md) für genau dieses Muster. Die
eigene Theme-Überschreibung jeder Projekt-Wurzel liegt dann eindeutig
direkt neben dem Content, den sie themet, ganz ohne die Frage, zu
welcher Domain ein bloßer, oberster `theme/`-Ordner eigentlich gehört
hätte.
