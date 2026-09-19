---
title: Origine del contenuto
order: 0.5
icon: phosphor-duotone:folder-open
tags: [guide, configurazione]
---

# Origine del contenuto

Ogni progetto ha esattamente una content root - la cartella che bxSites
analizza alla ricerca di pagine `.md`, `assets/`, `blog/`, `i18n/`,
`versions/`, e tutto il resto trattato altrove in questi documenti.
Questa guida copre come viene trovata quella cartella, come puntarla
altrove con `source`, come tenere fuori dalla scansione i file estranei
con `exclude`, e dove vive la sovrascrittura di tema propria di un
progetto rispetto ad essa.

## Rilevamento automatico (il comportamento predefinito)

Senza alcuna chiave `source` impostata, bxSites cerca prima `docs/`, poi
`src/`, e usa qualunque delle due esista davvero sul disco - la stessa
convenzione di lunga data trattata in
[Per iniziare](../getting-started.md#aggiungere-pagine). Va bene per la
maggior parte dei progetti e non richiede alcuna configurazione.

## La chiave di configurazione `source`

Imposta `source` in `bxsites.yaml` per saltare il rilevamento automatico
e indicare esplicitamente dove vive il tuo contenuto:

=== "YAML"
    ```yaml title="bxsites.yaml"
    source: docs
    ```

=== "JSON"
    ```json title="bxsites.json"
    { "source": "docs" }
    ```

=== "TOML"
    ```toml title="bxsites.toml"
    source = "docs"
    ```

`source` accetta:

- `docs` o `src` - gli stessi due nomi convenzionali che il rilevamento
  automatico già controlla, semplicemente indicati in modo esplicito
  invece che dedotti.
- Qualsiasi altro nome di cartella - `content`, `pages`, `website`,
  qualunque cosa si adatti al tuo progetto. Il rilevamento automatico
  cerca solo `docs`/`src`; un nome personalizzato richiede sempre un
  `source` esplicito.
- `.` - la radice del progetto stessa è la content root, senza alcuna
  sottocartella. Utile per un progetto che è *soltanto* un sito di
  documentazione - nient'altro nel repository - dove aggiungere uno
  strato `docs/` sopra sarebbe solo un'altra cartella da attraversare.
  `build`/`serve`/ogni altro verbo analizza allora l'intera radice del
  progetto alla ricerca di pagine `.md`, esattamente come farebbe con
  `docs/` altrimenti.

`bxSites new` scrive sempre un `source:` esplicito nel `bxsites.yaml` che
genera (`docs` per impostazione predefinita, o qualunque `--source=...`
tu abbia passato) - vedi
[Per iniziare](../getting-started.md#generare-lo-scheletro-di-un-progetto) -
così un progetto appena creato non è mai ambiguo su dove vive il suo contenuto,
anche prima che il rilevamento automatico entri in gioco.

Un nome resta comunque vietato: `source: site` fallisce sempre, dato che
`site/` è l'output di build generato proprio di bxSites - ogni build lo
rimuove e lo ricrea, quindi lasciarlo fungere anche da cartella sorgente
significherebbe una build che cancella il proprio stesso contenuto.

## L'errore `BxSites.SourceNotConfigured`

Se `source` viene lasciata non impostata **e** né `docs/` né `src/`
esistono sul disco, la build fallisce in modo esplicito invece di
ricadere silenziosamente sulla radice del progetto:

```text
BxSites.SourceNotConfigured: No docs/ or src/ folder found, and no
[source] set in bxsites.yaml - set source: docs, source: src, or
source: . (if your whole repo is the content) to tell bxSites where
your content lives
```

Questo è voluto - indovinare "la radice del progetto deve essere il
contenuto" ogni volta che nessuna delle due cartelle convenzionali esiste
finirebbe per raccogliere silenziosamente cose come `README.md`, un
`CHANGELOG.md`, la configurazione CI, o il codice sorgente proprio di un
repository in una build, nel momento in cui qualcuno rinominasse `docs/`
in qualcos'altro, o eseguisse bxSites contro un repository che non è mai
stato pensato per essere un sito di documentazione. La correzione è
sempre una riga in `bxsites.yaml`:

=== "YAML"
    ```yaml title="bxsites.yaml"
    source: .
    ```

=== "JSON"
    ```json title="bxsites.json"
    { "source": "." }
    ```

=== "TOML"
    ```toml title="bxsites.toml"
    source = "."
    ```

(oppure `source: docs`/`source: src` se intendevi una di quelle e la
cartella semplicemente non esiste ancora - creala, o punta `source` dove
il contenuto vive realmente).

## Escludere file e cartelle

bxSites esclude sempre da sé una manciata di nomi dalla scansione del
contenuto - `.git`, `.github`, `node_modules`, `boxlang_modules`, `site`,
`.theme`, `.themes`, e il proprio file di configurazione
(`bxsites.yaml`/`.yml`/`.toml`/`.json`, `box.json`) - allo stesso modo in
cui esclude già `assets/`, `versions/`, `i18n/`, `blog/` e `includes/`
dall'essere scansionati come pagine normali. `exclude` aggiunge i tuoi
nomi sopra a quell'elenco:

=== "YAML"
    ```yaml title="bxsites.yaml"
    source: .
    exclude:
      - tests
      - build
      - CONTRIBUTING.md
    ```

=== "JSON"
    ```json title="bxsites.json"
    {
    	"source": ".",
    	"exclude": ["tests", "build", "CONTRIBUTING.md"]
    }
    ```

=== "TOML"
    ```toml title="bxsites.toml"
    source = "."
    exclude = [ "tests", "build", "CONTRIBUTING.md" ]
    ```

Ogni voce è un nome nudo, confrontato allo stesso modo delle esclusioni
integrate - alla radice della cartella di contenuto, o ovunque al suo
interno.

Questo è più utile in coppia con `source: .`. Una volta che l'intero
repository è la content root, tutto ciò che contiene e non è di per sé
una pagina va nominato esplicitamente - una cartella `tests/`, una
directory di output `build/`, la configurazione del tooling, o qualsiasi
altra cosa che altrimenti verrebbe scansionata e pubblicata come se fosse
una pagina di documentazione. `exclude` non è deliberatamente
pre-popolato con `README.md`/`LICENSE.md`/`CHANGELOG.md`, però - un
progetto è libero di avere una vera pagina di contenuto esattamente a uno
di questi nomi (il `docs/license.md` proprio di questo modulo, ad
esempio), quindi se il tuo progetto `source: .` non vuole che il proprio
`README.md`/`LICENSE.md`/`CHANGELOG.md` alla radice venga pubblicato come
pagina, escludilo per nome tramite `exclude` invece di contare su un
comportamento automatico.

Vedi [Configurazione: `exclude`](../configuration.md#exclude) per il
riferimento completo.

## Dove vive una sovrascrittura di tema

La sovrascrittura di tema propria di un progetto - un `.theme/` scritto a
mano (vedi [Temi: Sovrascrivere un tema](themes.md#sovrascrivere-un-tema))
oppure un `.themes/<name>/` installato con `install:theme` (vedi
[Temi: Installare un tema pubblicato](themes.md#installare-un-tema-pubblicato)) -
vive **dentro la content root risolta**, non alla radice nuda del
progetto: `<contentRoot>/.theme/` e `<contentRoot>/.themes/<name>/`, dove
`<contentRoot>` è qualunque cosa risolva `source` (o il rilevamento
automatico) - `docs/`, `src/`, un nome di cartella personalizzato, oppure
la radice del progetto stessa per `source: .`.

```text title="Struttura del progetto"
my-project/
├── bxsites.yaml          ← source: docs
└── docs/                 ← la content root risolta
    ├── index.md
    ├── assets/
    └── .theme/            ← vive dentro docs/, non alla radice del progetto
        ├── layout.bxm
        └── page.bxm
```

Tenere `.theme`/`.themes` dentro la content root invece che alla radice
nuda del progetto conta soprattutto una volta che un repository ha più
di una content root al suo interno - vedi
[Monorepo multi-dominio](multi-domain.md) per questo schema. La
sovrascrittura di tema propria di ogni content root vive allora senza
ambiguità accanto al contenuto che tematizza, senza alcuna domanda su a
quale dominio apparterrebbe una cartella `theme/` nuda alla radice.
