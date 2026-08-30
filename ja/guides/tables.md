---
title: テーブル
order: 4.6
icon: phosphor-duotone:table
tags: [guides, markdown]
---

# テーブル

[Markdown 拡張機能](markdown.md) のすべてに加えた、標準の
[GFM](https://github.github.com/gfm/#tables-extension-) パイプテーブルです -
`bxsites.yaml` の設定は不要で、常に有効です:

```markdown title="Example" linenums="1"
| Feature      | Community | Enterprise |
| ------------ | :-------: | ---------: |
| Themes       |    10     |         10 |
| Multi-locale |    Yes    |        Yes |
| Support      |  Forums   |     24/7   |
```

これは次のようにレンダリングされます:

| Feature      | Community | Enterprise |
| ------------ | :-------: | ---------: |
| Themes       |    10     |         10 |
| Multi-locale |    Yes    |        Yes |
| Support      |  Forums   |     24/7   |

見出しの下にある `---` の行がテーブルを有効にします。その区切り行にコロンを
付けることで、列ごとの配置を制御できます - `:---` は左寄せ、`:---:` は
中央寄せ、`---:` は右寄せです（コロンをまったく付けない場合はすべての列が
左寄せになります）。

## セルの内容は通常のインライン Markdown

`code`、**太字**、*斜体*、[リンク](../index.md) は、ページの他の場所と
まったく同じように、セルの中でもそのまま使えます:

```markdown title="Example" linenums="1"
| Setting | Value |
| --- | --- |
| Default theme | `bootstrap` |
| Docs | [Themes guide](themes.md) |
| Status | **Stable** |
```

これは次のようにレンダリングされます:

| Setting | Value |
| --- | --- |
| Default theme | `bootstrap` |
| Docs | [Themes guide](themes.md) |
| Status | **Stable** |

## セル内のパイプをエスケープする

セル自身のプレーンテキストの中にあるリテラルな `|` はバックスラッシュ
（`\|`）が必要です - エスケープされていない `|` は次の列の区切りとして
読み取られてしまいます:

```markdown title="Example" linenums="1"
| Expression | Meaning |
| --- | --- |
| a \| b | bitwise OR |
```

これは次のようにレンダリングされます:

| Expression | Meaning |
| --- | --- |
| a \| b | bitwise OR |

インラインコードの中の `|` はまったくエスケープが不要です - コードスパン
（`` `a | b` ``）がすでにそれを保護しているためです:

| Expression | Meaning |
| --- | --- |
| `a | b` | bitwise OR |

## 短い行と長い行

データ行は見出しの列数と厳密に一致していなくても構いません - 短い行は空の
セルで埋められ、長い行は余分なセルが黙って破棄されます。どちらも下記の
`tableOptions.appendMissingColumns`/`discardExtraColumns` で制御されます:

```markdown title="Example" linenums="1"
| One | Two | Three |
| --- | --- | --- |
| a | b |
| c | d | e | f |
```

これは次のようにレンダリングされます:

| One | Two | Three |
| --- | --- | --- |
| a | b |
| c | d | e | f |

## パース設定

短い行/長い行の扱い、`---` 区切り行自体の厳密さ、そしてレンダリングされる
すべての `<table>` が持つ CSS クラスは、いずれも `bxsites.yaml` の
[`markdown.tableOptions`](../configuration.md#markdown) で制御されます -
このページ全体で示しているデフォルト値でほとんどの場合は十分です。

## レスポンシブなスクロールと固定ヘッダー

レンダリングされる各テーブルは、`bxsites.yaml` の設定も追加の markdown も不要で、
自動的に `.bxsites-table-wrap` div でラップされます。これにより、幅の広い
テーブルはページ全体からはみ出す代わりに独自の横スクロールバーを持ち、丈の高い
テーブルは（`max-height` を超えた分だけ）固定の高さに収められて独自の縦スクロール
バーを持ち、見出し行はその場に固定されたまま本文だけが下でスクロールします -
上記のような短いテーブルは、すでに収まっているため、スクロールバーがまったく
生成されません。カスタムの `theme/` オーバーライドは、他の CSS クラスと同様に
`.bxsites-table-wrap`（とりわけその `max-height`）を再スタイリングできます。

## プレーンなデータの先へ

プレーンなテーブルの上に、さらに次の2つのレシピを直接組み合わせられます:

- セル内のステータスチップやスターレーティングが必要ですか？
  [ビジュアライザーのレシピ](variables-and-functions.md#ビジュアライザーのレシピ)
  を参照してください。
- 読者に実際にテーブルをクライアントサイドでソート・フィルタさせたい、
  単に読ませるだけでは足りない場合は？[ソート・フィルタ可能なテーブル](interactivity.md#ソートフィルタ可能なテーブル)
  を参照してください。
