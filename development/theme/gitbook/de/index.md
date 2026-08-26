---
title: Startseite
order: 1
icon: phosphor-duotone:house
summary: Zeig auf einen docs/-Ordner. Erhalte eine schnelle, themefähige statische Website daraus - Dokumentation, eine Marketing-Site, ein Blog, oder alles andere, was sich in Markdown ausdrücken lässt - komplett mit Suche, i18n und einem Markdown-Toolkit für echten Content.
toc: false
---

<div class="bxsites-hero">
	<img class="bxsites-hero__banner" src="assets/home-banner.jpg" alt="BxSites - Write. Build. Publish Beautiful Docs. The official documentation engine for BoxLang. Markdown Powered, Beautiful Themes, Blazing Fast Search, Developer Focused.">
	<div class="bxsites-hero__actions">
		<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="getting-started.md">Erste Schritte</a>
		<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="https://github.com/ortus-boxlang/bx-sites">⭐ Gib uns einen Stern auf GitHub</a>
	</div>
</div>

Genau diese Seite wird von BxSites gebaut, aus den Markdown-Dateien im
`docs/`-Ordner dieses Repositorys.

BxSites ist nicht nur für Referenzdokumentation gedacht - es ist ein
allgemeiner **statischer Site-Generator**. Eine Marketing-Site, ein Blog,
eine Wissensdatenbank, eine Produktseite, eine persönliche Seite: alles, was
sich in Markdown schreiben lässt, wird auf demselben Weg gebaut - mit
denselben Themes, derselben Suche und demselben i18n.

::: cards
::: card title="Markdown rein, statisches HTML raus" icon="phosphor-duotone:file-html"
Zeig auf einen `docs/`-Ordner und es entsteht eine komplette Website in
`site/` - kein Server nötig, um sie zu hosten.
:::
::: card title="Ordnerstruktur ist Navigationsstruktur" icon="phosphor-duotone:tree-structure"
Verschachtele Ordner und Dateien unter `docs/`, und die Navigation baut
sich von selbst auf, in der Reihenfolge, die du per Frontmatter festlegst.
:::
::: card title="Zehn integrierte Themes" icon="phosphor-duotone:palette" href="guides/themes.md"
Eine vollständige Galerie - `bootstrap`, `material`, `tailwind` und sieben
weitere, inspiriert von Docsy, Stripe, Docusaurus, Just the Docs, VuePress,
GitBook und Notion - alle mit deinem eigenen Theme überschreibbar.
:::
::: card title="Statische, clientseitige Suche" icon="phosphor-duotone:magnifying-glass" href="guides/search.md"
Eine MiniSearch-basierte Suchbox (unscharfe Treffer, Präfixsuche) plus eine Cmd/Ctrl+K-Befehlspalette,
verdrahtet mit einem beim `build` erstellten Suchindex - ohne
Server-Abhängigkeit.
:::
::: card title="Ein Blog, direkt eingebaut" icon="lucide:newspaper" href="guides/blog.md"
Lege Beiträge unter `docs/blog/posts/` ab und erhalte Autoren, Kategorien,
Jahresarchive, RSS-Feeds und Featured Images pro Beitrag - ganz ohne
Konfiguration.
:::
::: card title="Schnell, standardmäßig air-gapped" icon="phosphor-duotone:wifi-slash" href="guides/themes.md#air-gappedoffline-websites"
Fingerprinted CSS/JS-Bundling und responsive Bilder direkt eingebaut, dazu
Bootstrap, highlight.js, Alpine.js, MiniSearch und (optional) Mermaid alle
vendored - eine gebaute Website benötigt standardmäßig keine ausgehenden
Anfragen.
:::
::: card title="Ein echtes Plugin-System" icon="phosphor-duotone:puzzle-piece" href="guides/plugins.md"
Ein Plugin ist einfach ein weiteres installiertes BoxLang-Modul - keine
separate Plugin-API zu lernen.
:::
::: card title="Plugins & Themes, veröffentlicht auf ForgeBox" icon="phosphor-duotone:package" href="guides/plugins.md#ein-veröffentlichtes-plugin-installieren"
`install:plugin` und `install:theme` laden ein veröffentlichtes Paket
direkt in dein Projekt herunter - durchsuche `bxsites-plugins` und
`bxsites-themes` auf ForgeBox.
:::
::: card title="Ein bestehendes Theme importieren" icon="phosphor-duotone:arrows-left-right" href="guides/theme-import.md"
`theme:import --source=mkdocs|jekyll|hugo` wandelt die eigenen
Theme-Templates eines anderen Generators in ein bx-sites-Gerüst um, auf
dem du aufbauen kannst - statt bei null anzufangen.
:::
::: card title="Migration von GitBook, mkdocs, einem ZIP oder Notion" icon="phosphor-duotone:swap" href="guides/index.md"
`bxSites migrate --from=gitbook|mkdocs|markdown-zip|notion` wandelt einen
bestehenden Export oder ein Projekt mit einem Befehl in ein funktionierendes
bx-sites-Projekt um.
:::
::: card title="Überall ausliefern" icon="phosphor-duotone:cloud-arrow-up" href="guides/deployment.md"
`bxSites deploy` liefert die gebaute Website direkt an S3, Azure, GCS,
Firebase, FTP/SFTP, rsync, Netlify, Vercel, Cloudflare Pages oder GitHub
Pages aus - oder `bxSites package` packt sie stattdessen in ein einzelnes
Archiv.
:::
::: card title="Wiederverwendbare Variablen & magische Funktionen" icon="phosphor-duotone:function" href="guides/variables-and-functions.md"
`{{ dotted.path }}` greift auf den eigenen `variables`-Block der
`bxsites.yaml` zu; `{{ $name(args) }}` ruft direkt aus Markdown heraus einen
kleinen BoxLang-Helper auf - kein Plugin, keine Verdrahtung nötig.
:::
::: card title="Umfangreiche Content-Blöcke" icon="phosphor-duotone:squares-four" href="guides/content-blocks.md"
Tabellen, Buttons, Prompts, Expandables, Tabs und eingebettete
OpenAPI-Spezifikationen - eine GitBook-artige Block-Bibliothek auf Basis von
reinem Markdown.
:::
:::

## Selbst sehen, statt nur davon lesen

BxSites' eigenes Markdown-Toolkit in Aktion, direkt hier auf der
Startseite - kein Screenshot, das Original:

::: stepper
::: step "Installieren"
`install-bx-module bx-sites`
:::
::: step "Gerüst erzeugen"
`bxSites new`
:::
::: step "Bauen & ausliefern"
`bxSites serve`
:::
:::

::: columns
::: column
!!! tip "Callouts für jeden Anlass"
    Zwölf kanonische Admonition-Typen - `note`, `tip`, `warning`, `danger`
    und mehr - jeder mit eigener Akzentfarbe, dazu eine einklappbare
    `???`-Variante. Siehe
    [Markdown-Erweiterungen](guides/markdown.md#admonitions).
:::
::: column
!!! faq "Content-Tabs, Mathematik, Diagramme"
    Gruppierte Code-Tabs, KaTeX-Mathematik, Mermaid-Diagramme, Fußnoten und
    Definitionslisten sind alle direkt eingebaut - siehe
    [Markdown-Erweiterungen](guides/markdown.md).
:::
:::

## Wie geht es weiter

::: cards
::: card title="Erste Schritte" icon="phosphor-duotone:rocket-launch" href="getting-started.md"
Installieren, ein Projekt aufsetzen, bauen und ausliefern.
:::
::: card title="CLI-Referenz" icon="phosphor-duotone:terminal-window" href="cli-reference.md"
Jedes Verb und seine Optionen.
:::
::: card title="Konfiguration" icon="phosphor-duotone:gear-six" href="configuration.md"
Die vollständige `bxsites.yaml`-Referenz.
:::
::: card title="Markdown-Erweiterungen" icon="phosphor-duotone:markdown-logo" href="guides/markdown.md"
Admonitions, Tabs, Cards, Callouts, Mathematik und Mermaid-Diagramme.
:::
::: card title="Blog" icon="lucide:newspaper" href="guides/blog.md"
Beiträge, Autoren, Kategorien, Archive, RSS, Entwürfe und eine
Statistikseite.
:::
::: card title="Responsive Bilder & Asset-Pipeline" icon="phosphor-duotone:image" href="guides/images.md"
Automatische Bildskalierung/WebP und fingerprinted CSS/JS-Bundling.
:::
::: card title="Deployment" icon="phosphor-duotone:cloud-arrow-up" href="guides/deployment.md"
`deploy`/`package` und der integrierte GitHub-Actions-Workflow.
:::
::: card title="Releases" icon="phosphor-duotone:tag" href="releases/index.md"
Versionierungsrichtlinie und Neuigkeiten pro Release.
:::
:::

## Brauchst du Hilfe beim Aufbau deiner Website?

BxSites ist frei und Open Source - aber wenn du lieber das Team, das es
entwickelt, die Arbeit machen lassen möchtest, bietet
[Ortus Solutions](https://www.ortussolutions.com) professionelle
Dienstleistungen und Beratung für Dokumentations-Websites, Migrationen und
jede andere mit BxSites gebaute statische Website an.

<div class="bxsites-hero__actions">
	<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="mailto:consulting@ortussolutions.com">E-Mail an consulting@ortussolutions.com</a>
	<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="services.md">Beratung & Professionelle Dienstleistungen</a>
</div>
