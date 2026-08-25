---
title: Migrare da GitBook
order: 7
icon: phosphor-duotone:swap
tags: [guide, migrazione, gitbook]
---

# Migrare da GitBook

`bxSites migrate` converte un export di GitBook - un sommario
`SUMMARY.md` più i suoi file `.md`, il formato di sincronizzazione su
disco proprio di GitBook (lo stesso scritto da GitHub/Git Sync) - in un
albero `docs/` di bx-sites, con un solo comando. Tutto ciò che il sistema
di blocchi di contenuto di GitBook supporta corrisponde a qualcosa che
bx-sites ha già (vedi [Blocchi di contenuto](content-blocks.md)), quindi
il risultato non è una bozza approssimativa - è un sito funzionante.

## Ottenere un export di GitBook

`bxSites migrate` legge direttamente la struttura di file propria di
GitBook, quindi ognuna delle seguenti opzioni funziona come `--source`:

- Un repository a cui GitBook è sincronizzato via Git (impostazioni dello
  Space → **GitSync**) - punta `--source` al tuo clone locale.
- Il download **Export → Markdown** proprio di GitBook, decompresso.

In entrambi i casi, `--source` dovrebbe essere la cartella che contiene
direttamente `SUMMARY.md`.

## Eseguire la migrazione

```bash
# 1. Scaffold a fresh bx-sites project (skip this if you already have one)
bxSites new my-docs
cd my-docs

# 2. Migrate the GitBook export into it
bxSites migrate --source=/path/to/gitbook-export

# 3. Build and look at the result
bxSites serve
```

`migrate` stampa quante pagine ha convertito e, quando qualcosa ha
richiesto una valutazione, esattamente cosa e dove:

```
Migrated 14 page(s) from [/path/to/gitbook-export] into my-docs/docs/, wrote my-docs/docs/nav.json

2 item(s) need a manual look:
  - guides/advanced.md: Unsupported GitBook block [{% conditional-content %}] - left in its original syntax, needs manual conversion
  - guides/layout.md: Column width="one-third" is not a plain length/percentage - dropped, review manually
```

Niente viene mai scartato in silenzio - un blocco che questo strumento
non sa convertire viene lasciato nel file migrato nella propria sintassi
originale `{% %}`, quindi il contenuto è comunque lì e ancora facile da
trovare (cerca `{%` nell'albero `docs/` migrato una volta finito).
Rieseguire `migrate` sovrascrive qualsiasi file o `docs/nav.json` scritto
in precedenza, quindi è sicuro correggere il proprio export sorgente ed
eseguirlo di nuovo.

## Cosa viene convertito automaticamente

| GitBook | Diventa |
|---|---|
| `SUMMARY.md` | `docs/nav.json` (formato [nav esplicita](../configuration.md#nav)), annidamento preservato |
| `README.md` (in qualsiasi cartella) | `index.md` - la convenzione di indice di cartella propria di bx-sites |
| Il frontmatter `title`/`description`/`tags` di una pagina | Riportato invariato nel frontmatter bx-sites del file migrato |
| `.gitbook/assets/**` | `docs/assets/gitbook/**`, con ogni riferimento riscritto di conseguenza |
| `{% hint style="..." %}` | `!!! type` - un'[ammonizione](markdown.md#admonitions) nativa |
| `{% tabs %}` / `{% tab title="..." %}` | `=== "Title"` - [schede di contenuto](markdown.md#content-tabs) native |
| `{% cards %}` / `{% card %}` | [`::: cards` / `::: card`](content-blocks.md#cards) |
| `{% columns %}` / `{% column width="..." %}` | [`::: columns` / `::: column`](content-blocks.md#columns) |
| `{% stepper %}` / `{% step %}` | [`::: stepper` / `::: step`](content-blocks.md#stepper) - titolo ricavato dalla prima intestazione del passo stesso |
| `{% file src="..." %}` | [`::: file`](content-blocks.md#file) |
| `{% embed url="..." %}` | [`::: embed`](content-blocks.md#embed) |
| `{% content-ref url="..." %}` | [`::: page-link`](content-blocks.md#page-link) |
| `{% details %}` / `{% expand %}` | [`::: expandable`](content-blocks.md#expandable) |
| `{% prompt description="..." icon="..." defaultExpanded="..." %}` | [`::: prompt`](content-blocks.md#prompt) - `openInAIProviders` viene scartato, segnalato come avviso quando era attivato |

Un blocco mostrato come esempio letterale delimitato nel tuo contenuto
GitBook (invece di essere usato per davvero) viene correttamente lasciato
stare, non frainteso per quello reale.

## Cosa richiede un controllo manuale

Alcuni blocchi di GitBook non hanno alcun equivalente in bx-sites e
vengono lasciati nella propria sintassi originale `{% %}` invece di
essere indovinati: **Contenuto condizionale** (visibilità basata
sull'account GitBook, un concetto che bx-sites non ha) e la barra di
ricerca **Ask AI**. Qualsiasi altra cosa che questo strumento non
riconosce - un blocco con un errore di battitura, una
funzionalità di GitBook aggiunta dopo la scrittura di questo strumento -
riceve lo stesso trattamento: lasciata così com'è, segnalata come
avviso.

Alcune decisioni minori vengono segnalate allo stesso modo: uno `style`
di `hint` non riconosciuto (ricade su `note`), oppure una `width` di
`column` che non è una lunghezza/percentuale CSS semplice (scartata
invece di essere presa alla lettera).

**Le icone delle pagine non vengono migrate automaticamente.** La
documentazione stessa di GitBook non conferma che l'assegnazione
dell'icona di una pagina (impostata tramite il selettore di icone del
suo editor) sopravviva davvero in un export Git-Sync - se il frontmatter
esportato di un progetto ha effettivamente un campo `icon`, `migrate` lo
riporta opportunisticamente, ma non aspettartelo per la maggior parte
degli export reali. Imposta le icone a mano in seguito - o nel
frontmatter proprio di una pagina, oppure nell'
[`icon` di una voce di `docs/nav.json`](../configuration.md#nav) -
usando un'[icona con nome](themes.md#icons) da una delle otto librerie
incluse (non serve far corrispondere le icone basate su Font Awesome
proprie di GitBook; scegli qualunque nome sembri adatto nella galleria di
[Phosphor](https://phosphoricons.com/) - uno qualsiasi dei suoi sei pesi -
[Lucide](https://lucide.dev/icons/) o [Tabler](https://tabler.io/icons)).

## Dopo la migrazione

Il `docs/nav.json` migrato è un normale file di
[nav esplicita](../configuration.md#nav) - modificalo come qualsiasi
altro, oppure eliminalo per ricadere sulla convenzione propria di
bx-sites secondo cui la struttura delle cartelle è la struttura di
navigazione. Da qui in poi è un normale progetto bx-sites: scegli un
[tema](themes.md), rivedi [`bxsites.yaml`](../configuration.md), e
[distribuisci](deployment.md) quando ne sei soddisfatto.
