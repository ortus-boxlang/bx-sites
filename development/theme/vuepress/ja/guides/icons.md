---
title: アイコン
order: 1.5
icon: phosphor-duotone:shapes
tags: [ガイド, テーマ, アイコン]
---

# アイコン

ページ自身の `icon` フロントマター（タイトルの横、サイドバーナビのそのエントリの横に
表示されます）は、プレーンな絵文字/短いテキスト（元々の、今も完全にサポートされている
形式）か、8 つの自己ホスト型ライブラリのいずれかからの名前付きアイコンを受け付けます -
すべて MIT/ISC ライセンスでこのモジュールにバンドルされています（合計約 16,200
アイコン、CDN なし、実際に使用する数個のアイコン以外はビルド済みページの重量に
一切追加されません - IconResolver.bx を参照してください）:

```markdown title="Frontmatter"
---
icon: rocket
---
```

```markdown title="Frontmatter"
---
icon: lucide:rocket
---
```

```markdown title="Frontmatter"
---
icon: phosphor-bold:rocket
---
```

裸の `rocket` は [Phosphor](https://phosphoricons.com/)（レギュラーウェイト）に
デフォルトします。Phosphor は 6 つの自身のウェイトすべてを、それぞれ独自の
プレフィックスで提供します: `phosphor-thin:`、`phosphor-light:`、`phosphor:`
（レギュラー、裸の名前と同じ）、`phosphor-bold:`、`phosphor-fill:`、
`phosphor-duotone:`。代わりに [Lucide](https://lucide.dev/icons/) には `lucide:`、
[Tabler](https://tabler.io/icons) には `tabler:` をプレフィックスします。正確な名前は
各サイト自身のギャラリーを参照してください - このモジュール自身が同梱している
ファイル名と完全に一致します（小文字、ハイフン区切り。例: `book-open`、
`arrow-up-right`。Phosphor 自身のサイトはウェイト切替を表示しますが、そこにある
6 つの選択肢はそれぞれこのモジュールの 6 つの `phosphor[-weight]:` プレフィックスの
いずれかに対応します）。

Font Awesome はこれらに意図的に含まれていません - その Duotone スタイル（および v6
以降のアイコンセットの大部分）は Pro 限定であり、このモジュールが無償でバンドル・
再配布できるライセンスの下にないためです。

プロジェクト独自の SVG も使用できます - `docs/assets/icons/my-icon.svg` に配置し、
`icon: custom:my-icon` として参照します。

[nav.json](../configuration.md#nav) のエントリも独自の `icon` を設定でき、その1つの
エントリについて対象ページ自身のフロントマターを上書きします:

```json title="docs/nav.json"
{ "title": "Guides", "path": "guides/index.md", "icon": "lucide:book-open" }
```

同じ `[library:]name`/絵文字の値は、[コンテンツブロックのカード](content-blocks.md#カード)
など、`icon` が受け付けられる他のどこでも機能します - 同じ方法で、同じ共有キャッシュを
通じて解決されるため、ビルド全体で同じアイコンを2回参照しても、その SVG ファイルは
一度しか読み込まれません。
