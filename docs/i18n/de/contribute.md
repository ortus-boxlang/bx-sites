---
title: Mitmachen
order: 2.3
icon: phosphor-duotone:git-pull-request
summary: Bugs melden, Fragen stellen, Pull Requests einreichen oder das Projekt finanziell unterstützen.
tags: [über-uns, mitmachen]
---

# Mitmachen

BxSites ist quelloffen, und die Maintainer investieren ihre Freizeit, um es
zu bauen und zu pflegen. Bitte sei rücksichtsvoll gegenüber den Maintainern,
wenn du Issues meldest oder Pull Requests einreichst - wir folgen alle der
goldenen Regel: Behandle andere so, wie du selbst behandelt werden möchtest.

## Verhaltenskodex

Als Contributor und Maintainer dieses Projekts verpflichten wir uns, alle
Menschen zu respektieren, die durch Issue-Meldungen, Feature-Wünsche,
Dokumentations-Updates, Pull Requests oder Patches und andere Aktivitäten
beitragen.

- Teilnehmende zeigen Toleranz gegenüber abweichenden Meinungen.
- Beispiele für inakzeptables Verhalten sind sexualisierte Sprache oder
  Bilder, abwertende Kommentare oder persönliche Angriffe, Trolling,
  öffentliche oder private Belästigung, Beleidigungen oder anderes
  unprofessionelles Verhalten.
- Die Projekt-Maintainer haben das Recht und die Verantwortung, Kommentare,
  Commits, Code, Wiki-Änderungen, Issues und andere Beiträge zu entfernen,
  zu bearbeiten oder abzulehnen, die nicht mit diesem Verhaltenskodex
  vereinbar sind.
- Bei der Interpretation von Worten und Handlungen anderer sollten
  Teilnehmende stets von guten Absichten ausgehen.
- Fälle von missbräuchlichem, belästigendem oder anderweitig inakzeptablem
  Verhalten können durch das Öffnen eines Issues oder die direkte
  Kontaktaufnahme mit einem oder mehreren Projekt-Maintainern gemeldet
  werden.

## Bugs melden

BoxLang selbst trackt seine Issues in Jira; jedes Modul - auch dieses -
trackt seine Issues im eigenen GitHub-Repository.

::: cards
::: card title="BoxLang Jira" icon="phosphor-duotone:kanban" href="https://ortussolutions.atlassian.net/browse/BL/issues"
Für Issues in der BoxLang-Runtime selbst.
:::
::: card title="bx-sites Issues" icon="phosphor-duotone:bug" href="https://github.com/ortus-boxlang/bx-sites/issues"
Für Issues in diesem Modul.
:::
:::

Ein guter Bugreport hat einen Titel, eine klare Beschreibung des Problems,
einen Weg, es zu reproduzieren, und alle nötigen Support-Dateien dafür.
Issues ohne Reproduktionsweg werden nicht bearbeitet.

## Support-Fragen

Wenn du eine Nutzungsfrage hast, professionellen Support suchst, oder
einfach eine Idee mit den Maintainern besprechen möchtest, eröffne dafür
bitte kein Issue - nutze stattdessen einen der folgenden Kanäle:

::: cards
::: card title="Ortus Community Discourse" icon="phosphor-duotone:chats-circle" href="https://community.ortussolutions.com"
Stelle Fragen und durchstöbere bestehende Diskussionen.
:::
::: card title="Box Slack Team" icon="phosphor-duotone:slack-logo" href="http://boxteam.ortussolutions.com/"
Chatte in Echtzeit mit der Community und den Maintainern.
:::
::: card title="Professioneller Support" icon="phosphor-duotone:headset" href="https://www.ortussolutions.com/services/support"
Kostenpflichtige Support-Pläne von Ortus Solutions.
:::
:::

## Pull-Request-Richtlinien

- Der `main`-/`master`-Branch ist ein Snapshot des letzten stabilen
  Releases - alle Entwicklung findet in dedizierten Branches statt, und
  PRs dagegen werden geschlossen. Sende Pull Requests stattdessen gegen
  den `development`-Branch.
- Es ist völlig in Ordnung, während der Arbeit mehrere kleine Commits zu
  haben - sie werden vor dem Merge automatisch zusammengefasst.
- Stelle sicher, dass lokale Tests bestehen, und füge deinen Änderungen
  passende Tests bei.
- Verlinke das relevante Jira-/GitHub-Issue im Titel deines PRs, wenn du
  ihn einreichst.

## Sicherheitslücken

Eine Sicherheitslücke gefunden? Bitte eröffne dafür kein öffentliches
Issue. Schreib eine E-Mail an das Entwicklungsteam an
[security@ortussolutions.com](mailto:security@ortussolutions.com?subject=security)
und melde es zusätzlich im `#security`-Kanal des Box Team Slack. Alle
Sicherheitslücken werden umgehend bearbeitet.

## Entwicklungsumgebung einrichten

Klone das Repository, installiere die Abhängigkeiten mit `box install`,
und schau dir den
[Collaboration-Abschnitt der readme](https://github.com/ortus-boxlang/bx-sites#running-tests)
für das vollständige lokale Setup und die Test-Ausführung an. JDK 21+ wird
benötigt.

## Coding-Styles

Dieses Projekt folgt den Ortus-Coding-Standards, mit mitgelieferten
Formatter-Configs sowohl für BoxLang/CFML- als auch für Java-Code:

```bash frame="terminal" title="Terminal"
# Alles formatieren
box run-script format

# Watcher starten - formatiert automatisch beim Speichern
box run-script format:watch
```

Die vollständige Referenz findest du in den
[Ortus Coding Standards](https://github.com/Ortus-Solutions/coding-standards).

## Finanzielle Unterstützung

Du kannst BxSites, BoxLang und alle Open-Source-Initiativen von Ortus
Solutions unterstützen, indem du Sponsor auf Patreon wirst - Sponsoren
erhalten je nach Stufe außerdem Vorteile wie einen cfcasts-Account, einen
ForgeBox-Pro-Account und mehr.

<div class="bxsites-hero__actions">
	<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="https://www.patreon.com/c/ortussolutions">Auf Patreon sponsern</a>
	<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="https://www.paypal.com/paypalme/ortussolutions">Einmalige Spende via PayPal</a>
</div>

## Contributors

Danke an alle, die bereits zu BxSites beigetragen haben - wir lieben euch!

<a href="https://github.com/ortus-boxlang/bx-sites/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ortus-boxlang/bx-sites" alt="BxSites Contributors">
</a>
