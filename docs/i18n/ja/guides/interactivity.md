---
title: Alpine.js によるインタラクティビティ
order: 9
icon: phosphor-duotone:lightning
tags: [ガイド, Alpine, インタラクティビティ]
---

# Alpine.js によるインタラクティビティ

BxSites がビルドするすべてのページは、すでに [Alpine.js](https://alpinejs.dev/)
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
- スタイル付きの CTA リンク →
  [ボタン](content-blocks.md#ボタン)（以下のコピー・トゥ・クリップボード
  ボタンは *別の* ケースです - `href` を一切持たず、クライアントサイドの
  動作だけです - これはまさに Alpine の出番です）

Alpine は、これらがカバーしない - 独自のクライアントサイド状態を持つ -
インタラクティブなコンテンツのためのものです。

## コピー・トゥ・クリップボードボタン

[`::: button`](content-blocks.md#ボタン) は常に本物のリンク（または操作
不可のプレースホルダー）だけをレンダリングします - GitBook 自身のボタンと
同様、クリック時に任意の JS を実行するという概念はありません。どこかへ
移動するのではなく実際に *何かを行う* ボタンには、代わりに
`bxsites-button`/`bxsites-button--*` クラスをプレーンな HTML の `<button>`
に付けてください - 見た目は同じで、すべての組み込みテーマでスタイルされ、
`href` の代わりに Alpine で配線されるだけです。よくある例: インストール
コマンドの横にあり、それをコピーしてコピー完了を確認するボタンです:

```markdown title="Copy button" linenums="1"
<div x-data="{ copied: false }">
  <button type="button" class="bxsites-button bxsites-button--secondary bxsites-button--small"
    @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
    <span x-show="!copied">インストールコマンドをコピー</span>
    <span x-show="copied" x-cloak>コピーしました！</span>
  </button>
</div>
```

<div x-data="{ copied: false }">
  <button type="button" class="bxsites-button bxsites-button--secondary bxsites-button--small"
    @click="navigator.clipboard.writeText( 'box install bx-sites' ); copied = true; setTimeout( () => copied = false, 1500 )">
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

## ソート・フィルタ可能なテーブル

[ネイティブなパイプテーブル](tables.md) は、一度組み立てられると
静的なままです - 読者が実際にクライアントサイドでソート・フィルタできるテーブル
（ここでの GitBook のテーブル検索/ソートに最も近いもの）が欲しい場合は、
`| Feature | Status |` というパイプ構文を書く代わりに、Alpine に行（row）を
管理させます: データを `x-data` に入れ、`x-for` でレンダリングします:

```markdown title="Sortable table" linenums="1"
<div x-data="{
  query: '',
  sortKey: 'name',
  sortAsc: true,
  rows: [
    { name: 'Bootstrap', type: 'Components', stars: 4 },
    { name: 'GitBook', type: 'SaaS', stars: 5 },
    { name: 'Docusaurus', type: 'React', stars: 4 },
    { name: 'VuePress', type: 'Vue', stars: 3 }
  ],
  sortBy(key) {
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true
    this.sortKey = key
  },
  get sorted() {
    return [...this.rows]
      .filter(r => r.name.toLowerCase().includes(this.query.toLowerCase()))
      .sort((a, b) => {
        const dir = this.sortAsc ? 1 : -1
        return a[this.sortKey] > b[this.sortKey] ? dir : a[this.sortKey] < b[this.sortKey] ? -dir : 0
      })
  }
}">
  <input type="text" x-model="query" placeholder="Filter by name...">
  <table class="table">
    <thead>
      <tr>
        <th @click="sortBy('name')" style="cursor:pointer">Name</th>
        <th @click="sortBy('type')" style="cursor:pointer">Type</th>
        <th @click="sortBy('stars')" style="cursor:pointer">Stars</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="row in sorted" :key="row.name">
        <tr>
          <td x-text="row.name"></td>
          <td x-text="row.type"></td>
          <td x-text="row.stars"></td>
        </tr>
      </template>
    </tbody>
  </table>
</div>
```

次のようにレンダリングされます（ボックスに入力するか、列見出しをクリックしてください）:

<div x-data="{
  query: '',
  sortKey: 'name',
  sortAsc: true,
  rows: [
    { name: 'Bootstrap', type: 'Components', stars: 4 },
    { name: 'GitBook', type: 'SaaS', stars: 5 },
    { name: 'Docusaurus', type: 'React', stars: 4 },
    { name: 'VuePress', type: 'Vue', stars: 3 }
  ],
  sortBy(key) {
    this.sortAsc = this.sortKey === key ? !this.sortAsc : true
    this.sortKey = key
  },
  get sorted() {
    return [...this.rows]
      .filter(r => r.name.toLowerCase().includes(this.query.toLowerCase()))
      .sort((a, b) => {
        const dir = this.sortAsc ? 1 : -1
        return a[this.sortKey] > b[this.sortKey] ? dir : a[this.sortKey] < b[this.sortKey] ? -dir : 0
      })
  }
}">
  <input type="text" x-model="query" placeholder="Filter by name...">
  <table class="table">
    <thead>
      <tr>
        <th @click="sortBy('name')" style="cursor:pointer">Name</th>
        <th @click="sortBy('type')" style="cursor:pointer">Type</th>
        <th @click="sortBy('stars')" style="cursor:pointer">Stars</th>
      </tr>
    </thead>
    <tbody>
      <template x-for="row in sorted" :key="row.name">
        <tr>
          <td x-text="row.name"></td>
          <td x-text="row.type"></td>
          <td x-text="row.stars"></td>
        </tr>
      </template>
    </tbody>
  </table>
</div>

`rows` はページに直接埋め込まれた単なる JS 配列です - ドキュメントが実際に持つ
ような小さな参照用テーブルには十分です。`sorted` は Alpine の `get`ter なので、
キー入力やクリックのたびに追加の配線なしで再フィルタ・再ソートされます。
`sortBy()` は同じ列を2回目にクリックすると向きを切り替えます。ここでの
`<table>` は手書きの本物の `<table>` タグです（row を Alpine に直接渡すパイプ
テーブル構文はありません）- そのため、bx-markdown 自身がレンダリングする他の
どのテーブルとも同じように、自動的に `.bxsites-table-wrap` でラップされ、
[レスポンシブなスクロールと固定ヘッダー](tables.md#レスポンシブなスクロールと固定ヘッダー)
の処理も適用されます。

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
