# Kizashi クイックスタート

Kizashi は、日々の情報ソースと llm-wiki の知識を使って、毎日のレポート、知識追加、検索、整理を行う Skill です。ユーザーは CLI の細かい手順を覚える必要はありません。Codex などの Agent に `$kizashi` を使うよう依頼し、最初に保存フォルダと情報ソースを決めたら、あとは日々の調査と知識管理を回します。

保存フォルダまたは `sources.yaml` がない場合は、Kizashi の init が未完了です。その場合は、先に wiki フォルダと情報ソースを決めます。

## まず10分で試す

最初の成功体験は、保存先を決め、ソースを1つ追加し、初回レポートを作ることです。

```text
$kizashi llm-wikiの保存先を C:\Users\kitad\Documents\kizashi-wiki にして
```

```text
$kizashi hachiware-labs.comを毎日の調査ソースに追加して
```

```text
$kizashi 今日のレポートを作って
```

レポートは `<wiki-root>/reports/daily/` に保存されます。HTML を作る場合は標準 Daily Report テンプレートを使い、検証してから完了扱いにします。以後、`$kizashi ...を覚えて` で知識を足し、`$kizashi ...を調べて` や `$kizashi ...を教えて` で過去レポートと知識を使えます。

## 1. 日々の調査をする

### 1. 最初にフォルダとソースサイトを決める

ユーザーは、Kizashi が知識を保存する llm-wiki フォルダと、日々見る情報ソースを決めます。情報ソースには、サイト URL、X ブックマーク、技術記事、GitHub、ローカルメモ、ブラウザやアプリで開いている画面などを含められます。具体的なソースがまだない場合は、Agent がユーザーの関心やプロジェクトの文脈から候補を出し、対話しながら最初のソースを決めます。ソースは後からいつでも追加・無効化できます。

```text
$kizashi llm-wikiの保存先を C:\Users\kitad\Documents\kizashi-wiki にして、hachiware-labs.com とXブックマークを毎日の調査ソースに設定して
```

まだ具体的なソースがない場合:

```text
$kizashi 私の関心から、毎日見るべき情報ソース候補を3つ提案して。一緒に最初のソースを決めたい
```

作成される主な場所:

- `<wiki-root>/SCHEMA.md`
- `<wiki-root>/index.md`
- `<wiki-root>/log.md`
- `<wiki-root>/sources.yaml`
- `<wiki-root>/raw/`
- `<wiki-root>/concepts/`
- `<wiki-root>/entities/`
- `<wiki-root>/queries/`
- `<wiki-root>/reports/daily/`

`<wiki-root>/sources.yaml` が、Daily Report、ingress / ingest、query、lint で使う情報ソース一覧です。

### 2. Agent のオートメーションで日々のレポートを作成する

ユーザーは、Codex など各 Agent のオートメーション機能を使って、毎日のソースから Kizashi Daily Report を作成させます。Kizashi は指定ソースと既存 wiki を読み、重要シグナルは元ソースだけでなく周辺情報も深掘りして、日付入りのレポートとして保存します。

```text
$kizashi 今日の情報ソースとllm-wikiの知識からDaily Reportを作って。重要シグナルは周辺調査もして、レポートをwikiに保存して
```

保存される主な場所:

- レポート: `<wiki-root>/reports/daily/YYYY-MM-DD.md`
- HTML レポートを作る場合: `<wiki-root>/reports/daily/YYYY-MM-DD.html`
- ブラウザやアプリ画面を Computer Use で取得した材料: `<wiki-root>/raw/app-captures/`
- レポート索引: `<wiki-root>/index.md`
- 追記ログ: `<wiki-root>/log.md`

HTML レポートは `assets/templates/daily-signal-report.html` を使います。完了前に `node scripts/validate-daily-report.js <wiki-root>/reports/daily/YYYY-MM-DD.html` を実行し、スクリプトが使えない環境では同等の項目を手動確認します。

Daily Report は wiki 内に保存されるため、後日の query や次回レポートで検索・接続できます。

## 2. llm-wiki として使う

### 3. 知識を追加する（ingress / ingest）

ユーザーは、単発で記憶したいネタ、URL、メモ、会話で出たアイデア、あとで参照したい観察を Kizashi に追加できます。Kizashi は raw ソースを保存し、必要に応じて `concepts/`、`entities/`、`comparisons/` などの wiki ページへ整理します。

```text
$kizashi AIレビューでは根拠URLを必ず残す、と覚えて
```

```text
$kizashi Cursor Background Agentは非同期PR作業の比較対象として追跡する、と覚えて
```

保存される主な場所:

- 一次メモや URL: `<wiki-root>/raw/notes/`、`<wiki-root>/raw/sites/`、`<wiki-root>/raw/articles/`
- X ブックマーク: `<wiki-root>/raw/x-bookmarks/`
- 整理済み知識: `<wiki-root>/concepts/`、`<wiki-root>/entities/`、`<wiki-root>/comparisons/`
- 追記ログ: `<wiki-root>/log.md`

### 4. 知識を検索する（query）

ユーザーは、llm-wiki に蓄積した知識、過去レポート、ソース URL、メモを対象に質問できます。Kizashi は `SCHEMA.md`、`index.md`、`sources.yaml`、`log.md`、関連ページ、過去レポートを読んで回答します。

```text
$kizashi 過去レポートからAIエージェントの評価観点を教えて。関連レポートとソースURLも示して
```

```text
$kizashi CursorのBackground Agentについて調べて。既存wikiと登録済みソースを優先して見て
```

必要に応じて、再利用したい回答は `<wiki-root>/queries/` に保存します。

## 3. 管理する

### 5. 知識を整理する（lint）

ユーザーは、増えた知識を Kizashi に整理させます。重複メモ、弱い主張、ソース URL の欠落、つながっていない過去レポート、古くなった仮説を見直し、wiki を日々使いやすくします。

```text
$kizashi llm-wikiをlintして。重複、弱い根拠、未接続のレポート、足りないソースURLを整理して
```

保存される主な場所:

- lint 出力: `<wiki-root>/outputs/lint/`
- 更新された wiki ページ: `<wiki-root>/concepts/`、`<wiki-root>/entities/`、`<wiki-root>/comparisons/`
- 追記ログ: `<wiki-root>/log.md`

### 6. ソースサイトを編集する

ユーザーは、Daily Report や query で使う情報ソースを追加、無効化、更新できます。削除よりも無効化を優先すると、あとから履歴を追いやすくなります。

```text
$kizashi 情報ソース一覧を見せて
```

```text
$kizashi hachiware-labs.comをDaily Report用の情報ソースに追加して。使わなくなったXブックマークのソースは無効化して
```

更新される場所:

- 情報ソース一覧: `<wiki-root>/sources.yaml`
- 追記ログ: `<wiki-root>/log.md`

## 保存先の最小まとめ

- Daily Report: `<wiki-root>/reports/daily/`
- Computer Use の取得材料: `<wiki-root>/raw/app-captures/`
- 単発知識: `<wiki-root>/raw/`
- 整理済み知識: `<wiki-root>/concepts/`、`<wiki-root>/entities/`、`<wiki-root>/comparisons/`
- query の保存回答: `<wiki-root>/queries/`
- lint 結果: `<wiki-root>/outputs/lint/`
- 情報ソース一覧: `<wiki-root>/sources.yaml`

Kizashi 固有の仮説検証や Signal / Review / Positioning の補助状態は、必要な場合だけ `<project-root>/kizashi/` に保存します。日々のレポートと llm-wiki の知識の正本は `<wiki-root>/` です。
