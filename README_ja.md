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
Xブックマークとキーワード検索はブラウザ経由で取得し、wiki-garden は内部知識ソースとして設定してください。
```

次に、時間名ではなく役割名で各階層を依頼します。

```text
Kizashi Skillを使って、`kizashi signal` で X 非依存の signal 階層を一連で実行してください。
ソース棚卸し、signalsファイル、エージェントタスク、evidence patch雛形、ログ雛形を作成し、
仮説や評価は書き換えず、根拠パッチだけを残してください。
```

```text
ブラウザで X ブックマークとキーワード検索結果を取得後、`kizashi signal-x` で X 系のみの signal を取り込みます。
```

```text
既存仮説とは別の痛みが見つかったときだけ、`kizashi hypo` または `kizashi hypothesize` で新規仮説を作成してください。
```

```text
Kizashi Skillを使って、`kizashi review` で review 階層を一連で実行してください。
evidence patchを既存仮説に照合し、評価を更新し、
continue / narrow / merge / park / split と next_experiment を判断してください。
Pain、ユーザー数、ビジネス規模のいずれかが突き抜けている場合だけ、最大3件まで新規仮説を作成してください。
```

```text
Kizashi Skillを使って、`kizashi positioning` で positioning 階層を一連で実行してください。
vendor encroachment、buyer、pricing、adoption unit、外部productとして残る余白を見直し、
ポジショニングレポートを私のロケールで作成してください。
```

## Kizashi が作成するもの

- `kizashi/inputs/`: 一次情報URLつきの入力メモ
- `kizashi/signal/`: signal の evidence patch と補助ファイル
- `kizashi/review/`: hypothesis review の出力と補助ファイル
- `kizashi/positioning/`: positioning の出力と補助ファイル
- `kizashi/hypotheses/`: 検証可能な課題仮説
- `kizashi/evaluations/`: スコア、根拠、反証、推奨判断

## 補助CLI

CLI は Skill に同梱される補助機能です。初期化や実行準備を決定的に行うために使えますが、主な利用面は `$kizashi` を呼び出すエージェント操作です。

```bash
node bin/kizashi.js init --target .
node bin/kizashi.js signal --target .
node bin/kizashi.js signal-x --target .
node bin/kizashi.js hypo --target . --slug agent-workspace-orchestration --title "Agent Workspace Orchestration"
# or: node bin/kizashi.js hypothesize --target . --slug agent-workspace-orchestration --title "Agent Workspace Orchestration"
node bin/kizashi.js review --target .
node bin/kizashi.js positioning --target .
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
