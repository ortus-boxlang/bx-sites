---
title: GitHub Pages へのデプロイ
order: 3
tags: [ガイド, デプロイ]
---

# GitHub Pages へのデプロイ

`site/` は静的ファイルを配信できる場所であればどこにでもホストできます。
このモジュールには GitHub Pages への直接公開用の、すぐに使える GitHub Actions ワークフロー
（`.github/workflows/pages.yml`）が付属しています。`main` と `development` が
同じサイトの独立して稼働する 2 つのバージョンとして公開されます。

CI の設定がまったくないよりシンプルな単一バージョンのプロジェクトには、
[`bxSites gh-deploy`](../cli-reference.md#gh-deploy) で `site/` を `gh-pages` ブランチに
一つのコマンドでビルドして Push できます（公開したいときに自分のマシンから実行するだけで、
ワークフローファイルも不要です）。このガイドの残りは、このリポジトリ自体が使用している
GitHub Actions ワークフロー（毎回の Push で自動マルチバージョン公開）について説明します。

## 動作内容

`docs/`、`bxsites.json`、またはモジュール自体のソース（テーマ/パイプラインの変更）に
触れる `main` または `development` へのすべての Push で、ワークフローが:

1. BoxLang + [bx-markdown](https://github.com/ortus-boxlang/bx-markdown) をインストール
2. このリポジトリをモジュールとして登録して `boxlang module:bxSites build` を解決
3. `main` 以外のブランチでは、このビルドのみ `baseURL` を `.../<branch-name>/` に設定
   （[以下を参照](#2-つのバージョンを同時に公開)）
4. `boxlang module:bxSites build` を実行
5. `site/` を `gh-pages` ブランチに Push（`main` はサイトルート、`development` は `/development/`）、
   もう一方のバージョンには触れません

Actions タブから手動トリガー（`workflow_dispatch`）でも利用可能で、
新しいコミットなしに一回限りの再公開ができます。

## 初回セットアップ

ワークフローが公開できるようにする前に、GitHub Pages を `gh-pages` ブランチに向ける必要があります。
これはリポジトリの設定で行うもので、ワークフローファイルだけでは有効にできません。
最初の成功したランが `gh-pages` を作成するため、ワークフローが少なくとも一度実行されてから行います:

1. **Settings → Pages**
2. **Build and deployment → Source** で **Deploy from a branch** を選択
3. **Branch** で **gh-pages** と **/ (root)** を選択

それ以降、一致するすべての Push が自動的にビルドおよびデプロイされます。
最初のデプロイ完了後に **Settings → Pages** に公開 URL が表示されます。

## 2 つのバージョンを同時に公開

`main` はサイトルート（`https://<user>.github.io/<repo>/`）に公開されます（安定版/リリース済みドキュメントとして扱います）。
`development` は `/development/`（`https://<user>.github.io/<repo>/development/`）に公開されます（最新の未リリースドキュメント）。
両方が同時に稼働し続けます: 各ブランチのジョブは `keep_files: true` と独自の `destination_dir` を使用して
`gh-pages` にのみ Push するため、`development` のデプロイが `main` のコンテンツを上書きすることはなく、
その逆も同様です。

3 番目のブランチを追加するには（例: `release/2.0` プレビュー）、`on.push.branches` リストに追加し、
`destination_dir: release-2.0`（または類似）を使用した `if: github.ref_name == '...'` デプロイステップを追加します。

## 独自プロジェクトへの応用

`.github/workflows/pages.yml` を独自のプロジェクトにコピーし（プロジェクトが `bx-markdown` 以外を
必要とする場合は `modules:` 行を調整し）、上記のように Pages を有効化すると、
`main`/`development` への Push が同様に公開されます。単一の公開バージョンのみが必要な場合は、
必要のないブランチを `on.push.branches` とその対応するデプロイステップから削除します。

## プロジェクト Pages のサブパスからの配信

GitHub の *プロジェクト* Pages サイト（*ユーザー* サイトとは異なり）は
`https://<user>.github.io/<repo>/` から配信されます（ドメインルートではありません）。
`bxsites.json` の `baseURL` をその完全な URL に設定して、すべての内部リンク、アセット、
ナビゲーションエントリに必要な `/<repo>/` プレフィックスが付くようにしてください。
また、実際の `sitemap.xml` も生成されます:

```json
{ "baseURL": "https://<user>.github.io/<repo>/" }
```

`baseURL` が何をするかの完全な詳細については [設定](../configuration.md#baseurl) を参照してください。
