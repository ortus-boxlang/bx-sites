---
title: Versionamento
order: 7.5
icon: phosphor-duotone:git-branch
summary: Distribuisci la documentazione di più di una release contemporaneamente - crea un'istantanea di versione, e ogni tema ottiene gratuitamente un selettore di versione.
tags: [guide, versionamento]
---

# Versionamento

La documentazione versionata è convenzione anziché configurazione - non
c'è alcuna chiave di `bxsites.json` da attivare. Aggiungi una cartella
`docs/versions/`, e ogni sottocartella diretta al suo interno viene
compilata come proprio albero di documenti completamente autonomo,
insieme al tuo normale `docs/` (che si compila sempre come "Latest"):

```text title="Struttura di docs/"
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

Ogni cartella versione è un normale albero a forma di `docs/` - il
proprio `index.md`, la propria nav, le proprie pagine - compilata in
`site/versions/<name>/` con ogni link interno prefissato di conseguenza,
e condividendo l'unica configurazione/tema `bxsites.json` del progetto.
Un file sciolto messo direttamente sotto `docs/versions/` (non dentro una
sottocartella) viene ignorato.

## Creare una nuova versione

`version:new` crea un'istantanea dell'albero `docs/` *corrente* dentro
`docs/versions/<name>/` - il workflow abituale è: finisci la
documentazione per una release, crea una versione appena prima di
iniziare a scrivere la documentazione per la prossima, così l'istantanea
congela esattamente ciò che è stato distribuito:

```bash title="Terminal"
bxSites version:new --name=1.0
```

- `--name` (obbligatorio) - la cartella/etichetta di versione, ad es. `1.0`

L'istantanea esclude `assets/`, `versions/`, `i18n/`, e `blog/` - ognuno
di questi è un proprio albero caricato separatamente, non parte del
contenuto proprio di una versione, quindi non viene mai duplicato al suo
interno.

Non c'è un verbo equivalente per "annullare l'istantanea" e nessun altro
verbo mira a una versione specifica - `page:new`/`page:rename`/`post:new`/
ecc. operano sempre contro l'albero `docs/` principale. Modificare le
pagine proprie di una versione già creata (correggere un refuso in
`docs/versions/1.0/guides/setup.md`, per esempio) è semplicemente
modificare quel file direttamente, come qualsiasi altra pagina.

## Cosa viene compilato

Ogni versione si compila in `site/versions/<name>/`, con la propria nav,
i propri breadcrumb, i propri link precedente/successivo, e gli
`editUri` propri correttamente delimitati al percorso sorgente di quella
versione. I nomi delle versioni si ordinano **dal più recente,
numericamente** invece che alfabeticamente - `2.0` viene prima di `10.0`
- e ogni tema integrato renderizza automaticamente un menu a discesa
selettore di versione nell'header non appena esiste più di una versione
(l'albero principale "Latest" conta come una) - niente da attivare.
Cambiare versione ti mantiene sull'albero della pagina equivalente quando
possibile.

`sitemap.xml` e `llms.txt` includono le pagine di ogni versione insieme a
quelle del sito principale - una versione è una parte di prima classe,
completamente esplorabile/collegabile del sito, non un archivio nascosto.

## Combinare con i18n

Anche una versione può essere tradotta - vedi
["Documenti versionati e tradotti" di i18n](i18n.md#versioned-and-translated-docs)
per la convenzione `docs/versions/<name>/i18n/<code>/`, che rispecchia
esattamente la struttura propria di una versione allo stesso modo in cui
il `docs/i18n/<code>/` di primo livello rispecchia `docs/` stesso.

## Cosa è fuori scopo (per ora)

- **La ricerca è delimitata per albero, non unificata tra le versioni.**
  Il provider di ricerca `local` predefinito scrive un
  `search-index.json` separato per ogni albero durante un vero `build` -
  `site/search-index.json` per "Latest", `site/versions/2.0/search-index.json`
  per la versione `2.0`, e così via - quindi la ricerca di un visitatore
  copre sempre solo la versione che sta leggendo in quel momento, mai
  tutte le versioni insieme. I verbi CLI autonomi `search-index`/
  `search:query` vanno oltre e caricano sempre solo l'albero `docs/`
  principale indipendentemente da quante versioni esistano, dato che
  sono pensati per un controllo rapido contro la documentazione
  attualmente in lavorazione, non per un build completo - esegui prima
  `build` se ti serve il vero indice di una versione. Il provider di
  ricerca `pagefind` è l'eccezione: esplora l'*intero* `site/` compilato
  in un solo passaggio, versioni incluse - vedi
  [Ricerca](search.md#other-search-providers).
- **Nessun flag deprecato/fine-vita, nessuna etichetta personalizzata.**
  La voce del selettore di una versione è sempre solo il proprio nome di
  cartella - non c'è alcuna configurazione per contrassegnarne una come
  non supportata o per rinominare la sua etichetta visualizzata
  indipendentemente dalla cartella. Archiviare una vecchia versione
  significa lasciare la sua cartella al proprio posto (oppure rimuoverla
  e accettare i link rotti, come per rimuovere qualsiasi altra pagina).
