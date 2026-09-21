---
title: Monorepo multi-dominio
order: 0.6
icon: phosphor-duotone:stack
tags: [guide, configurazione, distribuzione]
---

# Monorepo multi-dominio

Eseguire più di un sito indipendente da un unico repository git - ad
esempio un sito marketing e un sito di documentazione separato, oppure
una manciata di siti prodotto che per comodità condividono un solo
repository - non richiede nulla di speciale da bxSites. Ogni sito è
semplicemente una propria **project root**: un proprio `bxsites.yaml` più
una propria cartella di contenuto, compilato, servito e distribuito in
modo indipendente puntando bxSites su quell'unica cartella. Un "monorepo
con più domini" è semplicemente un repository che contiene diverse di
queste project root fianco a fianco.

## Lo schema

La posizione propria di `bxsites.yaml` è sempre dove punta la project
root esplicita della CLI - la directory di lavoro corrente, oppure un
`--projectRoot=<path>` esplicito (o un percorso posizionale nudo). Non
c'è alcuna ricerca verso l'alto nelle directory e nessun concetto
separato di "radice del repository" rispetto a "project root" - ogni
verbo risolve semplicemente una project root per invocazione e cerca
`bxsites.yaml` (o `.yml`/`.toml`/`.json`) direttamente al suo interno. Un
monorepo con più domini non è altro che un repository che ne contiene
diverse, ognuna indipendentemente completa:

```text title="Struttura del progetto"
my-monorepo/
├── marketing/
│   ├── bxsites.yaml        ← source: .  (oppure docs - scelta propria di marketing)
│   ├── index.md
│   ├── about.md
│   └── .theme/               ← sovrascrittura di tema propria di marketing, se presente
└── docs-site/
    ├── bxsites.yaml        ← source: docs
    └── docs/
        ├── index.md
        ├── guides/
        └── .theme/            ← sovrascrittura di tema propria di docs-site, se presente
```

Ognuna di `marketing/` e `docs-site/` sopra è un progetto bxSites
completo e autonomo - il proprio `bxsites.yaml`, la propria content root
(risolta dalla chiave `source` di quel progetto, o dal rilevamento
automatico - vedi [Origine del contenuto](content-source.md)), e la
propria sovrascrittura `.theme`/`.themes` che vive dentro *quella*
content root. Niente qui è nuovo o specifico dei monorepo; è lo stesso
comportamento a singola project root che bxSites ha sempre avuto, solo
con più di una project root nello stesso repository.

Annidale come preferisci per il repository - come fratelli alla radice
(come sopra), sotto un genitore `sites/` condiviso, o dove altro abbia
senso; a bxSites interessa solo il percorso che gli passi tramite
`--projectRoot`, non dove quel percorso si trova rispetto al resto del
repository.

## Compilare un dominio

Punta `--projectRoot` (o un percorso posizionale nudo) alla project root
che vuoi compilare - ogni verbo lo accetta, non solo `build`:

```bash frame="terminal" title="Terminal"
bxSites build --projectRoot=marketing
bxSites build --projectRoot=docs-site
```

Ogni comando risolve il proprio `bxsites.yaml`, la propria content root e
la propria sovrascrittura di tema in modo interamente indipendente -
compilare `marketing/` non tocca mai il proprio output `site/`, la
configurazione o il tema di `docs-site/`, e viceversa. Non c'è alcun
passaggio di build condiviso né alcun requisito di ordinamento
cross-dominio; compila qualunque dominio sia cambiato, nell'ordine che
preferisci.

## Anteprima di un dominio

`serve` funziona allo stesso modo - fa l'anteprima di esattamente una
project root alla volta:

```bash frame="terminal" title="Terminal"
bxSites serve --projectRoot=docs-site
```

Per fare l'anteprima di un dominio diverso, ferma `serve` ed eseguilo di
nuovo con un `--projectRoot` diverso (oppure da una directory di lavoro
diversa). Due domini che hanno entrambi bisogno di un'anteprima dal vivo
contemporaneamente richiedono semplicemente due processi `serve`
separati, ciascuno con il proprio `--projectRoot` e (se eseguiti insieme)
la propria `--port`.

## Compilare ogni dominio in CI

Dato che ogni dominio è un'invocazione indipendente di
`bxSites build --projectRoot=<path>`, la CI si limita a scorrere in loop
sull'elenco delle project root:

```yaml title=".github/workflows/build-sites.yml" linenums="1"
name: Build sites
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        project: [marketing, docs-site]
    steps:
      - uses: actions/checkout@v4
      - name: Install BoxLang + bx-sites
        run: |
          /bin/bash -c "$(curl -fsSL https://install.boxlang.io)"
          export BOXLANG_INSTALL_HOME="/usr/local/boxlang"
          export PATH="/root/.boxlang/bin:/usr/local/bin:$PATH"
          install-bx-module bx-sites
      - name: Build ${{ matrix.project }}
        run: bxSites build --projectRoot=${{ matrix.project }}
      - uses: actions/upload-artifact@v4
        with:
          name: site-${{ matrix.project }}
          path: ${{ matrix.project }}/site/
```

Un semplice loop bash funziona altrettanto bene fuori da una matrix
build, e rende facile far fallire l'intero job non appena un dominio
qualsiasi non riesce a compilarsi:

```bash frame="terminal" title="Terminal"
for project in marketing docs-site; do
	echo "Building $project..."
	bxSites build --projectRoot="$project" || exit 1
done
```

L'output `site/` proprio di ogni dominio viene distribuito allo stesso
modo dell'output di un progetto a singolo sito - vedi
[Distribuzione](deployment.md) - solo una volta per dominio, puntato sui
propri `deployments/*.json` e sulla propria cartella
`<project>/site/`.

## Nessuna collisione cross-dominio

Poiché `.theme`/`.themes` vivono dentro la content root propria di ogni
dominio (vedi
[Origine del contenuto: Dove vive una sovrascrittura di tema](content-source.md#dove-vive-una-sovrascrittura-di-tema))
invece che a una project root nuda e condivisa, due domini nello stesso
monorepo possono portare ciascuno la propria sovrascrittura di tema senza
alcun rischio che l'uno oscuri l'altro - `marketing/.theme/` e
`docs-site/docs/.theme/` sono due cartelle interamente separate, risolte
in modo indipendente dalla build propria di ogni dominio. Lo stesso vale
per tutto il resto a livello di progetto - `bxsites.yaml`,
`deployments/*.json`, `docs/versions/`, `docs/i18n/` - la copia propria
di ogni dominio è esattamente quella di quel dominio, senza nulla di
condiviso a meno che tu scelga di scriptare la condivisione da solo (ad
esempio, copiando un file `extraCss` comune in ogni dominio prima di
compilare).
