---
title: Interattività con Alpine.js
order: 9
icon: phosphor-duotone:lightning
tags: [guide, alpine, interattività]
---

# Interattività con Alpine.js

Ogni pagina compilata da BxSites carica già [Alpine.js](https://alpinejs.dev/)
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
- Un link di call-to-action con stile predefinito →
  [Pulsanti](content-blocks.md#pulsanti) (il pulsante copia-negli-appunti
  qui sotto è un caso *diverso* - non ha affatto un `href`, solo
  comportamento lato client - esattamente ciò per cui serve Alpine)

Alpine serve per il contenuto interattivo che questi non coprono -
qualsiasi cosa con un proprio stato lato client.

## Un pulsante copia-negli-appunti

[`::: button`](content-blocks.md#pulsanti) renderizza sempre e solo un
link vero (oppure un segnaposto inerte) - non ha alcuna nozione di
eseguire JS arbitrario al click. Per un
pulsante che *fa* qualcosa invece di navigare da qualche parte, applica
le sue classi `bxsites-button`/`bxsites-button--*` a un normale
`<button>` HTML - stesso aspetto, stilizzato in ogni tema integrato,
semplicemente collegato con Alpine invece che con un `href`. Un caso
comune: un pulsante accanto a un comando di installazione che lo copia e
conferma la copia:

```markdown title="Pulsante di copia" linenums="1"
<div x-data="{ copied: false }">
  <button type="button" class="bxsites-button bxsites-button--secondary bxsites-button--small"
    @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
    <span x-show="!copied">Copy install command</span>
    <span x-show="copied" x-cloak>Copied!</span>
  </button>
</div>
```

<div x-data="{ copied: false }">
  <button type="button" class="bxsites-button bxsites-button--secondary bxsites-button--small"
    @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
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

## Una tabella ordinabile e filtrabile

Una [tabella nativa a pipe](tables.md) è statica una volta
costruita - per averne una che il lettore possa davvero ordinare e
filtrare lato client, lascia che sia Alpine a possedere le righe:
metti i dati in `x-data` e renderizzali con `x-for`, invece di scrivere la
sintassi a pipe `| Feature | Status |`:

```markdown title="Sortable table" linenums="1"
<div x-data="{
  query: '',
  sortKey: 'name',
  sortAsc: true,
  rows: [
    { name: 'Bootstrap', type: 'Components', stars: 4 },
    { name: 'GitBook', type: 'SaaS', stars: 5 },
    { name: 'Docusaurus', type: 'React', stars: 4 },
    { name: 'VuePress', type: 'Vue', stars: 3 }
  ],
  sortBy(key) {
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true
    this.sortKey = key
  },
  get sorted() {
    return [...this.rows]
      .filter(r => r.name.toLowerCase().includes(this.query.toLowerCase()))
      .sort((a, b) => {
        const dir = this.sortAsc ? 1 : -1
        return a[this.sortKey] > b[this.sortKey] ? dir : a[this.sortKey] < b[this.sortKey] ? -dir : 0
      })
  }
}">
  <input type="text" x-model="query" placeholder="Filter by name...">
  <table class="table">
    <thead>
      <tr>
        <th @click="sortBy('name')" style="cursor:pointer">Name</th>
        <th @click="sortBy('type')" style="cursor:pointer">Type</th>
        <th @click="sortBy('stars')" style="cursor:pointer">Stars</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="row in sorted" :key="row.name">
        <tr>
          <td x-text="row.name"></td>
          <td x-text="row.type"></td>
          <td x-text="row.stars"></td>
        </tr>
      </template>
    </tbody>
  </table>
</div>
```

Che viene renderizzato così (scrivi nella casella, clicca un'intestazione di colonna):

<div x-data="{
  query: '',
  sortKey: 'name',
  sortAsc: true,
  rows: [
    { name: 'Bootstrap', type: 'Components', stars: 4 },
    { name: 'GitBook', type: 'SaaS', stars: 5 },
    { name: 'Docusaurus', type: 'React', stars: 4 },
    { name: 'VuePress', type: 'Vue', stars: 3 }
  ],
  sortBy(key) {
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true
    this.sortKey = key
  },
  get sorted() {
    return [...this.rows]
      .filter(r => r.name.toLowerCase().includes(this.query.toLowerCase()))
      .sort((a, b) => {
        const dir = this.sortAsc ? 1 : -1
        return a[this.sortKey] > b[this.sortKey] ? dir : a[this.sortKey] < b[this.sortKey] ? -dir : 0
      })
  }
}">
  <input type="text" x-model="query" placeholder="Filter by name...">
  <table class="table">
    <thead>
      <tr>
        <th @click="sortBy('name')" style="cursor:pointer">Name</th>
        <th @click="sortBy('type')" style="cursor:pointer">Type</th>
        <th @click="sortBy('stars')" style="cursor:pointer">Stars</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="row in sorted" :key="row.name">
        <tr>
          <td x-text="row.name"></td>
          <td x-text="row.type"></td>
          <td x-text="row.stars"></td>
        </tr>
      </template>
    </tbody>
  </table>
</div>

`rows` è un semplice array JS incorporato direttamente nella pagina - va
bene per il tipo di piccola tabella di riferimento che i docs hanno
davvero. `sorted` è un `get`ter di Alpine, quindi rifiltra e riordina a
ogni tasto premuto/clic senza cablaggio aggiuntivo; `sortBy()` inverte la
direzione al secondo clic sulla stessa colonna. Il `<table>` qui è un vero
tag `<table>` scritto a mano (non esiste una sintassi per tabelle a pipe
che passi le righe direttamente ad Alpine), quindi viene comunque
racchiuso in `.bxsites-table-wrap` e riceve il trattamento di [scorrimento
responsive/intestazione
fissa](tables.md#scorrimento-responsive-e-intestazione-fissa)
automaticamente, esattamente come qualsiasi tabella renderizzata da
bx-markdown stesso.

Scrivere `rows` a mano funziona, ma resta comunque contenuto che vive
dentro un letterale oggetto JS, modificato lontano dal resto dei tuoi
dati riutilizzabili. Se le stesse righe appartengono anche a una tabella
normale altrove, o a più pagine, i [dati riutilizzabili](data-files.md)
più `$jsonAttr()` alimentano `x-data` con vero contenuto
`docs/data/*.yaml`/`.json` invece di un array scritto a mano:

```markdown title="Righe alimentate dal server" linenums="1"
<div x-data="{ query: '', rows: {{ $jsonAttr(data.providers) }} }">
  ...
</div>
```

Stessa logica `x-for`/`x-model`/ordinamento di sopra, solo sostenuta da
`docs/data/providers.yaml` invece che da un letterale incorporato nella
pagina - vedi [File di dati: Usare i dati](data-files.md#consuming-data)
per la ricetta completa (e perché serve `encodeForHtmlAttribute()`, non
solo `jsonSerialize()`, per atterrare in sicurezza dentro un attributo
tra virgolette `"..."`).

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
