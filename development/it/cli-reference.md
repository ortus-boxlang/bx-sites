---
title: Riferimento CLI
order: 3
icon: ⌨️
summary: Ogni verbo di bxDocs e i suoi flag.
tags: [riferimento, cli]
---

# Riferimento CLI

```bash
bxDocs <verbo> [opzioni]
```

`box install bx-docs` crea uno script `bxDocs` autonomo sul tuo `PATH`
(tramite `boxlang.executable` di `box.json`), quindi ogni verbo qui sotto
può essere eseguito sia in quella forma breve, sia come
`boxlang module:bxdocs <verbo>` - entrambe eseguono esattamente la stessa
cosa; usa la forma più lunga ovunque lo shim sul `PATH` non sia impostato
(un runner di CI, un modulo registrato a mano):

```bash
boxlang module:bxdocs <verbo> [opzioni]
```

Ogni verbo accetta `--projectRoot=<percorso>` (oppure un percorso
posizionale semplice) per puntare a un progetto diverso dalla cartella
corrente, e i due flag globali qui sotto possono comparire prima di
qualsiasi verbo.

## Opzioni globali

| Flag | Descrizione |
|---|---|
| `-h`, `--help` | Mostra l'utilizzo ed esce |
| `-v`, `--version` | Mostra la versione del modulo ed esce |

## `new`

Genera lo scheletro di un progetto di documentazione.

```bash
bxDocs new [path] [--name=...] [--theme=bootstrap|material|tailwind] [--description=...]
```

- `--name` - il nome del sito scritto in `bxdocs.json` (per default, il nome della cartella di destinazione)
- `--theme` - il valore predefinito è `bootstrap`
- `--description` - la descrizione del sito scritta in `bxdocs.json`

## `build`

Genera `docs/**.md` in un sito statico dentro `site/`. Compila anche
l'indice di ricerca (a meno che `search` non sia `false` in
`bxdocs.json`) e copia il tema + `docs/assets/**` in `site/`.

```bash
bxDocs build
```

## `serve`

Compila e serve il sito in locale con ricaricamento automatico.

```bash
bxDocs serve [--port=8080] [--host=127.0.0.1]
```

Gira in primo piano finché non viene interrotto (Ctrl+C).

## `search-index`

Ricompila `site/search-index.json` in modo autonomo, senza rirenderizzare
le pagine o ricopiare gli asset. `build` esegue già automaticamente
questo stesso passaggio - questo verbo esiste per i casi in cui serve
solo aggiornare l'indice.

```bash
bxDocs search-index
```

## `clean`

Rimuove `site/` e qualsiasi cache di compilazione, lasciando intatti
`docs/` e `bxdocs.json`.

```bash
bxDocs clean
```

## `gh-deploy`

Compila il sito, poi lo forza (force-push) su un branch in stile
`gh-pages` - un commit per ogni deploy, senza storia accumulata su quel
branch, seguendo la stessa convenzione di `mkdocs gh-deploy` propria di
mkdocs. Richiede che il progetto sia un repository git con un remote
configurato; non tocca mai il tuo branch corrente o la working tree
(effettua il push da una `git worktree` usa e getta).

```bash
bxDocs gh-deploy [--branch=gh-pages] [--remote=origin] [--message="..."]
```

- `--branch` - il valore predefinito è `gh-pages`
- `--remote` - il valore predefinito è `origin`
- `--message` - il messaggio dell'unico commit del branch, il valore predefinito è `"Deploy site via bxDocs gh-deploy"`

Vedi [Distribuzione](guides/deployment.md) per la configurazione completa
di GitHub Pages (attivare Pages per il branch, `baseURL`, ecc.).

## `migrate`

Converte un export di GitBook - un sommario `SUMMARY.md` più i suoi file
`.md`, il formato di sincronizzazione su disco proprio di GitBook -
nell'albero `docs/` di questo progetto: `SUMMARY.md` diventa
`docs/nav.json`, la sintassi `{% block %}` diventa il proprio equivalente
in bx-docs (direttive `::: name`, oppure la sintassi nativa `=== "Title"`
per le schede / `!!! type` per le ammonizioni dove esiste già una
corrispondenza più stretta - vedi
[Estensioni Markdown](guides/markdown.md#gitbook-style-blocks)), i file
`README.md` diventano `index.md`, e `.gitbook/assets/**` viene copiato in
`docs/assets/gitbook/`.

```bash
bxDocs migrate --source=/percorso/dell/export-gitbook
```

- `--source` (obbligatorio) - percorso alla cartella radice dell'export di GitBook (deve contenere `SUMMARY.md`)

Stampa un riepilogo delle pagine convertite e, quando qualcosa non ha
potuto essere convertito automaticamente (un blocco non supportato come
`{% prompt %}`, uno stile di hint non riconosciuto, una larghezza di
colonna che non è una lunghezza semplice), un elenco esatto di cosa
richiede un controllo manuale - niente viene mai scartato in silenzio, un
blocco non riconosciuto viene lasciato nella propria sintassi originale
`{% %}` nel file migrato. Un file di destinazione o un `docs/nav.json`
già esistenti vengono sovrascritti (anche questo segnalato), quindi
rivedi l'output migrato prima di fare il commit.
