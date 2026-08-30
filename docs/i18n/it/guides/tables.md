---
title: Tabelle
order: 4.6
icon: phosphor-duotone:table
tags: [guides, markdown]
---

# Tabelle

Tabelle a pipe [GFM](https://github.github.com/gfm/#tables-extension-)
standard, in aggiunta a tutto quanto in [Estensioni
Markdown](markdown.md) - nessuna configurazione di `bxsites.yaml`
necessaria, sempre attive:

```markdown title="Example" linenums="1"
| Feature      | Community | Enterprise |
| ------------ | :-------: | ---------: |
| Themes       |    10     |         10 |
| Multi-locale |    Yes    |        Yes |
| Support      |  Forums   |     24/7   |
```

Che viene renderizzato così:

| Feature      | Community | Enterprise |
| ------------ | :-------: | ---------: |
| Themes       |    10     |         10 |
| Multi-locale |    Yes    |        Yes |
| Support      |  Forums   |     24/7   |

Una riga di `---` sotto l'intestazione attiva la tabella; metti i due
punti su quella riga separatrice per controllare l'allineamento per
colonna - `:---` sinistra, `:---:` centro, `---:` destra (nessun due
punti fa ricadere ogni colonna sull'allineamento a sinistra).

## Il contenuto delle celle è normale markdown inline

`code`, **grassetto**, *corsivo*, e [link](../index.md) funzionano tutti
dentro una cella esattamente come in qualsiasi altro punto della pagina:

```markdown title="Example" linenums="1"
| Setting | Value |
| --- | --- |
| Default theme | `bootstrap` |
| Docs | [Themes guide](themes.md) |
| Status | **Stable** |
```

Che viene renderizzato così:

| Setting | Value |
| --- | --- |
| Default theme | `bootstrap` |
| Docs | [Themes guide](themes.md) |
| Status | **Stable** |

## Escape di una pipe dentro una cella

Un `|` letterale nel testo semplice di una cella richiede un backslash,
`\|` - uno non sfuggito viene invece letto come il separatore della
colonna successiva:

```markdown title="Example" linenums="1"
| Expression | Meaning |
| --- | --- |
| a \| b | bitwise OR |
```

Che viene renderizzato così:

| Expression | Meaning |
| --- | --- |
| a \| b | bitwise OR |

Un `|` dentro il codice inline non ha affatto bisogno di essere sfuggito -
lo span di codice (`` `a | b` ``) lo protegge già:

| Expression | Meaning |
| --- | --- |
| `a | b` | bitwise OR |

## Righe corte e lunghe

Una riga di dati non deve corrispondere esattamente al numero di colonne
dell'intestazione - una riga corta viene riempita con celle vuote, e una
riga lunga ha le proprie celle in eccesso scartate silenziosamente,
entrambi i comportamenti controllati da
`tableOptions.appendMissingColumns`/`discardExtraColumns` qui sotto:

```markdown title="Example" linenums="1"
| One | Two | Three |
| --- | --- | --- |
| a | b |
| c | d | e | f |
```

Che viene renderizzato così:

| One | Two | Three |
| --- | --- | --- |
| a | b |
| c | d | e | f |

## Configurare il parsing

La gestione delle righe corte/lunghe, il rigore della riga separatrice
`---` stessa, e la classe CSS con cui viene renderizzata ogni `<table>`
sono tutti controllati dalla chiave
[`markdown.tableOptions`](../configuration.md#markdown) di
`bxsites.yaml`; i valori predefiniti mostrati in questa pagina sono
quasi sempre quello che vuoi.

## Scorrimento responsive e intestazione fissa

Ogni tabella renderizzata viene automaticamente racchiusa in un div
`.bxsites-table-wrap` - nessuna configurazione di `bxsites.yaml`, nessun
markdown aggiuntivo. Dà a una tabella larga una propria barra di
scorrimento orizzontale invece di farla traboccare oltre la pagina, e
limita le tabelle alte (oltre una `max-height`) a un'altezza fissa con una
propria barra di scorrimento verticale, con la riga di intestazione
fissata mentre il corpo scorre sotto di essa - una tabella corta come
quelle qui sopra non sviluppa mai una barra di scorrimento, dato che ci
sta già. Una sovrascrittura personalizzata in `theme/` può ridefinire lo
stile di `.bxsites-table-wrap` (in particolare la sua `max-height`), come
qualsiasi altra classe CSS.

## Oltre i dati semplici

Altre due ricette si costruiscono direttamente sopra una tabella
semplice come quelle sopra:

- Serve qualcosa di più vicino alle colonne Select/Rating di GitBook - un
  chip di stato o una valutazione a stelle in una cella? Vedi [Ricette
  per i visualizzatori](variables-and-functions.md#ricette-per-i-visualizzatori).
- Serve che un lettore possa davvero ordinare o filtrare una tabella lato
  client, invece di limitarsi a leggerla? Vedi [Una tabella ordinabile e
  filtrabile](interactivity.md#una-tabella-ordinabile-e-filtrabile).
