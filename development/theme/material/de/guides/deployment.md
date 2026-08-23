---
title: Deployment auf GitHub Pages
order: 3
icon: phosphor-duotone:cloud-arrow-up
tags: [anleitungen, deployment]
---

# Deployment auf GitHub Pages

`site/` ist eine reine statische Website - hoste sie überall, wo statische
Dateien ausgeliefert werden können. Dieses Modul bringt einen einsatzbereiten
GitHub-Actions-Workflow mit (`.github/workflows/pages.yml`) für den
üblichen Fall: direkte Veröffentlichung auf GitHub Pages, mit `main` und
`development`, die als zwei unabhängig live geschaltete Versionen derselben
Website veröffentlicht werden.

Für ein einfacheres Ein-Versionen-Projekt ganz ohne CI-Setup baut und
pusht [`bxSites gh-deploy`](../cli-reference.md#gh-deploy) `site/` mit
einem Befehl in einen `gh-pages`-Branch, ausgeführt von deiner eigenen
Maschine, wann immer du veröffentlichen möchtest - keine Workflow-Datei
nötig. Der Rest dieser Anleitung behandelt den GitHub-Actions-Workflow,
den dieses Repo selbst für automatische Multi-Versions-Veröffentlichung
bei jedem Push verwendet.

## Was er tut

Bei jedem Push nach `main` oder `development`, der `docs/`, `bxsites.json`
oder die eigene Quelle des Moduls (Theme-/Pipeline-Änderungen) berührt,
macht der Workflow Folgendes:

1. Installiert BoxLang + [bx-markdown](https://github.com/ortus-boxlang/bx-markdown)
2. Registriert dieses Repo als Modul, damit `boxlang bxSites build` aufgelöst werden kann
3. Setzt auf jedem Branch außer `main` `baseURL` auf `.../<branch-name>/`
   nur für diesen einen Build (siehe [unten](#publishing-two-versions-at-once))
4. Führt `boxlang bxSites build` aus
5. Pusht `site/` in den `gh-pages`-Branch - `main` in die Wurzel der
   Website, `development` nach `/development/` - ohne die jeweils andere
   Version anzurühren

Er ist außerdem als manueller Auslöser (`workflow_dispatch`) über den
Reiter Actions verfügbar, für eine einmalige Neuveröffentlichung ohne
neuen Commit.

## Einmalige Einrichtung

GitHub Pages muss auf den `gh-pages`-Branch verweisen, bevor der Workflow
etwas veröffentlichen kann - das ist eine Repository-Einstellung, kein
Schalter, den eine Workflow-Datei von selbst umlegen kann. Der erste
erfolgreiche Lauf erstellt `gh-pages` für dich, tu dies also, *nachdem*
der Workflow mindestens einmal gelaufen ist:

1. **Settings -> Pages**
2. Unter **Build and deployment -> Source** wähle **Deploy from a branch**
3. Unter **Branch** wähle **gh-pages** und **/ (root)**

Danach wird jeder passende Push automatisch gebaut und veröffentlicht.
Die veröffentlichte URL erscheint unter **Settings -> Pages**, sobald das
erste Deploy abgeschlossen ist.

## Zwei Versionen gleichzeitig veröffentlichen

`main` wird in die Wurzel der Website veröffentlicht
(`https://<user>.github.io/<repo>/`) - betrachte das als die
stabilen/veröffentlichten Docs. `development` wird nach `/development/`
veröffentlicht (`https://<user>.github.io/<repo>/development/`) - die
neuesten, unveröffentlichten Docs. Beide bleiben gleichzeitig live: der
Job jedes Branches pusht nur mit `keep_files: true` und seinem eigenen
`destination_dir` nach `gh-pages`, sodass ein `development`-Deploy nie den
Inhalt von `main` überschreibt und umgekehrt.

Die eigene `bxsites.json` von `main` sollte `baseURL` auf die Wurzel der
Website gesetzt haben (`https://<user>.github.io/<repo>/`); der Workflow
überschreibt das für jeden anderen Branch zur Build-Zeit, sodass die
`bxsites.json` von `development` dafür keinen eigenen `baseURL`-Eintrag
braucht.

Um einen dritten Branch hinzuzufügen (z. B. eine `release/2.0`-Vorschau),
füge ihn zur `on.push.branches`-Liste hinzu und gib ihm einen eigenen
`if: github.ref_name == '...'`-Deploy-Schritt mit
`destination_dir: release-2.0` (oder ähnlich) - das Muster ist dasselbe
wie bei `development`.

## Für dein eigenes Projekt verwenden

Kopiere `.github/workflows/pages.yml` in dein eigenes Projekt (passe die
`modules:`-Zeile an, falls dein Projekt mehr als `bx-markdown` braucht),
aktiviere Pages wie oben, und Pushes nach `main`/`development` werden auf
dieselbe Weise veröffentlicht. Willst du nur eine einzige veröffentlichte
Version, lösche den nicht benötigten Branch aus `on.push.branches` und
seinen passenden Deploy-Schritt.

## Aus einem Projekt-Pages-Unterpfad ausliefern

Eine GitHub-*Projekt*-Pages-Website (im Gegensatz zu einer
`<user>.github.io`-*Benutzer*-Website) wird unter
`https://<user>.github.io/<repo>/` ausgeliefert, nicht von der
Domain-Wurzel. Setze `baseURL` in `bxsites.json` auf diese vollständige
URL, damit jeder interne Link, jedes Asset und jeder Navigationseintrag
das nötige `/<repo>/`-Präfix bekommt - und damit auch eine echte
`sitemap.xml` erzeugt wird:

```json
{ "baseURL": "https://<user>.github.io/<repo>/" }
```

Siehe [Konfiguration](../configuration.md#baseurl) für die vollständige
Aufschlüsselung dessen, was `baseURL` bewirkt. Eine
`<user>.github.io`-Benutzer-Website, oder jede eigene Domain, die auf die
Wurzel der Website zeigt, kann `baseURL` bei seinem Standardwert (`/`)
belassen.
