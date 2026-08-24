---
title: Interattività con Alpine.js
order: 9
icon: phosphor-duotone:lightning
tags: [guide, alpine, interattività]
---

# Interattività con Alpine.js

Ogni pagina compilata da BX Sites carica già [Alpine.js](https://alpinejs.dev/)
- è ciò che alimenta l'interruttore modalità scura integrato e il menu a
discesa della lingua in ogni tema integrato. Quella stessa
istanza Alpine è disponibile gratuitamente anche per il contenuto delle
tue pagine: nessuna impostazione di `bxsites.yaml` da attivare, nessuna
voce `extraJs` da aggiungere, nessun tag `<script>` extra da scrivere nel
tuo markdown.

Dato che l'[HTML grezzo a livello di blocco passa intatto](images.md#captions-alignment-and-framing)
nel tuo markdown, puoi mettere gli attributi `x-data`/`x-show`/`@click`/ecc.
di Alpine direttamente su qualsiasi blocco HTML e funziona senza altro.

## Prima di ricorrere ad Alpine

La maggior parte delle esigenze "interattive" ha già un blocco a direttiva
pensato apposta che non richiede di scrivere alcun JS in prima persona -
ricorri prima a questi:

- Una sezione comprimibile → [Espandibile](content-blocks.md#expandable)
  oppure un'[ammonizione comprimibile](markdown.md#collapsible-admonitions)
- Contenuto alternativo raggruppato dietro schede cliccabili →
  [Schede di contenuto](markdown.md#content-tabs)
- Un percorso guidato numerato → [Stepper](content-blocks.md#stepper)

Alpine serve per il contenuto interattivo che questi non coprono -
qualsiasi cosa con un proprio stato lato client.

## Un pulsante copia-negli-appunti

Un caso comune: un pulsante accanto a un comando di installazione che lo
copia e conferma la copia:

```markdown title="Pulsante di copia" linenums="1"
<div x-data="{ copied: false }">
  <button type="button" @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
    <span x-show="!copied">Copy install command</span>
    <span x-show="copied" x-cloak>Copied!</span>
  </button>
</div>
```

<div x-data="{ copied: false }">
  <button type="button" class="btn btn-sm btn-outline-secondary" @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
    <span x-show="!copied">Copia il comando di installazione</span>
    <span x-show="copied" x-cloak>Copiato!</span>
  </button>
</div>

## Un filtro dal vivo

Filtrare una lista lato client, senza andata e ritorno verso il server:

```markdown title="Filtro dal vivo" linenums="1"
<div x-data="{ query: '' }">
  <input type="text" x-model="query" placeholder="Filter providers...">
  <ul>
    <li x-show="'local'.includes( query.toLowerCase() )">local (static index, no server)</li>
    <li x-show="'algolia'.includes( query.toLowerCase() )">algolia (hosted DocSearch)</li>
    <li x-show="'pagefind'.includes( query.toLowerCase() )">pagefind (indexed at build time)</li>
  </ul>
</div>
```

`x-model` collega il valore dell'input allo stato Alpine; l'`x-show` di
ogni `<li>` viene rivalutato a ogni tasto premuto.

## Le basi di `x-data`, se sei nuovo ad Alpine

`x-data` dichiara lo stato reattivo proprio di uno scope come un semplice
oggetto JS; qualsiasi cosa dentro quell'elemento può leggerlo/scriverlo, e
`x-show`/`x-text`/`x-model`/`@click` (forma abbreviata di `x-on:click`)
reagiscono tutti al suo cambiamento:

```markdown title="Esempio" linenums="1"
<div x-data="{ count: 0 }">
  <button type="button" @click="count++">Clicked <span x-text="count"></span> times</button>
</div>
```

Vedi la [documentazione ufficiale di Alpine](https://alpinejs.dev/start-here)
per l'elenco completo delle direttive (`x-if`, `x-for`, `x-transition`, e
altre).

## Cose da sapere

- **È fondamentale, non opzionale.** Gli elementi di contorno del tema
  (modalità scura, cambio lingua) dipendono da Alpine, quindi non può
  essere disattivato in `bxsites.yaml` come invece si può fare per
  `mermaid`/`math`.
- **Versione.** Attualmente `alpinejs@3.14.1`, incluso con questo modulo
  e servito da `site/assets/vendor/alpine/` - nessuna CDN coinvolta.
  Controlla il `layout.bxm` proprio di un tema per il tag `<script>` esatto
  se ti serve sapere con precisione cosa viene caricato.
- **CSP rigida.** La build predefinita di Alpine valuta le espressioni JS
  dentro `x-data`/`@click` ecc. direttamente, il che richiede
  `unsafe-eval` sotto una Content-Security-Policy rigida. Se la tua
  distribuzione non può permetterlo, non affidarti ad Alpine nel
  contenuto delle tue pagine.
- **Tienilo leggero.** Una pagina di documentazione dovrebbe restare
  veloce e semplice - piccoli widget autonomi (un pulsante di copia, un
  filtro, un interruttore) sono adatti; una vera applicazione lato client
  non è ciò per cui questo esiste.
