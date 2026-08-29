---
title: OpenAPI / Swagger
order: 4.6
icon: phosphor-duotone:plug
tags: [guide, openapi, api, gitbook]
---

# OpenAPI / Swagger

Un widget interattivo [Swagger UI](https://swagger.io/tools/swagger-ui/)
per una specifica OpenAPI/Swagger, con la stessa sintassi di contenitore
`::: name ... :::` di ogni blocco in
[Blocchi di contenuto](content-blocks.md) - l'equivalente diretto del
blocco OpenAPI proprio di GitBook. `src` viene risolto nello stesso modo,
relativo a `docs/assets/`, in cui viene risolto `src` di `::: file` (vedi
[Blocchi di contenuto](content-blocks.md#file)). Sia le specifiche JSON
che YAML funzionano; Swagger UI le analizza entrambe interamente lato
client - da nessuna parte in questo modulo avviene un'analisi OpenAPI lato
server. Richiede che `openapi` di `bxsites.yaml`
([`openapi`](../configuration.md#openapi)) sia impostato su `true` - se
non lo è, questo segnaposto viene renderizzato ma resta inerte (il JS/CSS
proprio di Swagger UI non viene mai copiato in `site/`, quindi la build di
qualsiasi altro progetto resta piccola esattamente come prima di questa
funzionalità):

```markdown title="Esempio" linenums="1"
::: openapi src="assets/openapi/example.yaml" title="Bookshelf API"
:::
```

::: openapi src="assets/openapi/example.yaml" title="Bookshelf API"
:::

Il widget qui sopra è proprio questa pagina, dal vivo, che renderizza la
piccola specifica di esempio che questa guida fornisce in
`docs/assets/openapi/example.yaml` - aprila nel tuo progetto sotto
`docs/assets/` (oppure punta `src` verso la tua specifica già esistente)
per vedere lo stesso risultato con la tua API.

Viene incluso (vendorizzato) solo il layout base proprio di
`SwaggerUIBundle` - senza la topbar/barra "Explore" che permetterebbe di
digitare una specifica diversa (un blocco `::: openapi` deve mostrare
sempre l'unica specifica a cui il suo autore lo ha puntato), quindi ogni
operazione, con i relativi schemi di richiesta/risposta, e "Try it out"
(che chiama il `servers[0].url` proprio della specifica direttamente dal
browser di chi visita la pagina - assicurati che quel server consenta CORS
da dove sono ospitati i tuoi docs) vengono renderizzati direttamente dalla
tua specifica esistente, senza bisogno di riscrivere nulla.

## Una singola operazione inline

Aggiungi `operation="METODO /percorso"` per inserire in una pagina
normale solo quell'unico endpoint - comodo a metà di un tutorial, senza
dover mandare il lettore fino al riferimento completo:

```markdown title="Esempio" linenums="1"
::: openapi src="assets/openapi/example.yaml" operation="GET /books"
:::
```

::: openapi src="assets/openapi/example.yaml" operation="GET /books"
:::

Esattamente lo stesso widget Swagger UI del blocco completo qui sopra
(stessa specifica, stesso rendering solo lato client - anche `operation`
non innesca mai alcuna analisi OpenAPI dal nostro lato); ogni altra
operazione viene semplicemente nascosta e questa espansa
automaticamente, leggendo il markup già renderizzato dallo stesso
Swagger UI. Il metodo di `operation` non distingue maiuscole/minuscole;
il suo percorso deve corrispondere esattamente al percorso della
specifica (segnaposto `{param}` compresi).

## Documentare un'API senza un file di specifica

`::: openapi` richiede sempre un documento OpenAPI/Swagger reale in `src`
- non esiste una versione manuale e senza specifica di questo blocco per
descrivere a mano un singolo endpoint. Nemmeno GitBook ce l'ha più: il suo
equivalente, il blocco "API method", è stato dismesso a febbraio 2024 a
favore dell'importazione sempre di una specifica reale. Se non ne hai
ancora una:

- Scrivi solo la specifica necessaria per la pagina su cui ti trovi. Una
  singola voce `paths` con un proprio `info`/`servers` minimo (vedi
  `docs/assets/openapi/example.yaml` per quanto poco basti in realtà) ti
  dà già il widget interattivo e "Try it out" per quell'endpoint -
  fattela crescere in una specifica completa più avanti; il blocco in sé
  non cambia.
- Oppure fai a meno del widget e descrivi l'endpoint come contenuto
  normale - una tabella dei parametri, una coppia di blocchi di codice
  (```` ```http ````/```` ```json ````) richiesta/risposta, accompagnata
  da uno [stepper](content-blocks.md#stepper) se aiuta a seguirla passo
  passo. Ogni altro blocco di contenuto ed estensione Markdown è
  disponibile su qualunque pagina, indipendentemente dal fatto che
  `openapi` sia attivato o meno.
