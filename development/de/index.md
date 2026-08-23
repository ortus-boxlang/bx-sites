---
title: Startseite
order: 1
icon: phosphor-duotone:house
---

# BX Sites

BX Sites ist ein BoxLang-Modul, das statische Dokumentations-Websites aus
Markdown erzeugt, im Geiste von [mkdocs](https://www.mkdocs.org/) und
[mkdocs-material](https://squidfunk.github.io/mkdocs-material/).

Genau diese Seite wird von BX Sites gebaut, aus den Markdown-Dateien im
`docs/`-Ordner dieses Repositorys - sieh dir
[Erste Schritte](getting-started.md) an, um sie selbst zu bauen.

## Highlights

- **Markdown rein, statisches HTML raus.** Zeig auf einen `docs/`-Ordner
  und es entsteht eine komplette Website in `site/` - kein Server nötig,
  um sie zu hosten.
- **Ordnerstruktur ist Navigationsstruktur.** Verschachtele Ordner und
  Dateien unter `docs/`, und die Navigation baut sich von selbst auf, in
  der Reihenfolge, die du per Frontmatter festlegst.
- **Drei integrierte Themes.** `bootstrap` (das Standard-Theme),
  `material` und `tailwind` - alle mit derselben BoxLang-Markenpalette,
  und alle mit deinem eigenen Theme überschreibbar.
- **Statische, clientseitige Suche.** Eine mit [lunr.js](https://lunrjs.com/)
  betriebene Suchbox, verdrahtet mit einem beim `build` erstellten
  Suchindex - derselbe Ansatz, den mkdocs selbst standardmäßig verwendet,
  ohne Server-Abhängigkeit.
- **Markdown wird von [bx-markdown](https://github.com/ortus-boxlang/bx-markdown) verarbeitet.**
  BX Sites parst Markdown nicht selbst; es delegiert an bx-markdown und
  reicht deine eigenen `bxsites.json`-Optionen direkt daran weiter.
- **Ein Plugin-System, das auf BoxLangs eigenem Modulsystem aufbaut.** Ein
  Plugin ist einfach ein weiteres installiertes BoxLang-Modul - keine
  separate Plugin-API zu lernen.
- **Direkte Migration aus GitBook oder mkdocs.** `bxSites migrate
  --source=... --from=gitbook|mkdocs` wandelt einen bestehenden
  GitBook-Export oder ein mkdocs-Projekt mit einem Befehl in ein
  funktionierendes bx-sites-Projekt um.

## Wie geht es weiter

- [Erste Schritte](getting-started.md) - installieren, ein Projekt aufsetzen, bauen und ausliefern
- [CLI-Referenz](cli-reference.md) - jedes Verb und seine Optionen
- [Konfiguration](configuration.md) - die vollständige `bxsites.json`-Referenz
- [Themes](guides/themes.md) - die integrierten Themes und wie du dein eigenes schreibst
- [Suche](guides/search.md) - wie der statische Suchindex funktioniert
- [Deployment auf GitHub Pages](guides/deployment.md) - der integrierte GitHub-Actions-Workflow
- [Markdown-Erweiterungen](guides/markdown.md) - Admonitions, Fußnoten, Definitionslisten, Content-Tabs, Mathematik, Code-Annotationen und Mermaid-Diagramme
- [Content-Blöcke](guides/content-blocks.md) - GitBook-artige Blöcke: Expandables, Cards, Columns, ein Stepper und wiederverwendbare Content-Includes
- [Responsive Bilder](guides/images.md) - automatische Skalierung, WebP-Varianten und CSS-/JS-Bundling, standardmäßig aktiv
- [Interaktivität mit Alpine.js](guides/interactivity.md) - reaktiver Inhalt ganz ohne zusätzliches Setup
- [Blog](guides/blog.md) - ein Convention-over-Configuration-Blog: Beiträge, Autoren, Kategorien, Archive, RSS und Statistiken
- [Plugins](guides/plugins.md) - BX Sites mit einem eigenen BoxLang-Modul erweitern
- [Versionierung](guides/versioning.md) - die Docs einer Version einfrieren und kostenlos einen Versionsumschalter erhalten
- [Internationalisierung (i18n)](guides/i18n.md) - deine Docs in andere Sprachen übersetzen
- [Migration von GitBook](guides/migrating-from-gitbook.md) - einen GitBook-Export mit einem Befehl in ein bx-sites-Projekt umwandeln
- [Migration von mkdocs](guides/migrating-from-mkdocs.md) - ein mkdocs-Projekt mit einem Befehl in ein bx-sites-Projekt umwandeln
- [Beratung & Professionelle Dienstleistungen](services.md) - Docs- und Static-Site-Beratung von Ortus Solutions
- [Releases](releases/index.md) - Versionierungsrichtlinie und Neuigkeiten pro Release
