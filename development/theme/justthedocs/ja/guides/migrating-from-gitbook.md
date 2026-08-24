---
title: GitBook からの移行
order: 7
icon: phosphor-duotone:swap
tags: [ガイド, 移行, GitBook]
---

# GitBook からの移行

`bxSites migrate` は GitBook のエクスポート - `SUMMARY.md` の目次とその
`.md` ファイル、GitBook 独自のオンディスク同期形式（GitHub/Git Sync が
書き込むのと同じもの）- を、一つのコマンドで bx-sites の `docs/` ツリーに
変換します。GitBook のコンテンツブロックシステムがサポートするすべてのものは
bx-sites がすでに持っているものにマッピングされる（
[コンテンツブロック](content-blocks.md) を参照）ため、出来上がるのは粗削りな
ドラフトではなく、動作するサイトです。

## GitBook エクスポートの取得

`bxSites migrate` は GitBook 独自のファイルレイアウトを直接読み込むため、
以下のいずれかが `--source` として使えます:

- GitBook が Git 同期しているリポジトリ（Space 設定 → **GitSync**）-
  ローカルクローンを `--source` に指定します。
- GitBook 自身の **Export → Markdown** ダウンロード（解凍済み）。

どちらの場合も `--source` は `SUMMARY.md` を直接含むディレクトリを指定します。

## 移行の実行

```bash frame="terminal" title="Terminal" linenums="1"
# 1. 新しい bx-sites プロジェクトをスキャフォールド（既にある場合はスキップ）
bxSites new my-docs
cd my-docs

# 2. GitBook エクスポートを移行
bxSites migrate --source=/path/to/gitbook-export

# 3. ビルドして結果を確認
bxSites serve
```

`migrate` は変換したページ数を出力し、判断が必要だった箇所があれば、
それが何でどこかを正確に報告します:

```text title="migrate output"
Migrated 14 page(s) from [/path/to/gitbook-export] into my-docs/docs/, wrote my-docs/docs/nav.json

2 item(s) need a manual look:
  - guides/advanced.md: Unsupported GitBook block [{% prompt %}] - left in its original syntax, needs manual conversion
  - guides/layout.md: Column width="one-third" is not a plain length/percentage - dropped, review manually
```

何も暗黙のうちに削除されることはありません - このツールが変換方法を知らない
ブロックは、元の `{% %}` 構文のまま移行済みファイルに残されるため、コンテンツ
自体はそこにあり続け、見つけやすいままです（作業が終わったら、移行済みの
`docs/` ツリーで `{%` を検索してください）。`migrate` を再実行すると、以前に
書き込んだファイルや `docs/nav.json` を上書きするため、ソースエクスポートを
修正して再実行しても安全です。

## 自動的に変換される内容

| GitBook | 変換先 |
|---|---|
| `SUMMARY.md` | `docs/nav.json`（[nav オーバーライド](../configuration.md#nav) 形式）、ネストを維持 |
| `README.md`（任意のフォルダ） | `index.md` - bx-sites 独自のフォルダインデックス規約 |
| ページの `title`/`description`/`tags` フロントマター | 移行済みファイルの bx-sites フロントマターにそのまま引き継がれます |
| `.gitbook/assets/**` | `docs/assets/gitbook/**`、すべての参照を一致するよう書き換え |
| `{% hint style="..." %}` | `!!! type` - ネイティブな [Admonition](markdown.md#admonition) |
| `{% tabs %}` / `{% tab title="..." %}` | `=== "Title"` - ネイティブな [コンテンツタブ](markdown.md#コンテンツタブ) |
| `{% cards %}` / `{% card %}` | [`::: cards` / `::: card`](content-blocks.md#カード) |
| `{% columns %}` / `{% column width="..." %}` | [`::: columns` / `::: column`](content-blocks.md#列) |
| `{% stepper %}` / `{% step %}` | [`::: stepper` / `::: step`](content-blocks.md#ステッパー) - タイトルはステップ自身の最初の見出しから取得 |
| `{% file src="..." %}` | [`::: file`](content-blocks.md#ファイル) |
| `{% embed url="..." %}` | [`::: embed`](content-blocks.md#埋め込み) |
| `{% content-ref url="..." %}` | [`::: page-link`](content-blocks.md#ページリンク) |
| `{% details %}` / `{% expand %}` | [`::: expandable`](content-blocks.md#展開可能) |

GitBook コンテンツ内でフェンスコードの例として（実際には使われずに）示されて
いるだけのブロックは正しくそのまま残され、本物のブロックと誤読されることは
ありません。

## 手動での確認が必要な内容

GitBook のブロックの中には、bx-sites にまったく対応するものがなく、推測で
変換されるのではなく元の `{% %}` 構文のまま残されるものがいくつかあります:
**Prompt**（AI 生成ブロック - 移行後にそれを実行する相手が存在しません）、
**Conditional content**（GitBook アカウントベースの表示制御で、bx-sites に
ある概念ではありません）、そして **Ask AI** 検索バーです。このツールが
認識しないその他のもの - タイプミスされたブロックや、このツールが書かれた
後に追加された GitBook の機能 - も同じ扱いを受けます: そのまま残され、
警告として報告されます。

いくつかの小さな判断も同様に報告されます: 認識できない `hint` の `style`
（`note` にフォールバック）や、プレーンな CSS 長さ/パーセンテージでない
`column` の `width`（そのまま信用するのではなく削除されます）などです。

**ページアイコンは自動的には移行されません。** GitBook 自身のドキュメントは、
ページのアイコン割り当て（エディタのアイコンピッカーで設定するもの）が
Git-Sync エクスポートに実際に残るかどうかを確認していません - プロジェクトの
エクスポート済みフロントマターに本当に `icon` フィールドがある場合、
`migrate` は日和見的にそれを引き継ぎますが、ほとんどの実際のエクスポートでは
期待しないでください。代わりに移行後に手作業でアイコンを設定してください -
ページ自身のフロントマター、または
[`docs/nav.json` エントリ自身の `icon`](../configuration.md#nav) のいずれかに、
8 つの同梱ライブラリのいずれかから
[名前付きアイコン](themes.md#アイコン) を指定します（GitBook 自身の
Font-Awesome ベースのアイコンに一致させる必要はありません。
[Phosphor](https://phosphoricons.com/)（6 つのウェイトいずれでも）、
[Lucide](https://lucide.dev/icons/)、または
[Tabler](https://tabler.io/icons) 自身のギャラリーから、しっくりくる名前を
選んでください）。

## 移行後

移行済みの `docs/nav.json` は、プレーンな [nav オーバーライド](../configuration.md#nav)
ファイルです - 他のファイルと同じように編集するか、削除して bx-sites 自身の
「フォルダ構造がそのままナビ構造」という規約にフォールバックさせることも
できます。ここから先は普通の bx-sites プロジェクトです:
[テーマ](themes.md) を選び、[`bxsites.json`](../configuration.md) を見直し、
納得がいったら [デプロイ](deployment.md) してください。
