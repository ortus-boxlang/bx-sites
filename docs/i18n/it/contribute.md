---
title: Contribuisci
order: 2.3
icon: phosphor-duotone:git-pull-request
summary: Segnala bug, fai domande, invia pull request o sostieni il progetto finanziariamente.
tags: [chi-siamo, contribuire]
---

# Contribuisci

BxSites è open source, e i maintainer dedicano il loro tempo libero per
costruirlo e mantenerlo. Sii gentile con i maintainer quando segnali
issue o proponi pull request - seguiamo tutti la regola d'oro: tratta gli
altri come vorresti essere trattato tu.

## Codice di condotta

Come contributori e maintainer di questo progetto, ci impegniamo a
rispettare tutte le persone che contribuiscono segnalando issue,
proponendo nuove funzionalità, aggiornando la documentazione, inviando
pull request o patch, e altre attività.

- I partecipanti saranno tolleranti verso opinioni diverse dalle proprie.
- Esempi di comportamento inaccettabile includono l'uso di linguaggio o
  immagini a sfondo sessuale, commenti denigratori o attacchi personali,
  trolling, molestie pubbliche o private, insulti o altra condotta non
  professionale.
- I maintainer del progetto hanno il diritto e la responsabilità di
  rimuovere, modificare o rifiutare commenti, commit, codice, modifiche
  al wiki, issue e altri contributi che non siano in linea con questo
  Codice di Condotta.
- Nell'interpretare le parole e le azioni altrui, i partecipanti
  dovrebbero sempre presumere buone intenzioni.
- Casi di comportamento abusivo, molesto o altrimenti inaccettabile
  possono essere segnalati aprendo un issue o contattando direttamente
  uno o più maintainer del progetto.

## Segnalare bug

BoxLang traccia i propri issue su Jira; ogni modulo - incluso questo -
traccia i propri issue nel proprio repository GitHub.

::: cards
::: card title="BoxLang Jira" icon="phosphor-duotone:kanban" href="https://ortussolutions.atlassian.net/browse/BL/issues"
Per gli issue del runtime BoxLang stesso.
:::
::: card title="Issue di bx-sites" icon="phosphor-duotone:bug" href="https://github.com/ortus-boxlang/bx-sites/issues"
Per gli issue di questo modulo.
:::
:::

Una buona segnalazione di bug ha un titolo, una descrizione chiara del
problema, un modo per riprodurlo, e gli eventuali file di supporto
necessari per riprodurlo. Gli issue senza un modo per riprodurli non
verranno gestiti.

## Domande di supporto

Se hai una domanda sull'uso, hai bisogno di supporto professionale, o
vuoi semplicemente proporre un'idea ai maintainer, ti chiediamo di non
aprire un issue per questo - usa invece uno dei seguenti canali di
supporto:

::: cards
::: card title="Ortus Community Discourse" icon="phosphor-duotone:chats-circle" href="https://community.ortussolutions.com"
Fai domande ed esplora le discussioni esistenti.
:::
::: card title="Box Slack Team" icon="phosphor-duotone:slack-logo" href="http://boxteam.ortussolutions.com/"
Chatta in tempo reale con la community e i maintainer.
:::
::: card title="Supporto professionale" icon="phosphor-duotone:headset" href="https://www.ortussolutions.com/services/support"
Piani di supporto a pagamento di Ortus Solutions.
:::
:::

## Linee guida per le pull request

- Il branch `main`/`master` è uno snapshot dell'ultima release stabile -
  tutto lo sviluppo avviene in branch dedicati, e le PR contro di esso
  vengono chiuse. Invia le pull request contro il branch `development`.
- Va bene avere diversi commit piccoli mentre lavori - vengono
  automaticamente compressi prima del merge.
- Assicurati che i test locali passino, e includi test insieme alle tue
  modifiche.
- Collega l'issue Jira/GitHub rilevante nel titolo della tua PR quando
  la invii.

## Vulnerabilità di sicurezza

Hai trovato una vulnerabilità di sicurezza? Ti chiediamo di non aprire
un issue pubblico per questo. Invia un'email al team di sviluppo a
[security@ortussolutions.com](mailto:security@ortussolutions.com?subject=security)
e segnalala anche nel canale `#security` dello Slack del Box Team. Tutte
le vulnerabilità di sicurezza vengono gestite tempestivamente.

## Configurazione dell'ambiente di sviluppo

Clona il repository, installa le dipendenze con `box install`, e
consulta la
[sezione collaborazione della readme](https://github.com/ortus-boxlang/bx-sites#running-tests)
per la configurazione locale completa e l'esecuzione dei test. È
richiesto JDK 21+.

## Stili di codifica

Questo progetto segue gli standard di codifica Ortus, con configurazioni
del formatter incluse sia per il codice BoxLang/CFML che per Java:

```bash frame="terminal" title="Terminal"
# Formatta tutto
box run-script format

# Avvia un watcher - formatta automaticamente al salvataggio
box run-script format:watch
```

Consulta gli
[standard di codifica Ortus](https://github.com/Ortus-Solutions/coding-standards)
per il riferimento completo.

## Contributi finanziari

Puoi sostenere BxSites, BoxLang e tutte le iniziative open source di
Ortus Solutions diventando sponsor su Patreon - gli sponsor ottengono
anche vantaggi come un account cfcasts, un account ForgeBox Pro e altro,
a seconda del livello.

<div class="bxsites-hero__actions">
	<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="https://www.patreon.com/c/ortussolutions">Diventa sponsor su Patreon</a>
	<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="https://www.paypal.com/paypalme/ortussolutions">Donazione una tantum via PayPal</a>
</div>

## Contributori

Grazie a tutti coloro che hanno già contribuito a BxSites - vi vogliamo
bene!

<a href="https://github.com/ortus-boxlang/bx-sites/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ortus-boxlang/bx-sites" alt="Contributori di BxSites">
</a>
