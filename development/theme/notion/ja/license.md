---
title: ライセンス
order: 2.2
icon: phosphor-duotone:scroll
summary: BxSites は無料でオープンソースであり、Apache 2.0 ライセンスの下で提供されています。
description: BxSites は無料でオープンソースであり、Apache 2.0 ライセンスの下で提供されています。
tags: [概要, ライセンス]
---

# ライセンス

BxSites は無料のオープンソースソフトウェアであり、
**Apache License, Version 2.0** の下でリリースされています。

```text title="著作権表示"
Copyright [2024] [Ortus Solutions, Corp]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```

!!! tip "要点まとめ"
    - 商用・クローズドソースのプロジェクトを含め、BxSites を**使用**・
      **改変**・**配布**することができます。
    - 著作権表示とライセンス表示を保持し、変更したファイルには変更した
      旨を明記する**必要があります**。
    - **一切の保証はありません** - 自己責任でそのまま使用してください。

    これは法的助言ではありません - 実際の条項については、下記の完全な
    ライセンス本文を確認してください。

::: cards
::: card title="ライセンス全文" icon="phosphor-duotone:file-text" href="https://github.com/ortus-boxlang/bx-sites/blob/development/LICENSE"
このリポジトリの `LICENSE` ファイルに記載されている Apache License,
Version 2.0 の完全なテキストです。
:::
::: card title="Apache License 2.0(公式)" icon="phosphor-duotone:link" href="https://www.apache.org/licenses/LICENSE-2.0"
Apache Software Foundation が公開している正式なライセンス本文です。
:::
:::

## サードパーティの依存関係

BxSites は、いくつかの BoxLang モジュール -
[bx-markdown](https://github.com/ortus-boxlang/bx-markdown)、
[bx-esapi](https://github.com/ortus-boxlang/bx-esapi)、
[bx-yaml](https://github.com/ortus-boxlang/bx-yaml)、
[bx-image](https://github.com/ortus-boxlang/bx-image) - に加えて、各
組み込みテーマがバンドルするクライアントサイドライブラリ(Bootstrap、
highlight.js、Alpine.js、lunr.js、オプションで Mermaid)に依存してい
ます。それぞれ独自のオープンソースライセンスを持っています。詳細は各
プロジェクトのリポジトリを参照してください。
