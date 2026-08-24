---
title: リリースポリシー
order: 6
icon: phosphor-duotone:tag
---

# リリースポリシー

BxSites は[セマンティックバージョニング](https://semver.org/)に従っています。
[`box.json`](https://github.com/ortus-boxlang/bx-sites/blob/development/box.json)
のバージョンが、すべてのリリースで [ForgeBox](https://forgebox.io/) に公開され、
リポジトリにタグが付けられます。

- **`development`** は作業ブランチです。そこへのすべてのマージがスナップショットビルド
  （`-snapshot` バージョンサフィックス）をトリガーし、早期テスト用として公開されますが、
  本番環境での使用は想定されていません。
- **`main`** は安定版ブランチです。そこへのプッシュが本番のタグ付きリリースを作成します:
  プロジェクト独自の [`changelog.md`](https://github.com/ortus-boxlang/bx-sites/blob/main/changelog.md)
  の `[Unreleased]` セクションがそのバージョン番号で確定され、Git タグと GitHub リリースが
  作成され、モジュールが ForgeBox に公開されます。

各バージョンの「新機能」ページはそのリリースプロセスの一部として自動的に生成されます。
`changelog.md` セクションから直接取得され、このセクションに表示されます。
同じ注記は[GitHub リリース](https://github.com/ortus-boxlang/bx-sites/releases)にも添付されます。
