---
title: ホーム
order: 1
icon: phosphor-duotone:house
summary: docs/ フォルダ(または、"docs" らしくないプロジェクトなら src/)を指定するだけ。ドキュメント、マーケティングサイト、ブログ、その他 Markdown で書けるものなら何でも、検索・i18n・実運用向けの Markdown ツールキットを備えた、高速でテーマ変更可能な静的サイトが手に入ります。
toc: false
---

<div class="bxsites-hero">
	<img class="bxsites-hero__banner" src="assets/home-banner.jpg" alt="BxSites - Write. Build. Publish Beautiful Docs. The official documentation engine for BoxLang. Markdown Powered, Beautiful Themes, Blazing Fast Search, Developer Focused.">
	<div class="bxsites-hero__actions">
		<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="getting-started.md">はじめに</a>
		<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="https://github.com/ortus-boxlang/bx-sites">⭐ GitHub でスターを付ける</a>
	</div>
</div>

このサイト自体も、このリポジトリの `docs/` フォルダ内の Markdown ファイルから
BxSites によってビルドされています。

BxSites はリファレンスドキュメント専用ではなく、汎用の
**静的サイトジェネレーター**です。マーケティングサイト、ブログ、ナレッジベース、
プロダクトサイト、個人サイト - Markdown で書けるものなら何でも、同じテーマ、
同じ検索、同じ i18n を通して同じようにビルドされます。コンテンツは既定では
`docs/` に置きますが、「docs」というよりウェブサイトらしいプロジェクトなら
`src/` でも構いません - どちらでもすべてのコマンドは同じように動作します。

::: cards
::: card title="Markdown を入力して、静的 HTML を出力" icon="phosphor-duotone:file-html"
`docs/` フォルダ - あるいは「docs」というよりウェブサイトらしいプロジェクトなら
`src/` - を指定するだけで、`site/` に完全なサイトが生成されます。ホスティング
にサーバーは不要です。
:::
::: card title="フォルダ構造がそのままナビゲーション構造に" icon="phosphor-duotone:tree-structure"
`docs/`(または `src/`)配下にフォルダとファイルをネストすると、フロントマターで
指定した順序でナビゲーションが自動的に構築されます。
:::
::: card title="10 個の組み込みテーマ" icon="phosphor-duotone:palette" href="guides/themes.md"
`bootstrap`、`material`、`tailwind`、そして Docsy・Stripe・Docusaurus・
Just the Docs・VuePress・GitBook・Notion にインスパイアされた 7 個を加えた
フルギャラリー - すべて独自テーマで上書き可能です。
:::
::: card title="静的なクライアントサイド検索" icon="phosphor-duotone:magnifying-glass" href="guides/search.md"
あいまい検索・前方一致検索に対応した MiniSearch 駆動の検索ボックスに加え、
Cmd/Ctrl+K コマンドパレットも搭載 - `build` 時に生成される検索インデックスと
連携し、サーバー依存なし。
:::
::: card title="標準搭載のブログ" icon="lucide:newspaper" href="guides/blog.md"
`docs/blog/posts/` に投稿を置くだけで、著者・カテゴリ・年別アーカイブ・
RSS フィード・投稿ごとのアイキャッチ画像が設定不要で手に入ります。
:::
::: card title="デフォルトで高速・エアギャップ対応" icon="phosphor-duotone:wifi-slash" href="guides/themes.md#air-gapped-offline-sites"
フィンガープリント付き CSS/JS バンドリングとレスポンシブ画像が標準搭載、
さらに Bootstrap、highlight.js、Alpine.js、lunr.js、（オプトインで）Mermaid
もすべてベンダリング済み - ビルドされたサイトはデフォルトで外部への
リクエストが一切発生しません。
:::
::: card title="本物のプラグインシステム" icon="phosphor-duotone:puzzle-piece" href="guides/plugins.md"
プラグインは単なる別の BoxLang モジュールです - 専用の Plugin API を学ぶ
必要はありません。
:::
::: card title="ForgeBox で公開されるプラグイン & テーマ" icon="phosphor-duotone:package" href="guides/plugins.md#公開済みプラグインのインストール"
`install:plugin` と `install:theme` は、公開済みパッケージをプロジェクトに
直接ダウンロードします - ForgeBox の `bxsites-plugins` と `bxsites-themes`
から探せます。
:::
::: card title="既存のテーマをインポート" icon="phosphor-duotone:arrows-left-right" href="guides/theme-import.md"
`theme:import --source=mkdocs|jekyll|hugo` は、他のジェネレーター自身の
テーマテンプレートを bx-sites のスキャフォールドに変換します - ゼロから
書き直す代わりに、そこから作り込めます。
:::
::: card title="GitBook、mkdocs、zip、または Notion から移行" icon="phosphor-duotone:swap" href="guides/index.md"
`bxSites migrate --from=gitbook|mkdocs|markdown-zip|notion` は、既存の
エクスポートやプロジェクトを、一つのコマンドで動作する bx-sites プロジェクトに
変換します。
:::
::: card title="どこへでもデプロイ" icon="phosphor-duotone:cloud-arrow-up" href="guides/deployment.md"
`bxSites deploy` は、ビルドしたサイトを S3、Azure、GCS、Firebase、FTP/SFTP、
rsync、Netlify、Vercel、Cloudflare Pages、GitHub Pages に直接デプロイします -
`bxSites package` なら単一のアーカイブに zip 圧縮することもできます。
:::
::: card title="再利用可能な変数とマジック関数" icon="phosphor-duotone:function" href="guides/variables-and-functions.md"
`{{ dotted.path }}` は `bxsites.yaml` 自身の `variables` ブロックから値を
取得し、`{{ $name(args) }}` は Markdown から直接、小さな BoxLang ヘルパー
関数を呼び出します - プラグインも配線も不要です。
:::
::: card title="リッチなコンテンツブロック" icon="phosphor-duotone:squares-four" href="guides/content-blocks.md"
テーブル、ボタン、プロンプト、展開可能セクション、タブ、埋め込み OpenAPI
仕様 - 素の Markdown の上に構築された GitBook スタイルのブロックライブラリです。
:::
:::

## 読むだけでなく、実際に見てみる

BxSites 自身の Markdown ツールキットが、まさにこのホームページ上で動いています -
スクリーンショットではなく、本物です:

::: stepper
::: step "インストール"
`install-bx-module bx-sites`
:::
::: step "スキャフォールド"
`bxSites new`
:::
::: step "ビルド & 配信"
`bxSites serve`
:::
:::

::: columns
::: column
!!! tip "あらゆる場面で使えるコールアウト"
    `note`、`tip`、`warning`、`danger` など、12 種類の標準 Admonition タイプ -
    それぞれ専用のアクセントカラーを持ち、折りたたみ可能な `???` バリアントも
    あります。[Markdown 拡張機能](guides/markdown.md#admonitions) を参照してください。
:::
::: column
!!! faq "コンテンツタブ、数式、ダイアグラム"
    グループ化されたコードタブ、KaTeX 数式、Mermaid ダイアグラム、脚注、
    定義リストがすべて標準搭載です - 詳しくは
    [Markdown 拡張機能](guides/markdown.md) を参照してください。
:::
:::

## 次のステップ

::: cards
::: card title="はじめに" icon="phosphor-duotone:rocket-launch" href="getting-started.md"
インストール、プロジェクトのスキャフォールド、ビルドと配信。
:::
::: card title="CLI リファレンス" icon="phosphor-duotone:terminal-window" href="cli-reference.md"
すべての動詞とオプション。
:::
::: card title="設定" icon="phosphor-duotone:gear-six" href="configuration.md"
`bxsites.yaml` の完全なリファレンス。
:::
::: card title="Markdown 拡張機能" icon="phosphor-duotone:markdown-logo" href="guides/markdown.md"
Admonition、タブ、カード、コールアウト、数式、Mermaid ダイアグラム。
:::
::: card title="ブログ" icon="lucide:newspaper" href="guides/blog.md"
投稿、著者、カテゴリ、アーカイブ、RSS、下書き、統計ページ。
:::
::: card title="レスポンシブ画像 & アセットパイプライン" icon="phosphor-duotone:image" href="guides/images.md"
自動画像リサイズ/WebP 変換と、フィンガープリント付き CSS/JS バンドリング。
:::
::: card title="デプロイ" icon="phosphor-duotone:cloud-arrow-up" href="guides/deployment.md"
`deploy`/`package` コマンドと、組み込みの GitHub Actions ワークフロー。
:::
::: card title="リリース" icon="phosphor-duotone:tag" href="releases/index.md"
バージョニングポリシーと各リリースの新機能。
:::
:::

## サイト構築の手伝いが必要ですか?

BxSites は無料でオープンソースです - ですが、開発チーム自身に作業を
任せたい場合は、[Ortus Solutions](https://www.ortussolutions.com) が
ドキュメントサイト、移行、その他 BxSites で構築されたあらゆる静的サイトに
関するプロフェッショナルサービス・コンサルティングを提供しています。

<div class="bxsites-hero__actions">
	<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="mailto:consulting@ortussolutions.com">consulting@ortussolutions.com にメール</a>
	<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="services.md">コンサルティング & プロフェッショナルサービス</a>
</div>
