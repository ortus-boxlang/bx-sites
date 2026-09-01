---
title: データファイル
order: 12.5
icon: phosphor-duotone:database
tags: [ガイド, データ]
---

# データファイル

[再利用可能な変数](variables-and-functions.md#reusable-variables) は、`company` や
`supportEmail` のようなフラットで一度きりの事実には最適ですが、チームの名簿、
料金表、機能比較表のような、実際に「形」を持つものには扱いにくくなります。
**データファイル** はそのギャップを埋めます - プロジェクトに
`docs/data/*.yaml`/`.yml`/`.json` ファイルを置くだけで、その内容全体 - オブジェクト
でも配列でも、好きな形で構いません - が、どのページからでも `data.<file>` として、
`variables`/`page` がすでに使っているのと同じ `{{ }}` 構文で参照できるようになります。

## 規約

`docs/data/` フォルダを追加します。各ファイルのベースネーム（拡張子を除いたもの）が、
`data` の下の1つのトップレベルキーになります:

```text title="docs/ layout"
docs/
├── index.md
└── data/
    ├── team.yaml
    └── pricing.json
```

```yaml title="docs/data/team.yaml"
- name: Luis Majano
  role: CEO
- name: Jon Clausen
  role: CTO
```

```json title="docs/data/pricing.json"
{
	"free": { "price": 0, "seats": 3 },
	"pro": { "price": 29, "seats": 20 }
}
```

`data.team` はそのまま先ほどの配列となり、`data.pricing.pro.price` はネストした
その数値になります - ファイルのパース済みルートは、オブジェクトであれ配列であれ、
パースされたまま正確にそのまま使われ、従うべき固定の形はありません。
`docs/data/` フォルダが一切ない場合は、単に `data` が存在しないだけです - これは
[`docs/functions.bxs`](variables-and-functions.md#magic-functions)/
[`docs/blog/authors.yml`](blog.md) がすでに採用している、存在すればオプトインされる
のと同じ形です。

その内容は、通常の Markdown からドット区切りのパスで参照できます:

```markdown title="docs/pricing.md"
The Pro plan is **${{ data.pricing.pro.price }}/mo** for up to
{{ data.pricing.pro.seats }} seats.
```

ビルドすると次のようになります:

```html
<p>The Pro plan is <strong>$29/mo</strong> for up to 20 seats.</p>
```

同じベースネームを持つファイルが拡張子違いで複数存在する場合（`products.yaml` と
`products.json` の両方がある場合）、`.yaml` が優先され、次に `.yml`、最後に
`.json` の順になります - 実運用では、この優先順位に頼るのではなく、ベースネーム
ごとに1つの形式を選ぶようにしてください。

## データを利用する

スカラーの `{{ data.x.y }}` 参照は、`{{ }}` がすでに機能するあらゆる場所で動作
しますが、チームのグリッドや料金表のような実際のコンテンツでは、たいてい
`data.*` に対するループが必要になります。そのループがどこに属するかに応じて、
3つの方法があります:

### テーマオーバーライドの中で

プロジェクトが `theme/` オーバーライドを持つと（[テーマ](themes.md#overriding-a-theme)
を参照）、`data` は `page`/`siteConfig` がすでにそうなっているのと同じように、
裸のまま `layout.bxm`/`page.bxm` にバインドされます - `{{ }}` は不要で、本物の
BoxLang だけです:

```bx title="theme/layout.bxm (excerpt)"
<ul class="footer-sponsors">
<bx:loop array="#data.sponsors#" index="sponsor">
	<li>#encodeForHTML( sponsor )#</li>
</bx:loop>
</ul>
```

これは、特定の1ページのコンテンツというより、*すべての* ページに属するデータ
（フッターのスポンサー一覧、サイト全体のナビバッジなど）にとって自然な
置き場所です。

### マジック関数から

[マジック関数](variables-and-functions.md#magic-functions) も `data` を裸のまま
読み取れます（`page`/`siteConfig` などと同じ「サポート変数」の1つです）- 本物の
BoxLang でそれをループ/分岐させ、Markdown/HTML の断片を返せます:

```bx title="docs/functions.bxs"
function $team() {
	var html = ""
	for ( item, idx in data.team ) {
		html &= "- **" & encodeForHTML( item.name ) & "** - " & encodeForHTML( item.role ) & char( 10 )
	}
	return html
}
```

```markdown title="docs/about.md"
## Our team

{{ $team() }}
```

これはサーバーサイドで、ビルド時にレンダリングされます - 下記の Alpine の
レシピとは異なり、JavaScript なしで検索クローラーにも見えます。

### Markdown 内で直接、`::: for`/`::: if` を使う

マジック関数をまったく必要としないループや単純な真偽チェックであれば、
[`::: for`/`::: if`](content-blocks.md#loop-and-conditional-data-driven) が
Markdown から直接使えます:

```markdown title="docs/team.md" linenums="1"
::: for member, idx in data.team
{{ idx }}. **{{ member.name }}** - {{ member.role }}
:::
```

`::: for <item>, <index> in <dotted.path>` は、`<dotted.path>` が何に解決される
かに応じて、BoxLang 自身のネイティブな2変数版 `for` ループのセマンティクスを
使って `<item>`/`<index>` をバインドします - 配列なら要素 + 1始まりのインデックス、
構造体ならキー + 値というように、どちらの場合も*まったく同じ*構文です（配列か
構造体かで自分で分岐を書く必要はありません）:

```markdown title="Iterating a struct" linenums="1"
::: for name, enabled in data.flags
- {{ name }}: {{ enabled }}
:::
```

`::: if <dotted.path>` は、解決された値が真の場合にのみ自身のコンテンツを
レンダリングします（空の配列/構造体/文字列、`0`、`false` はすべて偽として
扱われます）:

```markdown title="Example" linenums="1"
::: if data.flags.betaBanner
このビルドではベータ機能が有効になっています。
:::
```

`::: if` の直後に `::: elseif <dotted.path>`（何個でも）と、末尾に裸の
`::: else` を連ねることで、本物の `if`/`elseif`/`else` セマンティクスになります -
最初に真になった条件が採用され、`::: else` は残りすべてを引き受け、あとに続く
分岐自身の条件は、自分の番が来るまでは解決すらされません。連鎖全体は末尾の
1つの `:::` で閉じます - `::: elseif`/`::: else` 自体が直前の分岐の終わりを
示すため、それぞれの手前に `:::` を書く必要はありません（そのように明示的に
書きたい場合でも、それでも動作はします）:

```markdown title="Example" linenums="1"
::: if data.flags.darkModeDefault
ダークモードがデフォルトで有効になっています。
::: elseif data.flags.betaBanner
ベータ機能は有効になっていますが、ダークモードはデフォルトでは有効ではありません。
::: else
このビルドには特に変わったところはありません。
:::
```

どちらの本文にも、通常の Markdown や、ネストした `::: for`/`::: if` を含む他の
コンテンツブロックを入れることができます。文法は意図的に狭く絞られており、
`{{ }}` 自身と同じです - この最初のバージョンでは、ドット区切りのパスのみで、
比較演算子（`==`、`&&`、...）はありません。本物の比較が必要な場合は、代わりに
（上記の）マジック関数を使ってください - そちらはすでに BoxLang をフルに使えます。

### Alpine で、クライアントサイドから（`x-data`）

[インタラクティビティ](interactivity.md) はすでに、生の `x-data`/`x-for` HTML を
Markdown に直接書き込む方法をカバーしています。手書きの JS 配列の代わりに
`data.*` からそれを供給するには、`data.*` を安全な HTML 属性値に変換するだけで
済みます。`jsonSerialize()` だけでは不十分です - その結果は、`"..."` で
クォートされた属性の中に安全に収まるために、さらに HTML 属性エンコードが
必要です（ColdBox 自身の `attribute()`/`forAttribute()` ヘルパーが使うのと
同じ2段階のレシピです）- そのため、自分自身の `functions.bxs` の中で、一度だけ
1行のヘルパーを定義してください:

```bx title="docs/functions.bxs"
function $jsonAttr( required any value ) {
	return encodeForHtmlAttribute( jsonSerialize( arguments.value ) )
}
```

`encodeForHtmlAttribute()` は bx-esapi 由来で、これはすでにすべての bx-sites
プロジェクトの依存関係です - 新しい依存関係は不要で、このレシピを使うだけです。
続いて、Markdown では:

```markdown title="docs/team.md" linenums="1"
<div x-data="{ team: {{ $jsonAttr(data.team) }} }">
  <template x-for="member in team" :key="member.name">
    <li x-text="member.name + ' - ' + member.role"></li>
  </template>
</div>
```

`x-data` の周りではプレーンな二重引用符がそのまま安全に使えます -
`encodeForHtmlAttribute()` がすでにその衝突を処理しているため、シングル
クォートによる回避策は不要です。これは、クライアントサイドだけでレンダリング
される唯一の経路です（JavaScript を無効にした読者や検索クローラーには何も
見えません）- コンテンツが JavaScript なしでも見える必要がある場合は、代わりに
マジック関数か `::: for` を使ってください。

## なぜ Markdown 内の BoxLang テンプレートではなく、データファイルなのか？

これを設計する過程で、関連するより大きな疑問が持ち上がりました: 狭い
`::: for`/`::: if` を追加し、それ以上のことはマジック関数に頼らせる代わりに、
なぜ Markdown 自体を本物の BoxLang テンプレート（ループ、条件分岐、任意の
ロジック）にしてしまわないのか？ 理由は2つあります:

- **信頼境界。** `docs/**.md` は、多数の/外部の/信頼度の低い貢献者によって
  日常的に編集される唯一の成果物です（ドキュメント PR）。`docs/functions.bxs`
  は、*プロジェクトオーナー* が明示的に作成する唯一の成果物です。すべての
  `.md` ファイルを本物の BoxLang テンプレートとしてコンパイルしてしまうと、
  その境界が崩れてしまいます - ドキュメント PR を開けるだけの貢献者が、
  単なる Markdown テキストではなく、任意の BoxLang 実行（ファイル I/O、
  環境アクセス）を手に入れることになってしまいます。
- **失敗モード。** 今日、一致しない `{{ }}` はリテラルテキストとしてそのまま
  残ります - タイプミスがビルドを壊すことは決してありません。BoxLang
  テンプレートのコンパイルエラーはハードな失敗です。`::: for`/`::: if` も
  同じ寛容な形を保っています（解決できないパスは、静かに誤ってコンパイル
  されるのではなく、タイプミスをきちんと捕捉する明確なエラーを送出します -
  [エラー](#errors) を参照）。

データファイルは、どちらのトレードオフも払うことなく、実際のギャップ
（構造化されたコンテンツと、それに対するループ/条件分岐）を埋めます:
Markdown 自体は `{{ }}` で置換されるまで不活性なままであり、`functions.bxs`
は本物の BoxLang ロジックへの、明示的に信頼された唯一の抜け道であり続けます。

## スコープ

- `docs/data/` はプロジェクト全体のもので、一度だけ読み込まれます - これは
  [`functions.bxs`](variables-and-functions.md#scope) がすでに持っているのと
  同じ、単一読み込みのスコープです。すべてのバージョン/ロケールツリーが同一の
  `data` を見ます。このバージョンでは、バージョンごと/ロケールごとの
  オーバーライドやマージはありません。`docs/data/` を
  `docs/versions/<name>/` や `docs/i18n/<code>/` に複製しないでください -
  そこからは読み込まれません。
- フラットなディレクトリのみです - このバージョンでは `docs/data/` への
  サブフォルダの再帰はありません。これは [`docs/blog/authors.yml`](blog.md)
  がすでに持っている「ちょうど1ファイル」という形と同じです。
- `data` は、`page` がすでにそうであるのと同じように、予約された `{{ }}` の
  名前です（[予約された名前](variables-and-functions.md#reserved-names) を
  参照）- もしプロジェクトが何らかの形で `bxsites.yaml` の `variables.data`
  エントリを宣言していたとしても、それが優先されるのではなく、
  `docs/data/` 自身の構造体によって覆い隠されます。同じ理由で、
  `docs/functions.bxs` も `data` という名前の関数を宣言することはできません。

## エラー

- `BxSites.InvalidDataFile` - `docs/data/*.yaml`/`.yml`/`.json` ファイルの
  パースに失敗した場合（YAML/JSON の構文エラー）。問題のファイル名が
  示されます。
- `BxSites.UnknownVariable` - `{{ data.x.y }}`（または `::: for`/`::: if`
  のパス）が、実際の `docs/data/` の内容に対して解決できない場合。
- `BxSites.InvalidForTarget` - `::: for` 自身のパスが、配列でも構造体でも
  ない何かに解決された場合（ループできません）。
