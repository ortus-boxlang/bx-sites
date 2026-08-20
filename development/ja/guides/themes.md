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
| `bootstrap`（デフォルト） | [Bootstrap 5](https://getbootstrap.com/)（CDN 経由） | Poppins フォント、ブランドグラデーション navbar |
| `material` | 手作りの Material スタイル CSS | カードレイアウト、エレベーションシャドウ、Roboto フォント |
| `tailwind` | [Tailwind Play CDN](https://tailwindcss.com/) | ユーティリティクラス駆動、ビルドステップ不要 |

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
- **リポジトリリンクと「このページを編集」/「最終更新」行** - `bxdocs.json` の `repo`/`lastUpdated` オプション設定時。
- **「Markdown をダウンロード」リンク** - 「このページを編集」の横に表示。設定不要、常に有効。
- **オプトインのフッター** - 著作権、`social` リンク、「BX Docs で構築」クレジット。
- **バージョンスイッチャー** - `docs/versions/` フォルダに複数のバージョンがある場合に自動表示。
- **テーマ化された `404.html`** - ほとんどの静的ホスト（GitHub Pages を含む）で自動的に提供。
- **カスタムロゴとファビコン** - `bxdocs.json` の `theme.logo`/`theme.favicon` 設定時。
- **折りたたみ可能なサイドバーナビ** - `theme.options.navCollapsible` でオプトイン。
- **Google Analytics** - `bxdocs.json` の `analytics` 設定時。

`bxdocs.json` で使用するテーマを設定します:

```json
{ "theme": { "name": "material" } }
```

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
- **`search.bxm`**（省略可）- 検索ボックスのマークアップ。`bxdocs.json` の `search` が `true` の場合のみ含まれます。
- **`assets/`**（省略可）- テーマの CSS/JS。ビルド時に `site/assets/theme/` にコピーされます。

テーマフォルダに必須ファイルのいずれかが欠けている場合、テンプレートエラーが深部から出るのではなく、
ビルド時に明確な `BxDocs.InvalidTheme` エラーで即座に失敗します。

## テーマオーバーライドなしの色のカスタマイズ

色やフォントの微調整には、テーマ全体をフォークするのは過剰です。各組み込みテーマは
`:root` 上の少数の CSS カスタムプロパティからパレットを読み込みます。`bxdocs.json` の
`extraCss` でそれらを上書きするだけで済みます。
