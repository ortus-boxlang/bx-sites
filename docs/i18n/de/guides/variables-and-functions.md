---
title: Variablen & Magische Funktionen
order: 12
icon: phosphor-duotone:magic-wand
tags: [anleitungen, variablen, funktionen]
---

# Variablen & Magische Funktionen

Zwei kleine, verwandte Funktionen, um wiederkehrende Fakten und
wiederkehrende Logik aus deinem Markdown herauszuhalten: **wiederverwendbare
Variablen**, einmal in `bxsites.yaml` definiert und mit `{{ }}` in jede Seite
eingesetzt, und **magische Funktionen**, kleine BoxLang-Helfer, die du einmal
in `docs/functions.bxs` schreibst und auf dieselbe Weise aufrufst - überall,
ganz ohne Import, ohne Plugin, ohne Verdrahtung.

Beide teilen sich eine Syntax:

```text
{{ dotted.path }}          # a reusable variable
{{ $name(arg1, arg2) }}    # a magic function call
```

## Wiederverwendbare Variablen

Füge `bxsites.yaml` einen `variables`-Block hinzu - in beliebiger Form, flach
oder verschachtelt:

```yaml title="bxsites.yaml"
variables:
  company: "Ortus Solutions"
  product:
    name: "BoxLang"
    supportEmail: "support@example.com"
```

Referenziere davon dann alles, per Punktpfad, von jeder Markdown-Seite aus:

```markdown title="docs/index.md"
# Welcome to {{ company }}

We build {{ product.name }} tools. Need help? Write us at
{{ product.supportEmail }}.
```

baut zu:

```html
<h1>Welcome to Ortus Solutions</h1>
<p>We build BoxLang tools. Need help? Write us at support@example.com.</p>
```

Eine `{{ }}`-Variable wird einmal, zur Build-Zeit, gegen das aufgelöst, was
`bxsites.yaml`s eigener `variables`-Block gerade dann enthält - benenne ein
Produkt um, aktualisiere eine Support-Adresse oder erhöhe ein Jahr an einer
einzigen Stelle, und jede Seite, die die Variable nutzt, übernimmt die
Änderung beim nächsten Build. Siehe
[`variables`](../configuration.md#variables) in der
Konfigurationsreferenz.

## Magische Funktionen

Füge eine Datei `docs/functions.bxs` hinzu (oder `src/functions.bxs`, wenn
dein Projekt `src/` verwendet - siehe
[Erste Schritte](../getting-started.md)) - ein einfaches BoxLang-Skript.
Jede Funktion, die du mit einem führenden `$` benennst, wird zu einer
*magischen Funktion*: aufrufbar aus `{{ }}` in Markdown, und aufrufbar bar,
direkt, aus den eigenen [`theme/`](themes.md#ein-theme-überschreiben)
`.bxm`-Überschreibungen eines Projekts.

```bx title="docs/functions.bxs" linenums="1"
function $shout( text ) {
	return uCase( arguments.text ) & "!"
}

function $badge( label, kind = "info" ) {
	return '<span class="badge bg-' & arguments.kind & '">' & arguments.label & '</span>'
}
```

```markdown title="docs/index.md"
{{ $shout('this is important') }}

Status: {{ $badge('Stable', 'success') }}
```

baut zu:

```html
<p>THIS IS IMPORTANT!</p>
<p>Status: <span class="badge bg-success">Stable</span></p>
```

Eine magische Funktion kann alles `toString()`-Fähige zurückgeben - reinen
Text, HTML, eine Zahl - und wird direkt in das Markdown der Seite
eingesetzt, bevor es konvertiert wird, sodass die Rückgabe von echtem HTML
(wie bei `$badge()` oben) genau so funktioniert, wie man es erwarten würde.

Eine Funktion, die in derselben `functions.bxs` *ohne* führendes `$`
deklariert wird, ist nur ein privater Helfer, gedacht dafür, nur von den
eigenen `$`-präfixierten Funktionen in derselben Datei aufgerufen zu werden
(sie werden alle in denselben Scope geladen, sodass eine die andere bar
aufrufen kann) - `{{ }}` kann eine solche Funktion niemals direkt aufrufen
(nur ein `$name(...)`-Aufrufziel wird überhaupt erkannt), und sie ist auch
nicht Teil der dokumentierten öffentlichen Oberfläche, die ein
Theme-Override aufrufen sollte, auch wenn sie dort technisch zufällig
ebenfalls erreichbar ist:

```bx title="docs/functions.bxs"
private string function formatPrice( amount ) {
	return "$" & numberFormat( arguments.amount, "9.99" )
}

function $price( amount ) {
	return formatPrice( arguments.amount )
}
```

### Eine magische Funktion aus einem Theme-Override aufrufen

Weil eine magische Funktion direkt in den Template-Scope eingebunden wird,
kann das eigene `theme/page.bxm` (oder `layout.bxm`) eines Projekts sie bar
aufrufen, ganz ohne Präfix - auf dieselbe Weise, wie es bereits
`variables.page`/`variables.siteConfig` liest:

```bx title="theme/page.bxm (excerpt)"
<p class="build-banner">#$shout( 'built with boxlang' )#</p>
```

### Argumentsyntax

Die Argumente eines magischen Funktionsaufrufs sind einfache, durch Kommas
getrennte Literale oder Variablenreferenzen - keine verschachtelten
Funktionsaufrufe oder Ausdrücke in dieser ersten Version:

- Zahlen: `{{ $discount(20) }}`
- Zeichenketten in Anführungszeichen: `{{ $greet('World') }}` oder
  `{{ $greet("World") }}`
- Booleans: `{{ $badge('Beta', true) }}`
- Eine `{{ }}`-lose Punktpfad-Variablenreferenz: `{{ $greet(product.name) }}`

## Die Syntax wörtlich anzeigen

Ein `{{ }}`, das innerhalb eines eingezäunten Codeblocks angezeigt wird (drei
oder mehr Backticks, wie jedes Beispiel auf dieser Seite), bleibt völlig
unangetastet, statt aufgelöst zu werden - dieselbe Konvention, die dieses
Modul bereits für `$...$`-Mathematik und `=== "Tab"`-Content-Tabs verwendet.
Ein `` `{{ example }}` `` innerhalb von *Inline*-Code ist jedoch nicht durch
den Zaun geschützt - musst du die Syntax also inline statt in einem
vollständigen Codeblock zeigen, bevorzuge einen Namen, der nicht auch eine
echte Variable/Funktion in deinem eigenen Projekt ist.

Ein `{{ }}`, dessen Inhalt weder wie ein Variablenpfad noch wie ein
`$name(...)`-Aufruf aussieht - etwa die eigene `{{ }}`-Syntax einer anderen
Templating-Engine, in Fließtext gezeigt - bleibt unangetastet, statt als
Fehler behandelt zu werden. Nur ein Token, das *aussieht wie* eine Variable
oder ein magischer Funktionsaufruf, aber nicht aufgelöst werden kann, lässt
den Build fehlschlagen (siehe [Fehler](#fehler) unten) - das ist
beabsichtigt, um einen echten Tippfehler zu erkennen, ohne unbeteiligten
`{{ }}`-Text als defekte Syntax misszudeuten.

## Geltungsbereich

- `functions.bxs` gilt projektweit - eine Datei, einmal geladen, derselbe
  Satz magischer Funktionen auf jeder Seite verfügbar, über den Haupt-Baum
  und jeden [Versions](versioning.md)-/[Locale](i18n.md)-Baum hinweg. Du
  musst sie nicht nach `docs/versions/<name>/` oder `docs/i18n/<code>/`
  duplizieren.
- `variables` ist ebenso ein einzelner, projektweiter `bxsites.yaml`-Block -
  er ist selbst nicht pro Locale übersetzbar. Ein mehrsprachiges Projekt,
  das unterschiedlichen Variablentext pro Sprache möchte, kann stattdessen
  zu einer magischen Funktion greifen, die auf
  `siteConfig.i18n.defaultLocale.code` verzweigt (oder den Wert einfach
  locale-neutral halten - einen Produktnamen, eine Support-E-Mail).

## Reservierte Namen

Ein `theme/page.bxm`/`layout.bxm`-Override, das eine magische Funktion bar
aufruft (`$name(...)`), funktioniert, weil jede geladene Funktion -
`$`-präfigiert oder privater Helfer gleichermaßen - direkt in denselben
eigenen Rendering-Scope dieses Templates eingebunden wird, genau neben den
eingebauten `variables.page`/`variables.siteConfig`/etc., die jedes Theme
bereits liest. Das bedeutet, dass eine Funktion aus `functions.bxs`, die
sich einen Namen mit einem davon teilt, bereits einen hat: vermeide `page`,
`nav`, `siteConfig`, `themeDir`, `basePath`, `moduleAssetsDir`, `versions`,
`currentVersion`, `locales`, `currentLocale`, `currentLocaleDir`, `strings`,
`requiredFiles` und `stringsResolver` als eigenen Namen für einen privaten
Helfer (eine `$`-präfigierte magische Funktion kann mit keinem davon je
kollidieren, da keiner von ihnen mit `$` beginnt).

## Fehler

- `BxSites.UnknownVariable` - ein `{{ dotted.path }}` (oder ein
  `$name(...)`-Argument, das wie eine Variablenreferenz aussieht) passt zu
  nichts in `bxsites.yaml`s `variables`-Block.
- `BxSites.UnknownFunction` - ein `{{ $name(...) }}`-Aufruf passt zu keiner
  `$`-präfigierten Funktion in `docs/functions.bxs`.
- `BxSites.InvalidFunctions` - `docs/functions.bxs` konnte nicht geladen
  werden (ein BoxLang-Syntaxfehler in der Datei selbst).
- `BxSites.InvalidConfig` - der Schlüssel `variables` von `bxsites.yaml` ist
  vorhanden, ist aber kein Objekt.
