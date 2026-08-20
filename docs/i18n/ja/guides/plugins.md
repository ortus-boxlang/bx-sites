---
title: プラグイン
order: 6
tags: [guides, plugins]
---

# プラグイン

BX Docs プラグインは単なる別の BoxLang モジュールです。`box.json` + `ModuleConfig.bx` を持ち、
`bx-docs` と同じランタイムの兄弟としてインストールされます（`box install` でプロジェクトに追加、
`bx-markdown`/`bx-esapi` と同様）。インポートする Plugin API も、専用レジストリも不要です。
BoxLang 独自のモジュールシステムが*そのまま*プラグインシステムになっています。

ただし、モジュールをインストールしただけではプラグインとして有効化されません。
プロジェクトが `bxdocs.json` の [`plugins`](../configuration.md#plugins) 配列に BoxLang モジュール名を
明示的に追加することでオプトインする必要があります:

```json
{ "plugins": [ "myBxDocsPlugin" ] }
```

## プラグインの作成

プラグインモジュールが通常の BoxLang モジュールに追加で必要なのは `models/BxDocsPlugin.bx` クラスだけです。
すべてのメソッドはオプションです。必要なフックのみを実装してください。BX Docs は呼び出す前に
各フックの存在をチェックします:

```bx
// models/BxDocsPlugin.bx
class {

	struct function onConfig( required struct config ) {
		// bxdocs.json が読み込まれた直後にサイト設定を変更/返す。
		return arguments.config
	}

	string function onPageMarkdown( required string markdown, required struct page, required struct config ) {
		// 変換前のページの生 Markdown を変更する。
		return arguments.markdown
	}

	string function onPageHtml( required string html, required struct page, required struct config ) {
		// 変換後のページのレンダリング済み HTML を変更する。
		return arguments.html
	}

	array function onNav( required array nav, required struct config ) {
		// ナビゲーションツリーを変更する。
		return arguments.nav
	}

	void function onBuildComplete( required string siteDir, required struct config ) {
		// すべてが siteDir に書き出された後、一度だけ実行される。戻り値なし。
	}

}
```

フックは `bxdocs.json` の `plugins` 配列の順序で実行され、各フックの戻り値（`onBuildComplete` 以外）が
次のフック（または BX Docs 自体）が受け取る値を置き換えます。変更がない場合は受け取った値をそのまま
返すだけで構いません。

## 最小限の例

このリポジトリの `examples/hello-plugin/` は完全に動作するプラグインモジュールです。
`box install` ですぐに使えます。すべてのページに `<!-- rendered by hello-plugin -->` コメントを追加し、
ビルド完了後に `site/hello-plugin.txt` にビルドサマリを追記します。
フォルダレイアウトの実例として活用してください:

```
hello-plugin/
├── box.json              # boxlang.moduleName が bxdocs.json の [plugins] から参照される名前
├── ModuleConfig.bx        # 通常の（そうでなければ空の）BoxLang モジュールディスクリプタ
└── models/
    └── BxDocsPlugin.bx    # onPageHtml() + onBuildComplete()
```

## エラー

- `BxDocs.PluginNotFound` - `bxdocs.json` の `plugins` 配列内の名前がインストール/有効化された
  BoxLang モジュールでない場合。
- `BxDocs.InvalidPlugin` - モジュールは存在するが、`models/BxDocsPlugin.bx` クラスがない場合。
