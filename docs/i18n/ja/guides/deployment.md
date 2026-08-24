---
title: GitHub Pages へのデプロイ
order: 3
icon: phosphor-duotone:cloud-arrow-up
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

`docs/`、`bxsites.yaml`、またはモジュール自体のソース（テーマ/パイプラインの変更）に
触れる `main` または `development` へのすべての Push で、ワークフローが:

1. BoxLang + [bx-markdown](https://github.com/ortus-boxlang/bx-markdown) をインストール
2. このリポジトリをモジュールとして登録して `boxlang bxSites build` を解決
3. `main` 以外のブランチでは、このビルドのみ `baseURL` を `.../<branch-name>/` に設定
   （[以下を参照](#2-つのバージョンを同時に公開)）
4. `boxlang bxSites build` を実行
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
`bxsites.yaml` の `baseURL` をその完全な URL に設定して、すべての内部リンク、アセット、
ナビゲーションエントリに必要な `/<repo>/` プレフィックスが付くようにしてください。
また、実際の `sitemap.xml` も生成されます:

```yaml title="bxsites.yaml"
baseURL: "https://<user>.github.io/<repo>/"
```

`baseURL` が何をするかの完全な詳細については [設定](../configuration.md#baseurl) を参照してください。
`<user>.github.io` ユーザーサイト、またはサイトルートにマッピングされたカスタムドメインの
場合は、`baseURL` をデフォルト（`/`）のままにしておけます。

## サイトへのアクセスを制限する

ここには組み込みのアクセス制御はありません - bx-sites が生成するのはあくまで
プレーンな静的 `site/` であり、静的ファイルには「誰がリクエストしているか」という
概念がありません。`bxsites.json` の [`robots: false`](../configuration.md#robotstxt) は、
行儀の良いクローラーにビルドをインデックスしないよう伝えます（検索結果に出したくない
ステージング/プレビューデプロイに便利です）が、これはあくまで丁重なお願いであって
鍵ではありません - URL を持っている人には引き続き機能します。実際にアクセスを
制限する必要がある場合、それは静的ファイルの手前、つまりそれを配信しているホスト側で
行う必要があります - よくある、静的サイトに適した選択肢をいくつか挙げます:

- **Cloudflare Pages/Access** - デプロイしたサイトを
  [Cloudflare Access](https://developers.cloudflare.com/cloudflare-one/policies/access/)
  ポリシー（メールアドレスの許可リスト、SSO、またはワンタイム PIN）の背後に置きます -
  アプリケーションコードは一切不要です。
- **Netlify** - サイト設定だけで使える組み込みの
  [パスワード保護](https://docs.netlify.com/manage/security/secure-access-to-sites/site-protection/)
  で、サイト単位/デプロイ単位のどちらでも設定できます。
- **小さなリバースプロキシ**（任意のホスト）- 静的ファイルの手前に HTTP Basic 認証
  （`.htpasswd` 形式のルール、または一つのファイルで済む Cloudflare Worker/Netlify
  Edge Function）を置けば、「検索エンジンや無関係な人を締め出す」目的には十分です -
  ただし、サインイン済みアプリが持つような本物のユーザーごとの識別ではありません。

これらはいずれも bx-sites 自体の機能ではありません - `site/` の配信先ホストの側で
有効にする、ホストレベルの設定です。
