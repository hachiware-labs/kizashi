# Kizashi

Kizashi は、あなたの関心を毎日調べ、レポートとして残し、その知識を育てていく Skill です。

llm-wiki は、知識を Markdown などのテキストとして構造的に保存し、LLM があとから読み返し、追記し、整理し、回答に使いやすくするための考え方です。Kizashi はこの記憶管理を、日々の調査レポートと接続します。

毎日のソースからシグナルを拾い、あなた向けの Daily Report を作り、そのレポート自体も wiki に保存します。日々の調査、単発メモ、過去レポート、query、lint が同じ知識ベースにつながるので、使うほどあなたの知見が磨かれていきます。

English: [README.md](README.md)

## まず使う3つ

```text
$kizashi 今日のレポートを作って
```

```text
$kizashi AIレビューでは根拠URLを必ず残す、と覚えて
```

```text
$kizashi CursorのBackground Agentについて調べて
```

サンプルレポート: [kizashi-daily-2026-06-20.html](examples/daily-report-sample/kizashi-daily-2026-06-20.html)

## できること

- あなたの関心に沿って、日々の情報ソースを調査する
- 調査結果を Daily Report として保存する
- `$kizashi AIレビューでは根拠URLを必ず残す、と覚えて` のような依頼を llm-wiki に追加する
- `$kizashi 過去レポートからAIエージェントの評価観点を教えて` のような query に答える
- たまった知識を整理して、重複や弱い根拠を減らす
- 情報ソースの一覧表示・追加・無効化を行う

## インストール

Vercel Skills から、Codex などのコーディングエージェント全体で使える Skill としてインストールするのがおすすめです。プロジェクトごとに閉じずに入れておくと、どの会話・どの作業中でも `$kizashi AIレビューでは根拠URLを必ず残す、と覚えて` のように知識を残せます。

```bash
npx skills add hachiware-labs/kizashi
```

ローカルでこのリポジトリから試す場合は、Codex 向けにインストールします。

```bash
npx skills add . --skill kizashi --agent codex -y
```

インストール後は、Codex などの Agent に `$kizashi` を使うよう依頼します。初回利用時に共通の llm-wiki 保存先を決めておくと、別プロジェクトからの `$kizashi ...を覚えて`、`$kizashi ...を調べて`、`$kizashi ...を教えて` も同じ知識ベースにつながります。

## 使い方の感覚

Kizashi は、ユーザーの自然な言い方を llm-wiki の操作に変換します。

```text
$kizashi hachiware-labs.comを毎日の調査ソースに追加して
```

これは、情報ソースの一覧表示・編集につながります。保存先は `<wiki-root>/sources.yaml` です。

```text
$kizashi AIレビューでは根拠URLを必ず残す、と覚えて
```

これは、ingress / ingest として知識追加につながります。保存先は `<wiki-root>/raw/` と、必要に応じて `<wiki-root>/concepts/` や `<wiki-root>/entities/` です。

```text
$kizashi 今日のレポートを作って
```

これは、指定ソースと既存知識から Daily Report を作る操作です。保存先は `<wiki-root>/reports/daily/` です。

```text
$kizashi 過去レポートからAIエージェントの評価観点を教えて
```

これは query です。過去レポート、メモ、ソース URL、整理済み wiki ページを読んで答えます。

```text
$kizashi CursorのBackground Agentについて調べて
```

これも query です。既存 wiki、過去レポート、登録済みソースを手がかりに調べ、必要な根拠を示して答えます。

## はじめる

最初に決めるのは2つだけです。

1. llm-wiki を保存するフォルダ
2. 日々見る情報ソース

具体的なソースがまだない場合は、Agent があなたの関心やプロジェクトの文脈から候補を出し、対話しながら最初のソースを決めます。情報ソースは後からいつでも追加・無効化できます。

その後の流れは Quick Start にまとめています。

- [日本語 Quick Start](docs/quickstart_ja.md)
- [English Quick Start](docs/quickstart.md)

## 保存先の考え方

Daily Report と知識の正本は `<wiki-root>/` に保存します。日々のレポートも wiki 内に残すため、あとから query で検索できます。

Kizashi 固有の仮説検証や Signal / Review / Positioning の補助状態は、必要な場合だけ `<project-root>/kizashi/` に保存します。

## 検証

```bash
npm run check
```
