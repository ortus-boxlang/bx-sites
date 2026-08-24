---
title: Importare un tema
order: 6.5
icon: phosphor-duotone:arrows-left-right
tags: [guide, temi, migrazione]
---

# Importare un tema

`bxSites theme:import` converte un tema proveniente dall'ecosistema di un
altro generatore di siti statici in uno scheletro di tema bx-sites sotto
`themes/<name>/` - un punto di partenza fatto con il massimo impegno
possibile, non una conversione senza perdite in un solo comando. Gestisce
i tre ecosistemi la cui struttura di tema si mappa sul contratto
`layout.bxm`+`page.bxm` proprio di bx-sites (vedi
[Temi](themes.md#il-contratto-themeprovider)):

- **`mkdocs`** - template Jinja2 (sia mkdocs nativo sia mkdocs-material
  usano `base.html`+`main.html`)
- **`jekyll`** - template Liquid (`_layouts/default.html`+
  `_layouts/page.html`)
- **`hugo`** - template Go (`layouts/_default/baseof.html`+
  `layouts/_default/single.html`)

Un tema basato su componenti React/Vue (Docusaurus, VuePress, Gatsby, ...)
non ha un equivalente qui - non c'è alcun *file* template da tradurre
meccanicamente, dato che il tema è composto da componenti UI compilati
anziché da markup renderizzato lato server. Portare uno di questi
significa riscriverlo da zero come tema bx-sites (vedi
[Scrivere un tema da zero](themes.md#scrivere-un-tema-da-zero)), non
convertirlo.

```bash title="Terminal"
bxSites theme:import --source=mkdocs --path=/percorso/del/tema-mkdocs --name=my-imported-theme
```

- `--source` (obbligatorio) - `mkdocs`, `jekyll`, o `hugo`
- `--path` (obbligatorio) - la cartella radice propria del tema sorgente
  (quella che contiene il suo template di layout, non l'intero *progetto*
  mkdocs/jekyll/hugo - vedi [Migrare da mkdocs](migrating-from-mkdocs.md)/
  [Migrare da GitBook](migrating-from-gitbook.md) per convertire il
  *contenuto* di un progetto, un lavoro diverso dal convertirne il *tema*)
- `--name` (obbligatorio) - il nome di destinazione, scritto in
  `themes/<name>/` (la stessa convenzione dei
  [temi installati](themes.md#installare-un-tema-pubblicato) usata da
  `install:theme`) - imposta `theme.name` di `bxsites.yaml` su questo
  nome una volta soddisfatto del risultato

Rieseguire il comando con lo stesso `--name` è sicuro - `layout.bxm`/
`page.bxm` vengono sovrascritti e qualsiasi cartella di asset appena
trovata viene unita - quindi iterare (modifica il sorgente, o la
mappatura, riesegui) è il flusso di lavoro normale, non un'operazione
one-shot.

## Cosa viene effettivamente convertito

L'output del comando riporta esattamente cosa è successo - quale file
sorgente è diventato `layout.bxm`/`page.bxm` (oppure una nota che non ne
è stato trovato nessuno, se il tema sorgente non usa uno dei nomi file
convenzionali sopra), quali cartelle di asset (`css/`, `js/`, `static/`,
...) sono state copiate testualmente in `themes/<name>/assets/`, e un
elenco numerato di tutto ciò che richiede un controllo manuale.

All'interno di un file template, questo è un **traduttore meccanico e con
il massimo impegno possibile** (`JinjaLikeTranslator.bx` per la sintassi
Jinja2/Liquid condivisa da mkdocs/jekyll, `GoTemplateTranslator.bx` per i
template Go di hugo) - non un vero parser per nessuno dei due linguaggi.
Cosa gestisce:

- Output di variabili (`{{ page.title }}` / `{{ .Title }}` di Hugo),
  mappati su una piccola tabella fissa dei campi comuni (titolo/contenuto/
  descrizione della pagina, nome/descrizione del sito, URL base, nav) -
  qualsiasi cosa fuori da quella tabella viene lasciata come marcatore
  `<!--- TODO: ... --->` invece di essere indovinata.
- `if`/`elif`/`else`/`endif` (mkdocs/jekyll) o `if`/`else if`/`else`/`end`
  (hugo), tradotti in una vera struttura `<bx:if>`/`<bx:elseif>`/
  `<bx:else>` - sempre strutturalmente valida anche quando la
  *condizione* stessa fa riferimento a qualcosa fuori dalla tabella di
  mappatura (segnalata invece come avviso, dato che lasciare rotto l'`if`
  circostante sarebbe peggio di una condizione che una persona deve
  ancora controllare).
- `for x in list`/`endfor` (mkdocs/jekyll) o `range`/`end` (hugo),
  tradotti in `<bx:loop>` allo stesso modo. Il `range` di Hugo rilega `.`
  a ogni elemento senza una variabile di loop con nome nel caso comune -
  il `<bx:loop>` generato usa sempre un nome sintetico `item`, e un
  avviso permanente segnala che un `.Field` nudo *dentro* il corpo del
  loop si riferisce al campo proprio dell'elemento del range in Go, cosa
  che non può essere ritargettizzata automaticamente su `item.Field`.
- Commenti (`{# ... #}`/`{% comment %}` per Jinja2/Liquid, `{{/* ... */}}`
  per Go), eliminati del tutto.

Cosa non viene deliberatamente tradotto, sempre lasciato come marcatore
TODO (oppure, all'interno di una condizione dove lasciare sintassi grezza
non tradotta produrrebbe BoxLang non valido, sostituito con un segnaposto
sintatticamente sicuro - `false` per una condizione, `[]` per
l'espressione di lista di un loop - segnalato allo stesso modo):

- Un filtro/pipeline (`{{ page.title | upper }}`, `{{ .Title | truncate 100 }}`)
  - la semantica dei filtri varia troppo per essere indovinata in modo
  sicuro. Vale comunque la pena verificarlo manualmente, dato che un
  filtro con un equivalente BoxLang chiaramente sicuro (`upper` →
  `ucase()`) è abbastanza comune da essere una correzione manuale rapida.
- Ereditarietà dei template (`{% extends %}`/`{% block %}` di Jinja2,
  `{{ block }}`/`{{ define }}` di Hugo) e include/partial
  (`{% include %}`) - nessun modo automatico di mapparli sul contratto
  `layout.bxm`+`page.bxm` a file singolo proprio di bx-sites.
- Il `{{ with .X }}` di Hugo - rilega `.` a un nuovo contesto per il
  proprio corpo, senza alcun equivalente in bx-sites, quindi viene
  lasciato non tradotto invece di essere emesso come un `<bx:if>`
  strutturalmente valido ma semanticamente sbagliato.
- Una condizione Go che non è un singolo riferimento a campo (Go scrive
  la logica booleana come chiamate di funzione prefisse - `{{ if and .A .B }}`,
  `{{ if eq .Type "post" }}` - che non hanno un equivalente infisso in
  BoxLang; sostituire solo i token `.Field` al suo interno lascerebbe
  comunque testo BoxLang non valido, quindi l'intera condizione viene
  sostituita con il segnaposto).
- Qualsiasi riferimento a variabile non presente nella tabella di
  mappatura fissa.

## Dopo l'importazione

Lo scheletro è un punto di partenza, non un tema finito - lavora sui
marcatori TODO e sugli avvisi segnalati, poi verificalo rispetto al
[contratto ThemeProvider](themes.md#il-contratto-themeprovider) nello
stesso modo in cui deve farlo un tema scritto a mano
(`layout.bxm`+`page.bxm` obbligatori, `search.bxm` opzionale). Nessuna
delle convenzioni di funzionalità di pagina che ogni tema integrato
implementa (modalità scura, breadcrumb, precedente/successivo, il box di
ricerca, ...) arriva automaticamente - il markup proprio del tema
sorgente per queste, se ne aveva, è passato per la stessa traduzione
meccanica di tutto il resto e necessita della stessa revisione.
