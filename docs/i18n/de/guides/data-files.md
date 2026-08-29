---
title: Datendateien
order: 12.5
icon: phosphor-duotone:database
tags: [anleitungen, daten]
---

# Datendateien

[Wiederverwendbare Variablen](variables-and-functions.md#wiederverwendbare-variablen)
eignen sich hervorragend für einen flachen, einmaligen Fakt (`company`,
`supportEmail`), sind aber unhandlich für alles mit echter Form - eine
Teamliste, eine Preistabelle, eine Feature-Matrix. **Datendateien**
schließen genau diese Lücke: Lege eine `docs/data/*.yaml`-/`.yml`-/
`.json`-Datei in deinem Projekt ab, und ihr gesamter Inhalt - in
beliebiger Form, ein Objekt oder ein Array - wird von jeder Seite aus als
`data.<file>` erreichbar, mit derselben `{{ }}`-Syntax, die
`variables`/`page` bereits verwenden.

## Die Konvention

Füge einen `docs/data/`-Ordner hinzu. Der Basisname jeder Datei (ohne
Dateiendung) wird zu einem Top-Level-Schlüssel unter `data`:

```text title="docs/-Layout"
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

`data.team` ist jetzt genau dieses Array, `data.pricing.pro.price` jene
verschachtelte Zahl - die geparste Wurzel einer Datei wird exakt so
verwendet, wie sie geparst wurde, Objekt oder Array gleichermaßen, ohne
dass sie einer festen Form entsprechen müsste. Gibt es überhaupt keinen
`docs/data/`-Ordner, bedeutet das schlicht kein `data` - dieselbe
Opt-in-durch-Vorhandensein-Form, die
[`docs/functions.bxs`](variables-and-functions.md#magische-funktionen)/
[`docs/blog/authors.yml`](blog.md) bereits verwenden.

Referenziere davon alles in gewöhnlichem Markdown, per Punktpfad:

```markdown title="docs/pricing.md"
The Pro plan is **${{ data.pricing.pro.price }}/mo** for up to
{{ data.pricing.pro.seats }} seats.
```

baut zu:

```html
<p>The Pro plan is <strong>$29/mo</strong> for up to 20 seats.</p>
```

Teilen sich mehrere Dateien über verschiedene Endungen hinweg denselben
Basisnamen (sowohl `products.yaml` als auch `products.json` vorhanden),
gewinnt `.yaml`, dann `.yml`, dann `.json` - wähle in der Praxis lieber
ein Format pro Basisnamen, statt dich auf diese Reihenfolge zu verlassen.

## Daten verwenden

Ein skalarer `{{ data.x.y }}`-Verweis funktioniert überall dort, wo
`{{ }}` bereits funktioniert, aber echter Inhalt - ein Team-Raster, eine
Preistabelle - bedeutet meist ein Durchlaufen von `data.*`. Dafür gibt es
drei Wege, je nachdem, wo die Schleife hingehört:

### In einem Theme-Override

Sobald ein Projekt ein `theme/`-Override hat (siehe
[Themes](themes.md#ein-theme-überschreiben)), wird `data` auf dieselbe
Weise bar in `layout.bxm`/`page.bxm` eingebunden, wie es `page`/
`siteConfig` bereits sind - kein `{{ }}`, nur echtes BoxLang:

```bx title="theme/layout.bxm (excerpt)"
<ul class="footer-sponsors">
<bx:loop array="#data.sponsors#" index="sponsor">
	<li>#encodeForHTML( sponsor )#</li>
</bx:loop>
</ul>
```

Das ist der natürliche Ort für Daten, die auf *jede* Seite gehören (eine
Sponsorenliste im Footer, ein websiteweites Nav-Badge), statt auf den
Inhalt einer bestimmten Seite.

### Aus einer magischen Funktion

Eine [magische Funktion](variables-and-functions.md#magische-funktionen)
kann `data` ebenfalls bar lesen (sie ist eine der gleichen
"unterstützenden Variablen", die `page`/`siteConfig`/etc. bereits sind)
und darüber mit echtem BoxLang schleifen/verzweigen, wobei sie ein
Markdown-/HTML-Fragment zurückgibt:

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

Das wird serverseitig gerendert, zur Build-Zeit - für einen Such-Crawler
sichtbar, ganz ohne JavaScript, anders als das Alpine-Rezept unten.

### Direkt in Markdown, mit `::: for`/`::: if`

Für eine Schleife oder eine einfache Truthy-Prüfung, die überhaupt keine
magische Funktion braucht, funktionieren
[`::: for`/`::: if`](content-blocks.md#schleife-und-bedingung-datengesteuert)
direkt aus Markdown heraus:

```markdown title="docs/team.md" linenums="1"
::: for member, idx in data.team
{{ idx }}. **{{ member.name }}** - {{ member.role }}
:::
```

`::: for <item>, <index> in <dotted.path>` bindet `<item>`/`<index>`
mithilfe von BoxLangs eigener nativer Zwei-Variablen-`for`-Schleifen-
Semantik an das, was auch immer `<dotted.path>` auflöst - Element +
1-basierter Index für ein Array, oder Schlüssel + Wert für ein Struct,
in beiden Fällen die *identische* Syntax (keine Array-vs-Struct-
Verzweigung, die du selbst schreiben müsstest):

```markdown title="Eine Struktur iterieren" linenums="1"
::: for name, enabled in data.flags
- {{ name }}: {{ enabled }}
:::
```

`::: if <dotted.path>` rendert seinen eigenen Inhalt nur dann, wenn der
aufgelöste Wert truthy ist (ein leeres Array/Struct/String, `0` und
`false` gelten allesamt als falsy):

```markdown title="Beispiel" linenums="1"
::: if data.flags.betaBanner
Beta features are enabled on this build.
:::
```

Verkette `::: elseif <dotted.path>` (beliebig oft) und ein abschließendes,
bloßes `::: else` direkt nach einem `::: if` für echte
`if`/`elseif`/`else`-Semantik - die erste truthy Bedingung gewinnt,
`::: else` fängt auf, was übrig bleibt, und die Bedingung eines späteren
Zweigs wird erst dann überhaupt aufgelöst, wenn dieser Zweig selbst an
der Reihe ist. Ein einziges abschließendes `:::` schließt die gesamte
Kette - `::: elseif`/`::: else` markieren selbst, wo der vorherige Zweig
endet, es ist also kein `:::` vor jedem von ihnen nötig (auch wenn es
weiterhin funktioniert, falls du es lieber so schreiben möchtest):

```markdown title="Beispiel" linenums="1"
::: if data.flags.darkModeDefault
Dark mode is on by default.
::: elseif data.flags.betaBanner
Beta features are enabled, though dark mode isn't on by default.
::: else
Nothing special about this build.
:::
```

Beide Inhalte können gewöhnliches Markdown und sogar weitere
Content-Blöcke enthalten, einschließlich eines verschachtelten
`::: for`/`::: if`. Bewusst schmale Grammatik, passend zu `{{ }}` selbst
- nur ein Punktpfad, keine Vergleichsoperatoren (`==`, `&&`, ...) in
dieser ersten Version. Ein echter Vergleichsbedarf führt stattdessen zu
einer magischen Funktion (oben), die bereits über das volle BoxLang
verfügt.

### In Alpine, clientseitig (`x-data`)

[Interaktivität mit Alpine.js](interactivity.md) behandelt bereits, wie
man rohes `x-data`/`x-for`-HTML in Markdown fallen lässt; es stattdessen
mit `data.*` statt mit einem handgetippten JS-Array zu speisen, braucht
nur, `data.*` in einen sicheren HTML-Attributwert zu verwandeln.
`jsonSerialize()` allein reicht nicht aus - das Ergebnis braucht
weiterhin eine HTML-Attribut-Kodierung, um sicher innerhalb eines mit
`"..."` gequoteten Attributs zu landen (dasselbe Zwei-Schritt-Rezept, das
ColdBoxs eigener `attribute()`/`forAttribute()`-Helfer verwendet) - also
definiere einmalig einen einzeiligen Helfer, in deiner eigenen
`functions.bxs`:

```bx title="docs/functions.bxs"
function $jsonAttr( required any value ) {
	return encodeForHtmlAttribute( jsonSerialize( arguments.value ) )
}
```

`encodeForHtmlAttribute()` stammt aus bx-esapi, bereits eine Abhängigkeit
jedes bx-sites-Projekts - keine neue Abhängigkeit, nur dieses eine
Rezept. Dann, in Markdown:

```markdown title="docs/team.md" linenums="1"
<div x-data="{ team: {{ $jsonAttr(data.team) }} }">
  <template x-for="member in team" :key="member.name">
    <li x-text="member.name + ' - ' + member.role"></li>
  </template>
</div>
```

Einfache doppelte Anführungszeichen funktionieren rund um `x-data`
problemlos - `encodeForHtmlAttribute()` behandelt den Konflikt bereits,
kein Workaround mit einfachen Anführungszeichen nötig. Das ist der eine
Weg, der ausschließlich clientseitig rendert (nichts für eine Leserin
mit deaktiviertem JavaScript oder einen Such-Crawler) - greife
stattdessen zu einer magischen Funktion oder `::: for`, wenn der Inhalt
auch ohne JavaScript sichtbar sein soll.

## Warum Datendateien, nicht BoxLang-Templates in Markdown?

Eine verwandte, größere Frage kam beim Entwerfen davon auf: Warum nicht
Markdown selbst zu einem echten BoxLang-Template machen (Schleifen,
Bedingungen, beliebige Logik), statt ein schmales `::: for`/`::: if`
hinzuzufügen und sich für alles Weitere auf magische Funktionen zu
verlassen? Zwei Gründe:

- **Vertrauensgrenze.** `docs/**.md` ist das eine Artefakt, das
  routinemäßig von vielen/externen/weniger vertrauenswürdigen
  Mitwirkenden bearbeitet wird (ein Docs-PR). `docs/functions.bxs` ist
  das eine Artefakt, das der *Projekt-Eigentümer* explizit verfasst.
  Jede `.md`-Datei als echtes BoxLang-Template zu kompilieren, würde
  diese Grenze einreißen - jeder Mitwirkende, der einen Docs-PR öffnen
  kann, würde beliebige BoxLang-Ausführung gewinnen (Datei-I/O,
  Umgebungszugriff), statt nur reinen Markdown-Text.
- **Fehlerverhalten.** Ein unaufgelöstes `{{ }}` bleibt heute als reiner
  Text stehen - ein Tippfehler bricht einen Build nie. Ein
  BoxLang-Template-Kompilierfehler ist ein harter Fehler. `::: for`/
  `::: if` behalten dieselbe nachsichtige Form (ein nicht auflösbarer
  Pfad wirft einen klaren, tippfehlererkennenden Fehler - siehe
  [Fehler](#fehler) - statt still falsch zu kompilieren).

Datendateien schließen die eigentliche Lücke (strukturierter Inhalt, und
Schleifen/Bedingungen darüber), ohne einen der beiden Kompromisse:
Markdown selbst bleibt inert-bis-`{{ }}`-ersetzt, und `functions.bxs`
bleibt die eine explizit vertrauenswürdige Fluchttür in echte
BoxLang-Logik.

## Geltungsbereich

- `docs/data/` gilt projektweit, einmal geladen - derselbe
  Einmal-Lade-Geltungsbereich, den
  [`functions.bxs`](variables-and-functions.md#geltungsbereich) bereits
  hat. Jeder Versions-/Locale-Baum sieht dasselbe `data`; es gibt in
  dieser ersten Version kein Überschreiben oder Zusammenführen pro
  Version oder pro Locale. Dupliziere `docs/data/` nicht nach
  `docs/versions/<name>/` oder `docs/i18n/<code>/` - es wird von dort
  nicht gelesen.
- Nur ein flaches Verzeichnis - keine Unterordner-Rekursion in
  `docs/data/` in dieser ersten Version, dieselbe "genau eine
  Datei"-Form, die [`docs/blog/authors.yml`](blog.md) bereits hat.
- `data` ist ein reservierter `{{ }}`-Name, genau wie es `page` bereits
  ist (siehe
  [Reservierte Namen](variables-and-functions.md#reservierte-namen)) -
  ein `bxsites.yaml`-Eintrag `variables.data`, sollte ein Projekt
  irgendwie einen deklariert haben, wird vom eigenen Struct aus
  `docs/data/` überschattet, statt zu gewinnen. `docs/functions.bxs`
  kann ebenfalls keine Funktion namens `data` deklarieren, aus demselben
  Grund.

## Fehler

- `BxSites.InvalidDataFile` - eine `docs/data/*.yaml`-/`.yml`-/
  `.json`-Datei konnte nicht geparst werden (ein YAML-/JSON-Syntaxfehler),
  benennt die betroffene Datei.
- `BxSites.UnknownVariable` - ein `{{ data.x.y }}` (oder ein `::: for`/
  `::: if`-Pfad) lässt sich nicht gegen das auflösen, was tatsächlich in
  `docs/data/` liegt.
- `BxSites.InvalidForTarget` - der eigene Pfad eines `::: for` löste sich
  zu etwas auf, das weder ein Array noch ein Struct ist (kann nicht
  durchlaufen werden).
