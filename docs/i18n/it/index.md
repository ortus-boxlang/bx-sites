---
title: Home
order: 1
icon: phosphor-duotone:house
---

# BX Sites

BX Sites è un modulo BoxLang che genera siti di documentazione statici a
partire da Markdown, nello spirito di [mkdocs](https://www.mkdocs.org/) e
[mkdocs-material](https://squidfunk.github.io/mkdocs-material/).

Questo stesso sito è generato da BX Sites, a partire dai file Markdown nella
cartella `docs/` di questo repository - vedi
[Per iniziare](getting-started.md) per compilarlo tu stesso.

## In evidenza

- **Markdown in ingresso, HTML statico in uscita.** Puntalo su una cartella
  `docs/` e genera un sito completo dentro `site/` - nessun server
  necessario per ospitarlo.
- **La struttura delle cartelle è la struttura di navigazione.** Annida
  cartelle e file sotto `docs/` e la navigazione si costruisce da sola,
  nell'ordine che imposti tramite il frontmatter.
- **Tre temi integrati.** `bootstrap` (predefinito), `material` e
  `tailwind` - tutti condividono la stessa palette del brand BoxLang, e
  tutti sono sostituibili con un tuo tema personalizzato.
- **Ricerca statica lato client.** Un box di ricerca basato su
  [lunr.js](https://lunrjs.com/), collegato a un indice di ricerca
  costruito al momento del `build` - lo stesso approccio che usa mkdocs
  stesso di default, senza alcuna dipendenza da un server.
- **Markdown gestito da [bx-markdown](https://github.com/ortus-boxlang/bx-markdown).**
  BX Sites non analizza il Markdown da sé; delega il compito a bx-markdown
  e inoltra direttamente a esso le tue opzioni di `bxsites.json`.
- **Un sistema di plugin costruito sul sistema di moduli di BoxLang.** Un
  plugin è semplicemente un altro modulo BoxLang installato - nessuna API
  di plugin separata da imparare.
- **Migra direttamente da GitBook o mkdocs.** `bxSites migrate
  --source=... --from=gitbook|mkdocs` converte un export di GitBook o
  un progetto mkdocs esistente in un progetto bx-sites funzionante con
  un unico comando.

## Dove andare adesso

- [Per iniziare](getting-started.md) - installa, genera lo scheletro di un progetto, compilalo e servilo
- [Riferimento CLI](cli-reference.md) - ogni verbo e le sue opzioni
- [Configurazione](configuration.md) - il riferimento completo di `bxsites.json`
- [Temi](guides/themes.md) - i temi integrati e come scriverne uno tuo
- [Ricerca](guides/search.md) - come funziona l'indice di ricerca statico
- [Distribuire su GitHub Pages](guides/deployment.md) - il workflow GitHub Actions integrato
- [Estensioni Markdown](guides/markdown.md) - ammonizioni, note a piè di pagina, liste di definizioni, schede di contenuto, matematica, annotazioni del codice e diagrammi Mermaid
- [Plugin](guides/plugins.md) - estendere BX Sites con un tuo modulo BoxLang
- [Migrare da GitBook](guides/migrating-from-gitbook.md) - convertire un export di GitBook in un progetto bx-sites con un solo comando
- [Migrare da mkdocs](guides/migrating-from-mkdocs.md) - convertire un progetto mkdocs in un progetto bx-sites con un solo comando
- [Release](releases/index.md) - politica di versionamento e novità di ogni release
