---
title: Migrare da mkdocs
order: 8
icon: phosphor-duotone:swap
tags: [guide, migrazione, mkdocs]
---

# Migrare da mkdocs

`bxSites migrate --from=mkdocs` converte un progetto mkdocs - `mkdocs.yml`
più la sua cartella `docs/` - in un progetto bx-sites completo, con un
solo comando:

```bash frame="terminal" title="Terminal"
bxSites migrate --source=/path/to/mkdocs-project --from=mkdocs
```

- `--source` (obbligatorio) - la cartella radice del progetto mkdocs (deve contenere `mkdocs.yml`)

A differenza della [migrazione da GitBook](migrating-from-gitbook.md),
questa è principalmente una traduzione di *configurazione*, non di
*contenuto*. La cartella `docs/` propria di mkdocs usa già esattamente le
convenzioni di bx-sites - l'annidamento delle cartelle è struttura di nav,
`index.md` è la home page propria di una cartella, e i link relativi
`.md` tra pagine funzionano semplicemente. Ancora più a fondo: la
sintassi Markdown estesa propria di mkdocs-material è la *stessa identica
sintassi testuale* che bx-sites parla già, perché bx-sites si è
modellato su mkdocs-material fin dall'inizio (vedi
[Estensioni Markdown](markdown.md)). Quindi i corpi delle pagine vengono
copiati byte per byte senza modifiche - qui non c'è nulla da riscrivere
per le ammonizioni `!!! note`, le schede di contenuto `=== "Tab"`, o la
matematica `$x^2$`, perché sono già sintassi bx-sites valida.

## Cosa viene convertito automaticamente

**`mkdocs.yml` → `bxsites.yaml`:**

| mkdocs.yml | bxsites.yaml |
|---|---|
| `site_name` | `name` |
| `site_description` | `description` |
| `site_url` | `baseURL` |
| `theme.name: material` | `theme.name: "material"` |
| qualsiasi altro `theme.name` | `theme.name: "bootstrap"` (il predefinito proprio di bx-sites) - segnalato come avviso, dato che il risultato visivo differisce |
| `repo_url` / `edit_uri` | `repo.url` / `repo.editUri` |
| `extra_css` / `extra_javascript` | `extraCss` / `extraJs` |
| `markdown_extensions: [footnotes]` | `markdown.enableFootnotes: true` |
| `markdown_extensions: [def_list]` | `markdown.enableDefinitionLists: true` |
| `markdown_extensions: [pymdownx.arithmatex]` | `math: true` |

Ogni altra voce di `markdown_extensions` che la sintassi propria di
mkdocs-material copre già nativamente - `admonition`, `pymdownx.tabbed`,
`pymdownx.details`, `pymdownx.superfences`, `pymdownx.highlight`, `toc`,
`attr_list`, e altre - non richiede alcuna modifica a `bxsites.yaml`;
bx-sites si comporta già così di serie.

**`nav:` → `docs/nav.json`:**

```yaml title="mkdocs.yml" linenums="1"
# mkdocs.yml
nav:
  - Home: index.md
  - Guide:
      - Setup: guide/setup.md
      - Advanced: guide/advanced.md
  - About: about.md
```

diventa:

```json title="docs/nav.json" linenums="1"
[
  { "title": "Home", "path": "index.md", "children": [] },
  { "title": "Guide", "path": "", "children": [
    { "title": "Setup", "path": "guide/setup.md", "children": [] },
    { "title": "Advanced", "path": "guide/advanced.md", "children": [] }
  ] },
  { "title": "About", "path": "about.md", "children": [] }
]
```

- anche una voce con solo percorso (`- about.md`, senza titolo esplicito)
  viene convertita - il suo titolo proviene dal frontmatter/dalla prima
  intestazione propri della pagina migrata, come qualsiasi voce di
  `docs/nav.json` di bx-sites senza `title` impostato
- vedi [Configurazione: `nav`](../configuration.md#nav) per il formato completo

**Pagine e asset:**

- ogni file `.md` viene copiato allo stesso percorso sotto `docs/`, senza
  modifiche
- ogni file *diverso* (immagini, PDF, ...) viene rilocato in
  `docs/assets/mkdocs/<stesso-percorso-relativo>` - la pipeline di asset
  propria di bx-sites pubblica solo `docs/assets/**`, e mkdocs non ha una
  convenzione unica di cartella asset propria come invece
  `.gitbook/assets/` ce l'ha per GitBook, quindi le immagini sono
  comunemente sparse accanto alle pagine che le usano
- ogni riferimento a un asset rilocato - `![diagram](img/diagram.png)`,
  ad esempio - viene riscritto nel percorso relativo corretto che
  raggiunge la sua nuova posizione, tenendo conto di quanto in profondità
  si trova la pagina che contiene il link stessa (la stessa convenzione
  "l'autore scrive il numero giusto di `../`" che già usa qualsiasi
  progetto bx-sites - calcolata per te qui invece di essere lasciata a un
  trova-e-sostituisci)

## Cosa richiede un controllo manuale

Segnalato come avviso nell'output stesso del comando, niente viene mai
scartato in silenzio:

- una voce `markdown_extensions`/`plugins` di mkdocs senza un equivalente
  bx-sites (le scorciatoie emoji proprie di mkdocs-material, un plugin
  di terze parti come `awesome-pages` o `git-revision-date`) - se ti
  serve lo stesso comportamento, vedi [Plugin](plugins.md)
- la personalizzazione di colore/font propria di `mkdocs.yml`
  (`theme.palette`/`theme.font`) non ha un equivalente diretto - vedi
  [Personalizzare i colori](themes.md#customizing-colors-without-a-theme-override)
  una volta terminata la migrazione
- un `theme.name` diverso da `material` (ricade su `bootstrap`)

## Esempio pratico

```bash frame="terminal" title="Terminal" linenums="1"
boxlang module:bxSites new --projectRoot=my-docs
boxlang module:bxSites migrate --projectRoot=my-docs --source=../my-mkdocs-project --from=mkdocs
cd my-docs
boxlang module:bxSites serve
```

`migrate` scrive `bxsites.yaml` e `docs/` esso stesso - il passaggio
`new` sopra serve solo per ottenere una radice di progetto con `docs/`
pronta a riceverli; anche `migrate` crea `docs/` da sé, quindi non è
strettamente obbligatorio. Rivedi gli avvisi del comando, poi esegui
`serve` per vedere il risultato prima di fare commit.
