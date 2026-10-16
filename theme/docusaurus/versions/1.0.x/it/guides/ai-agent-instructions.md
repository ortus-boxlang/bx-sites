---
title: Istruzioni per Agenti IA
order: 6.4
icon: phosphor-duotone:file-text
summary: Ogni nuovo progetto riceve automaticamente un prontuario AGENTS.md per la stesura dei contenuti - chiavi di frontmatter, direttive dei blocchi di contenuto e il flusso di lavoro per le pagine, generato dal tema e dalla cartella sorgente reali del tuo progetto.
tags: [guide, ai, agents]
---

# Istruzioni per Agenti IA

`bxSites new` scrive per default un `AGENTS.md` nella radice del tuo
progetto - un prontuario compatto che copre ciò di cui la maggior parte
delle modifiche di un agente di coding IA ai tuoi contenuti ha davvero
bisogno: le chiavi di frontmatter riconosciute, ogni direttiva di blocco di
contenuto `::: name :::` con la sua sintassi, le cartelle riservate e il
flusso di lavoro di base `page:new` -> `serve` -> `lint` -> `build`. Viene
generato dal tema e dalla cartella sorgente reali del *tuo* progetto, non
da un modello generico, ed è il corrispettivo, per la stesura dei
contenuti, del pacchetto più approfondito [Skill per Agenti IA](ai-agent-skills.md)
- un riferimento rapido che un assistente può leggere in un'unica
passata, a differenza delle skill che carica su richiesta per un compito
specifico.

Questo è un pubblico diverso rispetto all'`AGENTS.md` nella radice del
**repository bx-sites stesso** - quello insegna a un assistente come
lavorare sul codice sorgente di bx-sites in sé. Questa guida riguarda il
file generato nel *tuo* progetto di sito, per aiutare un assistente a
modificare correttamente *i tuoi* contenuti.

## Cosa viene scritto

```bash title="Predefinito: solo AGENTS.md"
bxSites new my-docs
```

```text title="my-docs/"
my-docs/
├── AGENTS.md
├── .markdownlint.json
├── bxsites.yaml
└── docs/
    ├── assets/
    └── index.md
```

`.markdownlint.json` viene sempre scritto insieme ad esso - un insieme di
regole calibrato sui contenuti di bx-sites (allenta le regole su lunghezza
delle righe, tabulazioni e URL nude che altrimenti segnalerebbero Markdown
normale di bx-sites, come una lunga riga di direttiva di blocco di
contenuto o un blocco di codice senza linguaggio indicato).

### Scegliere quale/i file

Non tutti i progetti usano Claude Code in particolare, quindi
`CLAUDE.md`/`.cursorrules` sono opzionali tramite `--agents`:

```bash title="Scrivere anche CLAUDE.md"
bxSites new my-docs --agents=agents,claude
```

```bash title="Saltare completamente il/i file di istruzioni"
bxSites new my-docs --agents=none
# .markdownlint.json viene comunque scritto
```

| Destinazione | File |
|---|---|
| `agents` (predefinito) | `AGENTS.md` |
| `claude` | `CLAUDE.md` |
| `cursor` | `.cursorrules` |

## Mantenerlo aggiornato: `agents:sync`

Il contenuto generato si trova all'interno di un blocco contrassegnato:

```text title="AGENTS.md"
<!-- bxsites:agents:start -->
...prontuario generato...
<!-- bxsites:agents:end -->
```

Modifica liberamente sopra o sotto i marcatori - tue note di progetto,
convenzioni di team, link a una guida di stile interna, quello che vuoi.
Esegui `agents:sync` quando vuoi (dopo un aggiornamento di bx-sites che
aggiunge nuove direttive o chiavi di frontmatter, o per aggiornare un
progetto generato prima che questa funzione esistesse) e viene rinfrescato
solo il blocco contrassegnato:

```bash title="Utilizzo"
bxSites agents:sync
```

Tre esiti possibili per ogni file di destinazione, riportati come risultato:

- **Created** - il file non esisteva ancora.
- **Updated** - marcatori trovati, il blocco tra di essi rinfrescato, tutto
  ciò che sta fuori lasciato intatto.
- **Skipped** - il file esiste ma non ha marcatori. Non viene sovrascritto
  nulla; è o un file scritto a mano prima che questa funzione esistesse,
  oppure uno i cui marcatori sono stati rimossi apposta per escluderlo dai
  sync futuri.

`agents:sync` riscrive inoltre sempre `.markdownlint.json` con l'insieme di
regole canonico attuale, e accetta lo stesso flag `--agents=` di `new` per
mirare a file specifici.

## FAQ

??? faq "`agents:sync` sovrascriverà le mie note?"
    No - viene sostituito solo il testo tra `<!-- bxsites:agents:start -->`
    e `<!-- bxsites:agents:end -->`. Il contenuto che aggiungi al di fuori
    di quei marcatori, nello stesso file, viene preservato ad ogni sync.

??? faq "Non voglio che AGENTS.md venga più toccato - come escludo un file?"
    Elimina (o non aggiungere più) i marcatori
    `bxsites:agents:start`/`end`. `agents:sync` tratta un file senza
    marcatori come scritto a mano e lo segnala come saltato invece di
    sovrascriverlo.

??? faq "Questo sostituisce il pacchetto Skill per Agenti IA?"
    No - coprono ambiti diversi. Questo è un singolo prontuario, sempre
    presente, per la stesura dei contenuti; [Skill per Agenti IA](ai-agent-skills.md)
    (`bxSites skills:install`) è un pacchetto molto più approfondito, di
    tredici skill, che un assistente carica su richiesta, coprendo tutto
    dal theming al deployment. La maggior parte dei progetti trae beneficio
    da entrambi.

??? faq "Perché non c'è una riga `::: comments :::` nella tabella delle direttive?"
    I commenti dei lettori non sono ancora una funzione di bx-sites - il
    file generato lo dice esplicitamente, così un assistente non inventa
    una sintassi che non esiste.

## Fonte

- Generatore: `models/build/AgentsFileGenerator.bx`
- Verbi CLI: `models/cli/New.bx` (il flag `--agents` di `new`), `models/cli/AgentsSync.bx`
- Vedi [Riferimento CLI](../cli-reference.md#new) e
  [Riferimento CLI](../cli-reference.md#agentssync) per il riferimento completo dei flag.
