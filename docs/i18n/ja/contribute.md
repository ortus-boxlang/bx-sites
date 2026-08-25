---
title: 貢献する
order: 2.3
icon: phosphor-duotone:git-pull-request
summary: バグを報告したり、質問したり、プルリクエストを送ったり、プロジェクトを資金面で支援したりする方法。
tags: [概要, 貢献]
---

# 貢献する

BxSites はオープンソースであり、メンテナーは自分の自由な時間を使って
開発と保守を行っています。Issue を立てたりプルリクエストを送ったりする
際は、メンテナーへの配慮をお願いします - 私たちは皆、黄金律に従ってい
ます: 自分がされたいように他人にも接すること。

## 行動規範

このプロジェクトの貢献者・メンテナーとして、私たちは、Issue の報告、
機能要望の投稿、ドキュメントの更新、プルリクエストやパッチの送信、その
他の活動を通じて貢献してくださるすべての方々を尊重することを誓います。

- 参加者は、自分と異なる意見に対して寛容であること。
- 許容されない行動の例には、性的な言葉や画像の使用、侮辱的なコメントや
  個人攻撃、荒らし行為、公的・私的な嫌がらせ、暴言、その他非専門的な
  振る舞いが含まれます。
- プロジェクトのメンテナーは、この行動規範に沿わないコメント、コミット、
  コード、Wiki の編集、Issue、その他の貢献を削除、編集、または拒否する
  権利と責任を有します。
- 他者の言動を解釈する際、参加者は常に善意を前提とすべきです。
- 虐待的、嫌がらせ、その他容認できない行為が発生した場合は、Issue を
  立てるか、1 名以上のプロジェクトメンテナーに直接連絡することで報告
  できます。

## バグ報告

BoxLang 自体は Jira で Issue を管理しており、各モジュール(このモジュ
ールを含む)はそれぞれの GitHub リポジトリで Issue を管理しています。

::: cards
::: card title="BoxLang Jira" icon="phosphor-duotone:kanban" href="https://ortussolutions.atlassian.net/browse/BL/issues"
BoxLang ランタイム自体の Issue はこちら。
:::
::: card title="bx-sites の Issue" icon="phosphor-duotone:bug" href="https://github.com/ortus-boxlang/bx-sites/issues"
このモジュールの Issue はこちら。
:::
:::

良いバグ報告には、タイトル、問題の明確な説明、再現方法、再現に必要な
サポートファイルが含まれています。再現方法が示されていない Issue は
対応されません。

## サポートに関する質問

使い方についての質問、プロフェッショナルサポートの利用、あるいは単に
メンテナーにアイデアを聞いてほしい場合は、Issue を立てずに、以下の
サポートチャンネルをご利用ください。

::: cards
::: card title="Ortus コミュニティ Discourse" icon="phosphor-duotone:chats-circle" href="https://community.ortussolutions.com"
質問したり、既存の議論を閲覧したりできます。
:::
::: card title="Box Slack チーム" icon="phosphor-duotone:slack-logo" href="http://boxteam.ortussolutions.com/"
コミュニティやメンテナーとリアルタイムでチャットできます。
:::
::: card title="プロフェッショナルサポート" icon="phosphor-duotone:headset" href="https://www.ortussolutions.com/services/support"
Ortus Solutions による有償サポートプランです。
:::
:::

## プルリクエストのガイドライン

- `main`/`master` ブランチは最新の安定版リリースのスナップショットです
  - すべての開発は専用ブランチで行い、このブランチに対する PR はクロー
  ズされます。プルリクエストは代わりに `development` ブランチに対して
  送ってください。
- 作業中に小さなコミットを複数積んでも問題ありません - マージ前に自動
  的にスカッシュされます。
- ローカルでのテストが通ることを確認し、変更にはテストを添えてくださ
  い。
- PR を送る際は、タイトルに関連する Jira/GitHub の Issue へのリンクを
  記載してください。

## セキュリティ脆弱性

セキュリティ脆弱性を発見した場合は、公開の Issue を立てないでくださ
い。開発チーム宛に
[security@ortussolutions.com](mailto:security@ortussolutions.com?subject=security)
までメールを送り、あわせて Box Team Slack の `#security` チャンネルにも
報告してください。セキュリティ脆弱性はすべて速やかに対応されます。

## 開発環境のセットアップ

リポジトリをクローンし、`box install` で依存関係をインストールしてく
ださい。ローカルでの開発環境の完全なセットアップとテストの実行方法に
ついては、
[readme のコラボレーションセクション](https://github.com/ortus-boxlang/bx-sites#running-tests)
を参照してください。JDK 21 以上が必要です。

## コーディングスタイル

このプロジェクトは Ortus のコーディング標準に従っており、BoxLang/CFML
コードと Java コードの両方に対応したフォーマッター設定が用意されてい
ます。

```bash frame="terminal" title="Terminal"
# すべてをフォーマット
box run-script format

# ウォッチャーを起動 - 保存時に自動でフォーマット
box run-script format:watch
```

完全なリファレンスは
[Ortus コーディング標準](https://github.com/Ortus-Solutions/coding-standards)
を参照してください。

## 資金面での貢献

BxSites、BoxLang、そして Ortus Solutions のすべてのオープンソース活動
は、Patreon でスポンサーになることで支援できます - スポンサーには
cfcasts アカウントや ForgeBox Pro アカウントなど、ティアに応じた特典
もあります。

<div class="bxsites-hero__actions">
	<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="https://www.patreon.com/c/ortussolutions">Patreon でスポンサーになる</a>
	<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="https://www.paypal.com/paypalme/ortussolutions">PayPal での単発寄付</a>
</div>

## コントリビューター

すでに BxSites に貢献してくださったすべての方々に感謝します - 大好き
です!

<a href="https://github.com/ortus-boxlang/bx-sites/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ortus-boxlang/bx-sites" alt="BxSites のコントリビューター">
</a>
