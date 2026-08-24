---
title: Content-Blöcke
order: 4.5
icon: phosphor-duotone:squares-four
tags: [anleitungen, markdown, gitbook]
---

# Content-Blöcke

Zusätzlich zu allem in [Markdown-Erweiterungen](markdown.md) unterstützt
BxSites eine Familie von GitBook-artigen Content-Blöcken - für sich
genommen praktisch, und der Grund, warum sich der Inhalt einer
GitBook-Website unkompliziert migrieren lässt: jeder dieser Blöcke
bildet direkt auf einen gleichnamigen GitBook-Block ab. Jeder verwendet
dieselbe Container-Syntax `::: name ... :::` (ein einzelnes `:::` in
seiner eigenen Zeile schließt den jeweils gerade offenen Block) - keine
`bxsites.yaml`-Konfiguration nötig, immer verfügbar. Ein Block kann in
einem anderen verschachtelt sein (etwa ein Expandable mit einer
Cards-Gruppe darin) - jeder wird erneut nach weiteren Blöcken in seinem
eigenen Inhalt durchsucht.

## Expandable

Ein einfacher einklappbarer Bereich - kein Callout-Icon/keine Farbe, im
Gegensatz zu einer einklappbaren Admonition (`???`, siehe
[Admonitions](markdown.md#einklappbare-admonitions)):

```markdown title="Beispiel" linenums="1"
::: expandable "Is this different from a collapsible admonition?"
Yes - this has no type/icon/color, just a plain expand/collapse section.
Add `open="true"` to start it expanded.
:::
```

::: expandable "Unterscheidet sich das von einer einklappbaren Admonition?"
Ja - dies hat kein Typ/Icon/Farbe, nur einen einfachen
Auf-/Zuklapp-Bereich. Füge `open="true"` hinzu, um ihn ausgeklappt zu
starten.
:::

## Cards

Ein Raster aus Link-Cards, jede ihr eigenes `::: card` innerhalb eines
`::: cards`-Wrappers - `title`, `icon`, `image` und `href` sind alle
optional (eine Card ohne `href` wird als schlichte, nicht klickbare Card
gerendert). `icon` wird auf dieselbe Weise aufgelöst wie
Frontmatter-/Nav-`icon`-Werte - ein reines Emoji, oder ein benanntes
Icon aus einer mitgelieferten Bibliothek (`icon="phosphor-duotone:rocket-launch"`,
`icon="lucide:rocket"`, ...) - siehe [Themes: Icons](themes.md#icons):

```markdown title="Beispiel" linenums="1"
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
::: card title="Erste Schritte" icon="phosphor-duotone:rocket-launch" href="../getting-started.md"
Installiere, erstelle und baue deine erste Website.
:::
::: card title="Themes" icon="phosphor-duotone:palette" href="themes.md"
Passe ein integriertes Theme an oder schreibe dein eigenes.
:::
:::

## Columns

Ein nebeneinanderliegendes Layout - `::: column` akzeptiert ein
optionales `width` (eine reine CSS-Länge/-Prozentangabe, z. B. `"40%"`);
Spalten ohne explizite Breite teilen sich die Reihe gleichmäßig:

```markdown title="Beispiel" linenums="1"
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
Die breitere Spalte.
:::
::: column
Die schmalere.
:::
:::

## Stepper

Eine nummerierte, verbundene Abfolge von Schritten:

```markdown title="Beispiel" linenums="1"
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
::: step "Installieren"
`install-bx-module bx-sites`
:::
::: step "Aufsetzen"
`bxSites new`
:::
:::

Das eigene, optionale `color`-Attribut eines Schritts markiert seinen
Marker mit einer von vier semantischen Farben - dem Standard (kein
`color`), `success`, `warning` oder `danger` - unabhängig von der
Position des Schritts in der Abfolge:

```markdown title="Beispiel" linenums="1"
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
::: step "Daten sichern" color="success"
Routineaufgabe, jederzeit sicher auszuführen.
:::
::: step "Optional: Telemetrie aktivieren" color="warning"
Überspringe diesen Schritt, wenn du dir nicht sicher bist.
:::
::: step "Alte Installation löschen" color="danger"
Unumkehrbar - stelle sicher, dass die Sicherung oben abgeschlossen ist.
:::
:::

Der nummerierte Marker, die Verbindungslinie und jede der drei
`color`-Paletten oben lassen sich unabhängig von der restlichen Palette
der Website themen, über CSS-Custom-Properties - siehe
[Farben anpassen](themes.md#farben-anpassen-ohne-ein-theme-zu-überschreiben).

## File

Eine Download-Card für ein PDF, ein Video oder ein beliebiges anderes
Projekt-Asset - `src` wird auf dieselbe Weise aufgelöst wie
`theme.logo`/die Frontmatter-`ogImage` (relativ zu `docs/assets/`):

```markdown title="Beispiel" linenums="1"
::: file src="assets/spec.pdf" title="API Specification"
:::
```

::: file src="assets/og-image.png" title="Site Preview Image"
:::

## Embed

Ein responsives iframe-Embed für einen erkannten Anbieter - derzeit
YouTube, Vimeo, CodePen, Spotify, Loom und Figma. Eine URL von woanders
fällt stattdessen auf eine schlichte "visit ↗"-Link-Card zurück, statt
auf ein iframe, das ohnehin nicht rendern würde (die meisten Websites
blockieren das Einbetten in Frames):

```markdown title="Beispiel" linenums="1"
::: embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="A demo"
:::
```

::: embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="A demo"
:::

## OpenAPI / Swagger

Ein interaktives [Swagger-UI](https://swagger.io/tools/swagger-ui/)-Widget
für eine OpenAPI-/Swagger-Spezifikation - `src` wird auf dieselbe, relativ
zu `docs/assets/` aufgelöste Weise interpretiert wie das `src` von
`::: file`. Sowohl JSON- als auch YAML-Spezifikationen funktionieren;
Swagger UI parst beide vollständig clientseitig - nirgendwo in diesem
Modul findet eine serverseitige OpenAPI-Verarbeitung statt. Erfordert,
dass `bxsites.yaml`s [`openapi`](../configuration.md#openapi) auf `true`
gesetzt ist - ist das nicht der Fall, wird dieser Platzhalter zwar
gerendert, bleibt aber inaktiv (Swagger UIs eigenes JS/CSS wird dann
überhaupt nicht nach `site/` kopiert, sodass der Build jedes anderen
Projekts genauso klein bleibt wie vor diesem Feature):

```markdown title="Beispiel" linenums="1"
::: openapi src="assets/openapi/example.yaml" title="Bookshelf API"
:::
```

::: openapi src="assets/openapi/example.yaml" title="Bookshelf API"
:::

Das Widget oben ist genau diese Seite, live, und rendert die kleine
Beispielspezifikation, die dieser Guide unter
`docs/assets/openapi/example.yaml` mitliefert - öffne sie im eigenen
Projekt unter `docs/assets/` (oder richte `src` auf die bereits vorhandene
eigene Spezifikation), um dasselbe mit der eigenen API zu sehen.

Vendort ist nur `SwaggerUIBundle`s eigenes Basis-Layout - keine
Topbar/"Explore"-Leiste, über die eine andere Spezifikation eingetippt
werden könnte (ein `::: openapi`-Block soll immer genau die eine
Spezifikation zeigen, auf die seine Autorin ihn gerichtet hat), sodass
jede Operation samt ihrer Request-/Response-Schemas und "Try it out" (das
die eigene `servers[0].url` der Spezifikation direkt aus dem Browser der
Besucherin aufruft - dort muss CORS für den Docs-Host erlaubt sein) direkt
aus der bestehenden Spezifikation gerendert wird, ohne dass etwas
umgeschrieben werden muss.

### Eine einzelne Operation inline

Füge `operation="METHOD /path"` hinzu, um genau diesen einen Endpunkt in
eine gewöhnliche Seite einzubetten - praktisch mitten in einem Tutorial,
ohne die Leserin erst zur vollständigen Referenz zu schicken:

```markdown title="Beispiel" linenums="1"
::: openapi src="assets/openapi/example.yaml" operation="GET /books"
:::
```

::: openapi src="assets/openapi/example.yaml" operation="GET /books"
:::

Immer noch genau dasselbe Swagger-UI-Widget wie der vollständige Block
oben (dieselbe Spezifikation, dasselbe rein clientseitige Rendering -
auch `operation` löst niemals eine OpenAPI-Verarbeitung auf unserer
Seite aus); jede andere Operation wird einfach ausgeblendet und diese
eine automatisch aufgeklappt, indem Swagger UIs eigenes, bereits
gerendertes Markup ausgelesen wird. Die Methode in `operation` ist
Groß-/Kleinschreibung egal; ihr Pfad muss exakt dem eigenen Pfad der
Spezifikation entsprechen (samt `{param}`-Platzhaltern).

## Page Link

Eine ausführliche Vorschau-Card, die zu einer anderen Seite verlinkt -
`href` folgt derselben dateirelativen Konvention wie ein gewöhnlicher
[Seiten-Link](../getting-started.md#zwischen-seiten-verlinken). Anders als
eine Card werden Titel/Icon/Zusammenfassung automatisch aus der eigenen
Frontmatter der Zielseite gezogen, sodass sie synchron bleibt, wenn
diese Seite umbenannt wird oder sich ihre Zusammenfassung ändert:

```markdown title="Beispiel" linenums="1"
::: page-link href="../getting-started.md"
:::
```

::: page-link href="../getting-started.md"
:::

## Link Preview

Eine ausführliche Vorschau-Card für eine *externe* URL - dieselbe
Card-Form wie `::: page-link`, aber für einen Link, der keine der
eigenen Seiten dieser Website ist, es also keine Seite gibt, aus der
sich Titel/Zusammenfassung automatisch ziehen ließen. Jedes Feld kommt
aus den eigenen Attributen der Direktive: nur `url` ist erforderlich,
`title` fällt, wenn weggelassen, auf die reine URL zurück, und
`description`/`image` sind beide optional. Es gibt keinen
Build-Zeit-Abruf der Ziel-URL, um diese automatisch zu befüllen -
dieselbe Überlegung, die [`check`](../cli-reference.md#check) auf
interne Links beschränkt, gilt auch hier, sodass eine langsame oder
nicht erreichbare externe Website die Build-Zeit niemals beeinflusst:

```markdown title="Beispiel" linenums="1"
::: link-preview url="https://boxlang.io" title="BoxLang" description="A dynamic, multi-paradigm JVM language." image="https://boxlang.io/og.png"
:::
```

::: link-preview url="https://boxlang.io" title="BoxLang" description="A dynamic, multi-paradigm JVM language." image="https://boxlang.io/og.png"
:::

## Updates (Changelog)

Eine datierte, taggbare Changelog-Liste - `::: update` akzeptiert
`date="YYYY-MM-DD"` und optional durch Kommas getrennte `tags`:

```markdown title="Beispiel" linenums="1"
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
::: update date="2026-01-15" tags="feature,fix"
Dunkelmodus hinzugefügt und einen Ausrichtungsfehler in der Fußzeile behoben.
:::
::: update date="2026-01-01"
Erstveröffentlichung.
:::
:::

Eine Seite mit einem `::: updates`-Block erhält außerdem ihre eigene
`feed.xml` (RSS 2.0), die daneben geschrieben wird, sobald `baseURL` in
`bxsites.yaml` eine vollständige URL ist - dieselbe Voraussetzung wie
bei `sitemap.xml` - sodass Leser genau den Changelog dieser einen Seite
abonnieren können.

## Wiederverwendbare Inhalte (Includes)

`::: include src="..."` fügt an dieser Stelle das rohe Markdown einer
anderen Datei ein. Anders als jeder Block oben wird daraus echter
Seiteninhalt (Überschriften, Absätze, seine eigenen verschachtelten
Blöcke), nicht etwas, das in ein Widget verpackt wird - nützlich für
einen Warn-/Hinweistext, der sich über mehrere Seiten wiederholt. Lege
das Partial selbst unter `docs/includes/` ab - dieselbe reservierte
Ordner-Konvention wie `assets/`/`versions/`/`i18n/`/`blog/`. Eine Datei
unter `includes/` wird nie als eigene Seite gebaut und erscheint nie in
Navigation/Suche/Sitemap/Tags - sie existiert nur, um in andere Seiten
eingefügt zu werden:

```text title="docs/-Layout"
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

Ein **bloßer** `src` (ohne führendes `./` oder `../`) wird immer gegen
das eigene `docs/includes/` des aktuellen Baums aufgelöst, egal wie tief
die einbindende Seite selbst verschachtelt ist - `guides/deep/setup.md`
oben erreicht dieselbe Datei wie `index.md`, beide mit exakt demselben
`src`:

```markdown title="Aus index.md oder guides/deep/setup.md"
::: include src="beta-notice.md"
```

Ein bloßer `src` kann auch in einen Unterordner von `includes/` selbst
zeigen:

```markdown title="Beispiel"
::: include src="legal/terms.md"
```

Stelle stattdessen `./` oder `../` vor `src`, um ein seitennahes
Fragment zu erreichen, das nicht im zentralen `includes/`-Ordner leben
soll - diese Form löst dateirelativ zum eigenen Verzeichnis der
*einbindenden* Seite auf, dieselbe Konvention wie ein gewöhnlicher
Seiten-Link:

```markdown title="Aus guides/deep/setup.md, eine Ebene höher statt zentralisiert"
::: include src="../local-note.md"
```

Ein Versions-/Locale-Baum erhält sein eigenes `includes/` auf dieselbe
Weise - eine Seite unter `docs/versions/2.0/` löst einen bloßen `src`
gegen `docs/versions/2.0/includes/` auf, und eine unter
`docs/i18n/es/` gegen `docs/i18n/es/includes/` - die Partials jedes
Baums gehören ihm selbst, sie werden nicht mit dem `docs/includes/` des
Hauptbaums geteilt.

Eine eingebundene Datei kann selbst eine weitere einbinden (eine
zirkuläre Kette wirft zur Build-Zeit `BxSites.CircularInclude`, statt
endlos zu laufen).

## Conditional content

Zeigt eine von mehreren Varianten eines Blocks, je nach der eigenen Wahl
der Leserin - "Free" vs. "Pro"-Anleitung auf derselben Seite, zum
Beispiel. Das hier ist eine vollständig statische Website ohne jede Art
von Besucher-Identität, also gibt es, anders als bei einer Plattform mit
echtem Backend, kein serverseitig ausgewertetes "wer ist diese Leserin" -
die Leserin trifft die Wahl selbst, und ihre Wahl wird einfach im eigenen
Browser (`localStorage`) gemerkt, auch für jede spätere Seite:

```markdown title="Beispiel" linenums="1"
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

`::: conditional key="..." value="..."` kennzeichnet eine Variante; `key`
ist der jeweilige Präferenzname, auf den umgeschaltet wird (`"plan"`
oben, es könnte aber genauso gut `"os"`, `"language"`, was auch immer
sein), und `value` ist die eine Einstellung, für die dieser bestimmte
Block angezeigt werden soll. Jede Variante wird immer im HTML gerendert
- clientseitig nur versteckt, niemals weggelassen - sodass eine Leserin
mit deaktiviertem JavaScript (oder ein Such-Crawler) weiterhin jede
Variante sieht statt keine.

`::: audience-switcher key="..." options="value:Label,value:Label,..."`
ist ein optionales, fertiges Steuerelement - eine Schaltfläche pro
Option, die sofort jeden `::: conditional`-Block mit demselben `key`
umschaltet, überall auf der Seite. Du brauchst es überhaupt nicht: ein
Link, der auf `?plan=pro` endet, setzt beim Laden automatisch dieselbe
Präferenz (praktisch, um einen direkten Link zu "der Pro-Version dieser
Seite" zu teilen), und das eigene Theme-Override eines Projekts kann
stattdessen direkt `window.bxSitesSetPreference( key, value )` aufrufen,
um es von einer eigenen UI aus zu steuern.
