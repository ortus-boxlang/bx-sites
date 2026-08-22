---
title: テーマ
order: 1
tags: [guides, themes]
---

# テーマ

テーマはネイティブの BoxLang `.bxm` テンプレートです。専用のテンプレートエンジンや
ビルドステップは不要です。

## 組み込み

| テーマ | ベース | 備考 |
|---|---|---|
| `bootstrap`（デフォルト） | [Bootstrap 5](https://getbootstrap.com/)（バンドル同梱） | Poppins フォント、ブランドグラデーション navbar |
| `material` | 手作りの Material スタイル CSS | カードレイアウト、エレベーションシャドウ、Roboto フォント |
| `tailwind` | [Tailwind Play CDN](https://tailwindcss.com/) | ユーティリティクラス駆動、ビルドステップ不要 |

各組み込みテーマ自身の CSS/JS（Bootstrap の CSS/JS バンドル、highlight.js、Alpine.js、
デフォルトの `local` 検索プロバイダー用の lunr.js、および `mermaid` を有効にした場合の
Mermaid）は、このモジュールに同梱（バンドル）された状態で出荷され、ビルドされた `site/`
にそのままコピーされます - ビルド済みサイトの閲覧に CDN もインターネットアクセスも
一切不要です。`tailwind` テーマ自身のユーティリティエンジン（静的なスタイルシートでは
なく、クライアントサイドの JIT コンパイラ）と、自分で有効にしたその他のオプション機能
（`math`、Algolia 検索、Google Analytics）は、依然として CDN やホスト型 API から読み込
まれます - 詳細は下記の
[エアギャップ/オフラインサイト](#air-gapped-offline-sites) を参照してください。

すべて同じ BoxLang ブランドパレット（`#00FF78 → #00DBFF` グラデーションと `#FFF500` アクセント）を使用し、
以下の同じページ機能を搭載しています:

- **ページ内「このページの内容」目次** - 各ページの `h2`/`h3` 見出しから生成されます。
- **パンくずリスト** - リンクされた祖先の 1 つ以上深くネストされたページで表示されます。
- **前/次ページリンク** - 記事の下部に、ナビゲーションの読み取り順に従って表示されます。
- **構文ハイライトされたコードブロック** - [highlight.js](https://highlightjs.org/) および
  独自の BoxLang グラマー（`` ```bx ``/`` ```boxlang ``/`` ```cfscript ``）と**コピーボタン**付き。
- **自己ホスト型 Web フォント** - 表示時に `fonts.googleapis.com` へのリクエストなし。
- **ダーク/ライトモード切替** - [Alpine.js](https://alpinejs.dev/) で実装。訪問者の選択は
  `localStorage` に記憶されます。
- **レスポンシブヘッダー** - あらゆる幅で 1 行に収まります。折りたたみ可能なサイドバーナビ付き。
- **検索ボックスのキーボードショートカット** - `/` で検索にフォーカス、`Escape` で閉じます。
- **リポジトリリンクと「このページを編集」/「最終更新」行** - `bxsites.json` の `repo`/`lastUpdated` オプション設定時。
- **「Markdown をダウンロード」リンク** - 「このページを編集」の横に表示。設定不要、常に有効。
- **オプトインのフッター** - 著作権、`social` リンク、「BX Sites で構築」クレジット。
- **バージョンスイッチャー** - `docs/versions/` フォルダに複数のバージョンがある場合に自動表示。
- **テーマ化された `404.html`** - ほとんどの静的ホスト（GitHub Pages を含む）で自動的に提供。
- **カスタムロゴとファビコン** - `bxsites.json` の `theme.logo`/`theme.favicon` 設定時。
- **折りたたみ可能なサイドバーナビ** - `theme.options.navCollapsible` でオプトイン。
- **Google Analytics** - `bxsites.json` の `analytics` 設定時。

`bxsites.json` で使用するテーマを設定します:

```json
{ "theme": { "name": "material" } }
```

## エアギャップ/オフラインサイト {#air-gapped-offline-sites}

ビルドされたサイトは、`bootstrap` と `material` テーマをデフォルトの `local` 検索
プロバイダーと組み合わせた場合、デフォルトでインターネットアクセスが一切なくても
動作します。Bootstrap 自身の CSS/JS、highlight.js、Alpine.js、lunr.js はすべて
このモジュールに同梱されており（`resources/assets/vendor/`）、ビルド時に
`site/assets/vendor/` へそのままコピーされます - 生成される HTML のどこにも、
これらのための CDN の `<script>`/`<link>` タグは一切含まれません。`bxsites.json`
の `mermaid` キーを有効にすると、Mermaid も同様に同梱され、`mermaid.min.js`
バンドルが `site/assets/vendor/mermaid/` にコピーされて、組み込みのすべての
テーマがそこから読み込むため、図表も外部への通信なしで描画されます。

ただし、自分で有効にした場合に限り、いくつかの機能はまだネットワークに
アクセスします:

- `tailwind` テーマ自身のユーティリティエンジンは、`cdn.tailwindcss.com` から
  読み込まれるクライアントサイドの JIT コンパイラです - 静的なスタイルシートでは
  ないため、このモジュールが同様の方法で同梱することができず、このテーマは
  今のところエアギャップ環境には対応していません。
- Mermaid 自身のレイアウトエンジンは、追加のチャンクである `elk-api.js` を
  jsDelivr から遅延読み込みしますが、これは `elk` レイアウトアルゴリズムを
  使用するダイアグラムタイプに限られます。同梱された `mermaid.min.js` は、
  それ以外のすべてのダイアグラムタイプを完全に単独でレンダリングします。
- `bxsites.json` の `math` オプションを有効にすると、KaTeX（JS 本体とその独自
  フォントファイルの両方）を CDN から読み込みます。
- `searchProvider.provider: "algolia"` と `analytics.provider: "google"` は、
  その性質上ホスト型の API／トラッキングエンドポイントと通信します - JS
  ファイルを同梱しても、この依存関係はなくなりません。

デプロイ先が本当に一切インターネットにアクセスできない環境である場合は、
`bootstrap`/`material` とデフォルトの `local` 検索プロバイダーを使い、
`mermaid` を有効にしている場合は `elk` レイアウトの Mermaid ダイアグラムを
避け、`math`/Algolia/analytics はオフのままにしてください。

## アイコン

ページの `icon` フロントマターは、プレーンな絵文字/短いテキスト、または 8 つの
自己ホスト型ライブラリのいずれかからの名前付きアイコンを受け付けます
（すべて MIT/ISC ライセンスでこのモジュールにバンドルされています。合計約 16,200 アイコン）:

```markdown
---
icon: rocket
---
```

```markdown
---
icon: lucide:rocket
---
```

裸の `rocket` は [Phosphor](https://phosphoricons.com/)（レギュラーウェイト）にデフォルトします。
Phosphor は 6 つのウェイトすべてを独自プレフィックスで提供します:
`phosphor-thin:`、`phosphor-light:`、`phosphor:`（レギュラー）、`phosphor-bold:`、
`phosphor-fill:`、`phosphor-duotone:`。
[Lucide](https://lucide.dev/icons/) は `lucide:`、[Tabler](https://tabler.io/icons) は `tabler:` でプレフィックス。

プロジェクト独自の SVG も使用できます。`docs/assets/icons/my-icon.svg` に配置して
`icon: custom:my-icon` として参照します。

## `ThemeProvider` コントラクト

テーマは以下のフォルダです:

- **`layout.bxm`**（必須）- 外側の HTML シェル + ナビゲーション。
- **`page.bxm`**（必須）- 記事本文。`variables.page.contentHtml` をレンダリングします。
- **`search.bxm`**（省略可）- 検索ボックスのマークアップ。`bxsites.json` の `search` が `true` の場合のみ含まれます。
- **`assets/`**（省略可）- テーマの CSS/JS。ビルド時に `site/assets/theme/` にコピーされます。

テーマフォルダに必須ファイルのいずれかが欠けている場合、テンプレートエラーが深部から出るのではなく、
ビルド時に明確な `BxSites.InvalidTheme` エラーで即座に失敗します。

## テーマオーバーライドなしの色のカスタマイズ

色やフォントの微調整には、テーマ全体をフォークするのは過剰です。各組み込みテーマは
`:root` 上の少数の CSS カスタムプロパティからパレットを読み込みます。`bxsites.json` の
`extraCss` でそれらを上書きするだけで済みます。
