---
title: Corsi
order: 12.6
icon: phosphor-duotone:graduation-cap
tags: [guide, corsi]
---

# Corsi

Un **corso** trasforma un insieme di pagine in una sequenza guidata e
numerata - lezione 1, lezione 2, lezione 3... - con un proprio indice
numerato generato automaticamente, un proprio precedente/successivo
"Lezione N di M" limitato al corso (indipendente dall'ordine globale
pagina-per-pagina del sito), e, non appena un lettore apre una lezione, i
progressi tracciati nel proprio browser: quali lezioni ha completato, e
un link "Continua da dove avevi interrotto" che riporta all'ultima
visitata.

## Il manifest

Aggiungi un file `docs/data/courses.yaml` (funzionano anche `.yml`/
`.json` - vedi [File di dati](data-files.md)). Ogni chiave di primo
livello è un corso; il suo array `lessons` elenca le pagine proprie di
quel corso, in ordine - la posizione nell'array *è* il numero della
lezione:

```yaml title="docs/data/courses.yaml"
getting-started:
  title: "Getting Started with BoxLang"
  description: "A guided walkthrough from install to your first deployed site."
  lessons:
    - guides/course/introduction.md
    - guides/course/windows-installation.md
    - guides/course/mac-installation.md
    - guides/course/creating-a-new-site.md
```

Ogni voce di `lessons` è una stringa di percorso relativa a `docs/`, la
stessa convenzione di percorso relativo che usa già `nav.json`. Il
titolo/riepilogo di una lezione provengono dal *frontmatter proprio di
quella pagina* - non duplicati nel manifest - quindi rinominare il
titolo di una pagina, o modificarne il riepilogo, si riflette
automaticamente nell'indice del corso. Più corsi significano
semplicemente più chiavi di primo livello nello stesso file.

## L'indice

Inserisci una singola riga in un punto qualsiasi del tuo Markdown per
renderizzare l'indice numerato proprio di quel corso:

```markdown
::: course id="getting-started" :::
```

Questo renderizza un vero `<ol>` semantico - un link numerato per ogni
lezione, ciascuno con il proprio titolo e riepilogo - più (inizialmente
nascosti, riempiti lato client una volta che un lettore ha effettivamente
iniziato) una barra di progresso e un link "Continua da dove avevi
interrotto". Un `id` con un errore di battitura, o un corso le cui
lezioni non esistono tutte, degrada a una piccola nota visibile invece di
far fallire il build.

## Pagine delle lezioni

Ogni pagina elencata nei `lessons` di un corso riceve automaticamente un
contesto `course` (`page.course` - vedi [Variabili di
contesto](variables-and-functions.md#variabili-di-contesto)) con la
propria posizione, il proprio titolo, e un precedente/successivo
*limitato al corso* - `page.course.prevLesson`/`.nextLesson` si spostano
sempre e solo all'interno di quello stesso corso, a differenza del
[`page.prevPage`/`.nextPage`](variables-and-functions.md#variabili-di-contesto)
globale proprio del sito, che percorre l'intero albero di navigazione
indipendentemente da qualsiasi corso. Una lezione non deve dichiarare a
quale corso appartiene, né dove - il manifest è l'unico punto in cui
questo viene deciso, e una pagina non può finire accidentalmente in due
corsi (un errore di stesura che il build intercetta con un errore chiaro
- vedi [Errori](#errori)).

Attualmente, il tema bootstrap renderizza questa navigazione limitata al
corso - un badge "Lezione N di M", un pager precedente/successivo
limitato al corso, e un interruttore "Segna come completata" -
direttamente sulla pagina della lezione. Ogni altro tema integrato
calcola comunque correttamente `page.course` (così un progetto che ne usa
uno può già farlo emergere tramite la propria [sovrascrittura di
tema](themes.md#sovrascrivere-un-tema)); un'interfaccia nativa nel resto
dei temi integrati è nella roadmap.

## Monitoraggio dei progressi

Non appena un lettore apre una lezione, un marcatore nascosto proprio
della pagina indica a `course-progress.js` (condiviso da ogni tema
integrato, sempre incluso) di registrare la visita - nessuna
configurazione, nessuna adesione esplicita. I progressi vivono
interamente nel `localStorage` proprio di quel browser, sotto
`bxsites-course-progress-<courseId>`:

```json
{
  "firstStarted": "2026-08-30T14:02:11.000Z",
  "lastVisited": { "url": "/guides/course/mac-installation/", "at": "2026-08-30T14:22:03.000Z" },
  "completed": {
    "/guides/course/introduction/": "2026-08-30T14:05:00.000Z",
    "/guides/course/windows-installation/": "2026-08-30T14:12:44.000Z"
  }
}
```

Una lezione viene segnata come completata automaticamente nel momento in
cui la sua pagina viene visitata; l'interruttore "Segna come completata"/
"Segna come non completata" permette a un lettore di annullare un segno
automatico accidentale, oppure di tornare indietro e ricontrassegnare una
lezione in seguito. L'indice del corso legge questi stessi dati per
riempire i propri segni di spunta, la propria barra di progresso ("N di M
completate"), e il link di ripresa.

Si tratta di un puro miglioramento lato client, sovrapposto a un corso
che funziona già pienamente senza di esso - l'indice numerato e il pager
precedente/successivo limitato al corso vengono entrambi renderizzati
lato server, quindi un lettore con JavaScript disattivato, o un crawler
di ricerca, vede comunque la funzionalità di base completa: ogni lezione,
correttamente numerata, correttamente collegata. Il monitoraggio dei
progressi non è affatto necessario perché un corso funzioni;
l'indisponibilità totale dello storage (navigazione privata, dati del
sito bloccati) degrada silenziosamente a "nessun progresso ricordato",
mai a un errore.

I progressi sono per-browser, senza alcun account o backend dietro di
essi - non si sincronizzano tra dispositivi, e non esiste alcuna
registrazione lato server di chi ha letto cosa. Se questo è un requisito
reale per il tuo progetto, esula da ciò che questa funzionalità offre
oggi.

## Estensioni future

Due cose che questa funzionalità deliberatamente **non** implementa
ancora, ma è pensata per poter accogliere in futuro senza rompere un
`courses.yaml` esistente:

- **Quiz tra le lezioni.** Ogni lezione risolta porta già internamente un
  `type` (attualmente sempre `"lesson"`) - una versione futura potrà
  accettare una voce di `lessons` che sia un piccolo oggetto invece di
  una semplice stringa di percorso (ad es. `{ path: ..., type: "quiz" }`)
  accanto alle stringhe semplici, senza che serva alcuna modifica a un
  corso che elenca solo percorsi nudi.
- **Un test/valutazione finale al termine di un corso.** Lo schema del
  manifest riserva (ma ignora) una chiave opzionale di primo livello
  `finalTest` per ogni corso, specificamente affinché questo possa
  arrivare in seguito senza una modifica dello schema che rompa la
  compatibilità - non usare quella chiave per nient'altro nel tuo
  manifest.

## Perché un manifest, e non il frontmatter?

Le lezioni di un corso vengono dichiarate una sola volta, in
`courses.yaml` - non come un campo `course: getting-started` disperso nel
frontmatter proprio di ogni lezione. Un campo per-pagina sarebbe una
seconda fonte di verità non imposta, accanto al manifest, e le due che
entrano in disaccordo (il frontmatter di una lezione indica un corso, il
manifest la elenca in un altro - o in nessuno) sono esattamente il tipo
di deriva silenziosa che questo design evita. Il manifest è l'unico punto
in cui viene deciso l'assetto di un corso - quali lezioni, in quale
ordine; una pagina di lezione non ha mai bisogno di sapere a quale corso
appartiene, né dove.

## Ambito

- Un corso le cui `lessons` non esistono *tutte* come pagine reali
  nell'albero attualmente in fase di build viene saltato silenziosamente
  per quell'albero, mai con un fallimento del build - questo è rilevante
  perché `docs/data/courses.yaml` viene caricato una sola volta, a
  livello di progetto (lo stesso ambito che ha già [File di
  dati](data-files.md#ambito)), e riusato invariato in ogni albero di
  versione/locale; uno snapshot nudo `docs/versions/<name>/` potrebbe non
  contenere affatto i file delle lezioni di un corso.
- Una lezione può appartenere a un solo corso - elencare lo stesso
  percorso sotto due corsi diversi è un vero errore di stesura, e genera
  un'eccezione (vedi [Errori](#errori)).
- Nessun corso annidato/multi-percorso, nessun manifest dei corsi per
  versione con un ordine delle lezioni diverso per versione, in questa
  prima versione.

## Errori

- `BxSites.InvalidConfig` - `docs/data/courses.yaml` ha un problema di
  forma: il valore di un corso non è un oggetto, manca di un `title`, il
  suo `lessons` non è un array non vuoto di stringhe di percorso, oppure
  lo stesso percorso di lezione è elencato sotto più di un corso.
