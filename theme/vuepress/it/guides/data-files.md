---
title: File di dati
order: 12.5
icon: phosphor-duotone:database
tags: [guide, dati]
---

# File di dati

Le [variabili riutilizzabili](variables-and-functions.md#reusable-variables)
sono perfette per un fatto isolato e piatto (`company`, `supportEmail`), ma
risultano scomode per qualsiasi cosa abbia una forma reale - un elenco del
team, una tabella dei prezzi, una matrice di funzionalità. I **file di
dati** colmano questo divario: inserisci un file `docs/data/*.yaml`/`.yml`/
`.json` nel tuo progetto, e l'intero suo contenuto - qualsiasi forma tu
preferisca, un oggetto o un array - diventa raggiungibile come
`data.<file>` da ogni pagina, con la stessa sintassi `{{ }}` che
`variables`/`page` già usano. Ti servono dati *calcolati* invece che
semplicemente analizzati da un file statico - uno sconto applicato al
momento della lettura, un valore che non dovrebbe vivere duplicato in tre
file diversi? Inserisci invece una **classe** `docs/data/*.bx` - vedi
[Classi di dati](#classi-di-dati) più sotto.

## La convenzione

Aggiungi una cartella `docs/data/`. Il nome base di ogni file (senza
estensione) diventa una chiave di primo livello sotto `data`:

```text title="Struttura di docs/"
docs/
├── index.md
└── data/
    ├── team.yaml
    └── pricing.json
```

```yaml title="docs/data/team.yaml"
- name: Luis Majano
  role: CEO
- name: Jon Clausen
  role: CTO
```

```json title="docs/data/pricing.json"
{
	"free": { "price": 0, "seats": 3 },
	"pro": { "price": 29, "seats": 20 }
}
```

`data.team` è ora quell'array, `data.pricing.pro.price` quel numero
annidato - la radice analizzata di un file viene usata esattamente così
com'è stata interpretata, sia essa un oggetto o un array, senza alcuna
forma fissa a cui conformarsi. L'assenza totale di una cartella
`docs/data/` significa semplicemente nessun `data` - la stessa forma
opzionale-per-presenza che
[`docs/functions.bxs`](variables-and-functions.md#magic-functions)/
[`docs/blog/authors.yml`](blog.md) già usano.

Fai riferimento a uno qualsiasi dei suoi valori, per percorso puntato, nel
normale Markdown:

```markdown title="docs/pricing.md"
The Pro plan is **${{ data.pricing.pro.price }}/mo** for up to
{{ data.pricing.pro.seats }} seats.
```

viene compilata in:

```html
<p>The Pro plan is <strong>$29/mo</strong> for up to 20 seats.</p>
```

Se più di un file condivide lo stesso nome base tra estensioni diverse
(sia `products.yaml` sia `products.json` presenti), vince prima `.bx`
(vedi [Classi di dati](#classi-di-dati)), poi `.yaml`, poi `.yml`, poi
`.json` - nella pratica scegli un solo formato per ogni nome base invece
di affidarti a quest'ordine.

## Classi di dati

Un file `.yaml`/`.json` è statico - analizzato una volta, usato esattamente
così com'è scritto. Per dati che richiedono un calcolo (un prezzo scontato,
un valore assemblato da più fonti, qualsiasi cosa con una logica reale
dietro), inserisci invece una vera **classe** BoxLang - `docs/data/Pricing.bx`
(PascalCase, la stessa convenzione dei file classe che questo modulo usa
ovunque altrove) diventa `data.pricing` - la stessa forma di chiave
`data.*` minuscola di ogni altro file, con solo la prima lettera del nome
base della classe resa minuscola:

```bx title="docs/data/Pricing.bx"
class {
	struct function getData() {
		return { "free": { "price": 0 }, "pro": { "price": 29 } }
	}

	numeric function getDiscountedPrice( required string plan, required numeric pct ) {
		var base = getData()[ arguments.plan ].price
		return base - ( base * arguments.pct )
	}
}
```

**`getData()` è obbligatoria** - ogni classe di dati ne ha bisogno (anche
una banale che restituisce `{}`), perché è ciò che viene chiamato
automaticamente ogni volta che `data.pricing` viene usato allo stato puro,
esattamente come una radice YAML/JSON già analizzata:

```markdown title="docs/pricing.md"
The Pro plan is **${{ data.pricing.pro.price }}/mo**.

::: for plan, info in data.pricing
- {{ plan }}: ${{ info.price }}
:::
```

**Anche qualsiasi altro metodo pubblico è invocabile**, direttamente da
`{{ }}`, con esattamente la stessa sintassi degli argomenti già usata da
una chiamata a una [funzione magica](variables-and-functions.md#magic-functions)
(letterali o riferimenti a variabili con percorso puntato, separati da
virgole):

```markdown title="docs/pricing.md"
Discounted for early adopters: **${{ data.pricing.getDiscountedPrice("pro", 0.2) }}/mo**
```

viene compilata in:

```html
Discounted for early adopters: <strong>$23.2/mo</strong>
```

Questo funziona anche da `::: for`/`::: if`, la stessa grammatica
`<dotted.path>` che queste direttive già risolvono:

```markdown title="Example" linenums="1"
::: if data.pricing.getDiscountedPrice("pro", 0.2)
Discounts are active.
:::
```

Una sovrascrittura di tema o una funzione magica, che hanno già a
disposizione BoxLang per intero, ricevono l'istanza viva stessa collegata
allo stato puro come `data.pricing` - invoca `getData()` o qualsiasi altro
metodo direttamente lì, senza bisogno di alcuna magia di invocazione
automatica (vedi [Usare i dati](#usare-i-dati) più sotto).

**Solo i metodi pubblici sono raggiungibili in questo modo** - una
`private function` nella stessa classe resta un vero dettaglio
implementativo, irraggiungibile da `{{ }}`, proprio come un helper senza
prefisso `$` in `functions.bxs` è irraggiungibile *direttamente* (anche
se, come lì, resta comunque invocabile da un altro metodo dello stesso
file).

Questo non allenta il confine di fiducia [più sotto](#perché-file-di-dati-e-non-template-boxlang-nel-markdown) -
un file `.bx` sotto `docs/data/` è codice che scrive il *proprietario del
progetto*, lo stesso livello di fiducia che ha già `docs/functions.bxs`,
mai qualcosa che il Markdown di un contributore estraneo ai soli docs
possa raggiungere.

**Una limitazione ristretta**, reale ma rara nella pratica: caricare una
classe di dati richiede che il proprio percorso risolto sia esprimibile
come nome di classe BoxLang (nessun trattino o spazio da nessuna parte al
suo interno). Eseguire `bxSites` dall'interno del progetto stesso - il
caso di gran lunga più comune - funziona sempre, perché nulla del percorso
proprio del progetto (che può avere tutti i trattini che vuole, ad es.
`my-project/`) deve mai essere espresso in quel modo. Diventa una
restrizione reale solo con un `--projectRoot` esplicito che punta a un
progetto fuori dalla directory corrente, il cui percorso proprio (o quello
di una directory antenata) contiene un trattino o uno spazio - vedi
[`BxSites.UnsupportedDataClassPath`](#errori) per l'errore esatto che
viene generato al suo posto, invece di un fallimento criptico.

## Usare i dati

Un riferimento scalare `{{ data.x.y }}` funziona ovunque `{{ }}` funzioni
già, ma un contenuto reale - una griglia del team, una tabella dei prezzi
- di solito significa scorrere in loop su `data.*`. Ci sono tre modi per
farlo, a seconda di dove appartiene il loop:

### In una sovrascrittura di tema

Una volta che un progetto ha una sovrascrittura `theme/` (vedi
[Temi](themes.md#overriding-a-theme)), `data` viene collegata allo stato
puro in `layout.bxm`/`page.bxm` allo stesso modo in cui lo sono già
`page`/`siteConfig` - nessun `{{ }}`, solo vero BoxLang:

```bx title="theme/layout.bxm (excerpt)"
<ul class="footer-sponsors">
<bx:loop array="#data.sponsors#" index="sponsor">
	<li>#encodeForHTML( sponsor )#</li>
</bx:loop>
</ul>
```

Questa è la sede naturale per i dati che appartengono a *ogni* pagina (un
elenco di sponsor nel footer, un badge di navigazione a livello di sito)
piuttosto che al contenuto di una pagina specifica. Se `sponsors` fosse
una [classe di dati](#classi-di-dati) invece di un file `.yaml`/`.json`,
qui `data.sponsors` è l'istanza viva stessa (vero BoxLang, senza la
comodità di invocazione automatica esclusiva di `{{ }}`) - scorri invece
in loop esplicitamente su `data.sponsors.getData()`.

### Da una funzione magica

Anche una [funzione magica](variables-and-functions.md#magic-functions)
può leggere `data` allo stato puro (è una delle stesse "variabili di
supporto" che sono già `page`/`siteConfig`/ecc.), e può scorrerla in
loop/ramificarsi su di essa con vero BoxLang, restituendo un frammento
Markdown/HTML:

```bx title="docs/functions.bxs"
function $team() {
	var html = ""
	for ( item, idx in data.team ) {
		html &= "- **" & encodeForHTML( item.name ) & "** - " & encodeForHTML( item.role ) & char( 10 )
	}
	return html
}
```

```markdown title="docs/about.md"
## Our team

{{ $team() }}
```

Questo viene renderizzato lato server, al momento del build - visibile a
un crawler di ricerca senza bisogno di JavaScript, a differenza della
ricetta Alpine qui sotto.

### Direttamente nel Markdown, con `::: for`/`::: if`

Per un loop o un semplice controllo di verità che non richiede affatto
una funzione magica,
[`::: for`/`::: if`](content-blocks.md#loop-and-conditional-data-driven)
funzionano direttamente dal Markdown:

```markdown title="docs/team.md" linenums="1"
::: for member, idx in data.team
{{ idx }}. **{{ member.name }}** - {{ member.role }}
:::
```

`::: for <item>, <index> in <dotted.path>` associa `<item>`/`<index>`
usando la semantica nativa del loop `for` a due variabili propria di
BoxLang, qualunque cosa risolva `<dotted.path>` - elemento + indice a
base 1 per un array, oppure chiave + valore per uno struct, con la
sintassi *identica* in entrambi i casi (nessuna ramificazione
array-vs-struct da scrivere tu stesso):

```markdown title="Iterating a struct" linenums="1"
::: for name, enabled in data.flags
- {{ name }}: {{ enabled }}
:::
```

`::: if <dotted.path>` renderizza il proprio contenuto solo quando il
valore risolto è veritiero (un array/struct/stringa vuoto, `0` e `false`
contano tutti come falsi):

```markdown title="Example" linenums="1"
::: if data.flags.betaBanner
Beta features are enabled on this build.
:::
```

Concatena `::: elseif <dotted.path>` (un numero qualsiasi) e un
`::: else` nudo finale subito dopo un `::: if` per una vera semantica
`if`/`elseif`/`else` - la prima condizione veritiera vince, `::: else`
cattura tutto ciò che resta, e la condizione propria di un ramo
successivo non viene nemmeno risolta finché non arriva il suo turno. Un
solo `:::` finale chiude l'intera catena - `::: elseif`/`::: else`
stessi segnano dove finisce il ramo precedente, quindi non serve alcun
`:::` prima di ciascuno di essi (anche se funziona comunque se preferisci
scriverlo in quel modo):

```markdown title="Example" linenums="1"
::: if data.flags.darkModeDefault
Dark mode is on by default.
::: elseif data.flags.betaBanner
Beta features are enabled, though dark mode isn't on by default.
::: else
Nothing special about this build.
:::
```

Entrambi i corpi possono contenere normale Markdown e persino altri
blocchi di contenuto, incluso un `::: for`/`::: if` annidato. Una
grammatica deliberatamente ristretta, che rispecchia lo stesso `{{ }}` -
solo un percorso puntato, nessun operatore di confronto (`==`, `&&`, ...)
in questa prima versione. Una reale esigenza di confronto si indirizza
invece verso una funzione magica (sopra), che ha già a disposizione
BoxLang per intero.

### In Alpine, lato client (`x-data`)

[Interattività](interactivity.md) copre già l'inserimento di HTML grezzo
`x-data`/`x-for` nel Markdown; alimentarlo da `data.*` invece che da un
array JS scritto a mano richiede solo di trasformare `data.*` in un
valore di attributo HTML sicuro. `jsonSerialize()` da sola non basta - il
risultato ha comunque bisogno della codifica per attributi HTML per stare
al sicuro dentro un attributo tra virgolette `"..."` (la stessa ricetta
in due passaggi che usa l'helper `attribute()`/`forAttribute()` proprio
di ColdBox) - quindi definisci un helper di una riga, una sola volta, nel
tuo `functions.bxs`:

```bx title="docs/functions.bxs"
function $jsonAttr( required any value ) {
	return encodeForHtmlAttribute( jsonSerialize( arguments.value ) )
}
```

`encodeForHtmlAttribute()` proviene da bx-esapi, già una dipendenza di
ogni progetto bx-sites - nessuna nuova dipendenza, solo questa ricetta.
Poi, nel Markdown:

```markdown title="docs/team.md" linenums="1"
<div x-data="{ team: {{ $jsonAttr(data.team) }} }">
  <template x-for="member in team" :key="member.name">
    <li x-text="member.name + ' - ' + member.role"></li>
  </template>
</div>
```

Le semplici virgolette doppie funzionano in sicurezza intorno a
`x-data` - `encodeForHtmlAttribute()` gestisce già il conflitto, senza
bisogno di alcun espediente con le virgolette singole. Questo è l'unico
percorso che si renderizza solo lato client (nulla per un lettore con
JavaScript disattivato o per un crawler di ricerca) - ricorri invece a
una funzione magica o a `::: for` quando il contenuto deve essere
visibile senza JavaScript.

## Perché file di dati, e non template BoxLang nel Markdown?

Durante la progettazione di questa funzionalità è emersa una domanda
correlata, più ampia: perché non lasciare che il Markdown stesso diventi
un vero template BoxLang (loop, condizionali, logica arbitraria), invece
di aggiungere un ristretto `::: for`/`::: if` e affidarsi a funzioni
magiche per qualsiasi cosa in più? Due motivi:

- **Confine di fiducia.** `docs/**.md` è l'unico artefatto modificato di
  routine da contributori molti/esterni/meno fidati (una PR sui docs).
  `docs/functions.bxs` è l'unico artefatto che il *proprietario del
  progetto* redige esplicitamente. Compilare ogni file `.md` come un vero
  template BoxLang farebbe crollare quel confine - qualsiasi contributore
  in grado di aprire una PR sui docs otterrebbe l'esecuzione arbitraria
  di BoxLang (I/O su file, accesso all'ambiente) invece di semplice testo
  Markdown.
- **Modalità di fallimento.** Oggi un `{{ }}` non corrispondente viene
  lasciato come testo letterale - un errore di battitura non interrompe
  mai un build. Un errore di compilazione di un template BoxLang è invece
  un fallimento rigido. `::: for`/`::: if` mantengono la stessa forma
  tollerante (un percorso non risolvibile genera un errore chiaro, che
  intercetta gli errori di battitura - vedi [Errori](#errors) - invece di
  compilare in modo errato senza avvisare).

I file di dati colmano il vero divario (contenuto strutturato, e
loop/condizionali su di esso) senza nessuno dei due compromessi: il
Markdown resta inerte-finché-non-sostituito-da-`{{ }}`, e
`functions.bxs`/una classe `docs/data/*.bx` restano le vie di fuga
esplicitamente fidate verso la vera logica BoxLang - entrambe codice
scritto dal proprietario del progetto, mai qualcosa che la PR di un
contributore del solo Markdown possa aggiungere.

## Ambito

- `docs/data/` è a livello di progetto, caricata una sola volta - lo
  stesso ambito a caricamento singolo che ha già
  [`functions.bxs`](variables-and-functions.md#scope). Ogni albero di
  versione/locale vede lo stesso identico `data`; non c'è alcuna
  sovrascrittura o unione per versione o per locale in questa prima
  versione. Non duplicare `docs/data/` in `docs/versions/<name>/` o
  `docs/i18n/<code>/` - non viene letta da lì.
- Solo cartella piatta - nessuna ricorsione in sottocartelle dentro
  `docs/data/` in questa prima versione, la stessa forma "esattamente un
  file" che ha già [`docs/blog/authors.yml`](blog.md).
- `data` è un nome `{{ }}` riservato, allo stesso modo in cui lo è già
  `page` (vedi
  [Nomi riservati](variables-and-functions.md#reserved-names)) - una
  voce `variables.data` di `bxsites.yaml`, se un progetto in qualche modo
  ne dichiarasse una, viene oscurata dallo struct proprio di
  `docs/data/` invece di prevalere. Nemmeno `docs/functions.bxs` può
  dichiarare una funzione chiamata `data`, per lo stesso motivo.

## Errori

- `BxSites.InvalidDataFile` - un file `docs/data/*.yaml`/`.yml`/`.json`
  non è riuscito ad analizzarsi (un errore di sintassi YAML/JSON), oppure
  una classe `docs/data/*.bx` non è riuscita a compilarsi/istanziarsi,
  nominando il file incriminato.
- `BxSites.MissingDataMethod` - una classe `docs/data/*.bx` non ha alcun
  metodo pubblico `getData()`.
- `BxSites.UnknownDataMethod` - `{{ data.x.someMethod(...) }}` nomina un
  metodo che non esiste (o non è pubblico) su quell'istanza di classe di
  dati.
- `BxSites.NotCallable` - `{{ data.x.someMethod(...) }}` dove `data.x` non
  è affatto un'istanza di classe di dati (una chiave basata su
  `.yaml`/`.json` non ha metodi da invocare).
- `BxSites.UnsupportedDataClassPath` - una classe `docs/data/*.bx` non è
  stata caricata perché il suo percorso risolto contiene un carattere non
  valido in un nome di classe BoxLang (un trattino o uno spazio in un
  nome di directory antenata) - vedi la nota apposita in
  [Classi di dati](#classi-di-dati).
- `BxSites.UnknownVariable` - un `{{ data.x.y }}` (o un percorso
  `::: for`/`::: if`) non si risolve rispetto a ciò che è effettivamente
  presente in `docs/data/`.
- `BxSites.InvalidForTarget` - il percorso proprio di un `::: for` si è
  risolto in qualcosa che non è né un array né uno struct (non può
  essere ciclato).
