---
title: Release-Richtlinie
order: 6
---

# Release-Richtlinie

BX Docs folgt [Semantic Versioning](https://semver.org/) - die Version in
[`box.json`](https://github.com/ortus-boxlang/bx-docs/blob/development/box.json)
ist die, die auf [ForgeBox](https://forgebox.io/) veröffentlicht und im
Repo für jedes Release getaggt wird.

- **`development`** ist der Arbeits-Branch - jeder Merge dorthin löst
  einen Snapshot-Build aus (Versionssuffix `-snapshot`), veröffentlicht
  für frühes Testen, aber nicht für den Produktionseinsatz gedacht.
- **`main`** ist der stabile Branch - ein Push dorthin erzeugt ein
  echtes, getaggtes Release: der Abschnitt `[Unreleased]` der eigenen
  [`changelog.md`](https://github.com/ortus-boxlang/bx-docs/blob/main/changelog.md)
  des Projekts wird unter dieser Versionsnummer finalisiert, ein Git-Tag
  und ein GitHub Release werden daraus erstellt, und das Modul wird auf
  ForgeBox veröffentlicht.

Eine "Was ist neu"-Seite für jede Version wird als Teil dieses
Release-Prozesses automatisch erzeugt - direkt aus dem passenden Abschnitt
der `changelog.md` gezogen - und erscheint fortan in diesem Bereich.
Dieselben Hinweise werden auch an das jeweilige
[GitHub Release](https://github.com/ortus-boxlang/bx-docs/releases)
angehängt.
