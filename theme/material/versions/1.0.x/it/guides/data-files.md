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
`variables`/`page` già usano.

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
(sia `products.yaml` sia `products.json` presenti), vince `.yaml`, poi
`.yml`, poi `.json` - nella pratica scegli un solo formato per ogni nome
base invece di affidarti a quest'ordine.

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
piuttosto che al contenuto di una pagina specifica.

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
Markdown resta inerte-finché-non-sostituito-da-`{{ }}`, e `functions.bxs`
rimane l'unica via di fuga esplicitamente fidata verso la vera logica
BoxLang.

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
  non è riuscito ad analizzarsi (un errore di sintassi YAML/JSON),
  nominando il file incriminato.
- `BxSites.UnknownVariable` - un `{{ data.x.y }}` (o un percorso
  `::: for`/`::: if`) non si risolve rispetto a ciò che è effettivamente
  presente in `docs/data/`.
- `BxSites.InvalidForTarget` - il percorso proprio di un `::: for` si è
  risolto in qualcosa che non è né un array né uno struct (non può
  essere ciclato).
