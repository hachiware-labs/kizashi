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

3. Signal を実行する。

```text
Kizashi Skillを使って、`kizashi signal` で signal 階層を一連で実行してください。
ソース棚卸し、signalsファイル、エージェントタスク、evidence patch雛形、ログ雛形を作成し、
仮説や評価は書き換えず、一次情報URLつきの evidence patch だけを残してください。
```

4. 必要なときだけ新規仮説を作る。

```text
既存仮説とは別の痛みが見つかったときだけ、`kizashi hypo` または `kizashi hypothesize` で新規仮説を作成してください。
```

5. Review を実行する。

```text
Kizashi Skillを使って、`kizashi review` で review 階層を一連で実行してください。
evidence patchを既存仮説に照合し、評価を更新し、
continue / narrow / merge / park / split と next_experiment を判断してください。
Pain、ユーザー数、ビジネス規模のいずれかが突き抜けている場合だけ、最大3件まで新規仮説を作成してください。
```

6. Positioning が必要なタイミングで実行する。

```text
Kizashi Skillを使って、`kizashi positioning` で positioning 階層を一連で実行してください。
vendor encroachment、buyer、pricing、adoption unit、外部productとして残る余白を見直し、
ポジショニングレポートを私のロケールで作成してください。
```

7. 仮説を確認・改善する。

```text
Kizashi Skillを使って、現在の仮説一覧を出してください。
その後、agent-workspace-orchestration の説明、批評、改善を、
最新ソースと一次情報URLに基づいて実施してください。
```

## エージェントが作成・更新するもの

- `kizashi/inputs/`: 一次情報URLつきの入力メモ
- `kizashi/signal/`: signal の evidence patch と補助ファイル
- `kizashi/review/`: hypothesis review の出力と補助ファイル
- `kizashi/positioning/`: positioning の出力と補助ファイル
- `kizashi/hypotheses/`: 検証可能な課題仮説
- `kizashi/evaluations/`: スコア、根拠、反証、推奨判断

## 補助コマンド

CLI は Skill に同梱される補助機能です。初期化、一覧確認、実行準備、検証などを決定的に行いたいときに、ユーザーまたはエージェントが使います。Vercel Skills としての主な利用面は `$kizashi` を呼び出すエージェント操作です。

```bash
node bin/kizashi.js init --target .
node bin/kizashi.js sources list --target .
node bin/kizashi.js sources update --target . --id x_bookmarks --type browser_session --provider kimi-webbridge
node bin/kizashi.js signal --target .
node bin/kizashi.js hypo --target . --slug <slug> --title "<title>"
# or: node bin/kizashi.js hypothesize --target . --slug <slug> --title "<title>"
node bin/kizashi.js review --target .
node bin/kizashi.js positioning --target .
node bin/kizashi.js hypotheses list --target .
node bin/kizashi.js hypotheses show <slug> --target .
node bin/kizashi.js hypotheses critique <slug> --target .
node bin/kizashi.js hypotheses improve <slug> --target .
node bin/kizashi.js summarize --target .
```

`node bin/kizashi.js signal|review|positioning ...` は階層実行の補助コマンドです。決定的に処理できる部分を先に実行し、`kizashi/<layer>/<date>.task.md` にエージェントが続ける作業をまとめます。`node bin/kizashi.js hypo` と `node bin/kizashi.js hypothesize` は `kizashi/hypotheses/` に新規仮説を作ります。

## 品質ルール

- 新規仮説を増やすより、まず既存仮説を改善する。
- ユーザー、発生タイミング、Pain、回避策の失敗、マーケットの切り口が明確に異なる場合だけ新規仮説を作る。
- Pain の深さ、ユーザー数、ビジネス規模のどれかが突き抜けている仮説を優先する。
- 一次根拠には `Source File` と `Original URL` を残す。
- レポート、ログ、仮説、評価はユーザーのロケールに合わせる。
