---
title: 設定
order: 4
icon: ⚙️
summary: サイト設定のすべてのキー、デフォルト値、および動作。
tags: [reference, configuration]
---

# 設定

すべてのプロジェクトはルートに 1 つのサイト設定ファイルを持ちます。デフォルトかつ推奨の形式である
`bxdocs.yaml`（または `.yml`）を使うか、そのまま使い続けたいプロジェクト向けの `bxdocs.json` を
使うかのいずれかです。どちらも完全にサポートされており、まったく同じ結果になります。
`bxDocs new` は `--format=json` を指定しない限り `bxdocs.yaml` をスキャフォールドします
（[はじめに](getting-started.md#config-file-format) を参照）。プロジェクトに何らかの理由で
複数の設定ファイルが存在する場合は、`bxdocs.yaml` が優先され、次に `bxdocs.yml`、
最後に `bxdocs.json` の順で使用されます。

```yaml
name: "My Docs"
description: ""
baseURL: "/"
theme:
  name: bootstrap
  options: {}
  logo: ""
  favicon: ""
search: true
searchProvider:
  provider: local
  algolia: { appId: "", apiKey: "", indexName: "", insights: false }
nav: []
markdown:
  enableAdmonition: true
repo:
  url: ""
  editUri: ""
social: []
footer: false
lastUpdated: false
mermaid: false
math: false
analytics:
  provider: ""
  id: ""
ogImage: ""
generateOgImages: false
extraCss: []
extraJs: []
plugins: []
i18n:
  defaultLocale: { code: en, label: English }
  locales: []
```

そちらを好むプロジェクト向けの、同等の `bxdocs.json` は次のとおりです:

```json
{
	"name": "My Docs",
	"description": "",
	"baseURL": "/",
	"theme": {
		"name": "bootstrap",
		"options": {},
		"logo": "",
		"favicon": ""
	},
	"search": true,
	"searchProvider": {
		"provider": "local",
		"algolia": { "appId": "", "apiKey": "", "indexName": "", "insights": false }
	},
	"nav": [],
	"markdown": { "enableAdmonition": true },
	"repo": {
		"url": "",
		"editUri": ""
	},
	"social": [],
	"footer": false,
	"lastUpdated": false,
	"mermaid": false,
	"math": false,
	"analytics": {
		"provider": "",
		"id": ""
	},
	"ogImage": "",
	"generateOgImages": false,
	"extraCss": [],
	"extraJs": [],
	"plugins": [],
	"i18n": {
		"defaultLocale": { "code": "en", "label": "English" },
		"locales": []
	}
}
```

必須なのは `name` のみで、それ以外はすべて上記のデフォルト値にフォールバックします。
`theme` オブジェクトは 1 階層のみマージされます。`{"theme":{"name":"material"}}` だけでも
デフォルトの（空の）`options` が保持されます。以下の各キーはどちらの形式でも名前と構造が
同じです。このページの残りの部分では簡潔さのために JSON のスニペットのみを示しますが、
YAML でも同様に読み替えられます。

## `name`

ヘッダーのブランドマークとページタイトルに表示されるサイト名。必須。

## `description`

サイトの説明（省略可）。独自の `description` フロントマターを持たないページの
フォールバック `<meta name="description">` および `og:description` として使用されます
（[はじめに](getting-started.md#add-pages) を参照）。

## `baseURL`

すべての内部リンク、アセットパス、ナビゲーションエントリのプレフィックスを制御し、
`sitemap.xml` と `llms.txt` のサイト正規 URL としても機能します。

- 空白または `"/"` （デフォルト）- リンクはルート相対のまま（`/page/`）。`sitemap.xml` も
  絶対 URL の `llms.txt` も生成されません（正規ドメインがないため）。
- パスのみ（例: `"my-docs"` や `"/my-docs/"`）- サイトがそのサブパスから配信されると見なし、
  すべての内部リンク、ナビゲーションエントリ、アセットに `my-docs/` プレフィックスが付きます。
  絶対ドメインがないため `sitemap.xml` は生成されません。
- 完全な URL（例: `"https://docs.example.com/"`）- パス部分（ここでは `/`）が
  ベアパスと同様に使用され、**さらに** ビルド時に `sitemap.xml` が書き出されます。

`llms.txt`（[以下](#llmstxt) 参照）は常に書き出されます。`baseURL` が完全な URL の場合は絶対 URL が使用されます。

## `llms.txt`

すべてのビルドでサイトルートに `llms.txt` が書き出されます。
これは、LLM ベースのツールが HTML をクロールせずにサイトをナビゲートするための
[llms.txt](https://llmstxt.org) 規約に準拠した、すべての非隠しページのプレーン Markdown インデックスです。
設定キーはなく、自動的に生成されます。`baseURL` が完全な URL の場合は絶対 URL のリンク、
そうでない場合は `basePath` 相対のリンクが使われます。

## `sitemap.xml`

サイトルートに書き出されますが、`baseURL` が完全な URL の場合のみです（上記を参照）。
[sitemaps.org](https://www.sitemaps.org/) プロトコルに従ってすべての非隠しページを列挙します。

## `theme`

- `theme.name` - 組み込みテーマのいずれか（`bootstrap`、`material`、`tailwind`）、
  またはプロジェクトルートの `theme/` フォルダで提供するカスタムテーマの名前
  （[テーマ](guides/themes.md) を参照）
- `theme.logo` - ヘッダーブランドマークのサイト名の横に表示される画像への
  パス/URL（デフォルトの「⚡」グリフの代わり）
- `theme.favicon` - ファビコンへのパス/URL。空白（デフォルト）の場合、
  `<link rel="icon">` はレンダリングされません。
- `theme.options` - テーマ固有のオプション:
  - `theme.options.colorMode` - `"auto"`（デフォルト）、`"light"` または `"dark"`。
    ユーザーが初回訪問時に見るモードを制御します。`"auto"` は OS の設定に従います。

    ```json
    { "theme": { "options": { "colorMode": "dark" } } }
    ```
  - `theme.options.navCollapsible` - `false`（デフォルト）は常に展開されたナビゲーションセクションを表示します。
    `true` にすると、子要素を持つすべてのセクションにトグルボタンが追加されます。
  - `theme.options.navExpandAll` - `navCollapsible` が `true` の場合のみ関係します。
    `true`（デフォルト）はすべてのセクションを展開した状態で開始し、
    `false` は現在のページを含むセクション以外をすべて折りたたんだ状態で開始します。

    ```json
    { "theme": { "options": { "navCollapsible": true, "navExpandAll": false } } }
    ```

## `search`

`true`（デフォルト）は静的検索インデックスをビルドし、検索ボックスを接続します。
`false` はすべてをスキップします。[検索](guides/search.md) を参照してください。

## `nav`

デフォルトでは、ナビゲーションは `docs/` 自身のフォルダ/ファイル構造から推定されます
（`order`/`hidden` フロントマター付き）。明示的な nav を使用すると、ファイルの実際の場所に
関係なく、ページのタイトル、グループ、順序を自由に設定できます。

空の配列（デフォルト）はフォルダ構造から推定することを意味します。非空の配列は推定を完全に置き換えます。
各エントリは以下のいずれかです:

- `"guides/setup.md"` のような docs/ 相対パス文字列
- `{ "title", "path", "icon", "children" }` オブジェクト

```json
{
	"nav": [
		"index.md",
		{
			"title": "メインコンポーネント",
			"children": [
				{ "title": "クイックスタート", "path": "guides/setup.md" },
				"guides/deployment.md"
			]
		}
	]
}
```

`bxdocs.json` が大きくなりすぎる場合は、`docs/nav.json` ファイルに移動できます。

## `markdown`

[bx-markdown](https://github.com/ortus-boxlang/bx-markdown) 独自のモジュール設定として
そのまま転送されます。

| キー | デフォルト | 効果 |
|---|---|---|
| `enableAdmonition` | `true` *（BX Docs デフォルト; bx-markdown 自体は `false`）* | `!!!`/`???`/`???+` コールアウトブロック |
| `enableFootnotes` | `false` | `[^label]` 脚注参照 |
| `enableDefinitionLists` | `false` | `Term\n:   Definition` リスト |
| `autoLinkUrls` | `true` | 裸の URL とメールアドレスを自動リンク |
| `anchorLinks` | `true` | すべての見出しにクリック可能なアンカーリンクを追加 |

```json
{
	"markdown": {
		"enableFootnotes": true,
		"enableDefinitionLists": true,
		"anchorLinks": false,
		"enableYouTubeTransformer": true
	}
}
```

## `repo`

ヘッダー（すべての組み込みテーマ）にリポジトリアイコンリンクを追加し、
両方のキーが設定されている場合はすべてのページに「このページを編集」リンクを追加します。

- `repo.url` - リポジトリの URL（例: `"https://github.com/acme/docs"`）
- `repo.editUri` - リポジトリ URL とページのソースパスの間のパスセグメント
  （例: `"edit/main/docs/"`）

```json
{ "repo": { "url": "https://github.com/acme/docs", "editUri": "edit/main/docs/" } }
```

## `social`

フッターにレンダリングされるソーシャル/外部リンクの配列（[`footer`](#footer) が有効な場合のみ機能します）。
各エントリには `url` が必要です。`icon` は組み込みアイコンセットから選択し、`label` はリンクのアクセシブルな名前を設定します。

```json
{
	"social": [
		{ "url": "https://twitter.com/acme", "icon": "twitter", "label": "Twitter" },
		{ "url": "https://acme.com/rss.xml", "icon": "rss", "label": "RSS" }
	]
}
```

## `footer`

`false`（デフォルト）- フッターなし。`true` にすると各ページにフッターが追加されます:
著作権行（`© <year> <site name>`）、`social` リンク（あれば）、「BX Docs で構築」クレジット。

```json
{ "footer": true }
```

## `lastUpdated`

`false`（デフォルト）。`true` にすると、ビルド時に各ページの Markdown ファイルの `git log` から取得した
「最終更新」の日付が追加されます。

```json
{ "lastUpdated": true }
```

## `analytics`

ページビュー分析を有効にします。現在は Google Analytics（`gtag.js`）のみサポートしています:

- `analytics.provider` - `"google"` で有効化。空白（デフォルト）の場合、分析スクリプトは送信されません。
- `analytics.id` - Google Analytics 測定 ID（例: `"G-ABC123"`）。

```json
{ "analytics": { "provider": "google", "id": "G-ABC123" } }
```

## `ogImage`

デフォルトのソーシャルカード画像へのパス/URL。独自の `ogImage` を持たないすべてのページで
`og:image` としてレンダリングされます。

```json
{ "ogImage": "assets/social-card.png" }
```

### `generateOgImages`

`false`（デフォルト）。`true` にすると、独自のフロントマター `ogImage` を持たない
すべてのページに対して実際の 1200x630 PNG ソーシャルカードが生成されます。

```json
{ "generateOgImages": true }
```

## `extraCss` / `extraJs`

各ページに含めるスタイルシート/スクリプト URL の追加配列。テーマ独自のアセットの後に追加されます。

```json
{
	"extraCss": [ "assets/custom.css" ],
	"extraJs": [ "assets/custom.js" ]
}
```

## `mermaid`

`false`（デフォルト）。`true` にするとクライアントサイドで `mermaid.js` が読み込まれ、
` ```mermaid ` フェンスコードブロックがダイアグラムとしてレンダリングされます。

```json
{ "mermaid": true }
```

## `math`

`false`（デフォルト）。`true` にするとクライアントサイドで [KaTeX](https://katex.org/) が読み込まれ、
`$...$`/`$$...$$` が数式として組版されます。

```json
{ "math": true }
```

## `plugins`

`[]`（デフォルト）- プラグインとして有効化する BoxLang モジュール名の配列。
インストールしただけでは有効化されません。ここに名前を記述する必要があります。

```json
{ "plugins": [ "myBxDocsPlugin" ] }
```

## `i18n`

[`docs/i18n/<code>/`](guides/i18n.md) のロケールフォルダ規約のメタデータ。
ロケールはフォルダが存在すれば自動的にビルドされます。`i18n` は言語スイッチャーの
表示ラベル/方向を提供するだけです。

- `i18n.defaultLocale` - プロジェクト自身の通常の `docs/` ツリーの `{ "code", "label", "flag" }`。
  デフォルトは `{ "code": "en", "label": "English" }`。
- `i18n.locales` - `[]`（デフォルト）- 他のすべてのロケールの `{ "code", "label", "dir", "flag" }` の配列。

```json
{
	"i18n": {
		"defaultLocale": { "code": "en", "label": "English" },
		"locales": [
			{ "code": "es", "label": "Español" },
			{ "code": "ar", "label": "العربية", "dir": "rtl" }
		]
	}
}
```

詳しくは [国際化](guides/i18n.md) をご覧ください。

## バージョニング

バージョン管理されたドキュメントは設定より規約を重視します。`bxdocs.json` に専用キーはありません。
`docs/versions/` フォルダを追加すると、その中の各直接サブフォルダが独立したドキュメントツリーとして
ビルドされます:

```
docs/
├── index.md
├── guides/
└── versions/
    ├── 1.0/
    │   ├── index.md
    │   └── guides/
    └── 2.0/
        ├── index.md
        └── guides/
```

複数のバージョンが存在すると、すべてのテーマがヘッダーに自動的にバージョンスイッチャードロップダウンを
レンダリングします。設定は不要です。`sitemap.xml` と `llms.txt` にはすべてのバージョンのページが含まれます。
