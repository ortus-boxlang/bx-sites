---
title: Temi
order: 1
tags: [guide, temi]
---

# Temi

I temi sono template nativi BoxLang `.bxm` - non c'è alcun motore di
template separato o passaggio di build coinvolto.

## Integrati

| Tema | Base | Note |
|---|---|---|
| `bootstrap` (predefinito) | [Bootstrap 5](https://getbootstrap.com/) via CDN | Font Poppins, navbar con gradiente del brand |
| `material` | CSS in stile Material scritto a mano | Layout a card, ombre di elevazione, font Roboto |
| `tailwind` | [Tailwind Play CDN](https://tailwindcss.com/) | Guidato da classi utility, nessun passaggio di build |

Tutti e tre applicano la stessa palette del brand BoxLang: un gradiente
`#00FF78 -> #00DBFF` e un accento `#FFF500` - e tutti e tre includono lo
stesso insieme di funzionalità di pagina:

- **Un sommario "In questa pagina" in pagina**, generato dalle intestazioni
  `h2`/`h3` proprie di ogni pagina.
- **Breadcrumb**, che mostrano la catena di antenati di una pagina quando è
  annidata più di un livello sotto un antenato collegato.
- **Link pagina precedente/successiva** in fondo all'articolo, seguendo
  l'ordine di lettura della nav stessa.
- **Blocchi di codice con evidenziazione della sintassi**, tramite
  [highlight.js](https://highlightjs.org/) più una grammatica BoxLang
  propria (` ```bx `/` ```boxlang `/` ```cfscript `), ciascuno con un
  **pulsante di copia** - mostrato al passaggio del mouse sui dispositivi
  che lo supportano, sempre visibile sui dispositivi touch (dove non c'è
  hover per rivelarlo). Vedi
  [Estensioni Markdown](markdown.md#code-blocks).
- **Webfont autoospitati** - nessuna richiesta a `fonts.googleapis.com` al
  momento della visualizzazione.
- **Un interruttore modalità scura/chiara**, alimentato da
  [Alpine.js](https://alpinejs.dev/) per la reattività. La scelta del
  visitatore viene ricordata in `localStorage` (ricadendo sulla
  preferenza del suo sistema operativo), e applicata prima del primo
  rendering per evitare un lampo del tema sbagliato.
- **Un header responsivo** che resta su una sola riga a qualsiasi
  larghezza - un viewport stretto restringe il box di ricerca invece di
  farlo andare a capo - più una nav laterale comprimibile (un interruttore
  a hamburger sia in `bootstrap`, sia in `material`, sia in `tailwind`).
- **Scorciatoie da tastiera** nel box di ricerca: `/` porta il focus sulla
  ricerca da qualsiasi punto della pagina, e `Escape` chiude i risultati.
  Vedi [Ricerca](search.md).
- **Un link al repository e una riga "Modifica questa pagina"/"Ultimo
  aggiornamento"**, quando le opzioni `repo`/`lastUpdated` di
  `bxdocs.json` sono impostate. Vedi
  [Configurazione](../configuration.md#repo).
- **Un link "Scarica Markdown"**, accanto a "Modifica questa pagina" - il
  sorgente `.md` grezzo di ogni pagina viene pubblicato accanto al proprio
  HTML compilato (`guides/themes.md` si trova accanto a
  `guides/themes/index.html`), così una persona (o un LLM) può leggere la
  pagina come Markdown puro direttamente invece di analizzare l'HTML
  renderizzato. Sempre attivo, nessuna configurazione necessaria. Vedi
  [Per iniziare](../getting-started.md#downloading-a-page-as-markdown).
- **Un footer opzionale** (copyright, link `social`, un credito "Built
  with BX Docs") quando `footer` di `bxdocs.json` è `true`. Vedi
  [Configurazione](../configuration.md#footer).
- **Un selettore di versione**, che appare automaticamente non appena un
  progetto ha una cartella `docs/versions/` con più di una versione al
  suo interno. Vedi [Configurazione](../configuration.md#versioning).
- **Un `404.html` con tema applicato**, servito automaticamente dalla
  maggior parte degli host statici (incluso GitHub Pages) per qualsiasi
  percorso non corrispondente.
- **Un logo e una favicon personalizzati**, quando `theme.logo`/
  `theme.favicon` di `bxdocs.json` sono impostati. Vedi
  [Configurazione](../configuration.md#theme).
- **Una nav laterale comprimibile**, opzionale tramite
  `theme.options.navCollapsible`. Vedi
  [Configurazione](../configuration.md#theme).
- **Google Analytics**, quando `analytics` di `bxdocs.json` è configurato.
  Vedi [Configurazione](../configuration.md#analytics).
- **Social share card** (meta tag Open Graph + Twitter Card), ricavate
  dal frontmatter `description` di ogni pagina (o dalla `description` a
  livello di sito) e dal suo `ogImage` (o da quello a livello di sito) -
  generate automaticamente per pagina in modo opzionale tramite
  `generateOgImages` di `bxdocs.json`. Vedi
  [Configurazione](../configuration.md#ogimage).
- **Tag di pagina, un'icona e una riga di riepilogo**, tutti opzionali
  tramite il frontmatter di una pagina - i tag vengono renderizzati come
  badge che collegano a un indice `/tags/` a livello di sito. Vedi
  [Per iniziare](../getting-started.md#add-pages).
- **Una nav esplicita in sostituzione**, in `bxdocs.json` o nel proprio
  `docs/nav.json`, che sostituisce la deduzione dalle cartelle per siti di
  grandi dimensioni. Vedi [Configurazione](../configuration.md#nav).
- **CSS/JS extra**, iniettati tramite `extraCss`/`extraJs` di
  `bxdocs.json`. Vedi
  [Configurazione](../configuration.md#extracss--extrajs).
- **Box di richiamo per ammonizioni (nota/avviso/suggerimento/...)**,
  attivi di default nel markdown di qualsiasi pagina, incluse le varianti
  comprimibili - nessuna configurazione necessaria. Vedi
  [Estensioni Markdown](markdown.md#admonitions).
- **Note a piè di pagina e liste di definizioni**, opzionali tramite
  `markdown` di `bxdocs.json`. Vedi
  [Estensioni Markdown](markdown.md#footnotes).
- **Schede di contenuto** e **numeri di riga/righe evidenziate/titoli del
  codice**, nessuna configurazione necessaria. Vedi
  [Estensioni Markdown](markdown.md#content-tabs).
- **Diagrammi Mermaid**, opzionali tramite `mermaid` di `bxdocs.json`.
  Vedi [Estensioni Markdown](markdown.md#diagrams).
- **Matematica** (KaTeX), opzionale tramite `math` di `bxdocs.json`. Vedi
  [Estensioni Markdown](markdown.md#math).

Imposta quale tema usa un progetto in `bxdocs.json`:

```json
{ "theme": { "name": "material" } }
```

## Icone

Il frontmatter `icon` di una pagina (mostrato accanto al suo titolo, e
accanto alla sua voce nella nav laterale) accetta sia un'emoji/testo breve
semplice - la forma originale, ancora pienamente supportata - sia
un'icona con nome da una delle otto librerie autoospitate, tutte con
licenza MIT/ISC e incluse in questo modulo (circa 16.200 icone
combinate, nessuna CDN, nulla di aggiunto al peso di una pagina compilata
oltre alla manciata di icone effettivamente usate - vedi IconResolver.bx):

```markdown
---
icon: rocket
---
```

```markdown
---
icon: lucide:rocket
---
```

```markdown
---
icon: phosphor-bold:rocket
---
```

Un semplice `rocket` ricade su [Phosphor](https://phosphoricons.com/),
peso regolare. Phosphor include tutti e sei i suoi pesi, ciascuno con il
proprio prefisso: `phosphor-thin:`, `phosphor-light:`, `phosphor:`
(regolare, uguale al nome nudo), `phosphor-bold:`, `phosphor-fill:` e
`phosphor-duotone:`. Usa il prefisso `lucide:` per
[Lucide](https://lucide.dev/icons/), oppure `tabler:` per
[Tabler](https://tabler.io/icons). Sfoglia la galleria di ciascun sito
per il nome esatto - corrisponde esattamente al nome file incluso in
questo modulo (minuscolo, con trattini, ad es. `book-open`,
`arrow-up-right`; il sito di Phosphor mostra un selettore di peso -
ciascuna delle sue sei opzioni lì corrisponde a uno dei sei prefissi
`phosphor[-weight]:` di questo modulo).

Font Awesome non è deliberatamente incluso tra queste - il suo stile
Duotone (e la maggior parte del suo set di icone dalla v6 in poi) è
disponibile solo con Pro, non disponibile con una licenza che questo
modulo possa includere e ridistribuire gratuitamente.

Anche un SVG del tuo progetto funziona - mettilo in
`docs/assets/icons/my-icon.svg` e riferiscilo come `icon: custom:my-icon`.

Una voce di [nav.json](../configuration.md#nav) può impostare la propria
`icon`, sovrascrivendo il frontmatter proprio della pagina di destinazione
per quella singola voce:

```json
{ "title": "Guides", "path": "guides/index.md", "icon": "lucide:book-open" }
```

## Il contratto `ThemeProvider`

Un tema è semplicemente una cartella con:

- **`layout.bxm`** (obbligatorio) - il guscio HTML esterno + la nav.
  Riceve `variables.page`, `variables.nav`, `variables.siteConfig`,
  `variables.themeDir` e `variables.basePath` nello scope, e include il
  file gemello `page.bxm` tramite `#variables.themeDir#/page.bxm`.
  `variables.basePath` è sempre un percorso relativo alla radice che
  termina con `/` (`/` di default, `/my-docs/` quando `baseURL` di
  `bxdocs.json` lo sovrascrive) - anteponilo a ogni `href`/`src` interno,
  invece di codificare un `/` iniziale fisso, così il tema continua a
  funzionare quando il sito viene servito da un sotto-percorso.
- **`page.bxm`** (obbligatorio) - il corpo dell'articolo. Renderizza
  `variables.page.contentHtml` - il markdown già convertito.
- **`search.bxm`** (opzionale) - il markup del box di ricerca, incluso da
  `layout.bxm` solo quando `search` di `bxdocs.json` è `true`. Vedi
  [Ricerca](search.md).
- **`assets/`** (opzionale) - CSS/JS del tema, copiati in
  `site/assets/theme/` al momento del build.

`variables.page.editUrl`/`.lastUpdated` (stringhe vuote quando non
configurati) e `variables.siteConfig.repo`/`.social`/`.footer` sono
sempre disponibili anch'essi, a supporto delle funzionalità di link al
repository/link di modifica/ultimo aggiornamento/footer sopra descritte -
un tema personalizzato decide da sé se e come renderizzarli, come
tutto il resto. `variables.versions` (`[ { label, url } ]`, con "Latest"
per primo) e `variables.currentVersion` (l'etichetta `label` in fase di
rendering in questo momento) sono a supporto del selettore di versione -
vuoti/`"Latest"` per un progetto non versionato, quindi un tema deve
renderizzare un selettore solo quando `variables.versions.len() gt 1`. I
tre temi integrati ottengono le proprie icone repository/social da una
piccola tabella SVG condivisa,
`<bx:include template="#variables.moduleAssetsDir#/icons.bxm">`
(definisce `bxdocsIcon( name )`, uno tra `github`, `twitter`/`x`, `rss`,
`youtube`, `linkedin`, `facebook`, `bluesky`, `threads`, `slack`,
`patreon`, `email`, `edit`, `clock`, con un glifo di link generico come
ripiego) - un tema personalizzato può includerla nello stesso modo,
oppure fornire le proprie icone del tutto.

Una cartella tema a cui manca uno dei due file obbligatori fallisce
subito con un chiaro errore `BxDocs.InvalidTheme` al momento del build,
invece di un confuso errore di template nel profondo del rendering.

## Personalizzare i colori senza sovrascrivere un tema

Per una piccola modifica di colore/font, forkare un intero tema è
eccessivo - ogni tema integrato legge la propria palette da una manciata
di proprietà CSS personalizzate su `:root`, ridichiarate sotto
`[data-theme="dark"]` per la modalità scura. L'
[`extraCss`](../configuration.md#extracss--extrajs) di `bxdocs.json` si
carica *dopo* il foglio di stile proprio del tema, quindi una
ridichiarazione con la stessa specificità al suo interno vince senza
toccare affatto `resources/themes/`:

```json
{ "extraCss": [ "assets/brand.css" ] }
```

```css
/* docs/assets/brand.css - copiato in site/assets/brand.css al momento del build */
:root {
	--bxdocs-gradient-start: #7C3AED;
	--bxdocs-gradient-end: #DB2777;
	--bxdocs-accent: #FBBF24;
	--bxdocs-link: #7C3AED;
	--bxdocs-link-hover: #9F5AF0;
}

[data-theme="dark"] {
	--bxdocs-link: #C4B5FD;
	--bxdocs-link-hover: #DDD6FE;
}
```

L'insieme proprio del tema `bootstrap`
(`resources/themes/bootstrap/assets/style.css`) è composto da
`--bxdocs-gradient-start`/`-end`, `--bxdocs-accent`, `--bxdocs-bg`,
`--bxdocs-text`, `--bxdocs-sidebar-bg`, `--bxdocs-sidebar-text`,
`--bxdocs-border`, `--bxdocs-link`, `--bxdocs-link-hover` e
`--bxdocs-code-bg` - `material` e `tailwind` seguono la stessa
denominazione `--bxdocs-*` con piccole variazioni proprie. Qualsiasi cosa
oltre a colore/font (layout, aggiungere/rimuovere elementi di contorno)
richiede una vera sovrascrittura o un tema personalizzato - vedi sotto.

## Sovrascrivere un tema

Metti il tuo `layout.bxm` + `page.bxm` (e opzionalmente `search.bxm` /
`assets/`) in una cartella `theme/` alla radice del tuo progetto. BX Docs
preferisce una sovrascrittura `theme/` a livello di progetto rispetto a
qualsiasi tema integrato, purché soddisfi il contratto sopra descritto -
i temi integrati sotto `resources/themes/` proprio di questo modulo sono
un buon punto di partenza da copiare e adattare.

Un esempio pratico - parti da `bootstrap` e sostituisci la sua palette del
brand e il font delle intestazioni con i tuoi, mantenendo tutto il resto
(nav, ricerca, modalità scura, evidenziazione del codice, ...) esattamente
come già funziona:

```markdown
my-project/
├── bxdocs.json
├── docs/
└── theme/                    ← sovrascrittura a livello di progetto, verificata prima di qualsiasi tema integrato
    ├── layout.bxm             ← copiato da resources/themes/bootstrap/layout.bxm
    ├── page.bxm                ← copiato da resources/themes/bootstrap/page.bxm, invariato
    ├── search.bxm               ← copiato invariato
    └── assets/
        └── style.css              ← copiato da assets/style.css di bootstrap, poi modificato
```

1. Copia i tre file `.bxm` e `assets/style.css` da
   `resources/themes/bootstrap/` di questo modulo nel `theme/` del tuo
   progetto.
2. Modifica solo ciò che serve cambiare. Per sostituire la palette del
   brand e il font, basta agire sulla parte iniziale di
   `theme/assets/style.css`:

   ```css
   :root {
   	--bxdocs-gradient-start: #7C3AED;  /* era #00FF78 */
   	--bxdocs-gradient-end: #DB2777;    /* era #00DBFF */
   	--bxdocs-accent: #FBBF24;          /* era #FFF500 */
   }

   body {
   	font-family: "Inter", system-ui, sans-serif;  /* era "Poppins" */
   }
   ```

3. Esegui `boxlang module:bxDocs build` (o `serve` mentre iteri) - BX
   Docs recepisce `theme/` automaticamente, nessuna modifica a
   `bxdocs.json` necessaria (una cartella `theme/` a livello di progetto
   ha sempre la precedenza sul tema integrato nominato in `theme.name`).
   Tutto ciò che non hai toccato - rendering della nav, ricerca,
   interruttore modalità scura, annotazioni del codice - continua a
   funzionare esattamente come nel tema `bootstrap` originale, dato che è
   sempre lo stesso identico markup `layout.bxm`/`page.bxm` sottostante.

Una cartella `theme/` di progetto è comunque tutto-o-niente - una volta
che BX Docs ne trova una, viene usata al posto del tema integrato per
intero, quindi necessita comunque del proprio `layout.bxm` + `page.bxm`
anche se l'unica cosa cambiata è `assets/style.css` (una cartella priva
di uno dei due file fallisce subito con `BxDocs.InvalidTheme` invece di
ricadere silenziosamente su un altro tema). Per una modifica solo CSS
senza `.bxm`, usa
[`extraCss`](#customizing-colors-without-a-theme-override) come sopra
invece - si sovrappone a qualunque tema `bxdocs.json` nomini, senza alcuna
cartella `theme/` coinvolta. `theme/` serve per quando devi anche
cambiare il markup stesso, argomento trattato di seguito.

## Scrivere un tema da zero

Un tema necessita solo dei due file obbligatori, quindi ecco un esempio
davvero minimale - niente Bootstrap/Tailwind, niente modalità scura,
niente UI di ricerca - per mostrare esattamente cosa è richiesto rispetto
a cosa aggiungono in più i temi integrati. Salva entrambi come
`theme/layout.bxm` e `theme/page.bxm` nel tuo progetto - una cartella
`theme/` a livello di progetto viene recepita automaticamente (come
sopra), nessuna modifica a `bxdocs.json` necessaria:

```bx
<!-- theme/layout.bxm -->
<bx:script>
	function renderNav( required array nodes ) {
		var html = "<ul>"
		for ( var node in arguments.nodes ) {
			html &= "<li>"
			html &= len( node.url )
				? '<a href="' & variables.basePath & node.url & '">' & encodeForHTML( node.title ) & '</a>'
				: encodeForHTML( node.title )
			if ( node.children.len() ) {
				html &= renderNav( node.children )
			}
			html &= "</li>"
		}
		return html & "</ul>"
	}
</bx:script>
<bx:output>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<title>#encodeForHTML( variables.page.title )# - #encodeForHTML( variables.siteConfig.name )#</title>
	<link rel="stylesheet" href="#variables.basePath#assets/theme/style.css">
</head>
<body>
	<header><a href="#variables.basePath#">#encodeForHTML( variables.siteConfig.name )#</a></header>
	<nav>#renderNav( variables.nav )#</nav>
	<main>
</bx:output>
<bx:include template="#variables.themeDir#/page.bxm">
<bx:output>
	</main>
</body>
</html>
</bx:output>
```

```bx
<!-- theme/page.bxm -->
<bx:output>
<article>
	<h1>#encodeForHTML( variables.page.title )#</h1>
	#variables.page.contentHtml#
</article>
</bx:output>
```

Questo è un tema completo e funzionante -
`variables.page.contentHtml` è il markdown già convertito (evidenziazione
della sintassi, ammonizioni, schede, matematica e tutto il resto), quindi
non c'è più nulla da analizzare, solo da impaginare. Da qui, aggiungi
qualsiasi cosa dei temi integrati che vuoi davvero: `search.bxm` (incluso
solo quando `search` di `bxdocs.json` è `true` - vedi [Ricerca](search.md)),
un interruttore modalità scura (copia la coppia `x-data`/`x-init` di
Alpine.js dal tag `<body>` di `resources/themes/bootstrap/layout.bxm` e il
blocco CSS `[data-theme="dark"]` corrispondente), breadcrumb/tag/link
pagina precedente-successiva (`page.bxm` in qualsiasi tema integrato
mostra lo schema - ognuno è solo un `if` intorno a una piccola funzione di
rendering, tutti guidati da campi già presenti su `variables.page`),
oppure una cartella `assets/` per il tuo CSS/JS, copiata automaticamente
in `site/assets/theme/` al momento del build.
