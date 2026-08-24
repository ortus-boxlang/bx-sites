---
title: Distribuire su GitHub Pages
order: 3
icon: phosphor-duotone:cloud-arrow-up
tags: [guide, distribuzione]
---

# Distribuire su GitHub Pages

`site/` è un semplice sito statico - ospitalo ovunque vengano serviti
file statici. Questo modulo include un workflow GitHub Actions già pronto
all'uso (`.github/workflows/pages.yml`) per il caso comune: pubblicare
direttamente su GitHub Pages, con `main` e `development` pubblicati come
due versioni dello stesso sito, live in modo indipendente.

Per un progetto più semplice, con una sola versione e nessuna
configurazione di CI, [`bxSites gh-deploy`](../cli-reference.md#gh-deploy)
compila e invia `site/` a un branch `gh-pages` con un solo comando,
eseguito dalla tua stessa macchina ogni volta che vuoi pubblicare -
nessun file di workflow necessario. Il resto di questa guida copre il
workflow GitHub Actions usato da questo stesso repository, per la
pubblicazione automatica multi-versione a ogni push.

## Cosa fa

A ogni push su `main` o `development` che tocca `docs/`, `bxsites.yaml`, o
il sorgente stesso del modulo (modifiche a tema/pipeline), il workflow:

1. Installa BoxLang + [bx-markdown](https://github.com/ortus-boxlang/bx-markdown)
2. Registra questo repository come modulo così che `boxlang bxSites build` si risolva
3. Su qualsiasi branch diverso da `main`, punta `baseURL` a
   `.../<nome-branch>/` solo per questo build (vedi
   [sotto](#publishing-two-versions-at-once))
4. Esegue `boxlang bxSites build`
5. Invia `site/` al branch `gh-pages` - `main` alla radice del sito,
   `development` a `/development/` - senza toccare l'altra versione

È disponibile anche come trigger manuale (`workflow_dispatch`) dalla
scheda Actions, per una ripubblicazione una tantum senza un nuovo commit.

## Configurazione iniziale

GitHub Pages deve essere puntato sul branch `gh-pages` prima che il
workflow possa pubblicare qualcosa - questa è un'impostazione del
repository, non qualcosa che un file di workflow può attivare da solo. La
prima esecuzione riuscita crea `gh-pages` per te, quindi fai questo
*dopo* che il workflow è stato eseguito almeno una volta:

1. **Settings -> Pages**
2. Sotto **Build and deployment -> Source**, scegli **Deploy from a branch**
3. Sotto **Branch**, scegli **gh-pages** e **/ (root)**

Dopo di che, ogni push corrispondente compila e distribuisce
automaticamente. L'URL pubblicato compare sotto **Settings -> Pages** una
volta completato il primo deploy.

## Pubblicare due versioni contemporaneamente

`main` pubblica sulla radice del sito
(`https://<user>.github.io/<repo>/`) - trattala come la documentazione
stabile/rilasciata. `development` pubblica su `/development/`
(`https://<user>.github.io/<repo>/development/`) - la documentazione più
recente, non ancora rilasciata. Entrambe restano live simultaneamente:
il job di ciascun branch effettua il push su `gh-pages` solo con
`keep_files: true` e la propria `destination_dir`, quindi un deploy di
`development` non sovrascrive mai il contenuto di `main` e viceversa.

Il `bxsites.yaml` proprio di `main` dovrebbe avere `baseURL` impostato
sulla radice del sito (`https://<user>.github.io/<repo>/`); il workflow
lo sovrascrive per ogni altro branch al momento del build, quindi il
`bxsites.yaml` di `development` non ha bisogno di una propria voce
`baseURL` perché tutto funzioni.

Per aggiungere un terzo branch (ad es. un'anteprima `release/2.0`),
aggiungilo all'elenco `on.push.branches` e dagli un proprio passo di
deploy con `if: github.ref_name == '...'` e
`destination_dir: release-2.0` (o simile) - lo schema è lo stesso di
quello di `development`.

## Usare questo per il tuo progetto

Copia `.github/workflows/pages.yml` nel tuo progetto (modifica la riga
`modules:` se il tuo progetto necessita di qualcosa oltre a
`bx-markdown`), attiva Pages come sopra, e i push su `main`/`development`
pubblicheranno allo stesso modo. Se vuoi solo una singola versione
pubblicata, elimina il branch che non ti serve da `on.push.branches` e il
relativo passo di deploy.

## Servire da un sotto-percorso di Pages di progetto

Un sito GitHub Pages di *progetto* (a differenza di un sito *utente*
`<user>.github.io`) viene servito da
`https://<user>.github.io/<repo>/`, non dalla radice del dominio. Imposta
`baseURL` in `bxsites.yaml` su quell'URL completo così che ogni link
interno, asset e voce di nav ottenga il prefisso `/<repo>/` di cui ha
bisogno - e così che venga generato anche un vero `sitemap.xml`:

```yaml title="bxsites.yaml"
baseURL: "https://<user>.github.io/<repo>/"
```

Vedi [Configurazione](../configuration.md#baseurl) per il quadro completo
di cosa fa `baseURL`. Un sito utente `<user>.github.io`, o qualsiasi
dominio personalizzato mappato sulla radice del sito, può lasciare
`baseURL` al suo valore predefinito (`/`).

## Limitare chi può raggiungere il tuo sito

Qui non c'è alcun controllo degli accessi integrato - bx-sites produce
sempre e soltanto un semplice `site/` statico, e un file statico non ha
alcun concetto di "chi sta chiedendo". Il `robots: false` di
[`bxsites.json`](../configuration.md#robotstxt) dice ai crawler ben
educati di non indicizzare un build (utile per un deploy di
staging/anteprima che non vuoi veder comparire nei risultati di ricerca),
ma è una richiesta cortese, non un lucchetto - l'URL continua a
funzionare per chiunque lo abbia. Se hai davvero bisogno di limitare
l'accesso, questo deve avvenire davanti ai file statici, a qualunque host
li stia servendo - alcune opzioni comuni, adatte a siti statici:

- **Cloudflare Pages/Access** - metti il sito distribuito dietro una
  policy [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/)
  (lista email consentite, SSO, o un PIN monouso), senza bisogno di
  codice applicativo.
- **Netlify** - [protezione con password](https://docs.netlify.com/manage/security/secure-access-to-sites/site-protection/)
  integrata, per sito o per singolo deploy, dalle sole impostazioni del
  sito.
- **Un piccolo reverse-proxy** (qualsiasi host) - l'HTTP Basic Auth
  davanti ai file statici (una regola in stile `.htpasswd`, oppure una
  Cloudflare Worker/Netlify Edge Function di un solo file) basta per
  "tenere fuori i motori di ricerca e i visitatori a caso", anche se non
  è una vera identità per-utente come l'avrebbe un'app con login.

Nessuna di queste è una funzionalità di bx-sites - sono impostazioni a
livello di host, che attivi ovunque finisca per essere servito `site/`.
