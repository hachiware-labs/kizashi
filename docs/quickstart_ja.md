# Kizashi クイックスタート

Kizashi は Vercel Skills でインストールして使う Skill です。ユーザーが npm コマンドを直接覚えて実行するよりも、コーディングエージェントに `$kizashi` を使った作業を依頼する形を基本にします。Codex などのエージェントが Skill を読み、プロジェクトを確認し、必要なファイルを編集し、初期化・一覧確認・実行準備などの決定的な作業だけ JavaScript スクリプトで補助します。

## 推奨: エージェントに依頼する流れ

1. ワークスペースを初期化する。

```text
Kizashi Skillを使って、このプロジェクトに kizashi/ ディレクトリを初期化してください。
Xブックマークは kimi-webbridge、wiki-garden は内部知識ソースとして設定してください。
```

2. 情報ソースを収集する。

```text
Kizashi Skillを使うために、kimi-webbridgeでBraveに接続してください。
Xで直近ブックマーク20件を取得し、はてなブックマークのAI系最新トレンドも調べて、
kizashi/inputs/ 以下に一次情報URLつきで保存してください。
```

3. 週次レビューを実行する。

```text
Kizashi Skillを使って、weekly_kizashi_review を一連で実行してください。
上位コマンドでソース棚卸し、signalsファイル、エージェントタスク、レポート雛形、ログ雛形を作成し、
その後、現在の入力ファイルを読み、既存仮説を優先して改善し、
Pain、ユーザー数、ビジネス規模のいずれかが突き抜けている場合だけ、
最大3件まで新規仮説を作成してください。
評価を更新し、レポートは私のロケールに合わせて作成してください。
```

4. 仮説を確認・改善する。

```text
Kizashi Skillを使って、現在の仮説一覧を出してください。
その後、agent-workspace-orchestration の説明、批評、改善を、
最新ソースと一次情報URLに基づいて実施してください。
```

## エージェントが作成・更新するもの

- `kizashi/inputs/`: 一次情報URLつきの入力メモ
- `kizashi/signals/`: URL・見出し・箇条書き候補の機械的なシグナル一覧
- `kizashi/runs/`: タスク実行READMEとソース棚卸し
- `kizashi/hypotheses/`: 検証可能な課題仮説
- `kizashi/evaluations/`: スコア、根拠、反証、推奨判断
- `kizashi/reports/`: 定期レビュー
- `kizashi/logs/`: 短い日次ログ

## 補助コマンド

CLI は Skill に同梱される補助機能です。初期化、一覧確認、実行準備、検証などを決定的に行いたいときに、ユーザーまたはエージェントが使います。Vercel Skills としての主な利用面は `$kizashi` を呼び出すエージェント操作です。

```bash
node bin/kizashi.js init --target .
node bin/kizashi.js sources list --target .
node bin/kizashi.js sources update --target . --id x_bookmarks --type browser_session --provider kimi-webbridge
node bin/kizashi.js run weekly_kizashi_review --target .
node bin/kizashi.js hypotheses list --target .
node bin/kizashi.js hypotheses show <slug> --target .
node bin/kizashi.js hypotheses critique <slug> --target .
node bin/kizashi.js hypotheses improve <slug> --target .
node bin/kizashi.js summarize --target .
```

`node bin/kizashi.js run ...` は上位ワークフロー補助コマンドです。決定的に処理できる部分を先に実行し、`kizashi/runs/<date>-<task>/AGENT_TASK.md` にエージェントが続ける作業をまとめます。

## 品質ルール

- 新規仮説を増やすより、まず既存仮説を改善する。
- ユーザー、発生タイミング、Pain、回避策の失敗、マーケットの切り口が明確に異なる場合だけ新規仮説を作る。
- Pain の深さ、ユーザー数、ビジネス規模のどれかが突き抜けている仮説を優先する。
- 一次根拠には `Source File` と `Original URL` を残す。
- レポート、ログ、仮説、評価はユーザーのロケールに合わせる。
