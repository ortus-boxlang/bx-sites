---
title: BxSites について
order: 2.1
icon: phosphor-duotone:info
summary: BxSites とは何か、誰が開発しているか、プロジェクトの所在地について。
tags: [概要, プロジェクト]
---

# BxSites について

BxSites は [BoxLang](https://boxlang.io) で書かれた汎用の
**静的サイトジェネレーター**です。`docs/` フォルダーを指定するだけで、
テーマと検索機能を備えた静的サイトが得られます。リファレンスドキュメント、
ブログ、マーケティングサイト、ナレッジベースなど、どれを作る場合でも同じ
ツールキットを使えます。[bx-markdown](https://github.com/ortus-boxlang/bx-markdown)
の上に構築されており、[mkdocs](https://www.mkdocs.org/) の精神を受け継い
でいます。このサイト自体も、BxSites によって、その `docs/` フォルダー内の
Markdown ファイルからビルドされています。

::: cards
::: card title="GitHub リポジトリ" icon="phosphor-duotone:github-logo" href="https://github.com/ortus-boxlang/bx-sites"
完全なソースコード、リリース履歴、プロジェクトに関するその他すべて。
:::
::: card title="Issue を報告する" icon="phosphor-duotone:bug" href="https://github.com/ortus-boxlang/bx-sites/issues"
コードにバグを見つけましたか? GitHub の Issue トラッカーに報告してく
ださい。
:::
::: card title="ライセンス" icon="phosphor-duotone:scroll" href="license.md"
BxSites は無料でオープンソースであり、Apache 2.0 ライセンスの下で
提供されています。
:::
::: card title="貢献する" icon="phosphor-duotone:git-pull-request" href="contribute.md"
バグの報告方法、変更の提案方法、サポートの受け方について。
:::
:::

## 誰が開発しているか

<div class="bxsites-ortus-logo">
	<img class="bxsites-ortus-logo__light" src="assets/ortus-logo-full-light.svg" alt="Ortus Solutions, Corp">
	<img class="bxsites-ortus-logo__dark" src="assets/ortus-logo-full-dark.svg" alt="Ortus Solutions, Corp">
</div>

<style>
.bxsites-ortus-logo { margin: 0.5rem 0 1.5rem; }
.bxsites-ortus-logo img { max-width: 260px; width: 100%; height: auto; }
.bxsites-ortus-logo__dark { display: none; }
[data-theme="dark"] .bxsites-ortus-logo__dark { display: inline-block; }
[data-theme="dark"] .bxsites-ortus-logo__light { display: none; }
</style>

BxSites は [BoxLang](https://boxlang.io)、
[ColdBox](https://coldbox.ortusbooks.com/)、
[CommandBox](https://commandbox.ortusbooks.com/) をはじめとする BoxLang
エコシステムの開発元である
[Ortus Solutions, Corp](https://www.ortussolutions.com) によって開発・
保守されています - BxSites 自体が動作するランタイムを構築しているのも
同じチームです。

CFML、そして現在は BoxLang エコシステム向けのオープンソースツールを
構築・サポート・提供してきた**20 年以上**の実績を持つ Ortus Solutions
は、片手間のプロジェクトではありません - オープンソースこそが本業で
す。この積み重ねこそが、BxSites(そして BoxLang スタック全体)を安心
して採用できる理由です: 出したものを責任を持って保守し続けてきた、
20 年の実績を持つ企業が支えています。

## プロジェクトを支援する

BxSites は無料でオープンソースであり、それは今後も変わりません。最も
簡単な支援方法は無料です: **GitHub リポジトリにスターを付ける**ことで
す - 他の開発者がプロジェクトを見つける助けになり、メンテナーにとって
も「続ける価値がある」という確かなシグナルになります。

さらに支援したい場合、BoxLang や Ortus Solutions の他のオープンソース
活動と合わせて開発を継続的に支援する最も良い方法は、Patreon でスポン
サーになることです。

<div class="bxsites-hero__actions">
	<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="https://github.com/ortus-boxlang/bx-sites">⭐ GitHub でスターを付ける</a>
	<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="https://www.patreon.com/c/ortussolutions">Patreon でスポンサーになる</a>
</div>

コードでの貢献や単発の寄付など、プロジェクトを支援する他の方法について
は[貢献する](contribute.md)をご覧ください。
