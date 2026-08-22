---
title: Ricerca
order: 2
tags: [guide, ricerca]
---

# Ricerca

La ricerca di BX Docs è completamente statica e lato client - lo stesso
approccio che usa [mkdocs](https://www.mkdocs.org/) di default: un
indice costruito una sola volta al momento del `build`, e
[lunr.js](https://lunrjs.com/) che effettua la ricerca vera e propria nel
browser del visitatore. Non è coinvolto alcun server, database o servizio
di ricerca esterno.

## Come funziona

1. Al momento del `build`, `SearchIndexer` percorre ogni pagina non
   nascosta e scrive `site/search-index.json`: una voce per pagina con il
   suo `title`, `url`, i `tags` del frontmatter, il testo di ogni
   intestazione nella pagina, e una copia in testo semplice troncata del
   suo corpo (con i tag HTML rimossi).
2. Il parziale `search.bxm` di ogni tema renderizza un box di ricerca;
   `layout.bxm` lo include (insieme agli script `lunr.js` + `search.js`
   condiviso) solo quando `search` di `bxdocs.json` è `true`.
3. Nel browser, il widget condiviso `assets/search.js` recupera
   `search-index.json` una sola volta, costruisce a partire da esso un
   indice `lunr` (con `title` pesato di più, poi i `tags` del
   frontmatter, poi gli `headings`, poi il testo del corpo semplice), e
   ricerca di nuovo a ogni tasto premuto - nessuna richiesta di rete per
   ogni query.

## Scorciatoie da tastiera

- **`/`** porta il focus sul box di ricerca da qualsiasi punto della
  pagina (a meno che tu non stia già digitando in un altro campo) - la
  stessa convenzione usata da
  [mkdocs-material](https://squidfunk.github.io/mkdocs-material/).
- **`Escape`** chiude il menu a discesa dei risultati e toglie il focus
  dal box di ricerca.

## Disattivarla

```json
{ "search": false }
```

Salta del tutto la compilazione di `search-index.json`, e salta il box di
ricerca, lo script incluso `lunr.js`, e il widget condiviso `search.js` in
ogni pagina renderizzata - un progetto con la ricerca disattivata non
distribuisce assolutamente nulla legato alla ricerca.

## Ricompilare solo l'indice

```bash
bxDocs search-index
```

Utile se serve solo aggiornare `search-index.json` - `build` esegue già
questo passaggio come uno dei propri, quindi non serve eseguirlo
separatamente dopo un build normale.
