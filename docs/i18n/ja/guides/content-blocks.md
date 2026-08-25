---
title: コンテンツブロック
order: 4.5
icon: phosphor-duotone:squares-four
tags: [ガイド, markdown, GitBook]
---

# コンテンツブロック

[Markdown 拡張機能](markdown.md) のすべてに加えて、BxSites は GitBook
スタイルのコンテンツブロック群をサポートしています - それ自体便利であるだけでなく、
GitBook サイトのコンテンツを簡単に移行できる理由でもあります。それぞれが
同名の GitBook ブロックに直接対応しています。すべて同じ `::: name ... :::`
コンテナ構文を使い（単独の行にある裸の `:::` が、現在開いているブロックを
閉じます）、`bxsites.yaml` の設定は不要で、常に使用できます。ブロックは
別のブロックの中にネストできます（例えば、カードグループを含む展開可能
セクションなど）- それぞれが自身のコンテンツの中でさらにブロックがないか
再スキャンされます。

## 展開可能

コールアウトのアイコン/色を持たない、プレーンな折りたたみ可能セクションです -
折りたたみ可能な Admonition（`???`、[Admonition](markdown.md#折りたたみ可能な-admonition)
を参照）とは異なります:

```markdown title="Example" linenums="1"
::: expandable "これは折りたたみ可能な Admonition と違いますか？"
はい - これにはタイプ/アイコン/色がなく、単なるプレーンな展開/折りたたみ
セクションです。`open="true"` を追加すると展開された状態で開始します。
:::
```

::: expandable "これは折りたたみ可能な Admonition と違いますか？"
はい - これにはタイプ/アイコン/色がなく、単なるプレーンな展開/折りたたみ
セクションです。`open="true"` を追加すると展開された状態で開始します。
:::

## カード

リンクカードのグリッドで、それぞれが `::: cards` ラッパーの中の独自の
`::: card` です - `title`、`icon`、`image`、`href` はすべて任意です
（`href` のないカードは、クリックできないプレーンなカードとしてレンダリング
されます）。`icon` はフロントマター/ナビの `icon` 値と同じ方法で解決されます -
プレーンな絵文字、または同梱ライブラリの名前付きアイコン
（`icon="phosphor-duotone:rocket-launch"`、`icon="lucide:rocket"` など）
です - [アイコン](icons.md) を参照してください:

```markdown title="Example" linenums="1"
::: cards
::: card title="はじめに" icon="phosphor-duotone:rocket-launch" href="../getting-started.md"
インストール、スキャフォールド、最初のサイトのビルド。
:::
::: card title="テーマ" icon="phosphor-duotone:palette" href="themes.md"
組み込みテーマのカスタマイズ、または独自テーマの作成。
:::
:::
```

::: cards
::: card title="はじめに" icon="phosphor-duotone:rocket-launch" href="../getting-started.md"
インストール、スキャフォールド、最初のサイトのビルド。
:::
::: card title="テーマ" icon="phosphor-duotone:palette" href="themes.md"
組み込みテーマのカスタマイズ、または独自テーマの作成。
:::
:::

## 列

横並びのレイアウトです - `::: column` は任意の `width`（プレーンな CSS の
長さ/パーセンテージ、例えば `"40%"`）を受け付けます。明示的な幅を持たない
列は、行を均等に分け合います:

```markdown title="Example" linenums="1"
::: columns
::: column width="60%"
広い方の列。
:::
::: column
狭い方の列。
:::
:::
```

::: columns
::: column width="60%"
広い方の列。
:::
::: column
狭い方の列。
:::
:::

## ステッパー

番号付きで連結されたステップの連続です:

```markdown title="Example" linenums="1"
::: stepper
::: step "インストール"
`install-bx-module bx-sites`
:::
::: step "スキャフォールド"
`bxSites new`
:::
:::
```

::: stepper
::: step "インストール"
`install-bx-module bx-sites`
:::
::: step "スキャフォールド"
`bxSites new`
:::
:::

ステップ自身が持つ任意の `color` 属性は、そのマーカーに 4 色のうちいずれか
1 つの意味的な色を付けます - デフォルト（`color` なし）、`success`、
`warning`、`danger` です - シーケンス内でのステップの位置とは独立しています:

```markdown title="Example" linenums="1"
::: stepper
::: step "データをバックアップ" color="success"
定型作業で、いつ実行しても安全です。
:::
::: step "任意: テレメトリを有効化" color="warning"
確信が持てない場合はスキップしてください。
:::
::: step "旧インストールを削除" color="danger"
元に戻せません - 上のバックアップが完了していることを必ず確認してください。
:::
:::
```

::: stepper
::: step "データをバックアップ" color="success"
定型作業で、いつ実行しても安全です。
:::
::: step "任意: テレメトリを有効化" color="warning"
確信が持てない場合はスキップしてください。
:::
::: step "旧インストールを削除" color="danger"
元に戻せません - 上のバックアップが完了していることを必ず確認してください。
:::
:::

番号付きマーカー、接続線、そして上記 3 つの `color` パレットは、いずれも
サイトの他の部分のパレットとは独立して、CSS カスタムプロパティで
テーマ化できます -
[色のカスタマイズ](themes.md#テーマオーバーライドなしの色のカスタマイズ)
を参照してください。

## ファイル

PDF、動画、その他のプロジェクトアセット向けのダウンロードカードです -
`src` は `theme.logo`/フロントマターの `ogImage` がすでに解決されているのと
同じ方法で解決されます（`docs/assets/` からの相対パス）:

```markdown title="Example" linenums="1"
::: file src="assets/spec.pdf" title="API 仕様"
:::
```

::: file src="assets/og-image.png" title="サイトプレビュー画像"
:::

## 埋め込み

認識されたプロバイダー向けのレスポンシブ iframe 埋め込みです - 現時点では
YouTube、Vimeo、CodePen、Spotify、Loom、Figma に対応しています。それ以外の
URL は、どのみちレンダリングを拒否する iframe（ほとんどのサイトはフレーム
表示をブロックします）の代わりに、プレーンな「訪問 ↗」リンクカードに
フォールバックします:

```markdown title="Example" linenums="1"
::: embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="デモ"
:::
```

::: embed url="https://www.youtube.com/watch?v=dQw4w9WgXcQ" title="デモ"
:::

## ページリンク

別のページへのリッチなプレビューカードです - `href` は通常の
[ページリンク](../getting-started.md#ページ間のリンク) と同じ、
ファイル相対の規約に従います。カードとは異なり、タイトル/アイコン/サマリは
ターゲットページ自身のフロントマターから自動的に取得されるため、そのページが
リネームされたりサマリが変更されたりしても同期が保たれます:

```markdown title="Example" linenums="1"
::: page-link href="../getting-started.md"
:::
```

::: page-link href="../getting-started.md"
:::

## リンクプレビュー

*外部* URL 向けのリッチなプレビューカードです - `::: page-link` と同じ
カード形状ですが、このサイト自身のページではないリンクのためのもので、
タイトル/サマリを自動取得できるページがありません。すべてのフィールドは
ディレクティブ自身の属性から取得されます: 必須なのは `url` だけで、`title`
を省略すると裸の URL にフォールバックし、`description`/`image` はどちらも
任意です。これらを自動入力するためのビルド時のターゲット URL フェッチは
ありません - [`check`](../cli-reference.md) を内部リンクのみに
限定しているのと同じ理由がここにも当てはまり、遅い/到達不能なサードパーティ
サイトがビルド時間に影響することは決してありません:

```markdown title="Example" linenums="1"
::: link-preview url="https://boxlang.io" title="BoxLang" description="動的でマルチパラダイムな JVM 言語。" image="https://boxlang.io/og.png"
:::
```

::: link-preview url="https://boxlang.io" title="BoxLang" description="動的でマルチパラダイムな JVM 言語。" image="https://boxlang.io/og.png"
:::

## プロンプト

再利用可能な AI プロンプト向けのスタイル付きコンテナです - GitBook の
[Prompt ブロック](https://gitbook.com/docs/create-content/blocks/prompt)
に対する bx-sites 独自の対応物です。ブロックの本文がそのままプロンプトの
テキストになり、通常の Markdown として書かれます（そのため中の見出しや
リスト、コードもそれぞれ独自の書式を保ちます）。どのプロンプトにも
「Copy」ボタンが付き、書式マークアップを含むそのままのソーステキストを
コピーして、使いたい AI ツールにそのまま貼り付けられます。`description`
（任意の1行サマリ）と `icon`（`::: card` 自身の `icon` と同じ方法で解決
され、省略時はきらめきアイコンがデフォルトになります）はどちらも任意です:

```markdown title="Example" linenums="1"
::: prompt description="Summarizes a pull request for a changelog entry" icon="phosphor-duotone:git-pull-request"
Summarize the following pull request diff as a single changelog entry,
written for an end user rather than a developer. Group related changes
together and skip anything purely internal (refactors, tests, CI).
:::
```

::: prompt description="Summarizes a pull request for a changelog entry" icon="phosphor-duotone:git-pull-request"
Summarize the following pull request diff as a single changelog entry,
written for an end user rather than a developer. Group related changes
together and skip anything purely internal (refactors, tests, CI).
:::

長いプロンプトを短くフェードアウトするプレビューに収め、読者が「Show
more」をクリックするまでそのままにしておくには `expanded="preview"` を
追加します。あるいは `expanded="hidden"` を使うと、「Show prompt」ボタンの
背後に完全に折りたたまれた状態で開始します - 複数のプロンプトを連続して
並べるページで便利です。`expanded` を省略する（またはデフォルトの
`"full"` を指定する）と、常にプロンプト全体を表示します:

```markdown title="Example" linenums="1"
::: prompt description="A longer, multi-step prompt" expanded="preview"
1. Read the attached error log line by line.
2. For each stack trace, identify the failing module.
3. Group failures by root cause, not by timestamp.
4. Propose one fix per root cause, not per failure.
5. Skip anything that already has an open issue - list those separately.
:::
```

::: prompt description="A longer, multi-step prompt" expanded="preview"
1. Read the attached error log line by line.
2. For each stack trace, identify the failing module.
3. Group failures by root cause, not by timestamp.
4. Propose one fix per root cause, not per failure.
5. Skip anything that already has an open issue - list those separately.
:::

GitBook 自身の Prompt ブロックとは異なり、ここには「Open in AI
providers」メニューはありません - bx-sites はサードパーティの AI
プロバイダーと一切通信しないため、GitBook 自身のブロックのその部分には
対応するものがありません。

## 更新履歴（changelog）

日付とタグ付けが可能な変更履歴リストです - `::: update` は
`date="YYYY-MM-DD"` と、任意のカンマ区切りの `tags` を受け付けます:

```markdown title="Example" linenums="1"
::: updates
::: update date="2026-01-15" tags="feature,fix"
ダークモードを追加し、フッターの整列バグを修正しました。
:::
::: update date="2026-01-01"
初回リリース。
:::
:::
```

::: updates
::: update date="2026-01-15" tags="feature,fix"
ダークモードを追加し、フッターの整列バグを修正しました。
:::
::: update date="2026-01-01"
初回リリース。
:::
:::

`::: updates` ブロックを持つページは、`bxsites.yaml` の `baseURL` が完全な
URL である場合（`sitemap.xml` と同じ要件です）、その隣に独自の `feed.xml`
（RSS 2.0）も書き出されます - そのため、読者はそのページの更新履歴だけを
購読できます。

## 再利用可能なコンテンツ（インクルード）

`::: include src="..."` は、別のファイルの生の Markdown をその場所に
挿入します。上記のすべてのブロックとは異なり、これはウィジェットに包まれた
何かではなく、本物のページコンテンツ（見出し、段落、自身のネストした
ブロック）になります - 複数のページで繰り返される警告/告知に便利です。
パーシャル自体は `docs/includes/` の下に置いてください - `assets/`/
`versions/`/`i18n/`/`blog/` と同じ予約済みフォルダの規約です。`includes/`
配下のファイルは、決してそれ自体のページとしてビルドされず、ナビ/検索/
サイトマップ/タグにも一切現れません - 他のページに挿入されるためだけに
存在します:

```text title="docs/ のレイアウト"
docs/
├── index.md
├── includes/
│   ├── beta-notice.md
│   └── legal/
│       └── terms.md
└── guides/
    └── deep/
        └── setup.md
```

**裸の** `src`（先頭に `./` や `../` がないもの）は、インクルードする側の
ページがどれだけ深くネストしていても、常に現在のツリー自身の
`docs/includes/` に対して解決されます - 上記の `guides/deep/setup.md` は、
`index.md` とまったく同じ `src` で、まったく同じファイルに到達します:

```markdown title="index.md または guides/deep/setup.md のどちらからでも"
::: include src="beta-notice.md"
```

裸の `src` は `includes/` 自身のサブフォルダを指すこともできます:

```markdown title="Example"
::: include src="legal/terms.md"
```

代わりに `src` の前に `./` や `../` を付けると、集約された `includes/`
フォルダに置くつもりのない、ページに隣接するフラグメントに到達できます -
この形式は、通常のページリンクと同じ規約で、*インクルードする側*のページ
自身のディレクトリからのファイル相対で解決されます:

```markdown title="guides/deep/setup.md から、集約フォルダではなく 1 階層上"
::: include src="../local-note.md"
```

バージョン/ロケールのツリーも同じ方法で独自の `includes/` を持ちます -
`docs/versions/2.0/` 配下のページは、裸の `src` を
`docs/versions/2.0/includes/` に対して解決し、`docs/i18n/es/` 配下の
ページは `docs/i18n/es/includes/` に対して解決します - それぞれのツリーの
パーシャルは独自のものであり、メインツリーの `docs/includes/` とは
共有されません。

インクルードされたファイルは、さらに別のファイルをインクルードできます
（循環参照はビルド時に永久ループする代わりに `BxSites.CircularInclude`
を送出します）。

## 条件付きコンテンツ

読者自身の選択に基づいて、ブロックのいくつかのバリアントのうち1つを表示します -
例えば同じページ上の「Free」向けと「Pro」向けの手順を切り替えるような場合です。
これは訪問者の識別情報を一切持たない完全な静的サイトなので、本物のバックエンドを
持つプラットフォームとは違い、サーバー側で評価される「この読者は誰か」という
ものはありません - 読者自身が選択し、その選択は自分自身のブラウザ
（`localStorage`）に記憶され、以降のすべてのページにも引き継がれます:

```markdown title="Example" linenums="1"
::: audience-switcher key="plan" options="free:Free,pro:Pro"
:::

::: conditional key="plan" value="free"
The Free plan includes basic search.
:::

::: conditional key="plan" value="pro"
The Pro plan adds AI-assisted search and unlimited team seats.
:::
```

::: audience-switcher key="plan" options="free:Free,pro:Pro"
:::

::: conditional key="plan" value="free"
The Free plan includes basic search.
:::

::: conditional key="plan" value="pro"
The Pro plan adds AI-assisted search and unlimited team seats.
:::

`::: conditional key="..." value="..."` は1つのバリアントを示します。`key` は
切り替えの対象となる任意の設定名です（上記の `"plan"` はもちろん、
`"os"`、`"language"`、何でも構いません）。そして `value` は、このブロックが
どの設定のときに表示されるべきかを指定します。すべてのバリアントは常に
HTML 内にレンダリングされます - クライアント側で非表示にされるだけで、
決して省略されません - そのため、JavaScript を無効にしている読者
（あるいは検索クローラー）にも、どれも表示されないのではなく、すべての
バリアントが見えます。

`::: audience-switcher key="..." options="value:Label,value:Label,..."` は
任意の、すぐに使える既製のコントロールです - 選択肢ごとに1つのボタンがあり、
ページ上のどこにあっても同じ `key` を共有するすべての `::: conditional`
ブロックを即座に切り替えます。これは必須ではありません: `?plan=pro` で
終わるリンクは読み込み時に自動的に同じ設定をセットします（「このページの
Pro 版」への直接リンクを共有するのに便利です）。また、プロジェクト自身の
テーマオーバーライドから `window.bxSitesSetPreference( key, value )` を
直接呼び出して、独自の UI から制御することもできます。
