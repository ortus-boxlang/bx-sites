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
`variables`/`page` bereits verwenden. Brauchst du die Daten *berechnet*
statt nur aus einer statischen Datei geparst - einen Rabatt, der zur
Lesezeit angewendet wird, einen Wert, der nicht in drei duplizierten
Dateien leben sollte? Lege stattdessen eine `docs/data/*.bx`-**Klasse**
ab - siehe [Datenklassen](#datenklassen) weiter unten.

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
gewinnt zuerst `.bx` (siehe [Datenklassen](#datenklassen)), dann `.yaml`,
dann `.yml`, dann `.json` - wähle in der Praxis lieber ein Format pro
Basisnamen, statt dich auf diese Reihenfolge zu verlassen.

## Datenklassen

Eine `.yaml`-/`.json`-Datei ist statisch - einmal geparst, exakt so
verwendet, wie geschrieben. Für Daten, die berechnet werden müssen (ein
rabattierter Preis, ein aus mehreren Quellen zusammengesetzter Wert,
irgendetwas mit echter Logik dahinter), lege stattdessen eine echte
BoxLang-**Klasse** ab - `docs/data/Pricing.bx` (PascalCase, dieselbe
Klassendatei-Konvention, die dieses Modul überall sonst auch verwendet)
wird zu `data.pricing` - dieselbe kleingeschriebene `data.*`-Schlüsselform
wie jede andere Datei, nur mit dem ersten Buchstaben des Klassen-
Basisnamens kleingeschrieben:

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

**`getData()` ist erforderlich** - jede Datenklasse braucht eine (selbst
eine triviale, die `{}` zurückgibt), da sie automatisch aufgerufen wird,
wann immer `data.pricing` bloß verwendet wird, genau wie eine geparste
YAML-/JSON-Wurzel:

```markdown title="docs/pricing.md"
The Pro plan is **${{ data.pricing.pro.price }}/mo**.

::: for plan, info in data.pricing
- {{ plan }}: ${{ info.price }}
:::
```

**Jede andere öffentliche Methode ist ebenfalls aufrufbar**, direkt aus
`{{ }}`, mit genau derselben Argumentsyntax, die ein Aufruf einer
[magischen Funktion](variables-and-functions.md#magische-funktionen)
bereits verwendet (Literale oder Punktpfad-Variablenreferenzen,
kommagetrennt):

```markdown title="docs/pricing.md"
Discounted for early adopters: **${{ data.pricing.getDiscountedPrice("pro", 0.2) }}/mo**
```

baut zu:

```html
Discounted for early adopters: <strong>$23.2/mo</strong>
```

Das funktioniert auch aus `::: for`/`::: if`, derselben `<dotted.path>`-
Grammatik, die diese Direktiven bereits auflösen:

```markdown title="Beispiel" linenums="1"
::: if data.pricing.getDiscountedPrice("pro", 0.2)
Discounts are active.
:::
```

Ein Theme-Override oder eine magische Funktion, die bereits über das
volle BoxLang verfügen, bekommen die lebende Instanz selbst bar als
`data.pricing` gebunden - rufe `getData()` oder jede andere Methode dort
direkt auf, keine automatische Aufruf-Magie nötig (siehe
[Daten verwenden](#daten-verwenden) weiter unten).

**Nur öffentliche Methoden sind auf diese Weise erreichbar** - eine
`private function` in derselben Klasse bleibt ein echtes
Implementierungsdetail, unerreichbar von `{{ }}` aus, genau wie ein nicht
mit `$` präfixierter Helfer in `functions.bxs` *direkt* unerreichbar ist
(obwohl er, wie dort auch, weiterhin aus einer anderen Methode derselben
Datei aufrufbar ist).

Das lockert die Vertrauensgrenze [weiter unten](#warum-datendateien-nicht-boxlang-templates-in-markdown)
nicht - eine `.bx`-Datei unter `docs/data/` ist Code, den der
*Projekt-Eigentümer* schreibt, dieselbe Vertrauensstufe, die
`docs/functions.bxs` bereits hat, niemals etwas, das das Markdown eines
reinen Docs-Mitwirkenden erreichen kann.

**Eine schmale Einschränkung**, real, aber in der Praxis selten: Das Laden
einer Datenklasse braucht ihren eigenen aufgelösten Pfad als gültigen
BoxLang-Klassennamen (keine Bindestriche oder Leerzeichen irgendwo darin).
`bxSites` von innerhalb des Projekts selbst auszuführen - der weitaus
häufigste Fall - funktioniert immer, da nichts am eigenen Pfad des
Projekts (der beliebig viele Bindestriche haben darf, z. B. `my-project/`)
jemals so ausgeschrieben werden muss. Es wird nur mit einem expliziten
`--projectRoot` zu einer echten Einschränkung, das auf ein Projekt
außerhalb des aktuellen Verzeichnisses zeigt, dessen eigener Pfad (oder
der eines übergeordneten Verzeichnisses) einen Bindestrich oder ein
Leerzeichen enthält - siehe
[`BxSites.UnsupportedDataClassPath`](#fehler) für den genauen Fehler, der
stattdessen wirft, statt kryptisch zu scheitern.

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
Inhalt einer bestimmten Seite. Wäre `sponsors` eine
[Datenklasse](#datenklassen) statt einer `.yaml`-/`.json`-Datei, ist
`data.sponsors` hier die lebende Instanz selbst (echtes BoxLang, keine
nur-in-`{{ }}`-Bequemlichkeit mit automatischem Aufruf) - durchlaufe
stattdessen explizit `data.sponsors.getData()`.

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
Markdown selbst bleibt inert-bis-`{{ }}`-ersetzt, und `functions.bxs`/eine
`docs/data/*.bx`-Klasse bleiben die explizit vertrauenswürdigen
Fluchttüren in echte BoxLang-Logik - beides vom Projekt-Eigentümer
verfasster Code, niemals etwas, das der eigene PR eines
Markdown-Mitwirkenden hinzufügen kann.

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
  oder eine `docs/data/*.bx`-Klasse konnte nicht kompiliert/instanziiert
  werden, benennt die betroffene Datei.
- `BxSites.MissingDataMethod` - eine `docs/data/*.bx`-Klasse hat keine
  öffentliche `getData()`-Methode.
- `BxSites.UnknownDataMethod` - `{{ data.x.someMethod(...) }}` benennt
  eine Methode, die auf dieser Datenklassen-Instanz nicht existiert (oder
  nicht öffentlich ist).
- `BxSites.NotCallable` - `{{ data.x.someMethod(...) }}`, wobei `data.x`
  überhaupt keine Datenklassen-Instanz ist (ein `.yaml`-/`.json`-basierter
  Schlüssel hat keine Methoden, die aufgerufen werden könnten).
- `BxSites.UnsupportedDataClassPath` - eine `docs/data/*.bx`-Klasse konnte
  nicht geladen werden, weil ihr aufgelöster Pfad ein Zeichen enthält, das
  in einem BoxLang-Klassennamen nicht gültig ist (ein Bindestrich oder
  Leerzeichen in einem übergeordneten Verzeichnisnamen) - siehe die
  eigene Anmerkung dazu in [Datenklassen](#datenklassen).
- `BxSites.UnknownVariable` - ein `{{ data.x.y }}` (oder ein `::: for`/
  `::: if`-Pfad) lässt sich nicht gegen das auflösen, was tatsächlich in
  `docs/data/` liegt.
- `BxSites.InvalidForTarget` - der eigene Pfad eines `::: for` löste sich
  zu etwas auf, das weder ein Array noch ein Struct ist (kann nicht
  durchlaufen werden).
