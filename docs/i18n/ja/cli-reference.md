---
title: CLI リファレンス
order: 3
icon: phosphor-duotone:terminal-window
summary: bxDocs のすべての動詞とフラグ。
tags: [reference, cli]
---

# CLI リファレンス

```bash
bxDocs <verb> [options]
```

`box install bx-docs` を実行すると、スタンドアロンの `bxDocs` スクリプトが `PATH` に配置されます
（`box.json` の `boxlang.executable` 経由）。以下のすべての動詞は短縮形、または
`boxlang module:bxdocs <verb>` のどちらの形式でも実行できます。
`PATH` シムが設定されていない環境（CI ランナー、手動登録のモジュールなど）では長い形式を使用します:

```bash
boxlang module:bxdocs <verb> [options]
```

すべての動詞は `--projectRoot=<path>`（または先頭の位置引数）で、カレントディレクトリ以外の
プロジェクトを対象にできます。以下の 2 つのグローバルフラグはどの動詞の前にも指定できます。

## グローバルオプション

| フラグ | 説明 |
|---|---|
| `-h`, `--help` | 使用方法を表示して終了 |
| `-v`, `--version` | モジュールバージョンを表示して終了 |

## `new`

docs プロジェクトをスキャフォールドします。

```bash
bxDocs new [path] [--name=...] [--theme=bootstrap|material|tailwind] [--description=...] [--format=yaml|json]
```

- `--name` - サイト設定に書き込まれるサイト名（デフォルトはターゲットディレクトリ名）
- `--theme` - デフォルトは `bootstrap`
- `--description` - サイト設定に書き込まれるサイトの説明
- `--format` - `yaml`（デフォルト、`bxdocs.yaml` をスキャフォールド）または `json`（`bxdocs.json` をスキャフォールド）- [設定](configuration.md) を参照

## `build`

`docs/**.md` を `site/` の静的サイトとしてレンダリングします。
検索インデックスのビルド（サイト設定で `search` が `false` でない限り）と、
テーマ + `docs/assets/**` の `site/` へのコピーも行います。

```bash
bxDocs build
```

## `serve`

サイトをビルドし、ライブリロード付きでローカルで配信します。

```bash
bxDocs serve [--port=8080] [--host=127.0.0.1]
```

Ctrl+C で中断するまでフォアグラウンドで実行されます。

## `search-index`

ページの再レンダリングやアセットのコピーを行わずに、`site/search-index.json` を単独で再ビルドします。
`build` は自動的にこのステップを実行するため、通常のビルドの後にこれを実行する必要はありません。
インデックスのみ更新したい場合に使用します。

```bash
bxDocs search-index
```

## `clean`

`docs/` とサイト設定はそのままで、`site/` とビルドキャッシュを削除します。

```bash
bxDocs clean
```

## `gh-deploy`

サイトをビルドし、`gh-pages` スタイルのブランチに強制プッシュします。
デプロイごとに 1 コミット、そのブランチに蓄積された履歴はなく、mkdocs 独自の
`mkdocs gh-deploy` の慣習に合わせています。プロジェクトがリモートを設定した
git リポジトリである必要があります。現在のブランチや作業ツリーには一切触れません
（プッシュは使い捨ての `git worktree` から行います）。

```bash
bxDocs gh-deploy [--branch=gh-pages] [--remote=origin] [--message="..."]
```

- `--branch` - デフォルトは `gh-pages`
- `--remote` - デフォルトは `origin`
- `--message` - ブランチの単一コミットメッセージ。デフォルトは `"Deploy site via bxDocs gh-deploy"`

完全な GitHub Pages の設定（Pages のブランチ有効化、`baseURL` など）については
[デプロイ](guides/deployment.md) をご覧ください。

## `migrate`

GitBook のエクスポート（`SUMMARY.md` の目次とその `.md` ファイル、GitBook 独自のオンディスク同期形式）を
このプロジェクトの `docs/` ツリーに変換します。`SUMMARY.md` は `docs/nav.json` になり、
`{% block %}` 構文は bx-docs の同等物（`::: name` ディレクティブ、または
より近い一致が既にある場合は `=== "Title"` タブ / `!!! type` admonition 構文）になります。
`README.md` ファイルは `index.md` になり、`.gitbook/assets/**` は `docs/assets/gitbook/` にコピーされます。

```bash
bxDocs migrate --source=/path/to/gitbook-export
```

- `--source`（必須）- GitBook エクスポートのルートディレクトリへのパス（`SUMMARY.md` を含む必要があります）

変換されたページ数のサマリと、自動変換できなかった箇所の詳細リストを出力します。
認識できないブロックは移行済みファイルの元の `{% %}` 構文のままで残るため、
コンテンツが失われることはありません。移行済みの出力をコミットする前に確認してください。
