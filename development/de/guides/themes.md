---
title: Themes
order: 1
tags: [anleitungen, themes]
---

# Themes

Themes sind native BoxLang-`.bxm`-Templates - es gibt keine separate
Template-Engine oder einen eigenen Build-Schritt.

## Integriert

| Theme | Basis | Hinweise |
|---|---|---|
| `bootstrap` (Standard) | [Bootstrap 5](https://getbootstrap.com/) via CDN | Poppins-Schriftart, Navbar mit Marken-Gradient |
| `material` | Handgefertigtes Material-artiges CSS | Card-Layout, Elevation-Schatten, Roboto-Schriftart |
| `tailwind` | [Tailwind Play CDN](https://tailwindcss.com/) | Utility-Class-getrieben, kein Build-Schritt |

Alle drei verwenden dieselbe BoxLang-Markenpalette: einen
`#00FF78 -> #00DBFF`-Gradient und einen `#FFF500`-Akzent - und alle drei
bringen denselben Satz an Seitenfunktionen mit:

- **Ein Inhaltsverzeichnis "Auf dieser Seite"**, erzeugt aus den eigenen
  `h2`/`h3`-Überschriften jeder Seite.
- **Breadcrumbs**, die die Ahnenkette einer Seite zeigen, wenn sie mehr
  als eine Ebene tief unter einem verlinkten Vorfahren verschachtelt ist.
- **Vorherige/Nächste-Seite-Links** am Ende des Artikels, entlang der
  eigenen Leserichtung der Navigation.
- **Syntax-hervorgehobene Codeblöcke**, über [highlight.js](https://highlightjs.org/)
  plus eine eigene BoxLang-Grammatik (` ```bx `/` ```boxlang `/` ```cfscript `),
  jeweils mit einem **Kopieren-Button** - bei Hover sichtbar auf Geräten,
  die das unterstützen, auf Touch-Geräten immer sichtbar (dort gibt es
  kein Hover, um ihn einzublenden). Siehe
  [Markdown-Erweiterungen](markdown.md#code-blocks).
- **Selbst gehostete Webfonts** - keine Anfrage an `fonts.googleapis.com`
  zur Anzeigezeit.
- **Ein Dunkel-/Hell-Modus-Umschalter**, angetrieben von
  [Alpine.js](https://alpinejs.dev/) für die Reaktivität. Die Wahl des
  Besuchers wird in `localStorage` gemerkt (mit Fallback auf die
  Betriebssystem-Präferenz) und noch vor dem ersten Rendern angewendet, um
  ein kurzes Aufblitzen des falschen Themes zu vermeiden.
- **Eine responsive Kopfzeile**, die bei jeder Breite einreihig bleibt -
  ein schmales Viewport schrumpft die Suchbox, statt sie in eine eigene
  Zeile umbrechen zu lassen - plus eine einklappbare Sidebar-Navigation
  (ein Hamburger-Umschalter in `bootstrap`/`material`/`tailwind`
  gleichermaßen).
- **Tastaturkürzel** in der Suchbox: `/` fokussiert die Suche von überall
  auf der Seite, und `Escape` schließt die Ergebnisse. Siehe
  [Suche](search.md).
- **Ein Repo-Link und eine "Diese Seite bearbeiten"-/"Zuletzt
  aktualisiert"-Zeile**, wenn die Optionen `repo`/`lastUpdated` in
  `bxdocs.json` gesetzt sind. Siehe
  [Konfiguration](../configuration.md#repo).
- **Ein "Markdown herunterladen"-Link**, neben "Diese Seite bearbeiten" -
  die rohe `.md`-Quelle jeder Seite wird zusammen mit ihrem gebauten HTML
  veröffentlicht (`guides/themes.md` liegt neben
  `guides/themes/index.html`), sodass sie (oder eine KI) die Seite direkt
  als reines Markdown lesen kann, statt gerendertes HTML zu parsen. Immer
  aktiv, keine Konfiguration nötig. Siehe
  [Erste Schritte](../getting-started.md#downloading-a-page-as-markdown).
- **Eine optionale Fußzeile** (Copyright, `social`-Links, ein "Built with
  BX Docs"-Hinweis), wenn `footer` in `bxdocs.json` `true` ist. Siehe
  [Konfiguration](../configuration.md#footer).
- **Ein Versionsumschalter**, der automatisch erscheint, sobald ein
  Projekt einen `docs/versions/`-Ordner mit mehr als einer Version hat.
  Siehe [Konfiguration](../configuration.md#versioning).
- **Eine themenspezifische `404.html`**, automatisch ausgeliefert von den
  meisten statischen Hosts (einschließlich GitHub Pages) für jeden nicht
  gefundenen Pfad.
- **Ein eigenes Logo und Favicon**, wenn `theme.logo`/`theme.favicon` in
  `bxdocs.json` gesetzt sind. Siehe
  [Konfiguration](../configuration.md#theme).
- **Eine einklappbare Sidebar-Navigation**, opt-in über
  `theme.options.navCollapsible`. Siehe
  [Konfiguration](../configuration.md#theme).
- **Google Analytics**, wenn `analytics` in `bxdocs.json` konfiguriert
  ist. Siehe [Konfiguration](../configuration.md#analytics).
- **Social-Share-Cards** (Open-Graph- + Twitter-Card-Meta-Tags), erzeugt
  aus der `description`-Frontmatter jeder Seite (oder der websiteweiten
  `description`) und ihrem eigenen `ogImage` (oder dem websiteweiten) -
  optional automatisch pro Seite erzeugt über `generateOgImages` in
  `bxdocs.json`. Siehe [Konfiguration](../configuration.md#ogimage).
- **Seiten-Tags, ein Icon und eine Zusammenfassungszeile**, alle opt-in
  über die eigene Frontmatter einer Seite - Tags werden als Badges
  gerendert, die zu einem websiteweiten `/tags/`-Index verlinken. Siehe
  [Erste Schritte](../getting-started.md#add-pages).
- **Eine explizite Navigations-Überschreibung**, in `bxdocs.json` oder der
  eigenen `docs/nav.json`, die die Ordner-Ableitung für große Websites
  ersetzt. Siehe [Konfiguration](../configuration.md#nav).
- **Zusätzliches CSS/JS**, eingebunden über `extraCss`/`extraJs` in
  `bxdocs.json`. Siehe
  [Konfiguration](../configuration.md#extracss--extrajs).
- **Admonition-Callout-Boxen** (Hinweis/Warnung/Tipp/...), standardmäßig
  im Markdown jeder Seite aktiv, einschließlich einklappbarer Varianten -
  keine Konfiguration nötig. Siehe
  [Markdown-Erweiterungen](markdown.md#admonitions).
- **Fußnoten und Definitionslisten**, opt-in über `markdown` in
  `bxdocs.json`. Siehe
  [Markdown-Erweiterungen](markdown.md#footnotes).
- **Content-Tabs**, **Code-Zeilennummern/hervorgehobene Zeilen/Titel**
  und **Diff-Markierungen/Terminal-Rahmen** für Codeblöcke, keine
  Konfiguration nötig. Siehe
  [Markdown-Erweiterungen](markdown.md#content-tabs).
- **Mermaid-Diagramme**, opt-in über `mermaid` in `bxdocs.json`. Siehe
  [Markdown-Erweiterungen](markdown.md#diagrams).
- **Mathematik** (KaTeX), opt-in über `math` in `bxdocs.json`. Siehe
  [Markdown-Erweiterungen](markdown.md#math).

Lege in `bxdocs.json` fest, welches Theme ein Projekt verwendet:

```json
{ "theme": { "name": "material" } }
```

## Icons

Die eigene `icon`-Frontmatter einer Seite (angezeigt neben ihrem Titel und
neben ihrem Eintrag in der Sidebar-Navigation) akzeptiert entweder ein
reines Emoji/einen kurzen Text - die ursprüngliche, weiterhin vollständig
unterstützte Form - oder ein benanntes Icon aus einer von acht selbst
gehosteten Bibliotheken, alle MIT-/ISC-lizenziert und mit diesem Modul
mitgeliefert (~16.200 Icons insgesamt, kein CDN, kein zusätzliches Gewicht
für eine gebaute Seite über die tatsächlich verwendete Handvoll Icons
hinaus - siehe IconResolver.bx):

```markdown
---
icon: rocket
---
```

```markdown
---
icon: lucide:rocket
---
```

```markdown
---
icon: phosphor-bold:rocket
---
```

Ein reines `rocket` verwendet standardmäßig [Phosphor](https://phosphoricons.com/),
reguläre Stärke. Phosphor liefert alle sechs eigenen Stärken, jede mit
eigenem Präfix: `phosphor-thin:`, `phosphor-light:`, `phosphor:` (regulär,
identisch mit dem reinen Namen), `phosphor-bold:`, `phosphor-fill:` und
`phosphor-duotone:`. Stelle `lucide:` voran für [Lucide](https://lucide.dev/icons/),
oder `tabler:` für [Tabler](https://tabler.io/icons). Durchsuche die
jeweilige eigene Galerie der Website nach dem exakten Namen - er stimmt
genau mit dem vendorierten Dateinamen dieses Moduls überein
(Kleinbuchstaben, mit Bindestrichen, z. B. `book-open`, `arrow-up-right`;
Phosphors eigene Website zeigt einen Stärke-Umschalter - jede ihrer sechs
Optionen dort entspricht einem der sechs `phosphor[-weight]:`-Präfixe
dieses Moduls).

Font Awesome ist bewusst nicht dabei - sein Duotone-Stil (und der
Großteil seines Icon-Sets ab v6) ist Pro-only, nicht unter einer Lizenz
verfügbar, unter der dieses Modul sie kostenlos bündeln und
weiterverbreiten könnte.

Auch eine eigene SVG-Datei eines Projekts funktioniert - lege sie unter
`docs/assets/icons/my-icon.svg` ab und referenziere sie als
`icon: custom:my-icon`.

Ein [nav.json](../configuration.md#nav)-Eintrag kann ebenfalls ein
eigenes `icon` setzen, das die eigene Frontmatter der Zielseite für genau
diesen einen Eintrag überschreibt:

```json
{ "title": "Guides", "path": "guides/index.md", "icon": "lucide:book-open" }
```

## Der `ThemeProvider`-Vertrag

Ein Theme ist einfach ein Ordner mit:

- **`layout.bxm`** (erforderlich) - die äußere HTML-Hülle + Navigation.
  Erhält `variables.page`, `variables.nav`, `variables.siteConfig`,
  `variables.themeDir` und `variables.basePath` im Scope, und bindet das
  benachbarte `page.bxm` über `#variables.themeDir#/page.bxm` ein.
  `variables.basePath` ist immer ein root-relativer, auf `/` endender Pfad
  (standardmäßig `/`, `/my-docs/`, wenn `baseURL` in `bxdocs.json` das
  überschreibt) - stelle diesen jedem internen `href`/`src` voran, statt
  ein führendes `/` fest zu codieren, damit das Theme auch funktioniert,
  wenn die Website aus einem Unterpfad ausgeliefert wird.
- **`page.bxm`** (erforderlich) - der Artikelinhalt. Rendert
  `variables.page.contentHtml` - das bereits konvertierte Markdown.
- **`search.bxm`** (optional) - das Markup der Suchbox, von `layout.bxm`
  nur eingebunden, wenn `search` in `bxdocs.json` `true` ist. Siehe
  [Suche](search.md).
- **`assets/`** (optional) - Theme-CSS/JS, zur Build-Zeit nach
  `site/assets/theme/` kopiert.

`variables.page.editUrl`/`.lastUpdated` (leere Zeichenketten, wenn nicht
konfiguriert) und `variables.siteConfig.repo`/`.social`/`.footer` sind
ebenfalls immer verfügbar und stützen die oben beschriebenen
Repo-Link-/Bearbeiten-Link-/Zuletzt-aktualisiert-/Fußzeilen-Funktionen -
ein eigenes Theme entscheidet selbst, ob und wie es sie rendert, wie auch
alles andere. `variables.versions` (`[ { label, url } ]`, "Latest" zuerst)
und `variables.currentVersion` (das gerade gerenderte `label`) stützen den
Versionsumschalter - leer/`"Latest"` für ein nicht versioniertes Projekt,
sodass ein Theme nur dann einen Umschalter rendern muss, wenn
`variables.versions.len() gt 1`. Die drei integrierten Themes beziehen
ihre Repo-/Social-Icons aus einem kleinen gemeinsamen SVG-Lookup,
`<bx:include template="#variables.moduleAssetsDir#/icons.bxm">`
(definiert `bxdocsIcon( name )`, eines von `github`, `twitter`/`x`, `rss`,
`youtube`, `linkedin`, `facebook`, `bluesky`, `threads`, `slack`,
`patreon`, `email`, `edit`, `clock`, mit einem generischen Link-Symbol als
Fallback) - ein eigenes Theme kann das auf dieselbe Weise einbinden, oder
seine Icons vollständig selbst bereitstellen.

Ein Theme-Ordner, dem eine der beiden erforderlichen Dateien fehlt,
schlägt sofort mit einem klaren `BxDocs.InvalidTheme`-Fehler zur Build-Zeit
fehl, statt mit einem verwirrenden Template-Fehler tief im Rendering.

## Farben anpassen, ohne ein Theme zu überschreiben

Für eine kleine Farb-/Schriftanpassung ist ein ganzes Theme zu forken
Overkill - jedes integrierte Theme liest seine Palette aus einer Handvoll
CSS-Custom-Properties auf `:root`, erneut deklariert unter
`[data-theme="dark"]` für den Dunkelmodus. Das
[`extraCss`](../configuration.md#extracss--extrajs) von `bxdocs.json` wird
*nach* dem eigenen Stylesheet des Themes geladen, sodass eine erneute
Deklaration mit gleicher Spezifität darin gewinnt, ohne `resources/themes/`
überhaupt anzurühren:

```json
{ "extraCss": [ "assets/brand.css" ] }
```

```css
/* docs/assets/brand.css - copied to site/assets/brand.css at build time */
:root {
	--bxdocs-gradient-start: #7C3AED;
	--bxdocs-gradient-end: #DB2777;
	--bxdocs-accent: #FBBF24;
	--bxdocs-link: #7C3AED;
	--bxdocs-link-hover: #9F5AF0;
}

[data-theme="dark"] {
	--bxdocs-link: #C4B5FD;
	--bxdocs-link-hover: #DDD6FE;
}
```

Das eigene Set des `bootstrap`-Themes
(`resources/themes/bootstrap/assets/style.css`) besteht aus
`--bxdocs-gradient-start`/`-end`, `--bxdocs-accent`, `--bxdocs-bg`,
`--bxdocs-text`, `--bxdocs-sidebar-bg`, `--bxdocs-sidebar-text`,
`--bxdocs-border`, `--bxdocs-link`, `--bxdocs-link-hover` und
`--bxdocs-code-bg` - `material` und `tailwind` folgen derselben
`--bxdocs-*`-Namensgebung mit ihren eigenen kleinen Abweichungen. Alles
über Farbe/Schriftart hinaus (Layout, Chrome hinzufügen/entfernen)
braucht eine echte Überschreibung oder ein eigenes Theme - siehe unten.

## Ein Theme überschreiben

Lege deine eigenen `layout.bxm` + `page.bxm` (und optional `search.bxm` /
`assets/`) in einen `theme/`-Ordner im Wurzelverzeichnis deines Projekts.
BX Docs bevorzugt eine projektweite `theme/`-Überschreibung gegenüber
jedem integrierten Theme, solange sie den obigen Vertrag erfüllt - die
integrierten Themes unter `resources/themes/` dieses Moduls sind ein
guter Ausgangspunkt zum Kopieren und Anpassen.

Ein durchgearbeitetes Beispiel - starte mit `bootstrap` und tausche seine
Markenpalette und Überschriften-Schriftart gegen deine eigenen aus, wobei
alles andere (Navigation, Suche, Dunkelmodus, Code-Hervorhebung, ...)
genau so weiterläuft, wie es bereits funktioniert:

```markdown
my-project/
├── bxdocs.yaml
├── docs/
└── theme/                    ← project-level override, checked before any built-in theme
    ├── layout.bxm             ← copied from resources/themes/bootstrap/layout.bxm
    ├── page.bxm                ← copied from resources/themes/bootstrap/page.bxm, unchanged
    ├── search.bxm               ← copied unchanged
    └── assets/
        └── style.css              ← copied from bootstrap's assets/style.css, then edited
```

1. Kopiere die drei `.bxm`-Dateien und `assets/style.css` aus
   `resources/themes/bootstrap/` dieses Moduls in das `theme/` deines
   Projekts.
2. Ändere nur das, was du wirklich ändern musst. Um Markenpalette und
   Schriftart zu tauschen, genügt der obere Teil von
   `theme/assets/style.css`:

   ```css
   :root {
   	--bxdocs-gradient-start: #7C3AED;  /* was #00FF78 */
   	--bxdocs-gradient-end: #DB2777;    /* was #00DBFF */
   	--bxdocs-accent: #FBBF24;          /* was #FFF500 */
   }

   body {
   	font-family: "Inter", system-ui, sans-serif;  /* was "Poppins" */
   }
   ```

3. Führe `boxlang module:bxDocs build` aus (oder `serve` während der
   Iteration) - BX Docs übernimmt `theme/` automatisch, keine Änderung an
   `bxdocs.json` nötig (ein projektweiter `theme/`-Ordner hat immer
   Vorrang vor dem im `theme.name` genannten integrierten Theme). Alles,
   was du nicht angefasst hast - Navigations-Rendering, Suche, der
   Dunkelmodus-Umschalter, Code-Annotationen - funktioniert genau so
   weiter, wie es im ursprünglichen `bootstrap`-Theme funktioniert hat, da
   es darunter immer noch genau dasselbe `layout.bxm`/`page.bxm`-Markup
   ist.

Ein projektweiter `theme/`-Ordner ist allerdings alles-oder-nichts -
sobald BX Docs einen findet, wird er anstelle des integrierten Themes
vollständig verwendet, braucht also trotzdem seine eigenen `layout.bxm` +
`page.bxm`, selbst wenn du nur `assets/style.css` geändert hast (ein
Ordner, dem eine der beiden fehlt, schlägt sofort mit
`BxDocs.InvalidTheme` fehl, statt stillschweigend zurückzufallen). Für
eine reine CSS-Anpassung ohne `.bxm`, nutze stattdessen
[`extraCss`](#customizing-colors-without-a-theme-override) von oben - es
legt sich über das Theme, das `bxdocs.json` benennt, ganz ohne
`theme/`-Ordner. `theme/` ist für den Fall, dass du auch das Markup
selbst ändern musst, siehe als Nächstes.

## Ein Theme von Grund auf schreiben

Ein Theme braucht nur die beiden erforderlichen Dateien, hier also ein
wirklich minimales Beispiel - kein Bootstrap/Tailwind, kein Dunkelmodus,
keine Such-UI - um genau zu zeigen, was erforderlich ist im Vergleich zu
dem, was die integrierten Themes zusätzlich bieten. Speichere beide als
`theme/layout.bxm` und `theme/page.bxm` in deinem Projekt - ein
projektweiter `theme/`-Ordner wird automatisch übernommen (wie oben),
keine Änderung an `bxdocs.json` nötig:

```bx
<!-- theme/layout.bxm -->
<bx:script>
	function renderNav( required array nodes ) {
		var html = "<ul>"
		for ( var node in arguments.nodes ) {
			html &= "<li>"
			html &= len( node.url )
				? '<a href="' & variables.basePath & node.url & '">' & encodeForHTML( node.title ) & '</a>'
				: encodeForHTML( node.title )
			if ( node.children.len() ) {
				html &= renderNav( node.children )
			}
			html &= "</li>"
		}
		return html & "</ul>"
	}
</bx:script>
<bx:output>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>#encodeForHTML( variables.page.title )# - #encodeForHTML( variables.siteConfig.name )#</title>
	<link rel="stylesheet" href="#variables.basePath#assets/theme/style.css">
</head>
<body>
	<header><a href="#variables.basePath#">#encodeForHTML( variables.siteConfig.name )#</a></header>
	<nav>#renderNav( variables.nav )#</nav>
	<main>
</bx:output>
<bx:include template="#variables.themeDir#/page.bxm">
<bx:output>
	</main>
</body>
</html>
</bx:output>
```

```bx
<!-- theme/page.bxm -->
<bx:output>
<article>
	<h1>#encodeForHTML( variables.page.title )#</h1>
	#variables.page.contentHtml#
</article>
</bx:output>
```

Das ist ein vollständiges, funktionierendes Theme -
`variables.page.contentHtml` ist das bereits konvertierte Markdown
(Syntax-Hervorhebung, Admonitions, Tabs, Mathematik und alles), es bleibt
also nichts mehr zu parsen, nur noch zu layouten. Von hier aus füge
hinzu, was die integrierten Themes haben und du tatsächlich willst:
`search.bxm` (nur eingebunden, wenn `search` in `bxdocs.json` `true` ist
- siehe [Suche](search.md)), einen Dunkelmodus-Umschalter (kopiere das
`x-data`/`x-init`-Alpine.js-Paar vom `<body>`-Tag von
`resources/themes/bootstrap/layout.bxm` und den passenden
`[data-theme="dark"]`-CSS-Block), Breadcrumbs/Tags/Vorherige-Nächste-Links
(`page.bxm` in jedem integrierten Theme zeigt das Muster - jedes ist nur
ein `if` um eine kleine Render-Funktion, alle gespeist aus Feldern, die
bereits auf `variables.page` vorhanden sind), oder einen `assets/`-Ordner
für dein eigenes CSS/JS, automatisch zur Build-Zeit nach
`site/assets/theme/` kopiert.
