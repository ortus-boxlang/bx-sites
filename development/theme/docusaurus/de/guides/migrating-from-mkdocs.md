---
title: Migration von mkdocs
order: 8
icon: phosphor-duotone:swap
tags: [anleitungen, migration, mkdocs]
---

# Migration von mkdocs

`bxSites migrate --from=mkdocs` wandelt ein mkdocs-Projekt - `mkdocs.yml`
plus dessen `docs/`-Ordner - mit einem Befehl in ein vollständiges
bx-sites-Projekt um:

```bash frame="terminal" title="Terminal"
bxSites migrate --source=/path/to/mkdocs-project --from=mkdocs
```

- `--source` (erforderlich) - das Wurzelverzeichnis des mkdocs-Projekts (muss `mkdocs.yml` enthalten)

Anders als die [Migration von GitBook](migrating-from-gitbook.md) ist
dies größtenteils eine *Konfigurations*-Übersetzung, keine
*Inhalts*-Übersetzung. Der eigene `docs/`-Ordner von mkdocs verwendet
bereits genau die Konventionen von bx-sites - Ordnerverschachtelung ist
Navigationsstruktur, `index.md` ist die eigene Startseite eines Ordners,
und relative `.md`-Links zwischen Seiten funktionieren einfach. Genauer
gesagt: die eigene erweiterte Markdown-Syntax von mkdocs-material ist
*dieselbe textuelle Syntax*, die bx-sites bereits spricht, weil sich
bx-sites von Anfang an an mkdocs-material orientiert hat (siehe
[Markdown-Erweiterungen](markdown.md)). Seiteninhalte werden also
Byte für Byte unverändert übernommen - nichts hier muss
`!!! note`-Admonitions, `=== "Tab"`-Content-Tabs oder `$x^2$`-Mathematik
umschreiben, weil sie bereits gültige bx-sites-Syntax sind.

## Was automatisch konvertiert wird

**`mkdocs.yml` → `bxsites.yaml`:**

| mkdocs.yml | bxsites.yaml |
|---|---|
| `site_name` | `name` |
| `site_description` | `description` |
| `site_url` | `baseURL` |
| `theme.name: material` | `theme.name: "material"` |
| jedes andere `theme.name` | `theme.name: "bootstrap"` (der eigene Standard von bx-sites) - als Warnung gemeldet, da sich das visuelle Ergebnis unterscheidet |
| `repo_url` / `edit_uri` | `repo.url` / `repo.editUri` |
| `extra_css` / `extra_javascript` | `extraCss` / `extraJs` |
| `markdown_extensions: [footnotes]` | `markdown.enableFootnotes: true` |
| `markdown_extensions: [def_list]` | `markdown.enableDefinitionLists: true` |
| `markdown_extensions: [pymdownx.arithmatex]` | `math: true` |

Jeder andere `markdown_extensions`-Eintrag, den die eigene Syntax von
mkdocs-material bereits nativ abdeckt - `admonition`, `pymdownx.tabbed`,
`pymdownx.details`, `pymdownx.superfences`, `pymdownx.highlight`, `toc`,
`attr_list` und mehr - braucht überhaupt keine `bxsites.yaml`-Änderung;
bx-sites verhält sich bereits von Haus aus so.

**`nav:` → `docs/nav.json`:**

```yaml title="mkdocs.yml" linenums="1"
# mkdocs.yml
nav:
  - Home: index.md
  - Guide:
      - Setup: guide/setup.md
      - Advanced: guide/advanced.md
  - About: about.md
```

wird zu:

```json title="docs/nav.json" linenums="1"
[
  { "title": "Home", "path": "index.md", "children": [] },
  { "title": "Guide", "path": "", "children": [
    { "title": "Setup", "path": "guide/setup.md", "children": [] },
    { "title": "Advanced", "path": "guide/advanced.md", "children": [] }
  ] },
  { "title": "About", "path": "about.md", "children": [] }
]
```

- ein bloßer Pfad-Eintrag (`- about.md`, ohne expliziten Titel) wird
  ebenfalls konvertiert - sein Titel stammt aus der eigenen Frontmatter/
  ersten Überschrift der migrierten Seite, genau wie bei jedem
  bx-sites-`docs/nav.json`-Eintrag ohne gesetztes `title`
- siehe [Konfiguration: `nav`](../configuration.md#nav) für das
  vollständige Format

**Seiten und Assets:**

- jede `.md`-Datei wird unverändert an denselben Pfad unter `docs/`
  kopiert
- jede *andere* Datei (Bilder, PDFs, ...) wird nach
  `docs/assets/mkdocs/<derselbe-relative-Pfad>` verschoben - die eigene
  Asset-Pipeline von bx-sites veröffentlicht ausschließlich
  `docs/assets/**`, und mkdocs hat keine einzelne
  Asset-Ordner-Konvention, wie es GitBooks `.gitbook/assets/` ist,
  sodass Bilder häufig verstreut neben den Seiten liegen, die sie
  verwenden
- jede Referenz auf ein verschobenes Asset - `![diagram](img/diagram.png)`,
  etwa - wird auf den korrekten relativen Pfad zu seinem neuen Ort
  umgeschrieben, unter Berücksichtigung dessen, wie tief die
  verlinkende Seite selbst liegt (dieselbe Konvention "der Autor
  schreibt die richtige Anzahl von `../`", die jedes bx-sites-Projekt
  bereits verwendet - hier für dich berechnet, statt einem
  Suchen-und-Ersetzen überlassen)

## Was einen manuellen Blick braucht

Als Warnungen in der eigenen Ausgabe des Befehls gemeldet, nichts wird
stillschweigend verworfen:

- ein mkdocs-`markdown_extensions`-/`plugins`-Eintrag ohne
  bx-sites-Entsprechung (die eigenen Emoji-Shortcodes von
  mkdocs-material, ein Drittanbieter-Plugin wie `awesome-pages` oder
  `git-revision-date`) - wenn du dasselbe Verhalten brauchst, siehe
  [Plugins](plugins.md)
- die eigene Farb-/Schriftanpassung von `mkdocs.yml`
  (`theme.palette`/`theme.font`) hat keine direkte Entsprechung - siehe
  [Farben anpassen](themes.md#farben-anpassen-ohne-ein-theme-zu-überschreiben),
  sobald die Migration abgeschlossen ist
- ein `theme.name` außer `material` (fällt auf `bootstrap` zurück)

## Durchgearbeitetes Beispiel

```bash frame="terminal" title="Terminal" linenums="1"
bxSites new --projectRoot=my-docs
bxSites migrate --projectRoot=my-docs --source=../my-mkdocs-project --from=mkdocs
cd my-docs
bxSites serve
```

`migrate` schreibt `bxsites.yaml` und `docs/` selbst - der `new`-Schritt
oben dient nur dazu, ein Projekt-Wurzelverzeichnis mit `docs/`
bereitzustellen, das bereit ist, sie zu empfangen; `migrate` erstellt
`docs/` auch selbst, es ist also nicht zwingend erforderlich. Überprüfe
die eigenen Warnungen des Befehls, dann `serve`, um das Ergebnis zu
sehen, bevor du es committest.
</content>
