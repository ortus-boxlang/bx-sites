---
title: Konfiguration
order: 4
icon: phosphor-duotone:gear-six
summary: Jeder Konfigurationsschlüssel, sein Standardwert und was er bewirkt.
tags: [referenz, konfiguration]
---

# Konfiguration

Jedes Projekt hat eine Website-Konfiguration in seinem Wurzelverzeichnis -
`bxdocs.yaml` (oder `.yml`), das Standard- und bevorzugte Format, oder
`bxdocs.json` für ein Projekt, das dabei bleiben möchte. Beide werden
vollständig unterstützt und liefern exakt dasselbe Ergebnis; `bxDocs new`
erzeugt `bxdocs.yaml`, sofern nicht `--format=json` übergeben wird (siehe
[Erste Schritte](getting-started.md#format-der-konfigurationsdatei)). Hat
ein Projekt aus irgendeinem Grund mehr als eine, gewinnt `bxdocs.yaml`,
dann `bxdocs.yml`, dann `bxdocs.json`.

```yaml
name: "My Docs"
description: ""
baseURL: "/"
theme:
  name: bootstrap
  options: {}
  logo: ""
  favicon: ""
search: true
searchProvider:
  provider: local
  algolia: { appId: "", apiKey: "", indexName: "", insights: false }
nav: []
markdown:
  enableAdmonition: true
repo:
  url: ""
  editUri: ""
social: []
footer: false
lastUpdated: false
mermaid: false
math: false
analytics:
  provider: ""
  id: ""
ogImage: ""
generateOgImages: false
extraCss: []
extraJs: []
plugins: []
i18n:
  defaultLocale: { code: en, label: English }
  locales: []
```

Die äquivalente `bxdocs.json`, für ein Projekt, das sie bevorzugt:

```json
{
	"name": "My Docs",
	"description": "",
	"baseURL": "/",
	"theme": {
		"name": "bootstrap",
		"options": {},
		"logo": "",
		"favicon": ""
	},
	"search": true,
	"nav": [],
	"markdown": { "enableAdmonition": true },
	"repo": {
		"url": "",
		"editUri": ""
	},
	"social": [],
	"footer": false,
	"lastUpdated": false,
	"mermaid": false,
	"math": false,
	"analytics": {
		"provider": "",
		"id": ""
	},
	"ogImage": "",
	"generateOgImages": false,
	"extraCss": [],
	"extraJs": [],
	"plugins": [],
	"i18n": {
		"defaultLocale": { "code": "en", "label": "English" },
		"locales": []
	}
}
```

Nur `name` ist erforderlich - alles andere fällt auf die oben gezeigten
Standardwerte zurück. Ein teilweise angegebenes `theme`-Objekt wird eine
Ebene tief zusammengeführt, sodass `{"theme":{"name":"material"}}` allein
weiterhin die Standard-(leeren)-`options` behält. Jeder Schlüssel heißt in
beiden Formaten gleich und hat dieselbe Form; der Rest dieser Seite zeigt
der Kürze halber nur JSON, liest sich in YAML aber genauso.

## `name`

Der Name der Website, angezeigt in der Kopfzeile/Marke und in Seitentiteln.
Erforderlich.

## `description`

Eine optionale Website-Beschreibung, verwendet als Fallback für
`<meta name="description">` und `og:description` für jede Seite, die keine
eigene `description`-Frontmatter setzt (siehe
[Erste Schritte](getting-started.md#add-pages)).

## `baseURL`

Steuert, wie jeder interne Link, Asset-Pfad und Navigationseintrag
vorangestellt wird, und dient zugleich als kanonische URL der Website für
`sitemap.xml` und `llms.txt`.

- Leer gelassen oder `"/"` (Standard) - Links bleiben root-relativ
  (`/page/`), und weder `sitemap.xml` noch eine `llms.txt` mit absoluten
  URLs wird erzeugt (es gibt keine kanonische Domain, aus der sie gebaut
  werden könnten).
- Ein reiner Pfad, z. B. `"my-docs"` oder `"/my-docs/"` - es wird
  angenommen, dass die Website unter diesem Unterpfad ausgeliefert wird,
  und jeder interne Link, Navigationseintrag und jedes Asset wird damit
  vorangestellt (`/my-docs/page/`). Immer noch keine `sitemap.xml`, da es
  weiterhin keine absolute Domain gibt.
- Eine vollständige URL, z. B. `"https://docs.example.com/"` - der
  Pfadanteil (hier `/`) wird genauso verwendet wie ein reiner Pfad, **und**
  `sitemap.xml` wird zur Build-Zeit mit der absoluten URL jeder nicht
  versteckten Seite unter dieser Domain geschrieben.

`llms.txt` (siehe [unten](#llmstxt)) wird immer geschrieben; sie bevorzugt
lediglich eine absolute URL, wenn `baseURL` eine solche liefert.

## `llms.txt`

Jeder Build schreibt eine `llms.txt` in die Wurzel der Website - ein
einfacher Markdown-Index jeder nicht versteckten Seite, gemäß der
aufkommenden [llms.txt](https://llmstxt.org)-Konvention, die
LLM-basierten Tools hilft, sich auf einer Website zurechtzufinden, ohne
deren gerendertes HTML zu crawlen. Es gibt dafür keinen Konfigurationsschlüssel;
sie wird automatisch erzeugt, mit einer absoluten URL pro Link, wenn
`baseURL` eine vollständige URL ist, andernfalls relativ zum `basePath`.

## `sitemap.xml`

Wird in der Wurzel der Website geschrieben, aber nur, wenn `baseURL` eine
vollständige URL ist (siehe oben) - eine Sitemap braucht eine absolute
Domain, um sinnvoll zu sein. Listet jede nicht versteckte Seite gemäß dem
[sitemaps.org](https://www.sitemaps.org/)-Protokoll auf.

## `theme`

- `theme.name` - eines der integrierten Themes (`bootstrap`, `material`,
  `tailwind`) oder der Name eines eigenen Themes, das du über einen
  `theme/`-Ordner im Projekt-Wurzelverzeichnis bereitstellst (siehe
  [Themes](guides/themes.md))
- `theme.logo` - Pfad/URL zu einem Bild, das neben dem Website-Namen in der
  Kopfzeilen-Marke angezeigt wird (anstelle des standardmäßigen
  "⚡"-Symbols) - ein relativer Pfad (z. B. `"assets/logo.svg"`, aufgelöst
  relativ zu `docs/assets/`) wird mit `baseURL` vorangestellt, wie jedes
  andere interne Asset auch; eine absolute URL wird unverändert verwendet.
  Leer gelassen (Standard), zeigt die Kopfzeile "⚡ &lt;Website-Name&gt;".
- `theme.favicon` - Pfad/URL zu einem Favicon, aufgelöst auf dieselbe Weise
  wie `theme.logo`. Leer gelassen (Standard), wird gar kein
  `<link rel="icon">` gerendert (es greift dann das Standardverhalten des
  Browsers).
- `theme.options` - themenspezifische Optionen, von jedem integrierten
  Theme gelesen:
  - `theme.options.colorMode` - `"auto"` (Standard), `"light"` oder
    `"dark"`. Steuert, welchen Modus ein Erstbesucher sieht, bevor er
    selbst über den Dunkel-/Hell-Umschalter in der Kopfzeile eine Wahl
    getroffen hat - `"auto"` folgt der Betriebssystem-Präferenz,
    `"light"`/`"dark"` legt einen festen Standard fest. Sobald ein Besucher
    den Schalter umlegt, gewinnt seine eigene Wahl (in `localStorage`
    gespeichert) bei späteren Besuchen immer, unabhängig von dieser
    Einstellung.

    ```json
    { "theme": { "options": { "colorMode": "dark" } } }
    ```
  - `theme.options.navCollapsible` - `false` (Standard) rendert jede
    Navigationsabschnitts-Überschrift stets ausgeklappt, wie bisher. `true`
    rendert jeden Navigationsabschnitt (einen Ordner ohne `index.md`) als
    natives `<details>`/`<summary>`-Element, das der Besucher einklappen
    kann - kein JS-Framework nötig.
  - `theme.options.navExpandAll` - nur relevant, wenn `navCollapsible`
    `true` ist. `true` (Standard) startet jeden Abschnitt geöffnet;
    `false` startet jeden Abschnitt eingeklappt.

    ```json
    { "theme": { "options": { "navCollapsible": true, "navExpandAll": false } } }
    ```

## `search`

`true` (Standard) baut einen statischen Suchindex und verdrahtet die
Suchbox; `false` überspringt beides vollständig - keine
`search-index.json`, keine Such-UI, kein zusätzliches JS ausgeliefert.
Siehe [Suche](guides/search.md).

## `nav`

Standardmäßig wird die Navigation aus der eigenen Ordner-/Dateistruktur von
`docs/` abgeleitet (mit `order`/`hidden`-Frontmatter) - für kleine
Websites ausreichend, aber eine große Website kann daraus herauswachsen:
eine explizite Navigation erlaubt es dir, Seiten zu betiteln, zu gruppieren
und zu ordnen, ganz unabhängig davon, wo ihre Dateien tatsächlich liegen.

Ein leeres Array (Standard) bedeutet "aus der Ordnerstruktur ableiten". Ein
nicht leeres Array ersetzt diese Ableitung vollständig - die Array-Reihenfolge
wird zur Navigationsreihenfolge, und eine Seite, auf die darin nirgendwo
verwiesen wird, wird trotzdem gebaut, nur nicht aus der Navigation
verlinkt (wie bei `hidden: true`). Jeder Eintrag ist entweder:

- eine reine, docs/-relative Pfad-Zeichenkette, z. B. `"guides/setup.md"` -
  der Titel stammt aus der eigenen Frontmatter/dem Dateinamen dieser Seite,
  genau wie bei der Ordner-Ableitung
- ein Objekt `{ "title", "path", "icon", "children" }` - `path`, `icon`
  und `children` sind alle optional; ein Eintrag nur mit `title` und ohne
  `path` ist eine unverlinkte Gruppenüberschrift (wie ein Ordner ohne
  `index.md` heute), und ein explizites `title`/`icon` überschreibt immer
  den eigenen Titel/das eigene Icon der verlinkten Seite in der Navigation
  (das echte `<h1>`/`<title>` der Seite bleibt unangetastet - nur das
  Navigations-Label/-Icon ändert sich) - siehe
  [Themes: Icons](guides/themes.md#icons) dafür, was ein `icon`-Wert sein kann

```json
{
	"nav": [
		"index.md",
		{
			"title": "Guides",
			"children": [
				{ "title": "Quick Start", "path": "guides/setup.md" },
				"guides/deployment.md"
			]
		}
	]
}
```

Für eine Navigation, die groß genug ist, um `bxdocs.json` zu überladen,
verschiebe sie in eine eigene `docs/nav.json`-Datei - dieselbe Array-Form,
nur als kompletter Top-Level-Inhalt der Datei:

```json
[
	"index.md",
	{ "title": "Guides", "children": [ "guides/setup.md" ] }
]
```

Das eigene `nav` von `bxdocs.json` gewinnt, wenn es nicht leer ist, immer
gegenüber `docs/nav.json`. Nur der Hauptbaum berücksichtigt eines von
beiden - ein `docs/versions/<name>/`-Baum leitet seine Navigation immer aus
seiner eigenen Ordnerstruktur ab, selbst wenn der Hauptbaum eine explizite
Navigation hat.

## `markdown`

Wird unverändert an [bx-markdown](https://github.com/ortus-boxlang/bx-markdown)s
eigene Modul-Einstellungen weitergereicht, bevor jede Seite gerendert
wird. BX Docs definiert oder validiert diese Schlüssel nicht neu; was auch
immer du hier einträgst, ist direkt bx-markdowns eigenes Optionsset - diese
Liste kann sich also im Lauf der Zeit von bx-markdowns eigener
unterscheiden. Tabellen, `~~Durchgestrichen~~`, `- [ ]`-Task-List-Checkboxen
und das Inhaltsverzeichnis innerhalb der Seite sind immer aktiv, ohne
Umschaltmöglichkeit. Die eine Ausnahme ist `enableAdmonition` - bx-markdown
selbst setzt es standardmäßig auf `false`, aber BX Docs setzt es
standardmäßig auf `true` (siehe die
[Markdown-Erweiterungen-Anleitung](guides/markdown.md)).

| Schlüssel | Standard | Wirkung |
|---|---|---|
| `enableAdmonition` | `true` *(BX-Docs-Standard; bx-markdowns eigener Standard ist `false`)* | `!!!`/`???`/`???+`-Callout-Blöcke - siehe die [Markdown-Erweiterungen-Anleitung](guides/markdown.md#admonitions) |
| `enableFootnotes` | `false` | `[^label]`-Fußnotenverweise - siehe die [Markdown-Erweiterungen-Anleitung](guides/markdown.md#footnotes) |
| `enableDefinitionLists` | `false` | `Term\n:   Definition`-Listen - siehe die [Markdown-Erweiterungen-Anleitung](guides/markdown.md#definition-lists) |
| `autoLinkUrls` | `true` | Verlinkt nackte URLs und E-Mail-Adressen automatisch |
| `anchorLinks` | `true` | Fügt jeder Überschrift einen klickbaren Anker-Link hinzu |
| `anchorSetId` | `true` | Setzt ein `id`-Attribut auf jede Überschrift |
| `achorSetName` *(sic)* | `true` | Setzt ein `name`-Attribut auf jede Überschrift |
| `anchorWrapText` | `false` | Umschließt den gesamten Überschriftentext mit dem Anker-Link, statt nur eines schlichten Markers |
| `anchorClass` | `"anchor"` | CSS-Klasse auf dem Anker-`<a>` |
| `anchorPrefix` / `anchorSuffix` | `""` | Rohes HTML, unmittelbar vor/nach dem Überschriftentext eingefügt |
| `enableYouTubeTransformer` | `false` | Bettet nackte YouTube-Links automatisch als Player ein |
| `codeStyleHTMLOpen` / `codeStyleHTMLClose` | `"<code>"` / `"</code>"` | Wrapper-HTML um Inline-Code-Spans |
| `fencedCodeLanguageClassPrefix` | `"language-"` | Klassenpräfix, an dem sich bx-docs' clientseitiger Syntax-Highlighter (und Mermaid, siehe unten) orientieren, z. B. ` ```js ` -> `class="language-js"` |
| `tableOptions.columnSpans` | `true` | Berücksichtigt `colspan`-artig zusammengeführte Tabellenzellen |
| `tableOptions.appendMissingColumns` | `true` | Füllt eine zu kurze Zeile bis zur Spaltenzahl der Kopfzeile auf |
| `tableOptions.discardExtraColumns` | `true` | Verwirft überzählige Zellen in einer zu langen Zeile |
| `tableOptions.className` | `"table"` | CSS-Klasse auf jeder gerenderten `<table>` |
| `tableOptions.headerSeparationColumnMatch` | `true` | Verlangt, dass die `---`-Trennzeile der Spaltenzahl der Kopfzeile entspricht |

```json
{
	"markdown": {
		"enableFootnotes": true,
		"enableDefinitionLists": true,
		"anchorLinks": false,
		"enableYouTubeTransformer": true
	}
}
```

## `repo`

Fügt der Kopfzeile (in allen drei integrierten Themes) einen
Repository-Icon-Link hinzu und, wenn beide Schlüssel gesetzt sind, jeder
Seite einen "Diese Seite bearbeiten"-Link.

- `repo.url` - die URL deines Repos, z. B. `"https://github.com/acme/docs"`.
  Rendert für sich genommen bereits den Icon-Link in der Kopfzeile; leer
  lassen, um ihn ganz wegzulassen.
- `repo.editUri` - das Pfadsegment zwischen der Repo-URL und dem eigenen
  Quellpfad einer Seite, z. B. `"edit/main/docs/"` (GitHubs eigene
  "edit"-URL-Konvention). Wird mit `repo.url` und dem `docs/`-relativen
  Quellpfad einer Seite kombiniert, um ihren Bearbeiten-Link zu bauen -
  z. B. mit dem Beispiel oben ergibt `docs/guides/setup.md`
  `https://github.com/acme/docs/edit/main/docs/guides/setup.md`. Erfordert
  ebenfalls `repo.url`; leer lassen, um Bearbeiten-Links wegzulassen und
  trotzdem das Icon in der Kopfzeile zu zeigen.

```json
{ "repo": { "url": "https://github.com/acme/docs", "editUri": "edit/main/docs/" } }
```

## `social`

Ein Array von Social-/externen Links, die in der Fußzeile gerendert werden
(siehe [`footer`](#footer) - hat ohne diesen keine Wirkung). Jeder Eintrag
braucht eine `url`; `icon` wählt aus einem kleinen integrierten Icon-Set
(`github`, `twitter`/`x`, `youtube`, `linkedin`, `facebook`, `bluesky`,
`threads`, `slack`, `patreon`, `rss`, `email`, mit einem generischen
Link-Symbol als Fallback für alles andere), und `label` setzt den
barrierefreien Namen/Tooltip des Links (Standard ist `icon`, dann
`"Link"`).

```json
{
	"social": [
		{ "url": "https://twitter.com/acme", "icon": "twitter", "label": "Twitter" },
		{ "url": "https://acme.com/rss.xml", "icon": "rss", "label": "RSS" }
	]
}
```

## `footer`

`false` (Standard) - überhaupt keine Fußzeile. `true` fügt jeder Seite eine
hinzu: eine Copyright-Zeile (`© <Jahr> <Website-Name>`), die `social`-Links
(falls vorhanden) und einen "Built with BX Docs"-Hinweis.

```json
{ "footer": true }
```

## `lastUpdated`

`false` (Standard) - kein Datum der letzten Aktualisierung. `true` fügt
eine "Zuletzt aktualisiert"-Zeile neben dem Bearbeiten-Link hinzu (oder für
sich allein, wenn `repo.editUri` nicht gesetzt ist), ermittelt aus dem
`git log` der eigenen Markdown-Datei jeder Seite zur Build-Zeit. Wird
stillschweigend ausgelassen für eine Seite, für die Git keine Historie
hat - ein frisches `git init` ohne bisherige Commits, ein Build aus einem
heruntergeladenen ZIP ohne `.git` überhaupt, oder Git ist auf der
Build-Maschine nicht installiert - statt den Build abzubrechen.

```json
{ "lastUpdated": true }
```

## `analytics`

Bindet Pageview-Analytics ein. Unterstützt derzeit nur Google Analytics
(`gtag.js`):

- `analytics.provider` - `"google"`, um es zu aktivieren; leer gelassen
  (Standard), wird gar kein Analytics-Skript ausgeliefert.
- `analytics.id` - die Google-Analytics-Measurement-ID (z. B.
  `"G-ABC123"`). Erforderlich, wenn `provider` `"google"` ist.

```json
{ "analytics": { "provider": "google", "id": "G-ABC123" } }
```

## `ogImage`

Pfad/URL zu einem Standard-Social-Card-Bild, gerendert als `og:image`
(gepaart mit einem `twitter:card` von `summary_large_image`) auf jeder
Seite, die es nicht überschreibt - aufgelöst auf dieselbe Weise wie
`theme.logo` (relative Pfade werden mit `baseURL` vorangestellt, absolute
URLs unverändert verwendet). Leer gelassen (Standard) und `generateOgImages`
deaktiviert, werden gar keine `og:image`/`twitter:card`-Tags gerendert.

```json
{ "ogImage": "assets/social-card.png" }
```

Die eigene `ogImage`-Frontmatter einer Seite (siehe
[Erste Schritte](getting-started.md#add-pages)) gewinnt für diese eine
Seite immer gegenüber diesem websiteweiten Standard.

### `generateOgImages`

`false` (Standard) - keine seitenweisen Cards. `true` rendert für jede
Seite, die noch keine eigene `ogImage`-Frontmatter hat, eine echte
1200x630-PNG-Social-Card - den Seitentitel auf dem Marken-Gradienten,
geschrieben nach `site/assets/og/<page>.png` - statt dass sich alle Seiten
ein generisches, websiteweites Bild teilen. Rein `java.awt`/`javax.imageio`
unter der Haube (Teil jeder JVM, auf der BoxLang läuft), sodass dafür kein
Headless-Browser, kein externer Dienst und kein Netzwerkzugriff zur
Build-Zeit nötig ist.

```json
{ "generateOgImages": true }
```

## `extraCss` / `extraJs`

Arrays zusätzlicher Stylesheet-/Skript-URLs, die auf jeder Seite
eingebunden werden, nach den eigenen Assets des Themes - jeder Eintrag
wird auf dieselbe Weise aufgelöst wie `theme.logo` (ein relativer Pfad
wird mit `baseURL` vorangestellt; eine absolute URL wird unverändert
verwendet). `extraJs`-Einträge werden mit `defer` geladen.

```json
{
	"extraCss": [ "assets/custom.css" ],
	"extraJs": [ "assets/custom.js" ]
}
```

## `mermaid`

`false` (Standard) - überhaupt keine
[Mermaid](https://mermaid.js.org/)-Diagrammunterstützung ausgeliefert.
`true` lädt `mermaid.js` clientseitig und rendert jeden mit ` ```mermaid `
eingezäunten Codeblock als Diagramm. Siehe
[Markdown-Erweiterungen](guides/markdown.md#diagrams) für die Syntax.

```json
{ "mermaid": true }
```

## `math`

`false` (Standard) - kein [KaTeX](https://katex.org/) ausgeliefert. `true`
lädt es clientseitig und setzt `$...$`/`$$...$$` direkt aus dem Markdown
einer Seite. Siehe [Markdown-Erweiterungen](guides/markdown.md#math) für
die Syntax.

```json
{ "math": true }
```

Admonitions (Hinweis-/Warnungs-/Tipp-artige Callout-Boxen), Content-Tabs
und die Fenced-Code-Annotationen `hl_lines`/`linenums`/`title` sind im
Markdown jeder Seite immer verfügbar, ohne Konfiguration nötig - siehe
[Markdown-Erweiterungen](guides/markdown.md#admonitions).

## `plugins`

`[]` (Standard) - ein Array von BoxLang-Modulnamen, die als Plugins
aktiviert werden. Das Installieren eines Plugin-Moduls (`box install`)
aktiviert es niemals von selbst als Plugin; es muss auch hier benannt
werden. Siehe [Plugins](guides/plugins.md) dafür, wie man eines schreibt.

```json
{ "plugins": [ "myBxDocsPlugin" ] }
```

## `i18n`

Metadaten für die Locale-Ordner-Konvention
[`docs/i18n/<code>/`](guides/i18n.md) - eine Locale wird automatisch
gebaut, sobald ihr Ordner existiert; `i18n` liefert nur ihr
Anzeige-Label/ihre Schreibrichtung für den Sprachumschalter.

- `i18n.defaultLocale` - `{ "code", "label" }` für den eigenen regulären
  `docs/`-Baum des Projekts, standardmäßig
  `{ "code": "en", "label": "English" }`. Muss nur gesetzt werden, wenn
  deine Standard-Locale nicht Englisch ist.
- `i18n.locales` - `[]` (Standard) - ein Array aus
  `{ "code", "label", "dir" }` für jede andere Locale. `code` dient
  zugleich als Ordnername in `docs/i18n/<code>/` und als gebautes
  URL-Präfix - nur Buchstaben/Ziffern/Bindestriche (`es`, `pt-BR`,
  `zh-Hans`). `dir` ist `"ltr"` (Standard) oder `"rtl"`.

```json
{
	"i18n": {
		"defaultLocale": { "code": "en", "label": "English" },
		"locales": [
			{ "code": "es", "label": "Español" },
			{ "code": "ar", "label": "العربية", "dir": "rtl" }
		]
	}
}
```

Siehe [Internationalisierung](guides/i18n.md) für das vollständige Bild -
Fallback bei nicht übersetzten Seiten, den Sprachumschalter und was noch
nicht übersetzt wird.

## Versionierung

Versionierte Docs sind Konvention statt Konfiguration - dafür gibt es
keinen `bxdocs.json`-Schlüssel. Füge einen `docs/versions/`-Ordner hinzu,
und jeder direkte Unterordner darin wird als eigener, vollständig
in sich geschlossener Doc-Baum gebaut, neben deinem regulären `docs/`
(das immer als "Latest" gebaut wird):

```
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

Jeder Versionsordner ist ein normal `docs/`-förmiger Baum - eigene
`index.md`, eigene Navigation, eigene Seiten - gebaut nach
`site/versions/<name>/`, mit jedem internen Link entsprechend
vorangestellt, und teilt sich die einzige `bxdocs.json`-Konfiguration/das
Theme des Projekts. Versionsnamen sortieren neuestes zuerst, numerisch
statt alphabetisch (sodass `2.0` vor `10.0` sortiert), und jedes Theme
rendert automatisch ein Versions-Dropdown in der Kopfzeile, sobald mehr
als eine Version existiert - nichts, wozu man sich anmelden müsste. Eine
lose Datei direkt unter `docs/versions/` (nicht in einem Unterordner)
wird ignoriert.

`sitemap.xml` und `llms.txt` enthalten die Seiten jeder Version neben
denen der Hauptwebsite.
