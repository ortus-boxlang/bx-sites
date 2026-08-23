---
title: Riferimento CLI
order: 3
icon: phosphor-duotone:terminal-window
summary: Ogni verbo di bxSites e i suoi flag.
tags: [riferimento, cli]
---

# Riferimento CLI

```bash
bxSites <verbo> [opzioni]
```

`box install bx-sites` crea uno script `bxSites` autonomo sul tuo `PATH`
(tramite `boxlang.executable` di `box.json`), quindi ogni verbo qui sotto
può essere eseguito sia in quella forma breve, sia come
`boxlang module:bxsites <verbo>` - entrambe eseguono esattamente la stessa
cosa; usa la forma più lunga ovunque lo shim sul `PATH` non sia impostato
(un runner di CI, un modulo registrato a mano):

```bash
boxlang module:bxsites <verbo> [opzioni]
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
bxSites new [path] [--name=...] [--theme=bootstrap|material|tailwind] [--description=...] [--format=yaml|json]
```

- `--name` - il nome del sito scritto nella configurazione del sito (per default, il nome della cartella di destinazione)
- `--theme` - il valore predefinito è `bootstrap`
- `--description` - la descrizione del sito scritta nella configurazione del sito
- `--format` - `yaml` (predefinito, genera lo scheletro di `bxsites.yaml`) oppure `json` (genera lo scheletro di `bxsites.json`)

## `build`

Genera `docs/**.md` in un sito statico dentro `site/`. Compila anche
l'indice di ricerca (a meno che `search` non sia `false` nella
configurazione del sito) e copia il tema + `docs/assets/**` in `site/`.

```bash
bxSites build
```

## `serve`

Compila e serve il sito in locale con ricaricamento automatico.

```bash
bxSites serve [--port=8080] [--host=127.0.0.1]
```

Gira in primo piano finché non viene interrotto (Ctrl+C).

## `search-index`

Ricompila `site/search-index.json` in modo autonomo, senza rirenderizzare
le pagine o ricopiare gli asset. `build` esegue già automaticamente
questo stesso passaggio - questo verbo esiste per i casi in cui serve
solo aggiornare l'indice.

```bash
bxSites search-index
```

## `clean`

Rimuove `site/` e qualsiasi cache di compilazione, lasciando intatti
`docs/` e la configurazione del sito.

```bash
bxSites clean
```

## `gh-deploy`

Compila il sito, poi lo forza (force-push) su un branch in stile
`gh-pages` - un commit per ogni deploy, senza storia accumulata su quel
branch, seguendo la stessa convenzione di `mkdocs gh-deploy` propria di
mkdocs. Richiede che il progetto sia un repository git con un remote
configurato; non tocca mai il tuo branch corrente o la working tree
(effettua il push da una `git worktree` usa e getta).

```bash
bxSites gh-deploy [--branch=gh-pages] [--remote=origin] [--message="..."]
```

- `--branch` - il valore predefinito è `gh-pages`
- `--remote` - il valore predefinito è `origin`
- `--message` - il messaggio dell'unico commit del branch, il valore predefinito è `"Deploy site via bxSites gh-deploy"`

Vedi [Distribuzione](guides/deployment.md) per la configurazione completa
di GitHub Pages (attivare Pages per il branch, `baseURL`, ecc.).

## `migrate`

Converte un export di GitBook - un sommario `SUMMARY.md` più i suoi file
`.md`, il formato di sincronizzazione su disco proprio di GitBook -
nell'albero `docs/` di questo progetto: `SUMMARY.md` diventa
`docs/nav.json`, la sintassi `{% block %}` diventa il proprio equivalente
in bx-sites (direttive `::: name`, oppure la sintassi nativa `=== "Title"`
per le schede / `!!! type` per le ammonizioni dove esiste già una
corrispondenza più stretta - vedi
[Blocchi di contenuto](guides/content-blocks.md)), i file
`README.md` diventano `index.md`, e `.gitbook/assets/**` viene copiato in
`docs/assets/gitbook/`.

```bash
bxSites migrate --source=/percorso/dell/export-gitbook
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

## `check`

Un controllo di qualità del contenuto di livello CI su un `site/` già
compilato - esegui prima `build`. Verifica:

- **Link/immagini interni rotti** - qualsiasi `<a href>`/`<img src>` che
  punta a una pagina o un asset che non esiste in `site/`. Fa fallire il
  controllo.
- **Testo alternativo mancante** - qualsiasi `<img>` senza alcun
  attributo `alt`. Un `alt=""` vuoto (il markup corretto per un'immagine
  puramente decorativa) non viene segnalato. Fa fallire il controllo.
- **Pagine orfane** - pagine che esistono in `site/` ma non sono
  raggiungibili seguendo i link dalla home page propria di qualsiasi
  albero (l'`index.html` del sito principale, e quello proprio di ogni
  versione/locale). Solo informativo - non fa mai fallire il controllo,
  dato che una pagina che un progetto ha deliberatamente lasciato fuori
  dalla propria nav (ad es. frontmatter `hidden: true`) *deve* essere
  raggiungibile solo tramite un link diretto.

```bash
bxSites build
bxSites check
```

Esce con `1` quando ci sono link/immagini rotti o immagini senza alt,
`0` altrimenti (le pagine orfane non influiscono mai sul codice di
uscita). Deliberatamente limitato ai soli link interni - non effettua
richieste HTTP per verificare URL esterni, cosa che spetta a uno
strumento dedicato di controllo link eseguito come proprio job separato.
