---
title: 検索
order: 2
tags: [ガイド, 検索]
---

# 検索

BX Sites の検索は完全に静的でクライアントサイドです。[mkdocs](https://www.mkdocs.org/)
がデフォルトで使用するのと同じアプローチです: `build` 時に一度作成されるインデックスと、
訪問者のブラウザで実際の検索を行う [lunr.js](https://lunrjs.com/) の組み合わせです。
サーバー、データベース、外部検索サービスは一切不要です。

## 仕組み

1. `build` 時に、`SearchIndexer` がすべての非隠しページを巡回して
   `site/search-index.json` を書き出します: 各ページの `title`、`url`、
   フロントマターの `tags`、ページ上のすべての見出しのテキスト、
   本文の切り詰めたプレーンテキストのコピー（HTML タグを除去）を 1 エントリとして格納します。
2. 各テーマの `search.bxm` パーシャルが検索ボックスをレンダリングします。
   `layout.bxm` は `bxsites.yaml` の `search` が `true` の場合のみ
   これ（と `lunr.js` + 共有 `search.js` スクリプト）を含めます。
3. ブラウザでは、共有の `assets/search.js` ウィジェットが `search-index.json` を
   一度取得し、`lunr` インデックスをビルドして（`title` を最高優先度として、
   フロントマターの `tags`、`headings`、本文テキストの順）、キーストロークごとに
   検索します。ネットワークラウンドトリップは発生しません。

## キーボードショートカット

- **`/`** - 他のフィールドに入力中でない限り、ページのどこからでも検索ボックスにフォーカスします
  （[mkdocs-material](https://squidfunk.github.io/mkdocs-material/) と同じ慣習）。
- **`Escape`** - 結果のドロップダウンを閉じ、検索ボックスのフォーカスを外します。

## 無効化

```yaml
search: false
```

`search-index.json` のビルドを完全にスキップし、すべてのレンダリングされたページから
検索ボックス、同梱された（バンドルされた）`lunr.js` スクリプト、共有 `search.js` ウィジェットをスキップします。
検索をオフにしたプロジェクトは検索関連のものを一切送信しません。

## インデックスのみ再ビルド

```bash
bxSites search-index
```

`search-index.json` を更新するだけの場合に便利です。`build` はその手順の一つとして
これを自動的に実行するため、通常のビルドの後に別途実行する必要はありません。
