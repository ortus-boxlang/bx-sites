---
title: Blocchi di contenuto
order: 4.5
icon: phosphor-duotone:squares-four
tags: [guide, markdown, gitbook]
---

# Blocchi di contenuto

Oltre a tutto quanto in [Estensioni Markdown](markdown.md), BxSites
supporta una famiglia di blocchi di contenuto in stile GitBook - utili di
per sé, e il motivo per cui il contenuto di un sito GitBook è semplice da
migrare: ognuno di questi corrisponde direttamente a un blocco GitBook
dello stesso nome. Ognuno usa la stessa sintassi contenitore
`::: name ... :::` (un `:::` nudo su una riga a sé chiude qualsiasi
blocco attualmente aperto) - nessuna configurazione di `bxsites.yaml`
necessaria, sempre disponibile. Un blocco può essere annidato dentro un
altro (un espandibile che contiene un gruppo di card, per esempio) -
ognuno viene analizzato di nuovo per ulteriori blocchi al proprio
interno.

## Espandibile

Una sezione comprimibile semplice - nessuna icona/colore di richiamo, a
differenza di un'ammonizione comprimibile (`???`, vedi
[Ammonizioni](markdown.md#collapsible-admonitions)):

```markdown title="Esempio" linenums="1"
::: expandable "Is this different from a collapsible admonition?"
Yes - this has no type/icon/color, just a plain expand/collapse section.
Add `open="true"` to start it expanded.
:::
```

::: expandable "È diverso da un'ammonizione comprimibile?"
Sì - questa non ha tipo/icona/colore, solo una semplice sezione
espandi/comprimi. Aggiungi `open="true"` per farla iniziare espansa.
:::

## Card

Una griglia di card di collegamento, ognuna un proprio `::: card` dentro
un wrapper `::: cards` - `title`, `icon`, `image` e `href` sono tutti
opzionali (una card senza `href` viene renderizzata come una card
semplice, non cliccabile). `icon` viene risolta allo stesso modo dei
valori `icon` di frontmatter/nav - una semplice emoji, oppure un'icona
con nome da una libreria inclusa
(`icon="phosphor-duotone:rocket-launch"`, `icon="lucide:rocket"`, ...) -
vedi [Temi: Icone](themes.md#icons):

```markdown title="Esempio" linenums="1"
::: cards
::: card title="Getting Started" icon="phosphor-duotone:rocket-launch" href="../getting-started.md"
Install, scaffold and build your first site.
:::
::: card title="Themes" icon="phosphor-duotone:palette" href="themes.md"
Customize a built-in theme or write your own.
:::
:::
```

::: cards
::: card title="Per iniziare" icon="phosphor-duotone:rocket-launch" href="../getting-started.md"
Installa, genera lo scheletro e compila il tuo primo sito.
:::
::: card title="Temi" icon="phosphor-duotone:palette" href="themes.md"
Personalizza un tema integrato oppure scrivine uno tuo.
:::
:::

## Colonne

Un layout affiancato - `::: column` accetta un `width` opzionale (una
lunghezza/percentuale CSS semplice, ad es. `"40%"`); le colonne senza una
larghezza esplicita condividono la riga in parti uguali:

```markdown title="Esempio" linenums="1"
::: columns
::: column width="60%"
The wider column.
:::
::: column
The narrower one.
:::
:::
```

::: columns
::: column width="60%"
La colonna più larga.
:::
::: column
Quella più stretta.
:::
:::

## Stepper

Una sequenza numerata e collegata di passaggi:

```markdown title="Esempio" linenums="1"
::: stepper
::: step "Install"
`install-bx-module bx-sites`
:::
::: step "Scaffold"
`bxSites new`
:::
:::
```

::: stepper
::: step "Installazione"
`install-bx-module bx-sites`
:::
::: step "Scheletro del progetto"
`bxSites new`
:::
:::

L'attributo opzionale `color` di un passo segna il proprio marcatore con
uno di quattro colori semantici - il predefinito (nessun `color`),
`success`, `warning` o `danger` - indipendentemente dalla posizione del
passo nella sequenza:

```markdown title="Esempio" linenums="1"
::: stepper
::: step "Back up your data" color="success"
Routine, safe to run any time.
:::
::: step "Optional: enable telemetry" color="warning"
Skip this one if you're not sure.
:::
::: step "Delete the old install" color="danger"
Irreversible - make sure the backup above finished first.
:::
:::
```

::: stepper
::: step "Fai un backup dei tuoi dati" color="success"
Operazione di routine, sicura da eseguire in qualsiasi momento.
:::
::: step "Opzionale: attiva la telemetria" color="warning"
Salta questo passo se non sei sicuro.
:::
::: step "Elimina la vecchia installazione" color="danger"
Irreversibile - assicurati che il backup sopra sia terminato per primo.
:::
:::

Il marcatore numerato, la linea di collegamento, e ognuna delle tre
palette `color` sopra sono personalizzabili indipendentemente dal resto
della palette del sito, tramite proprietà CSS personalizzate - vedi
[Personalizzare i colori](themes.md#customizing-colors-without-a-theme-override).

## File

Una card di download per un PDF, un video, o qualsiasi altro asset di
progetto - `src` viene risolto allo stesso modo in cui lo sono già
`theme.logo`/frontmatter `ogImage` (relativo a `docs/assets/`):

```markdown title="Esempio" linenums="1"
::: file src="assets/spec.pdf" title="API Specification"
:::
```

::: file src="assets/og-image.png" title="Immagine di anteprima del sito"
:::

## Embed

Un embed responsivo in iframe per un provider riconosciuto - attualmente
YouTube, Vimeo, CodePen, Spotify, Loom e Figma. Un URL da qualsiasi altra
fonte ricade su una semplice card di link "visita ↗" invece di un iframe
che si rifiuterebbe comunque di renderizzarsi (la maggior parte dei siti
blocca l'essere incorniciata):

```markdown title="Esempio" linenums="1"
::: embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="A demo"
:::
```

::: embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="Una demo"
:::

## OpenAPI / Swagger

Un widget interattivo [Swagger UI](https://swagger.io/tools/swagger-ui/)
per una specifica OpenAPI/Swagger - `src` viene risolto nello stesso modo,
relativo a `docs/assets/`, in cui viene risolto `src` di `::: file`. Sia le
specifiche JSON che YAML funzionano; Swagger UI le analizza entrambe
interamente lato client - da nessuna parte in questo modulo avviene
un'analisi OpenAPI lato server. Richiede che `openapi` di `bxsites.yaml`
([`openapi`](../configuration.md#openapi)) sia impostato su `true` - se
non lo è, questo segnaposto viene renderizzato ma resta inerte (il JS/CSS
proprio di Swagger UI non viene mai copiato in `site/`, quindi la build di
qualsiasi altro progetto resta piccola esattamente come prima di questa
funzionalità):

```markdown title="Esempio" linenums="1"
::: openapi src="assets/openapi/example.yaml" title="Bookshelf API"
:::
```

::: openapi src="assets/openapi/example.yaml" title="Bookshelf API"
:::

Il widget qui sopra è proprio questa pagina, dal vivo, che renderizza la
piccola specifica di esempio che questa guida fornisce in
`docs/assets/openapi/example.yaml` - aprila nel tuo progetto sotto
`docs/assets/` (oppure punta `src` verso la tua specifica già esistente)
per vedere lo stesso risultato con la tua API.

Viene incluso (vendorizzato) solo il layout base proprio di
`SwaggerUIBundle` - senza la topbar/barra "Explore" che permetterebbe di
digitare una specifica diversa (un blocco `::: openapi` deve mostrare
sempre l'unica specifica a cui il suo autore lo ha puntato), quindi ogni
operazione, con i relativi schemi di richiesta/risposta, e "Try it out"
(che chiama il `servers[0].url` proprio della specifica direttamente dal
browser di chi visita la pagina - assicurati che quel server consenta CORS
da dove sono ospitati i tuoi docs) vengono renderizzati direttamente dalla
tua specifica esistente, senza bisogno di riscrivere nulla.

### Una singola operazione inline

Aggiungi `operation="METODO /percorso"` per inserire in una pagina
normale solo quell'unico endpoint - comodo a metà di un tutorial, senza
dover mandare il lettore fino al riferimento completo:

```markdown title="Esempio" linenums="1"
::: openapi src="assets/openapi/example.yaml" operation="GET /books"
:::
```

::: openapi src="assets/openapi/example.yaml" operation="GET /books"
:::

Esattamente lo stesso widget Swagger UI del blocco completo qui sopra
(stessa specifica, stesso rendering solo lato client - anche `operation`
non innesca mai alcuna analisi OpenAPI dal nostro lato); ogni altra
operazione viene semplicemente nascosta e questa espansa
automaticamente, leggendo il markup già renderizzato dallo stesso
Swagger UI. Il metodo di `operation` non distingue maiuscole/minuscole;
il suo percorso deve corrispondere esattamente al percorso della
specifica (segnaposto `{param}` compresi).

## Link a pagina

Una card di anteprima ricca che rimanda a un'altra pagina - `href` segue
la stessa convenzione relativa al file di un normale
[link a pagina](../getting-started.md#linking-between-pages). A
differenza di una card, il suo titolo/icona/riepilogo vengono ricavati
automaticamente dal frontmatter proprio della pagina di destinazione,
così resta sincronizzato se quella pagina viene rinominata o il suo
riepilogo cambia:

```markdown title="Esempio" linenums="1"
::: page-link href="../getting-started.md"
:::
```

::: page-link href="../getting-started.md"
:::

## Anteprima link

Una card di anteprima ricca per un URL *esterno* - la stessa forma di
card di `::: page-link`, ma per un link che non è una delle pagine del
sito stesso, quindi non c'è alcuna pagina da cui ricavare automaticamente
titolo/riepilogo. Ogni campo proviene dagli attributi propri della
direttiva: solo `url` è obbligatorio, `title` ricade sull'URL nudo quando
omesso, e `description`/`image` sono entrambi opzionali. Non c'è alcun
recupero dell'URL di destinazione al momento del build per riempirli
automaticamente - lo stesso ragionamento che mantiene
[`check`](../cli-reference.md#check) limitato ai soli link interni si
applica anche qui, così un sito di terze parti lento o irraggiungibile
non influisce mai sul tempo di build:

```markdown title="Esempio" linenums="1"
::: link-preview url="https://boxlang.io" title="BoxLang" description="A dynamic, multi-paradigm JVM language." image="https://boxlang.io/og.png"
:::
```

::: link-preview url="https://boxlang.io" title="BoxLang" description="Un linguaggio JVM dinamico e multi-paradigma." image="https://boxlang.io/og.png"
:::

## Aggiornamenti (changelog)

Una lista di changelog datata e taggabile - `::: update` accetta
`date="YYYY-MM-DD"` e un `tags` opzionale separato da virgole:

```markdown title="Esempio" linenums="1"
::: updates
::: update date="2026-01-15" tags="feature,fix"
Added dark mode and fixed a footer alignment bug.
:::
::: update date="2026-01-01"
Initial release.
:::
:::
```

::: updates
::: update date="2026-01-15" tags="funzionalità,correzione"
Aggiunta la modalità scura e corretto un bug di allineamento del footer.
:::
::: update date="2026-01-01"
Prima release.
:::
:::

Una pagina con un blocco `::: updates` ottiene anche il proprio
`feed.xml` (RSS 2.0) scritto accanto a sé una volta che `baseURL` di
`bxsites.yaml` è un URL completo - lo stesso requisito di `sitemap.xml` -
così i lettori possono iscriversi solo al changelog di quella pagina.

## Contenuto riutilizzabile (include)

`::: include src="..."` inserisce il Markdown grezzo di un altro file in
quel punto. A differenza di ogni blocco sopra, questo diventa vero
contenuto di pagina (intestazioni, paragrafi, i propri blocchi
annidati), non qualcosa avvolto in un widget - utile per un avviso/nota
ripetuto su più pagine. Metti il partial stesso sotto `docs/includes/` -
la stessa convenzione di cartella riservata di `assets/`/`versions/`/
`i18n/`/`blog/`. Un file sotto `includes/` non viene mai compilato come
propria pagina e non compare mai in nav/ricerca/sitemap/tag - esiste solo
per essere inserito in altre pagine:

```text title="Struttura di docs/"
docs/
├── index.md
├── includes/
│   ├── beta-notice.md
│   └── legal/
│       └── terms.md
└── guides/
    └── deep/
        └── setup.md
```

Uno `src` **nudo** (senza `./` o `../` iniziale) si risolve sempre
rispetto al proprio `docs/includes/` dell'albero corrente, non importa
quanto in profondità sia annidata la pagina che include - `guides/deep/setup.md`
sopra raggiunge lo stesso file che raggiunge `index.md`, entrambi con
esattamente lo stesso `src`:

```markdown title="Da index.md oppure da guides/deep/setup.md"
::: include src="beta-notice.md"
```

Uno `src` nudo può anche puntare a una sottocartella di `includes/`
stessa:

```markdown title="Esempio"
::: include src="legal/terms.md"
```

Anteponi invece `./` o `../` a `src` per raggiungere un frammento
adiacente alla pagina che non è pensato per vivere nella cartella
centralizzata `includes/` - quella forma si risolve in modo relativo al
file rispetto alla cartella propria della pagina *che include*, la
stessa convenzione di un normale link a pagina:

```markdown title="Da guides/deep/setup.md, un livello sopra invece che centralizzato"
::: include src="../local-note.md"
```

Un albero versione/locale ottiene il proprio `includes/` allo stesso
modo - una pagina sotto `docs/versions/2.0/` risolve uno `src` nudo
rispetto a `docs/versions/2.0/includes/`, e una sotto `docs/i18n/es/`
rispetto a `docs/i18n/es/includes/` - i partial di ogni albero sono
propri, non condivisi con il `docs/includes/` dell'albero principale.

Un file incluso può a sua volta includerne un altro (una catena
circolare genera `BxSites.CircularInclude` al momento del build invece
di ripetersi all'infinito).

## Contenuto condizionale

Mostra una tra più varianti di un blocco in base a una scelta fatta dal
lettore stesso - istruzioni "Free" contro "Pro" nella stessa pagina, ad
esempio. Questo è un sito interamente statico senza alcuna identità del
visitatore, quindi a differenza di una piattaforma con un vero backend,
non c'è un "chi è questo lettore" valutato lato server - è il lettore
stesso a scegliere, e la sua scelta viene semplicemente ricordata nel
proprio browser (`localStorage`) anche per ogni pagina successiva:

```markdown title="Esempio" linenums="1"
::: audience-switcher key="plan" options="free:Free,pro:Pro"
:::

::: conditional key="plan" value="free"
The Free plan includes basic search.
:::

::: conditional key="plan" value="pro"
The Pro plan adds AI-assisted search and unlimited team seats.
:::
```

::: audience-switcher key="plan" options="free:Free,pro:Pro"
:::

::: conditional key="plan" value="free"
The Free plan includes basic search.
:::

::: conditional key="plan" value="pro"
The Pro plan adds AI-assisted search and unlimited team seats.
:::

`::: conditional key="..." value="..."` segna una variante; `key` è
qualsiasi nome di preferenza tu stia usando per commutare (`"plan"` qui
sopra, ma potrebbe altrettanto bene essere `"os"`, `"language"`,
qualsiasi cosa), e `value` è l'impostazione per cui questo particolare
blocco deve essere mostrato. Ogni variante viene sempre renderizzata
nell'HTML - nascosta lato client, mai omessa - così un lettore con
JavaScript disattivato (o un crawler di ricerca) vede comunque ogni
variante invece di nessuna.

`::: audience-switcher key="..." options="valore:Etichetta,valore:Etichetta,..."`
è un controllo opzionale, già pronto all'uso - un pulsante per ogni
opzione, che commuta immediatamente ogni blocco `::: conditional` che
condivide quella stessa `key`, ovunque nella pagina. Non ti serve affatto:
un link che termina con `?plan=pro` imposta automaticamente la stessa
preferenza al caricamento (comodo per condividere un link diretto verso
"la versione Pro di questa pagina"), e una sovrascrittura di tema propria
di un progetto può chiamare direttamente
`window.bxSitesSetPreference( key, value )` per pilotarla da
un'interfaccia personalizzata invece.
