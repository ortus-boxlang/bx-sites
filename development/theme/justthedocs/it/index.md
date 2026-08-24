---
title: Home
order: 1
icon: phosphor-duotone:house
summary: Punta BX Sites su una cartella docs/. Ottieni un sito statico veloce e personalizzabile - documentazione, un sito marketing, un blog, o qualsiasi altra cosa il Markdown possa esprimere - completo di ricerca, i18n, e un toolkit Markdown pensato per contenuti reali.
toc: false
---

<div class="bxsites-hero">
	<img class="bxsites-hero__banner" src="assets/home-banner.jpg" alt="BX Sites - Scrivi. Compila. Pubblica documentazione bellissima. Il motore di documentazione ufficiale per BoxLang. Basato su Markdown, temi bellissimi, ricerca fulminea, pensato per gli sviluppatori.">
	<div class="bxsites-hero__actions">
		<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="getting-started.md">Inizia subito</a>
		<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="https://github.com/ortus-boxlang/bx-sites">Vedi su GitHub</a>
	</div>
</div>

Questo stesso sito è generato da BX Sites, a partire dai file Markdown
nella cartella `docs/` propria di questo repository.

BX Sites non serve solo per la documentazione di riferimento - è un
**generatore di siti statici** di uso generale. Un sito marketing, un
blog, una knowledge base, un sito prodotto, un sito personale: qualsiasi
cosa tu possa scrivere in Markdown si compila allo stesso modo,
attraverso gli stessi temi, la stessa ricerca e la stessa i18n.

::: cards
::: card title="Markdown in ingresso, HTML statico in uscita" icon="phosphor-duotone:file-html"
Puntalo su una cartella `docs/` e genera un sito completo dentro `site/`
- nessun server necessario per ospitarlo.
:::
::: card title="La struttura delle cartelle è la struttura di navigazione" icon="phosphor-duotone:tree-structure"
Annida cartelle e file sotto `docs/` e la navigazione si costruisce da
sola, nell'ordine che imposti tramite il frontmatter.
:::
::: card title="Dieci temi integrati" icon="phosphor-duotone:palette" href="guides/themes.md"
Una galleria completa - `bootstrap`, `material`, `tailwind`, e altri
sette ispirati a Docsy, Stripe, Docusaurus, Just the Docs, VuePress,
GitBook e Notion - tutti sostituibili con un tuo tema personalizzato.
:::
::: card title="Ricerca statica lato client" icon="phosphor-duotone:magnifying-glass" href="guides/search.md"
Un box di ricerca basato su lunr.js, collegato a un indice di ricerca
costruito al momento del `build` - nessuna dipendenza da un server.
:::
::: card title="Un blog, pronto all'uso" icon="lucide:newspaper" href="guides/blog.md"
Deposita i post sotto `docs/blog/posts/` e ottieni autori, categorie,
archivi annuali, feed RSS, e immagini in evidenza per post - zero
configurazione richiesta.
:::
::: card title="Veloce, air-gapped per default" icon="phosphor-duotone:wifi-slash" href="guides/themes.md#air-gapped-offline-sites"
Bundling CSS/JS con fingerprint e immagini responsive pronti all'uso, più
Bootstrap, highlight.js, Alpine.js, lunr.js e (opzionale) Mermaid tutti
inclusi localmente - un sito compilato non necessita di alcuna richiesta
in uscita per default.
:::
::: card title="Un vero sistema di plugin" icon="phosphor-duotone:puzzle-piece" href="guides/plugins.md"
Un plugin è semplicemente un altro modulo BoxLang installato - nessuna
API di plugin separata da imparare.
:::
::: card title="Plugin e temi, pubblicati su ForgeBox" icon="phosphor-duotone:package" href="guides/plugins.md#installare-un-plugin-pubblicato"
`install:plugin` e `install:theme` scaricano un pacchetto pubblicato
direttamente nel tuo progetto - sfoglia `bxsites-plugins` e
`bxsites-themes` su ForgeBox.
:::
::: card title="Importa un tema esistente" icon="phosphor-duotone:arrows-left-right" href="guides/theme-import.md"
`theme:import --source=mkdocs|jekyll|hugo` converte i template di un tema
di un altro generatore in uno scaffold bx-sites su cui costruire, invece
di ripartire da zero.
:::
::: card title="Migra da GitBook o mkdocs" icon="phosphor-duotone:swap" href="guides/index.md"
`bxSites migrate --source=... --from=gitbook|mkdocs` converte un export
di GitBook o un progetto mkdocs esistente in un progetto bx-sites
funzionante con un unico comando.
:::
:::

## Vedilo, non limitarti a leggerne

Il toolkit Markdown proprio di BX Sites, in azione proprio qui sulla
homepage - non uno screenshot, la cosa vera:

::: stepper
::: step "Installa"
`install-bx-module bx-sites`
:::
::: step "Genera lo scheletro"
`bxSites new`
:::
::: step "Compila e servi"
`bxSites serve`
:::
:::

::: columns
::: column
!!! tip "Callout per ogni occasione"
    Dodici tipi di ammonizione canonici - `note`, `tip`, `warning`,
    `danger` e altri - ciascuno con il proprio colore d'accento, più una
    variante comprimibile `???`. Vedi
    [Estensioni Markdown](guides/markdown.md#admonitions).
:::
::: column
!!! faq "Schede di contenuto, matematica, diagrammi"
    Schede di codice raggruppate, matematica KaTeX, diagrammi Mermaid,
    note a piè di pagina e liste di definizioni sono tutti disponibili
    pronti all'uso - vedi [Estensioni Markdown](guides/markdown.md).
:::
:::

## Dove andare adesso

::: cards
::: card title="Per iniziare" icon="phosphor-duotone:rocket-launch" href="getting-started.md"
Installa, genera lo scheletro di un progetto, compilalo e servilo.
:::
::: card title="Riferimento CLI" icon="phosphor-duotone:terminal-window" href="cli-reference.md"
Ogni verbo e le sue opzioni.
:::
::: card title="Configurazione" icon="phosphor-duotone:gear-six" href="configuration.md"
Il riferimento completo di `bxsites.yaml`.
:::
::: card title="Estensioni Markdown" icon="phosphor-duotone:markdown-logo" href="guides/markdown.md"
Ammonizioni, schede, card, callout, matematica e diagrammi Mermaid.
:::
::: card title="Blog" icon="lucide:newspaper" href="guides/blog.md"
Post, autori, categorie, archivi, RSS, bozze, e una pagina di statistiche.
:::
::: card title="Immagini responsive e pipeline asset" icon="phosphor-duotone:image" href="guides/images.md"
Ridimensionamento automatico delle immagini/WebP, e bundling CSS/JS con
fingerprint.
:::
::: card title="Distribuire su GitHub Pages" icon="phosphor-duotone:cloud-arrow-up" href="guides/deployment.md"
Il workflow GitHub Actions integrato.
:::
::: card title="Release" icon="phosphor-duotone:tag" href="releases/index.md"
Politica di versionamento e novità di ogni release.
:::
:::

## Serve una mano per costruire il tuo sito?

BX Sites è libero e open source - ma se preferisci avere il team che lo
sviluppa a fare il lavoro, [Ortus Solutions](https://www.ortussolutions.com)
offre servizi professionali e consulenza per siti di documentazione,
migrazioni, e qualsiasi altro sito statico costruito con BX Sites.

<div class="bxsites-hero__actions">
	<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="mailto:consulting@ortussolutions.com">Scrivi a consulting@ortussolutions.com</a>
	<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="services.md">Consulenza e servizi professionali</a>
</div>
