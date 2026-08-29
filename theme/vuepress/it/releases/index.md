---
title: Politica di Release
order: 6
icon: phosphor-duotone:tag
---

# Politica di Release

BxSites segue il [Versionamento Semantico](https://semver.org/) - la
versione in
[`box.json`](https://github.com/ortus-boxlang/bx-sites/blob/development/box.json)
è quella pubblicata su [ForgeBox](https://forgebox.io/) e taggata nel
repository per ogni release.

- **`development`** è il branch di lavoro - ogni merge su di esso attiva
  una build snapshot (suffisso di versione `-snapshot`), pubblicata per
  test anticipati ma non pensata per l'uso in produzione.
- **`main`** è il branch stabile - un push su di esso genera una vera
  release taggata: la sezione `[Unreleased]` del
  [`changelog.md`](https://github.com/ortus-boxlang/bx-sites/blob/main/changelog.md)
  del progetto viene finalizzata sotto quel numero di versione, viene
  creato un tag Git e una GitHub Release a partire da esso, e il modulo
  viene pubblicato su ForgeBox.

Una pagina "novità" per ogni versione viene generata automaticamente come
parte di quel processo di release - ricavata direttamente dalla relativa
sezione di `changelog.md` - e compare in questa sezione man mano che si
procede. Le stesse note vengono allegate anche alla relativa
[GitHub Release](https://github.com/ortus-boxlang/bx-sites/releases).
