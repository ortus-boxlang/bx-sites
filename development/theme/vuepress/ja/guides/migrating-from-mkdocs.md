---
title: mkdocs からの移行
order: 8
icon: phosphor-duotone:swap
tags: [ガイド, 移行, mkdocs]
---

# mkdocs からの移行

`bxSites migrate --from=mkdocs` は、mkdocs プロジェクト（`mkdocs.yml` と
その `docs/` フォルダ）を、一つのコマンドで完全な bx-sites プロジェクトに
変換します:

```bash frame="terminal" title="Terminal"
bxSites migrate --source=/path/to/mkdocs-project --from=mkdocs
```

- `--source`（必須）- mkdocs プロジェクトのルートディレクトリ
  （`mkdocs.yml` を含んでいる必要があります）

[GitBook からの移行](migrating-from-gitbook.md)とは違い、これは主に
*コンテンツ*の変換ではなく*設定*の変換です。mkdocs 自身の `docs/` フォルダは
すでに bx-sites とまったく同じ規約を使っています - フォルダのネストがナビ
構造であること、`index.md` がフォルダ自身のホームページであること、
ページ間の相対 `.md` リンクがそのまま機能することです。さらに重要なのは、
mkdocs-material 自身の拡張 Markdown 構文が、bx-sites がすでに話しているのと
*まったく同じテキスト構文*だということです。そもそも bx-sites は
mkdocs-material をモデルにして作られているからです（
[Markdown 拡張機能](markdown.md) を参照）。そのため、ページ本文はバイト単位で
そのままコピーされます - `!!! note` の Admonition も、`=== "Tab"` の
コンテンツタブも、`$x^2$` の数式も、ここでは書き換える必要は一切ありません。
すでに有効な bx-sites 構文だからです。

## 自動的に変換される内容

**`mkdocs.yml` → `bxsites.yaml`:**

| mkdocs.yml | bxsites.yaml |
|---|---|
| `site_name` | `name` |
| `site_description` | `description` |
| `site_url` | `baseURL` |
| `theme.name: material` | `theme.name: "material"` |
| それ以外の `theme.name` | `theme.name: "bootstrap"`（bx-sites 自身のデフォルト）- 見た目の結果が異なるため警告として報告されます |
| `repo_url` / `edit_uri` | `repo.url` / `repo.editUri` |
| `extra_css` / `extra_javascript` | `extraCss` / `extraJs` |
| `markdown_extensions: [footnotes]` | `markdown.enableFootnotes: true` |
| `markdown_extensions: [def_list]` | `markdown.enableDefinitionLists: true` |
| `markdown_extensions: [pymdownx.arithmatex]` | `math: true` |

`markdown_extensions` のそれ以外のエントリは、mkdocs-material 自身の構文が
すでにネイティブにカバーしています - `admonition`、`pymdownx.tabbed`、
`pymdownx.details`、`pymdownx.superfences`、`pymdownx.highlight`、`toc`、
`attr_list` など - これらは `bxsites.yaml` の変更を一切必要としません。
bx-sites はすでに標準でその通りに振る舞います。

**`nav:` → `docs/nav.json`:**

```yaml title="mkdocs.yml" linenums="1"
# mkdocs.yml
nav:
  - Home: index.md
  - Guide:
      - Setup: guide/setup.md
      - Advanced: guide/advanced.md
  - About: about.md
```

は次のようになります:

```json title="docs/nav.json" linenums="1"
[
  { "title": "Home", "path": "index.md", "children": [] },
  { "title": "Guide", "path": "", "children": [
    { "title": "Setup", "path": "guide/setup.md", "children": [] },
    { "title": "Advanced", "path": "guide/advanced.md", "children": [] }
  ] },
  { "title": "About", "path": "about.md", "children": [] }
]
```

- 裸のパスエントリ（明示的なタイトルのない `- about.md`）も変換されます -
  そのタイトルは移行済みページ自身のフロントマター/最初の見出しから
  取得されます。`title` が設定されていない bx-sites の `docs/nav.json`
  エントリと同じ挙動です
- 完全な形式については[設定: `nav`](../configuration.md#nav) を参照してください

**ページとアセット:**

- すべての `.md` ファイルは、`docs/` の下の同じパスに無変更でコピーされます
- それ*以外*のすべてのファイル（画像、PDF など）は
  `docs/assets/mkdocs/<同じ相対パス>` に再配置されます - bx-sites 自身の
  アセットパイプラインは `docs/assets/**` しか公開しないため、また mkdocs には
  GitBook の `.gitbook/assets/` のような単一のアセットフォルダ規約がないため
  （画像は使用するページの隣に散らばっているのが一般的です）
- 再配置されたアセットへの参照 - 例えば `![diagram](img/diagram.png)` -
  はすべて、リンク元のページ自身がどれだけ深い階層にあるかを考慮した上で、
  新しい場所に正しく到達する相対パスに書き換えられます（どの bx-sites
  プロジェクトもすでに使っている「著者が正しい数の `../` を書く」という
  規約と同じですが、ここでは find-and-replace に頼らず自動的に計算されます）

## 手動での確認が必要な内容

コマンド自身の出力に警告として報告されます。何も黙って捨てられることは
ありません:

- bx-sites に対応するものがない mkdocs の `markdown_extensions`/`plugins`
  エントリ（mkdocs-material 自身の絵文字ショートコード、`awesome-pages` や
  `git-revision-date` のようなサードパーティプラグインなど）- 同じ挙動が
  必要な場合は[プラグイン](plugins.md) を参照してください
- `mkdocs.yml` 自身の色/フォントカスタマイズ
  （`theme.palette`/`theme.font`）には直接の対応物がありません - 移行が
  終わったら
  [色のカスタマイズ](themes.md#テーマオーバーライドなしの色のカスタマイズ)
  を参照してください
- `material` 以外の `theme.name`（`bootstrap` にデフォルトします）

## 実例

```bash frame="terminal" title="Terminal" linenums="1"
bxSites new --projectRoot=my-docs
bxSites migrate --projectRoot=my-docs --source=../my-mkdocs-project --from=mkdocs
cd my-docs
bxSites serve
```

`migrate` は `bxsites.yaml` と `docs/` 自体を書き込みます - 上記の `new`
ステップは、それらを受け取る準備として `docs/` を持つプロジェクトルートを
用意するためだけのものです。migrate 自体も `docs/` を自分で作成するため、
厳密には必須ではありません。コマンド自身の警告を確認したうえで、コミットする
前に `serve` で結果を見てください。
