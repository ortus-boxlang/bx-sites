---
title: Alpine.js によるインタラクティビティ
order: 9
icon: phosphor-duotone:lightning
tags: [ガイド, Alpine, インタラクティビティ]
---

# Alpine.js によるインタラクティビティ

BX Sites がビルドするすべてのページは、すでに [Alpine.js](https://alpinejs.dev/)
を読み込んでいます - すべての組み込みテーマで、ダーク/ライトモード切替と
言語ドロップダウンを動かしているのがこれです。同じ Alpine インスタンスは、
あなた自身のページコンテンツからも無料で使えます。`bxsites.yaml` で切り替える
設定も、追加する `extraJs` エントリも、Markdown に書く追加の `<script>` タグも
必要ありません。

Markdown 内の[生のブロックレベル HTML はそのまま通過する](images.md#キャプション配置フレーミング)
ため、Alpine の `x-data`/`x-show`/`@click` などの属性を、そのままどの HTML
ブロックにも書くだけで動作します。

## Alpine に手を伸ばす前に

「インタラクティブ」に見えるニーズの多くは、自分で JS を書かなくても済む
専用のディレクティブブロックがすでに用意されています - まずはこちらを検討して
ください:

- 折りたたみ可能なセクション →
  [展開可能](content-blocks.md#展開可能) または
  [折りたたみ可能な Admonition](markdown.md#折りたたみ可能な-admonition)
- クリック可能なタブの背後にグループ化された代替コンテンツ →
  [コンテンツタブ](markdown.md#コンテンツタブ)
- 番号付きの手順ウォークスルー →
  [ステッパー](content-blocks.md#ステッパー)

Alpine は、これらがカバーしない - 独自のクライアントサイド状態を持つ -
インタラクティブなコンテンツのためのものです。

## コピー・トゥ・クリップボードボタン

よくある例: インストールコマンドの横にあり、それをコピーしてコピー完了を
確認するボタンです:

```markdown title="Copy button" linenums="1"
<div x-data="{ copied: false }">
  <button type="button" @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
    <span x-show="!copied">インストールコマンドをコピー</span>
    <span x-show="copied" x-cloak>コピーしました！</span>
  </button>
</div>
```

<div x-data="{ copied: false }">
  <button type="button" class="btn btn-sm btn-outline-secondary" @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
    <span x-show="!copied">インストールコマンドをコピー</span>
    <span x-show="copied" x-cloak>コピーしました！</span>
  </button>
</div>

## ライブフィルタ

サーバーへの往復なしで、クライアントサイドでリストをフィルタリングします:

```markdown title="Live filter" linenums="1"
<div x-data="{ query: '' }">
  <input type="text" x-model="query" placeholder="プロバイダーを絞り込み...">
  <ul>
    <li x-show="'local'.includes( query.toLowerCase() )">local（静的インデックス、サーバー不要）</li>
    <li x-show="'algolia'.includes( query.toLowerCase() )">algolia（ホスト型 DocSearch）</li>
    <li x-show="'pagefind'.includes( query.toLowerCase() )">pagefind（ビルド時にインデックス化）</li>
  </ul>
</div>
```

`x-model` は入力値を Alpine の状態にバインドします。各 `<li>` の `x-show` は
キー入力のたびに再評価されます。

## `x-data` の基本（Alpine が初めての方向け）

`x-data` は、スコープ自身のリアクティブな状態をプレーンな JS オブジェクトとして
宣言します。その要素の内側にあるものはすべてそれを読み書きでき、
`x-show`/`x-text`/`x-model`/`@click`（`x-on:click` の省略形）はいずれも、
状態の変化に反応します:

```markdown title="Example" linenums="1"
<div x-data="{ count: 0 }">
  <button type="button" @click="count++">クリック <span x-text="count"></span> 回</button>
</div>
```

完全なディレクティブ一覧（`x-if`、`x-for`、`x-transition` など）については
[Alpine 自身のドキュメント](https://alpinejs.dev/start-here) を参照してください。

## 知っておくべきこと

- **これはコアであり、オプションではありません。** テーマのクロム（ダーク
  モード、言語スイッチャー）は Alpine に依存しているため、`mermaid`/`math`
  のように `bxsites.yaml` でオフにすることはできません。
- **バージョン。** 現在は `alpinejs@3.14.1` で、このモジュールに同梱され
  `site/assets/vendor/alpine/` から配信されます - CDN は関与しません。
  正確に何が読み込まれているか知りたい場合は、テーマ自身の `layout.bxm`
  内の実際の `<script>` タグを確認してください。
- **厳格な CSP。** Alpine のデフォルトビルドは `x-data`/`@click` などの内側の
  JS 式を直接評価するため、厳格な Content-Security-Policy の下では
  `unsafe-eval` が必要です。デプロイ先でそれが許可できない場合、ページ
  コンテンツで Alpine に頼らないでください。
- **軽量に保つ。** ドキュメントページは高速でシンプルであるべきです -
  小さく自己完結したウィジェット（コピーボタン、フィルタ、トグル）は
  適していますが、フルのクライアントサイドアプリのためのものではありません。
