---
title: はじめに
order: 2
icon: phosphor-duotone:rocket-launch
summary: モジュールをインストールし、プロジェクトをスキャフォールドして、最初のサイトをビルドします。
tags: [guides, setup]
---

# はじめに

## インストール

BX Docs は、Markdown レンダリングに [bx-markdown](https://github.com/ortus-boxlang/bx-markdown)、
HTML エンコードに [bx-esapi](https://github.com/ortus-boxlang/bx-esapi)、
`bxdocs.yaml` の読み込みに [bx-yaml](https://github.com/ortus-boxlang/bx-yaml) が必要です。
[CommandBox](https://commandbox.ortusbooks.com/) がインストール済みの場合:

```bash
box install bx-docs
box install bx-markdown
box install bx-esapi
box install bx-yaml
```

CommandBox を使用しない場合、BoxLang 独自のインストーラーで 4 つをまとめてインストールできます:

```bash
install-bx-module bx-docs bx-markdown bx-esapi bx-yaml
```

`box install`/`install-bx-module` は `box.json` の `boxlang.executable` を参照し、
`~/.boxlang/bin` に `bxDocs` スクリプトを配置します。これにより、以下のコマンドがいずれの形式でも実行できます:

```bash
bxDocs <verb> [options]
```

または、BoxLang は使えるが `PATH` のシムが設定されていない環境（CI ランナー、手動登録のモジュールなど）では:

```bash
boxlang module:bxdocs <verb> [options]
```

このガイドでは短縮形を使用します。

## プロジェクトのスキャフォールド

```bash
bxDocs new my-docs
cd my-docs
```

以下の構造が作成されます:

```
my-docs/
├── docs/
│   ├── assets/
│   └── index.md
└── bxdocs.yaml
```

`--theme=material` や `--theme=tailwind` で別のテーマを指定でき、
`--name="My Project Docs"` でサイト名を設定できます（省略時はディレクトリ名から導出されます）。

### 設定ファイルの形式

`bxdocs.yaml` はデフォルトかつ推奨の形式です。特に指定がない限り `new` はこの形式を
スキャフォールドし、このガイドと [設定](configuration.md) の例もすべてまずこの形式で
示されます。`bxdocs.json` も完全にサポートされており、そちらを好むプロジェクトでは
`--format=json` を渡してスキャフォールドするか、自分で手書き/リネームするだけで構いません。
ConfigLoader は `bxdocs.yaml`/`.yml`/`.json` のうち実際に存在するものをこの順序で解決するため、
切り替えに他の設定は一切必要ありません。両方の形式の完全なキーリファレンスは
[設定](configuration.md) を参照してください。

GitBook のコンテンツがある場合は、`bxDocs migrate --source=/path/to/export` で
GitBook エクスポートをそのまま `docs/` に変換できます。
詳しくは [GitBook からの移行](guides/migrating-from-gitbook.md) をご覧ください。

## ページの追加

`docs/` 配下のすべての `.md` ファイルがページになります。フォルダのネストがそのままナビゲーションのネストになります:

```
docs/
├── index.md              -> /
├── guides/
│   ├── index.md          -> /guides/
│   └── deployment.md     -> /guides/deployment/
```

（大規模なサイトでは、明示的な nav を使ってこの推定順序やグループを完全に上書きできます。
[`nav`](configuration.md#nav) を参照してください。）

### ページ間のリンク

別のページへのリンクは mkdocs と同様に、相手の `.md` ソースへのファイル相対パスを使います:

```markdown
[デプロイ](guides/deployment.md) を参照するか、そのガイドから
[はじめに](../getting-started.md#add-pages) に戻ることができます。
```

BX Docs はビルド時にすべてのリンクをキレイな URL に書き換えます
（`guides/deployment.md` → `/guides/deployment/index.html`、アンカーとクエリ文字列を保持）。
絶対 URL、`mailto:`、`/` で始まるリンクはそのまま保持されます。

### Markdown としてページをダウンロード

ビルドされた各ページには、元の `.md` ソースも一緒に公開されます
（`docs/guides/deployment.md` は `site/guides/deployment.md` としてコピーされ、
`site/guides/deployment/index.html` の隣に置かれます）。
ページ上に「Markdown をダウンロード」リンクが表示されます。設定不要で常に有効です。

各ページは小さなフロントマターブロックから始めることができます:

```markdown
---
title: デプロイ
order: 2
hidden: false
description: ビルドした BX Docs サイトのデプロイ方法。
tags: [guides, deployment]
icon: 🚀
summary: サイトを公開するために必要なすべてのこと。
ogImage: assets/deployment-card.png
---

# デプロイ

コンテンツをここに。
```

- `title` - ナビゲーションやページタイトルを上書きします（省略時はファイル名から導出）
- `order` - ナビゲーション内の兄弟ページの並び順を制御します（小さい値が先、省略時はアルファベット順）
- `hidden` - `true` にするとナビゲーションと検索から除外されますが、ビルドからは除外されません
- `description` - このページのソーシャルカード/メタ説明（[`ogImage`](configuration.md#ogimage) を参照）。省略時はサイト全体の `description` にフォールバック
- `tags` - このページのタグ配列。タイトル下にバッジとして表示され、サイト全体の `/tags/` インデックスに収集されます
- `icon` - ページタイトルとナビゲーションエントリの横に表示されるアイコン
- `summary` - タイトルの下に表示される1行のリードイン
- `ogImage` - このページのソーシャルカード画像を上書きします

## ビルド

```bash
bxDocs build
```

`docs/` のすべてのページを `site/` の静的サイトとしてレンダリングします。静的ファイルを配信できる場所であればどこにでもホストできます。

## ローカルで配信

```bash
bxDocs serve
```

プロジェクトをビルドし、`http://127.0.0.1:8080/` で `site/` を配信します。
`docs/`、`bxdocs.yaml`/`.json` のサイト設定、またはプロジェクトレベルの `theme/` オーバーライドを保存するたびに自動的に再ビルドされ、ブラウザも自動的にリロードされます。
バインドの変更には `--port=3000` や `--host=0.0.0.0` を使用します。

## クリーン

```bash
bxDocs clean
```

`docs/` ソースを変更せずに `site/` とビルドキャッシュを削除します。
