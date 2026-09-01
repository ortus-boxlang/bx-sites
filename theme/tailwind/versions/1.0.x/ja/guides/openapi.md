---
title: OpenAPI / Swagger
order: 4.6
icon: phosphor-duotone:plug
tags: [ガイド, openapi, api]
---

# OpenAPI / Swagger

OpenAPI/Swagger 仕様に対するインタラクティブな
[Swagger UI](https://swagger.io/tools/swagger-ui/) ウィジェットです。
[コンテンツブロック](content-blocks.md) のどのブロックとも同じ
`::: name ... :::` コンテナ構文を使います。`src` は `::: file` の `src`（[コンテンツブロック](content-blocks.md#ファイル)
参照）と同じく、`docs/assets/` からの相対パスとして解決されます。
JSON・YAML どちらの仕様ファイルにも対応しており、Swagger UI が
クライアント側で完全にパースします - このモジュールのどこにもサーバー側
での OpenAPI パースは存在しません。`bxsites.yaml` の
[`openapi`](../configuration.md#openapi) を `true` に設定する必要があります
- 設定されていない場合、このプレースホルダーはレンダリングされますが動作
しません（Swagger UI 自体の JS/CSS が `site/` に一切コピーされないため、
この機能を使わない他のすべてのプロジェクトのビルドサイズはこれまでどおり
小さいままです）:

```markdown title="例" linenums="1"
::: openapi src="assets/openapi/example.yaml" title="Bookshelf API"
:::
```

::: openapi src="assets/openapi/example.yaml" title="Bookshelf API"
:::

上のウィジェットはまさにこのページ自身がライブでレンダリングしているもの
で、このガイドが同梱する小さなサンプル仕様
`docs/assets/openapi/example.yaml` を表示しています - 自分のプロジェクトの
`docs/assets/` 配下に置いて開く（あるいは `src` を既存の自分の仕様ファイル
に向ける）ことで、自分の API についても同じように表示できます。

同梱(ベンダリング)しているのは `SwaggerUIBundle` 自体のベースレイアウトの
みです - 別の仕様を入力できるトップバー/「Explore」バーは含まれません
（`::: openapi` ブロックは、著者が指定した唯一の仕様を常に表示するように
意図されているためです）。そのため、各オペレーションとそのリクエスト/
レスポンススキーマ、そして「Try it out」（訪問者のブラウザから仕様自身の
`servers[0].url` へ直接呼び出します - そのサーバーがドキュメントのホスト元
からの CORS を許可していることを確認してください）は、何も書き換えること
なく既存の仕様からそのままレンダリングされます。

## エンドポイント1件をインライン表示

`operation="METHOD /path"` を追加すると、そのエンドポイント1件だけを通常の
ページ内にそのまま配置できます - チュートリアルの途中で、読者を完全な
リファレンスへ送り出すことなく使えて便利です:

```markdown title="例" linenums="1"
::: openapi src="assets/openapi/example.yaml" operation="GET /books"
:::
```

::: openapi src="assets/openapi/example.yaml" operation="GET /books"
:::

上のフルブロックとまったく同じ Swagger UI ウィジェットです（同じ仕様、
同じくクライアント側のみのレンダリング - `operation` もこちら側で
OpenAPI パースを一切トリガーしません）。Swagger UI 自身がすでにレンダリング
済みのマークアップを読み取ることで、他のすべてのオペレーションは単に
非表示にされ、このオペレーションだけが自動的に展開されます。`operation`
のメソッドは大文字小文字を区別しませんが、パスは仕様自身のパス
（`{param}` プレースホルダーも含めて）と完全に一致する必要があります。

## 仕様ファイルなしで API をドキュメント化する

`::: openapi` には常に `src` に実在する OpenAPI/Swagger ドキュメントが
必要です - 1件のエンドポイントを手書きで説明するための、仕様ファイル不要
の手動版ブロックは存在しません。代わりに、常に実際の仕様をインポートして
ください。まだ仕様がない場合は:

- 今いるページに必要な分だけ仕様を書きます。最小限の `info`/`servers`
  を伴う `paths` の1エントリだけでも（`docs/assets/openapi/example.yaml`
  を見ると、実際にどれだけ少なくて済むかがわかります）、そのエンドポイント
  1件分のインタラクティブなウィジェットと「Try it out」が手に入ります -
  後から完全な仕様へ育てていけばよく、ブロック自体は何も変わりません。
- あるいはウィジェットを使わず、通常のコンテンツとしてエンドポイントを
  説明します - パラメータの表や、リクエスト/レスポンスの
  ```` ```http ````/```` ```json ```` コードブロックのペアを、必要なら
  [ステッパー](content-blocks.md#ステッパー) で手順化します。`openapi`
  が有効かどうかに関わらず、他のすべてのコンテンツブロックと Markdown
  拡張機能はどのページでも使えます。
