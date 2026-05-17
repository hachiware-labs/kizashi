# Kizashi

Kizashi は、Hachiware Labs 向けの課題仮説を、設定済みの情報ソースから生成・改善・評価するための Vercel Skills 対応 Skill です。

単独CLIツールとして使うことが主目的ではありません。Vercel Skills としてインストールし、Codex などのコーディングエージェントに `$kizashi` を使わせる形が主導線です。同梱の JavaScript スクリプトは、初期化、ソース棚卸し、signals 生成、実行引き継ぎなどを決定的に行うための補助機能です。

English: [README.md](README.md)

## インストール

```bash
npx skills add hachiware-labs/kizashi
```

チェックアウトしたローカルリポジトリから試す場合:

```bash
npx skills add . --skill kizashi --agent codex -y
```

## エージェントに依頼する使い方

まず、コーディングエージェントにこう依頼します。

```text
Kizashi Skillを使って、このプロジェクトに kizashi/ ディレクトリを初期化してください。
Xブックマークは kimi-webbridge、wiki-garden は内部知識ソースとして設定してください。
```

次に、レビューを依頼します。

```text
Kizashi Skillを使って、weekly_kizashi_review を一連で実行してください。
ソース棚卸し、signalsファイル、エージェントタスク、レポート雛形、ログ雛形を作成し、
その後、意味的レビューを完了してください。
既存仮説を優先して改善し、Pain、ユーザー数、ビジネス規模のいずれかが突き抜けている場合だけ、
最大3件まで新規仮説を作成してください。
評価を更新し、レポートは私のロケールに合わせて作成してください。
```

## Kizashi が作成するもの

- `kizashi/inputs/`: 一次情報URLつきの入力メモ
- `kizashi/signals/`: URL・見出し・箇条書き候補の機械的なシグナル一覧
- `kizashi/runs/`: run README、`AGENT_TASK.md`、manifest
- `kizashi/hypotheses/`: 検証可能な課題仮説
- `kizashi/evaluations/`: スコア、根拠、反証、推奨判断
- `kizashi/reports/`: 定期レビュー
- `kizashi/logs/`: 短い日次ログ

## 補助CLI

CLI は Skill に同梱される補助機能です。初期化や実行準備を決定的に行うために使えますが、主な利用面は `$kizashi` を呼び出すエージェント操作です。

```bash
node bin/kizashi.js init --target .
node bin/kizashi.js run weekly_kizashi_review --target .
node bin/kizashi.js hypotheses list --target .
node bin/kizashi.js summarize --target .
```

## ドキュメント

- [英語 Quick Start](docs/quickstart.md)
- [日本語 Quick Start](docs/quickstart_ja.md)
- [要件定義・設計メモ](docs/kizashi_skill_requirements.md)

## 検証

```bash
node scripts/validate-skill.js .
npm run smoke
```
