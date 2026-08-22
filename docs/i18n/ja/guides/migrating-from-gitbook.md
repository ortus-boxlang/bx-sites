---
title: GitBook からの移行
order: 7
tags: [guides, migration, gitbook]
---

# GitBook からの移行

`bxSites migrate` は GitBook のエクスポート（`SUMMARY.md` の目次とその `.md` ファイル、
GitBook 独自のオンディスク同期形式（GitHub/Git Sync が書き込むのと同じもの））を
bx-sites の `docs/` ツリーに一つのコマンドで変換します。GitBook のコンテンツブロックシステムが
サポートするすべてのものが bx-sites が既に持っているものにマッピングされます
（[Markdown 拡張機能](markdown.md#gitbook-style-blocks) を参照）ので、
粗削りなドラフトではなく、動作するサイトが出来上がります。

## GitBook エクスポートの取得

`bxSites migrate` は GitBook 独自のファイルレイアウトを直接読み込むため、
以下のいずれかが `--source` として使用できます:

- GitBook が Git 同期しているリポジトリ（Space 設定 → **GitSync**）-
  ローカルクローンを `--source` に指定します。
- GitBook の **Export → Markdown** ダウンロード（解凍済み）。

どちらの場合も `--source` は `SUMMARY.md` を直接含むディレクトリを指定します。

## 移行の実行

```bash
# 1. 新しい bx-sites プロジェクトをスキャフォールド（既にある場合はスキップ）
bxSites new my-docs
cd my-docs

# 2. GitBook エクスポートを移行
bxSites migrate --source=/path/to/gitbook-export

# 3. ビルドして結果を確認
bxSites serve
```

`migrate` は変換されたページ数を出力し、判断が必要だった箇所の詳細も正確に報告します:

```
Migrated 14 page(s) from [/path/to/gitbook-export] into my-docs/docs/, wrote my-docs/docs/nav.json

2 item(s) need a manual look:
  - guides/advanced.md: Unsupported GitBook block [{% prompt %}] - left in its original syntax, needs manual conversion
  - guides/layout.md: Column width="one-third" is not a plain length/percentage - dropped, review manually
```

何も暗黙的に削除されません。変換方法が分からないブロックは、元の `{% %}` 構文のまま
移行済みファイルに残されます。`migrate` を再実行すると、以前に書き込んだファイルや
`docs/nav.json` を上書きするため、ソースエクスポートを修正して再実行しても安全です。

## 自動変換される内容

| GitBook | 変換先 |
|---|---|
| `SUMMARY.md` | `docs/nav.json`（[nav オーバーライド](../configuration.md#nav) 形式）、ネストを維持 |
| `README.md`（任意のフォルダ） | `index.md` - bx-sites 独自のフォルダインデックス規約 |
| ページの `title`/`description`/`tags` フロントマター | 移行済みファイルの bx-sites フロントマターにそのまま引き継がれます |
| `.gitbook/assets/**` | `docs/assets/gitbook/**`（すべての参照を書き換え） |
| `{% hint style="..." %}` | `!!! type` - ネイティブ [Admonition](markdown.md#admonitions) |
| `{% tabs %}` / `{% tab title="..." %}` | `=== "Title"` - ネイティブ [コンテンツタブ](markdown.md#content-tabs) |
| `{% cards %}` / `{% card %}` | [`::: cards` / `::: card`](markdown.md#cards) |
| `{% columns %}` / `{% column width="..." %}` | [`::: columns` / `::: column`](markdown.md#columns) |
| `{% stepper %}` / `{% step %}` | [`::: stepper` / `::: step`](markdown.md#stepper) |
| `{% file src="..." %}` | [`::: file`](markdown.md#file) |
| `{% embed url="..." %}` | [`::: embed`](markdown.md#embed) |
| `{% content-ref url="..." %}` | [`::: page-link`](markdown.md#page-link) |
| `{% details %}` / `{% expand %}` | [`::: expandable`](markdown.md#expandable) |

GitBook コンテンツ内でフェンスコード例として表示されているブロック（実際には使用されていないもの）は
正しくそのまま残され、誤って変換されることはありません。
