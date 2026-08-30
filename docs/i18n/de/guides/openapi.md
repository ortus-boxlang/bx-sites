---
title: OpenAPI / Swagger
order: 4.6
icon: phosphor-duotone:plug
tags: [anleitungen, openapi, api]
---

# OpenAPI / Swagger

Ein interaktives [Swagger-UI](https://swagger.io/tools/swagger-ui/)-Widget
für eine OpenAPI-/Swagger-Spezifikation, mit derselben `::: name ... :::`-
Container-Syntax wie jeder Block in [Content-Blöcke](content-blocks.md).
`src` wird auf dieselbe, relativ zu `docs/assets/` aufgelöste Weise interpretiert wie das
`src` von `::: file` (siehe [Content-Blöcke](content-blocks.md#file)).
Sowohl JSON- als auch YAML-Spezifikationen funktionieren; Swagger UI parst
beide vollständig clientseitig - nirgendwo in diesem Modul findet eine
serverseitige OpenAPI-Verarbeitung statt. Erfordert, dass `bxsites.yaml`s
[`openapi`](../configuration.md#openapi) auf `true` gesetzt ist - ist das
nicht der Fall, wird dieser Platzhalter zwar gerendert, bleibt aber
inaktiv (Swagger UIs eigenes JS/CSS wird dann überhaupt nicht nach
`site/` kopiert, sodass der Build jedes anderen Projekts genauso klein
bleibt wie vor diesem Feature):

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

## Eine einzelne Operation inline

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

## Eine API ohne Spezifikationsdatei dokumentieren

`::: openapi` benötigt immer ein echtes OpenAPI-/Swagger-Dokument unter
`src` - es gibt keine manuelle, spezifikationslose Variante dieses Blocks
zum handschriftlichen Beschreiben eines einzelnen Endpunkts; importiere
stattdessen immer eine echte Spezifikation. Falls noch keine existiert:

- Schreibe nur so viel Spezifikation, wie die aktuelle Seite braucht. Ein
  einzelner `paths`-Eintrag mit eigenem, minimalem `info`/`servers`
  (siehe `docs/assets/openapi/example.yaml` dafür, wie wenig das
  tatsächlich braucht) liefert bereits das interaktive Widget samt
  "Try it out" für diesen einen Endpunkt - wächst später zur
  vollständigen Spezifikation heran, ohne dass sich am Block selbst
  etwas ändert.
- Oder verzichte ganz auf das Widget und beschreibe den Endpunkt als
  gewöhnlichen Inhalt - eine Parametertabelle, ein Codeblock-Paar für
  Anfrage/Antwort (```` ```http ````/```` ```json ````), begleitet von
  einem [Stepper](content-blocks.md#stepper), falls das beim Durchgehen
  hilft. Jeder andere Content-Block und jede Markdown-Erweiterung steht
  auf jeder Seite zur Verfügung, unabhängig davon, ob `openapi` überhaupt
  aktiviert ist.
