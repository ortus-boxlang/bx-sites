---
title: KI-Agenten-Anweisungen
order: 6.4
icon: phosphor-duotone:file-text
summary: Jedes neue Projekt erhält automatisch eine AGENTS.md-Kurzreferenz zur Inhaltserstellung - Frontmatter-Schlüssel, Content-Block-Direktiven und den Seiten-Workflow, generiert aus dem echten Theme und Quellordner deines Projekts.
tags: [anleitungen, ai, agents]
---

# KI-Agenten-Anweisungen

`bxSites new` schreibt standardmäßig eine `AGENTS.md` in den Projekt-Root -
eine kompakte Kurzreferenz für das, was die meisten KI-Coding-Assistenten
beim Bearbeiten deiner Inhalte tatsächlich brauchen: erkannte
Frontmatter-Schlüssel, jede `::: name :::`-Content-Block-Direktive mit ihrer
Syntax, die reservierten Ordner und der grundlegende Workflow `page:new` ->
`serve` -> `lint` -> `build`. Sie wird aus dem echten Theme und Quellordner
*deines* Projekts generiert, nicht aus einer generischen Vorlage, und ist
das Pendant zu den [KI-Agenten-Skills](ai-agent-skills.md) für die
Inhaltserstellung - eine Kurzreferenz, die ein Assistent in einem Durchgang
lesen kann, im Gegensatz zu Skills, die er bei Bedarf für eine bestimmte
Aufgabe lädt.

Das ist eine andere Zielgruppe als die `AGENTS.md` im Root des
**bx-sites-Repositorys selbst** - diese bringt einem Assistenten bei, wie er
am Quellcode von bx-sites selbst arbeitet. Diese Anleitung dreht sich um die
Datei, die in *dein* generiertes Site-Projekt gescaffoldet wird, damit ein
Assistent *deine* Inhalte korrekt bearbeitet.

## Was geschrieben wird

```bash title="Standard: nur AGENTS.md"
bxSites new my-docs
```

```text title="my-docs/"
my-docs/
├── AGENTS.md
├── .markdownlint.json
├── bxsites.yaml
└── docs/
    ├── assets/
    └── index.md
```

`.markdownlint.json` wird immer mitgeschrieben - ein Regelwerk, abgestimmt
auf bx-sites-Inhalte (lockert Zeilenlängen-, Hard-Tab- und
Bare-URL-Regeln, die sonst gewöhnliches bx-sites-Markdown bemängeln würden,
wie eine lange Content-Block-Direktivenzeile oder einen Code-Fence ohne
Sprachangabe).

### Auswahl der Datei(en)

Nicht jedes Projekt nutzt speziell Claude Code, daher sind
`CLAUDE.md`/`.cursorrules` über `--agents` optional:

```bash title="Auch CLAUDE.md schreiben"
bxSites new my-docs --agents=agents,claude
```

```bash title="Anweisungsdatei(en) komplett überspringen"
bxSites new my-docs --agents=none
# .markdownlint.json wird trotzdem in jedem Fall geschrieben
```

| Ziel | Datei |
|---|---|
| `agents` (Standard) | `AGENTS.md` |
| `claude` | `CLAUDE.md` |
| `cursor` | `.cursorrules` |

## Aktuell halten: `agents:sync`

Der generierte Inhalt steht in einem markierten Block:

```text title="AGENTS.md"
<!-- bxsites:agents:start -->
...generierte Kurzreferenz...
<!-- bxsites:agents:end -->
```

Bearbeite frei oberhalb oder unterhalb der Marker - eigene Projektnotizen,
Team-Konventionen, Links zu einem internen Styleguide, was auch immer du
möchtest. Führe `agents:sync` jederzeit aus (nach einem bx-sites-Upgrade,
das neue Direktiven oder Frontmatter-Schlüssel hinzufügt, oder um ein
Projekt nachzurüsten, das vor Einführung dieser Funktion gescaffoldet
wurde), und nur der markierte Block wird aufgefrischt:

```bash title="Usage"
bxSites agents:sync
```

Drei Ergebnisse pro Zieldatei, die zurückgemeldet werden:

- **Created** - die Datei existierte noch nicht.
- **Updated** - Marker gefunden, der Block dazwischen aufgefrischt, alles
  außerhalb davon unangetastet gelassen.
- **Skipped** - die Datei existiert, hat aber keine Marker. Nichts wird
  überschrieben; das ist entweder eine Datei, die du vor Einführung dieser
  Funktion von Hand geschrieben hast, oder eine, deren Marker du absichtlich
  entfernt hast, um sie von künftigen Syncs auszunehmen.

`agents:sync` schreibt außerdem immer `.markdownlint.json` auf das aktuelle
kanonische Regelwerk neu und nimmt dasselbe Flag `--agents=` wie `new`
entgegen, um bestimmte Datei(en) anzusprechen.

## FAQ

??? faq "Überschreibt `agents:sync` meine eigenen Notizen?"
    Nein - nur der Text zwischen `<!-- bxsites:agents:start -->` und
    `<!-- bxsites:agents:end -->` wird jemals ersetzt. Inhalte, die du
    außerhalb dieser Marker in derselben Datei hinzufügst, bleiben bei
    jedem Sync erhalten.

??? faq "Ich möchte, dass AGENTS.md nicht mehr angefasst wird - wie schließe ich eine Datei aus?"
    Lösche die Marker `bxsites:agents:start`/`end` (oder füge sie nie wieder
    hinzu). `agents:sync` behandelt eine Datei ohne Marker als handgeschrieben
    und meldet sie als übersprungen, statt sie zu überschreiben.

??? faq "Ersetzt das die KI-Agenten-Skills?"
    Nein - sie decken unterschiedliche Bereiche ab. Dies ist eine einzelne,
    stets vorhandene Kurzreferenz für die Inhaltserstellung;
    [KI-Agenten-Skills](ai-agent-skills.md) (`bxSites skills:install`) ist
    ein deutlich tieferes, dreizehnteiliges Skill-Paket, das ein Assistent
    bei Bedarf lädt und alles von Theming bis Deployment abdeckt. Die
    meisten Projekte profitieren von beidem.

??? faq "Warum gibt es keine `::: comments :::`-Zeile in der Direktiven-Tabelle?"
    Leser-Kommentare sind noch kein bx-sites-Feature - die generierte Datei
    sagt das ausdrücklich, damit ein Assistent keine nicht existierende
    Syntax erfindet.

## Quelle

- Generator: `models/build/AgentsFileGenerator.bx`
- CLI-Verben: `models/cli/New.bx` (das `--agents`-Flag von `new`), `models/cli/AgentsSync.bx`
- Siehe [CLI-Referenz](../cli-reference.md#new) und
  [CLI-Referenz](../cli-reference.md#agentssync) für die vollständige Flag-Referenz.
