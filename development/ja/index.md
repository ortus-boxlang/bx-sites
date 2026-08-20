---
title: ホーム
order: 1
---

# BX Docs

BX Docs は、[mkdocs](https://www.mkdocs.org/) や
[mkdocs-material](https://squidfunk.github.io/mkdocs-material/) の精神に倣い、
Markdown から静的なドキュメントサイトを生成する BoxLang モジュールです。

このサイト自体も、このリポジトリの `docs/` フォルダ内の Markdown ファイルから BX Docs によってビルドされています。
ご自身でビルドするには [はじめに](getting-started.md) をご覧ください。

## ハイライト

- **Markdown を入力して、静的 HTML を出力。** `docs/` フォルダを指定するだけで、
  `site/` に完全なサイトが生成されます。ホスティングにサーバーは不要です。
- **フォルダ構造がナビゲーション構造。** `docs/` 配下にフォルダとファイルをネストすると、
  フロントマターで指定した順序でナビゲーションが自動的に構築されます。
- **3 つの組み込みテーマ。** `bootstrap`（デフォルト）、`material`、`tailwind` の 3 つ。
  すべて同じ BoxLang ブランドパレットを使用しており、独自テーマで上書きすることもできます。
- **静的なクライアントサイド検索。** [lunr.js](https://lunrjs.com/) を使った検索ボックスと
  ビルド時に生成される検索インデックスを組み合わせています。mkdocs のデフォルトと同じアプローチで、
  サーバー依存なし。
- **Markdown の処理は [bx-markdown](https://github.com/ortus-boxlang/bx-markdown) が担当。**
  BX Docs 自身は Markdown を解析せず、bx-markdown に委譲し、
  `bxdocs.json` のオプションをそのまま渡します。
- **BoxLang 独自のモジュールシステムを基盤にしたプラグインシステム。**
  プラグインは単なる別の BoxLang モジュールであり、専用の Plugin API を学ぶ必要はありません。
- **GitBook から直接移行。** `bxDocs migrate --source=...` コマンドで、
  GitBook のエクスポート（`SUMMARY.md`、コンテンツブロック、アセット）を
  一つのコマンドで動作する bx-docs プロジェクトに変換します。

## 次のステップ

- [はじめに](getting-started.md) - インストール、プロジェクトのスキャフォールド、ビルドと配信
- [CLI リファレンス](cli-reference.md) - すべての動詞とオプション
- [設定](configuration.md) - `bxdocs.json` の完全なリファレンス
- [テーマ](guides/themes.md) - 組み込みテーマと独自テーマの作成方法
- [検索](guides/search.md) - 静的検索インデックスの仕組み
- [GitHub Pages へのデプロイ](guides/deployment.md) - 組み込みの GitHub Actions ワークフロー
- [Markdown 拡張機能](guides/markdown.md) - Admonition、脚注、定義リスト、コンテンツタブ、数式、コードアノテーション、Mermaid ダイアグラム
- [プラグイン](guides/plugins.md) - 独自の BoxLang モジュールで BX Docs を拡張する
- [GitBook からの移行](guides/migrating-from-gitbook.md) - GitBook エクスポートを一つのコマンドで bx-docs プロジェクトに変換する
- [リリース](releases/index.md) - バージョンポリシーと各リリースの新機能
