# Kizashi Skill 要件定義

## 1. 概要

Kizashi は、指定された情報ソースから材料を取得し、Hachiware Labs 向けの課題仮説を生成・改善・評価するための Vercel Skills 対応 Skill である。

単なる情報収集ツールではなく、外部シグナルと内部知識を掛け合わせて、検証可能な課題仮説へ変換することを目的とする。

## 2. コンセプト

Kizashi は、以下の流れを支援する。

```text
情報ソースを定義する
  ↓
取得方法を決める
  ↓
調査を実行する
  ↓
取得情報をシグナル化する
  ↓
既存仮説と照合する
  ↓
課題仮説を新規生成 / 改善する
  ↓
現実性・Painの深さで評価する
  ↓
検証計画・MVP案・発信案へ接続する
  ↓
日々の変更ログと定期レビューを残す
```

## 3. Kizashi の位置づけ

| 項目 | 内容 |
|---|---|
| ツール名 | Kizashi |
| 形式 | Vercel Skills でインストールできる Skill |
| 主目的 | 情報ソース指定型の課題仮説生成・改善 |
| 主入力 | Xブックマーク、wiki-garden、リリースノート、GitHub、技術記事など |
| 主出力 | evidence patch、課題仮説、評価、検証計画、レポート、短い実行ログ |
| 実行形態 | 手動実行 / 定期実行タスク |
| 重要方針 | 新規仮説を乱造せず、既存仮説を育てる |

## 4. 主な利用シナリオ

### 4.1 Xブックマークと wiki-garden を使った定期レビュー

- Xブックマークは別 Skill が取得する
- wiki-garden は別 Skill が関連知識を取得する
- Kizashi はそれらを材料にする
- 既存仮説を改善し、必要に応じて新規仮説を作成する
- 評価を更新する
- 短い実行ログ、Hypothesis Review レポート、Market Positioning レポートを生成する

### 4.2 新しいツール・機能から課題仮説を作る

例:

- Claude Code subagents
- Codex Goals
- GitHub Copilot coding agent
- AGENTS.md / CLAUDE.md / custom instructions
- AI-generated PR workflow
- browser agent / approval policy

### 4.3 粗い仮説をブラッシュアップする

例:

```text
粗い仮説:
AIエージェントが増えると管理が大変になる。
```

これを以下のように磨く。

- 誰が困るか
- いつ困るか
- 何が具体的に困るか
- 既存の回避策は何か
- 既存策の弱さは何か
- 反証条件は何か
- 検証方法は何か
- MVP案は何か

## 5. 情報ソース

Kizashi は、情報ソースを `kizashi/config/sources.yaml` で定義する。

### 5.1 想定する情報ソース

| ソース | 役割 | 取得担当 |
|---|---|---|
| Xブックマーク | 外部シグナル | X Bookmark Skill |
| wiki-garden | 内部知識・過去メモ | wiki-garden Skill |
| リリースノート | 新ツール・新機能の変化 | Kizashi または別 Skill |
| GitHub Issues / Discussions | 実際の困りごと・回避策 | GitHub Skill / API |
| 技術記事 | 実践例・利用者の工夫 | Web検索 / RSS |
| 競合ツール情報 | 既存手段と限界 | Web検索 |

### 5.2 `sources.yaml` 例

```yaml
sources:
  - id: evidence_patches
    name: Evidence Patches
    type: local_artifact
    description: Small append-only signal records created by the Signal Capture layer.
    input_path: kizashi/signal/
    expected_format: markdown
    cadence: per_source_batch
    role: evidence_patch

  - id: x_bookmarks
    name: X Bookmarks
    type: external_skill
    description: X bookmarks collected and summarized by another skill.
    provider: x-bookmark-skill
    input_path: kizashi/inputs/x-bookmarks/
    expected_format: markdown_or_yaml
    cadence: daily
    role: external_signal

  - id: wiki_garden
    name: Wiki Garden
    type: knowledge_skill
    description: Internal knowledge, past hypotheses, product concepts, and strategic notes.
    provider: wiki-garden-skill
    input_path: kizashi/inputs/wiki-garden/
    expected_format: markdown
    cadence: daily
    role: internal_context

  - id: release_notes
    name: AI Tool Release Notes
    type: web_or_manual
    description: Release notes and changelogs for AI coding tools.
    input_path: kizashi/inputs/release-notes/
    expected_format: markdown
    cadence: weekly
    role: tool_change

  - id: github_signals
    name: GitHub Issues and Repositories
    type: github_or_manual
    description: GitHub Issues, Discussions, and repositories related to AI agents and developer workflows.
    input_path: kizashi/inputs/github/
    expected_format: markdown_or_yaml
    cadence: weekly
    role: external_signal

  - id: articles
    name: Technical and Market Articles
    type: web_or_manual
    description: Technical articles, competitive writeups, market notes, and pricing or adoption signals.
    input_path: kizashi/inputs/articles/
    expected_format: markdown
    cadence: strategic_or_market_shift
    role: market_signal
```

## 6. 調査タスク

調査タスクは `kizashi/config/tasks.yaml` に定義する。

### 6.1 タスクの考え方

`daily` / `weekly` / `monthly` は階層名にしない。階層は役割名で定義し、頻度は運用上の目安としてだけ扱う。

| 階層 | 位置づけ | 対応コマンド | 頻度の目安 | 目的 |
|---|---|---|---|---|
| Signal | evidence intake layer | `kizashi signal` | source batch ごと | 取得情報を evidence patch として追記する。仮説・評価は触らない |
| Review | hypothesis governance layer | `kizashi review` | regular / triggered | evidence patch を仮説・評価・意思決定に反映する |
| Positioning | strategy layer | `kizashi positioning` | strategic / market shift | vendor encroachment、buyer、pricing、adoption unit、外部product余白を見直す |

### 6.2 `tasks.yaml` 例

```yaml
tasks:
  - id: signal_capture
    name: Signal Capture
    layer: signal
    position: evidence_intake_layer
    mode: evidence_capture
    cadence: per_source_batch

    sources:
      - x_bookmarks
      - wiki_garden

    actions:
      - consume_inputs
      - extract_signals
      - match_existing_hypotheses
      - create_evidence_patches
      - create_short_log

    policy:
      append_only_evidence: true
      do_not_edit_hypotheses: true
      do_not_update_evaluations: true
      create_new_hypotheses: false
      keep_log_short: true

    output:
      evidence_patch_path: kizashi/signal/{date}.md

  - id: hypothesis_review
    name: Hypothesis Review
    layer: review
    position: hypothesis_governance_layer
    mode: hypothesis_review
    cadence: regular_or_triggered

    sources:
      - evidence_patches
      - x_bookmarks
      - wiki_garden
      - release_notes
      - github_signals

    themes:
      - ai_coding_agent
      - agent_memory
      - agent_handoff
      - ai_pr_review
      - approval_policy
      - long_running_agent

    actions:
      - consume_evidence_patches
      - match_existing_hypotheses
      - update_existing_hypotheses
      - update_evaluations
      - decide_continue_narrow_merge_park_split
      - update_validation_plans
      - create_report

    policy:
      prefer_existing_hypotheses: true
      create_new_hypothesis_only_if_distinct: true
      require_evaluation_reason: true
      require_counter_evidence: true
      avoid_hypothesis_sprawl: true

    output:
      report_path: kizashi/review/{date}.md

  - id: market_positioning
    name: Market Positioning
    layer: positioning
    position: strategy_layer
    mode: market_positioning
    cadence: strategic_or_market_shift

    sources:
      - evidence_patches
      - wiki_garden
      - release_notes
      - github_signals
      - articles

    actions:
      - consume_evidence_patches
      - review_competitive_signals
      - assess_vendor_encroachment
      - reassess_buyer_pricing_adoption_unit
      - identify_external_product_wedge
      - create_positioning_report

    policy:
      do_not_create_hypotheses_by_default: true
      require_external_product_wedge: true

    output:
      report_path: kizashi/positioning/{date}.md
```

## 7. プロジェクト構成

Kizashi Skill は、対象プロジェクト内に以下の構成を作る。

```text
kizashi/
  config/
    sources.yaml
    tasks.yaml
    themes.yaml
    scoring-rubric.yaml

  inputs/
    x-bookmarks/
    wiki-garden/
    release-notes/
    github/
    articles/

  signal/
    YYYY-MM-DD.md
    YYYY-MM-DD.signals.md
    YYYY-MM-DD.task.md
    YYYY-MM-DD.manifest.json
    YYYY-MM-DD.log.md
    YYYY-MM-DD.run.md

  review/
    YYYY-MM-DD.md
    YYYY-MM-DD.signals.md
    YYYY-MM-DD.task.md
    YYYY-MM-DD.manifest.json
    YYYY-MM-DD.log.md
    YYYY-MM-DD.run.md

  positioning/
    YYYY-MM-DD.md
    YYYY-MM-DD.signals.md
    YYYY-MM-DD.task.md
    YYYY-MM-DD.manifest.json
    YYYY-MM-DD.log.md
    YYYY-MM-DD.run.md

  hypotheses/
  evaluations/
  validations/

  outputs/
    issues/
    mvp/
    sns/
    lp/
    demo/
    interview/

  archive/
    parked/
    rejected/
    superseded/
```

## 8. 主要ファイル

### 8.1 `hypotheses/*.md`

課題仮説本体。Kizashi の中心ファイル。

含める内容:

- 粗い仮説
- 洗練後の仮説
- 背景変化
- 想定ユーザー
- 発生条件
- 具体的Pain
- 既存回避策
- 既存策の弱さ
- 根拠シグナル
- 反証条件
- Hachiware Labs との接続
- 検証質問
- MVP / 実験案
- 発信文言
- 変更履歴

### 8.2 `evaluations/*.eval.yaml`

課題仮説の評価。

含める評価軸:

- realism
- pain_depth
- frequency
- future_growth
- existing_solution_gap
- hachiware_fit
- mvp_feasibility
- message_clarity
- monetization_potential
- user_count
- business_scale
- spike_strength

### 8.3 `validations/*.plan.md`

仮説の検証計画。

含める内容:

- 検証したい問い
- 集めるべき証拠
- 検索クエリ
- ヒアリング質問
- 採用条件
- 棄却条件
- MVP実験案

### 8.4 `signal/YYYY-MM-DD.md`

Signal Capture が作る追記型の evidence patch。

目的:

- 一次情報を仮説に直接書き込まずに保持する
- `related_hypothesis`、support / counter / neutral、strength、novelty を明示する
- Hypothesis Review の入力にする

Signal Capture では仮説ファイルと評価ファイルを更新しない。

### 8.5 `<layer>/YYYY-MM-DD.log.md`

短い変更ログ。

目的:

- どの evidence patch、仮説、評価、レポートを更新したか
- 次に何をするか

ログは短くする。

### 8.6 `review/YYYY-MM-DD.md` / `positioning/YYYY-MM-DD.md`

Hypothesis Review と Market Positioning のレポート。

目的:

- 期間中の重要変化をまとめる
- 評価の変化を整理する
- 進めるべき仮説を示す
- 次アクションを提案する

## 9. コマンド一覧

Kizashi Skill が提供する概念コマンドは以下とする。

| コマンド | 役割 | 主な出力 |
|---|---|---|
| `kizashi init` | プロジェクト初期化 | `config/*` |
| `kizashi sources` | 情報ソース定義の確認・編集 | `config/sources.yaml` |
| `kizashi task` | 定期タスク定義の確認・編集 | `config/tasks.yaml` |
| `kizashi signal` | Signal 階層を実行 | `signal/*` |
| `kizashi hypo` | 新規課題仮説生成 | `hypotheses/*.md` |
| `kizashi hypothesize` | 新規課題仮説生成 | `hypotheses/*.md` |
| `kizashi review` | Review 階層を実行 | `review/*`, `hypotheses/*`, `evaluations/*`, `validations/*` |
| `kizashi positioning` | Positioning 階層を実行 | `positioning/*` |
| `kizashi hypotheses list` | 仮説一覧確認 | `hypotheses/*`, `evaluations/*` |
| `kizashi hypotheses show` | 指定仮説の説明 | `hypotheses/<slug>.md`, `evaluations/<slug>.eval.yaml` |
| `kizashi hypotheses critique` | 指定仮説の批評観点出力 | 仮説改善メモ |
| `kizashi hypotheses improve` | 指定仮説の改善作業準備 | `hypotheses/*`, `evaluations/*`, `validations/*` |
| `kizashi refine` | 既存仮説のブラッシュアップ | `hypotheses/*.md` |
| `kizashi evaluate` | 仮説評価 | `evaluations/*.eval.yaml` |
| `kizashi validate-plan` | 検証計画作成 | `validations/*.plan.md` |
| `kizashi route` | MVP・Issue・SNS案などへ変換 | `outputs/*` |
| `kizashi report` | レポート雛形作成 | `review/*.md` |
| `kizashi log` | 短い実行ログ作成・追記 | `<layer>/YYYY-MM-DD.log.md` |
| `kizashi archive` | 保留・棄却・統合済み仮説の整理 | `archive/*` |

## 10. MVPコマンド

初期版では以下を必須とする。

| コマンド | 必須度 | 理由 |
|---|---:|---|
| `kizashi init` | 必須 | プロジェクト構造を作る |
| `kizashi sources` | 必須 | 情報ソース定義が Kizashi の起点になる |
| `kizashi signal/review/positioning` | 必須 | 3階層タスクの本体 |
| `kizashi hypo/hypothesize` | 必須 | 新規仮説生成 |
| `kizashi hypotheses list/show` | 必須 | 仮説を育てるための確認導線 |
| `kizashi hypotheses critique/improve` | 必須 | 仮説の批評と改善を標準ワークフローにする |
| `kizashi refine` | 必須 | 仮説改善 |
| `kizashi evaluate` | 必須 | 現実性・Pain深さの評価 |
| `kizashi log` | 必須 | 日々の変更履歴 |
| `kizashi report` | 必須 | 定期レビュー |

`validate-plan`、`route`、`archive` は次段階で追加してもよい。

## 11. 各コマンド仕様

### 11.1 `kizashi init`

プロジェクト内に Kizashi 用ディレクトリと設定ファイルを作成する。

例:

```bash
kizashi init
kizashi init --preset hachiware
kizashi init --sources x-bookmarks,wiki-garden
```

作成対象:

- `kizashi/config/sources.yaml`
- `kizashi/config/tasks.yaml`
- `kizashi/config/themes.yaml`
- `kizashi/config/scoring-rubric.yaml`
- `kizashi/inputs/*`
- `kizashi/signal/`
- `kizashi/hypotheses/`
- `kizashi/evaluations/`
- `kizashi/review/`
- `kizashi/positioning/`

### 11.2 `kizashi signal` / `kizashi review` / `kizashi positioning`

指定タスクの上位ワークフローを実行する。

例:

```bash
kizashi signal
kizashi review
kizashi positioning
```

処理:

1. `config/sources.yaml` を読む
2. `config/tasks.yaml` を読む
3. 対象ソースの `inputs/` を棚卸しする
4. URL、見出し、箇条書き候補を機械的に抽出し、`<layer>/YYYY-MM-DD.signals.md` に保存する
5. 既存仮説と評価ファイルを一覧化する
6. `<layer>/YYYY-MM-DD.run.md`、`<layer>/YYYY-MM-DD.task.md`、`<layer>/YYYY-MM-DD.manifest.json` を作成する
7. task の output 定義に応じて evidence patch、ログ、レポートの雛形を作成する
8. コーディングエージェントが `AGENT_TASK.md` に沿って、階層に応じた evidence patch 作成、仮説調整、評価更新、またはポジショニング見直しを行う

MVPでは、URL抽出や入力棚卸しのように決定的に処理できる部分を階層コマンドが実行し、意味的な判断はコーディングエージェントが行う。

### 11.3 `kizashi hypo` / `kizashi hypothesize`

入力情報から新しい課題仮説を作る。

例:

```bash
kizashi hypo --slug agent-workspace-orchestration --title "Agent Workspace Orchestration"
# or: kizashi hypothesize --slug agent-workspace-orchestration --title "Agent Workspace Orchestration"
```

出力:

- `kizashi/hypotheses/<slug>.md`

方針:

- 既存仮説と明確に異なる場合のみ新規作成する
- 類似仮説がある場合は新規作成ではなく改善候補とする

### 11.4 `kizashi refine`

既存仮説をブラッシュアップする。

例:

```bash
kizashi refine kizashi/hypotheses/whitebox-agent-memory.md
kizashi refine --all
```

改善観点:

- 誰が困るか
- いつ困るか
- 何が具体的に困るか
- 既存回避策
- 既存策の弱さ
- 反証条件
- 検証質問
- MVP案
- 発信文言

### 11.5 `kizashi evaluate`

仮説を評価する。

例:

```bash
kizashi evaluate kizashi/hypotheses/whitebox-agent-memory.md
kizashi evaluate --all
```

出力:

- `kizashi/evaluations/<slug>.eval.yaml`

重要:

- スコアだけでなく、理由を必ず残す
- スコア変更時は変更理由を残す
- 現実性と Pain の深さを重視する

### 11.6 `kizashi validate-plan`

検証計画を作る。

例:

```bash
kizashi validate-plan kizashi/hypotheses/agent-sprawl.md
```

出力:

- `kizashi/validations/<slug>.plan.md`

### 11.7 `kizashi route`

仮説を下流成果物へ変換する。

例:

```bash
kizashi route kizashi/hypotheses/whitebox-agent-memory.md --to issue,mvp,sns,lp
```

出力:

- `kizashi/outputs/issues/<slug>.issue.md`
- `kizashi/outputs/mvp/<slug>.mvp.md`
- `kizashi/outputs/sns/<slug>.x.md`
- `kizashi/outputs/lp/<slug>.lp.md`

### 11.8 `kizashi report`

レポート雛形を作成する。通常の階層実行では `kizashi review` または `kizashi positioning` を使う。

例:

```bash
kizashi report --name 2026-05-17
```

出力:

- `kizashi/review/YYYY-MM-DD.md`
- `kizashi/positioning/YYYY-MM-DD.md`

含める内容:

- Summary
- Sources Used
- New Signals
- Updated Hypotheses
- New Hypotheses
- Evaluation Changes
- Recommended Actions
- Files Changed

### 11.9 `kizashi log`

短い実行ログを作る。

例:

```bash
kizashi log today --layer signal
kizashi log today --layer hypothesis
```

出力:

- `kizashi/<layer>/YYYY-MM-DD.log.md`

方針:

- 10〜30行程度
- 差分だけを書く
- 長い分析は書かない
- 詳細は `hypotheses/`、`evaluations/`、`validations/`、`review/`、`positioning/` に置く

テンプレート:

```markdown
# Kizashi Log: YYYY-MM-DD

Sources: X bookmarks, wiki-garden

Added:
- `new-hypothesis.md`

Updated:
- `whitebox-agent-memory.md`: Painを再現性・レビュー不能性へ強化

Scores:
- `whitebox-agent-memory`: realism 4→5

Next:
- memory系MVP案
- PR review系の事例追加調査
```

### 11.10 `kizashi archive`

仮説を保留・棄却・統合済みに移す。

例:

```bash
kizashi archive hypotheses/old-hypothesis.md --as parked
kizashi archive hypotheses/weak-hypothesis.md --as rejected
kizashi archive hypotheses/duplicate.md --as superseded
```

出力:

- `kizashi/archive/parked/`
- `kizashi/archive/rejected/`
- `kizashi/archive/superseded/`

## 12. 評価軸

### 12.1 基本評価軸

| 評価軸 | 内容 | 高評価の条件 |
|---|---|---|
| realism | 現実的に起きそうか | すでに兆候や近い行動がある |
| pain_depth | 困りごとに深く刺さっているか | 時間・品質・信頼・収益に影響する |
| frequency | 繰り返し起きるか | 日常的・週次で発生する |
| future_growth | 今後増えるか | 新ツールの普及とともに増える |
| existing_solution_gap | 既存手段で足りないか | 手作業・属人化・コピペ・目視確認になっている |
| hachiware_fit | Hachiware Labs に合うか | Nagomi、refina、Argus、Delta Context などに接続できる |
| mvp_feasibility | 小さく試せるか | CLI、Markdown、GitHub連携、デモで検証できる |
| message_clarity | 発信しやすいか | 一文で「それ困る」と伝わる |
| monetization_potential | 将来お金を払う人がいるか | チーム・企業利用に発展しそう |
| user_count | 困っている人数・チーム数が多いか | 個人・チーム・組織に広く起きる |
| business_scale | 支払い・予算・業務影響が大きいか | 少人数でも高単価・高リスク・高影響 |
| spike_strength | Pain・ユーザー数・ビジネス規模のどれかが突き抜けているか | 少なくとも1軸が強い |

### 12.2 重視する評価軸

Kizashi では特に以下を重視する。

1. 現実性
2. Pain の深さ
3. Spike strength
4. 今後性
5. Hachiware Labs 適合度
6. MVP 検証容易性

仮説はすべての軸で大きい必要はない。以下のいずれかが強ければ良い仮説候補とする。

- Pain spike: 少数でも痛みが深い
- User-count spike: 困っている人数・チーム数が多い
- Business-scale spike: 支払い・予算・業務影響が大きい

## 13. 課題仮説の品質条件

### 13.1 良い課題仮説

- 誰が困るかが明確
- いつ困るかが明確
- 具体的な Pain がある
- なぜ今後増えるかが説明できる
- 現在の回避策がある
- その回避策の弱さがある
- 反証条件がある
- 検証質問に落とせる
- Hachiware Labs の製品・思想に接続できる
- 小さくMVP化できる
- 発信文言に変換できる

### 13.2 悪い課題仮説

- ただの技術アイデア
- 誰の困りごとか不明
- Pain が浅い
- 検証方法がない
- 既存製品との関係が薄い
- 大きすぎる
- 「便利そう」で止まっている
- 1件の情報だけで過剰に確信している

## 14. 階層別の出力粒度

| 種類 | 役割 | 粒度 | 長さ |
|---|---|---|---|
| `signal/` | source signal の追記記録 | 1 signal / source cluster | 短い |
| `<layer>/*.log.md` | 実行履歴 | 1実行 | 短い |
| `review/` / `positioning/` | review / positioning の判断 | 1レビュー | 中程度 |
| `<layer>/*.run.md` | 実行詳細 | 1タスク実行 | 詳細可 |
| `hypotheses/` | 仮説本体 | 継続更新 | 詳細 |
| `evaluations/` | 評価本体 | 継続更新 | 詳細 |

ログは極力短くする。  
詳細な分析はログに書かず、対応する evidence patch、仮説・評価・検証・レポートに書く。

## 15. Skill パッケージ構成

Vercel Skills で配布するリポジトリ構成案。

```text
kizashi-skill/
  README.md
  LICENSE
  SKILL.md

  references/
    overview.md
    source-definition.md
    hypothesis-format.md
    refinement-guide.md
    scoring-rubric.md
    validation-guide.md
    periodic-review.md
    daily-log.md
    hachiware-products.md

  assets/
    templates/
      sources.yaml
      tasks.yaml
      themes.yaml
      scoring-rubric.yaml
      hypothesis.md
      evaluation.yaml
      validation-plan.md
      periodic-report.md
      daily-log.md
      x-bookmark-input.md
      wiki-garden-input.md

  scripts/
    init-kizashi-project.js
    sources.js
    create-run.js
    summarize-outputs.js

  bin/
    kizashi.js

  package.json

  examples/
    project/
      config/
        sources.yaml
        tasks.yaml
        themes.yaml
      hypotheses/
        whitebox-agent-memory.md
      evaluations/
        whitebox-agent-memory.eval.yaml
      signal/
        2026-05-17.md
      review/
        2026-05-17.md
      positioning/
        2026-05-17.md
```

## 16. `SKILL.md` に記載すべき内容

`SKILL.md` には以下を含める。

- Kizashi の目的
- いつ使うか
- 情報ソース指定型であること
- Signal Capture
- Hypothesis Review
- Market Positioning
- Hypothesis Generation
- Hypothesis Refinement
- Hypothesis Evaluation
- Validation Plan
- Output Rules
- Command List
- File Structure
- Evaluation Rubric
- 実行ログは短くするルール

## 17. 利用パターン

Kizashi は Vercel Skills でインストールして使う Skill である。主な使い方は、npm コマンドをユーザーが直接覚えて実行することではなく、Vercel Skills として有効化された Kizashi をコーディングエージェントに `$kizashi` として使わせる形とする。

CLI / Node スクリプト / npm scripts は、エージェントが決定的な初期化・一覧確認・実行準備・検証を行うために Skill 内へ同梱する補助手段である。ユーザー向けの主導線ではない。

短い利用手順は以下のペア文書にも記載する。

- 英語: `docs/quickstart.md`
- 日本語: `docs/quickstart_ja.md`

### 17.1 コーディングエージェントを使う基本パターン

ユーザーは、Codex などのコーディングエージェントに以下のように依頼する。

初期化:

```text
Kizashi Skillを使って、このプロジェクトに kizashi/ ディレクトリを初期化してください。
Xブックマークは kimi-webbridge、wiki-garden は内部知識ソースとして設定してください。
```

入力収集:

```text
Kizashi Skillを使うために、kimi-webbridgeでBraveに接続してください。
Xで直近ブックマーク20件を取得し、はてなブックマークのAI系最新トレンドも調べて、
kizashi/inputs/ 以下に一次情報URLつきで保存してください。
```

Signal:

```text
Kizashi Skillを使って、`kizashi signal` で signal 階層を実行してください。
Xブックマーク、はてなブックマーク、wiki-garden の入力を読み、
仮説や評価は書き換えず、一次情報URLつきの evidence patch だけを残してください。
ログは短く日本語で作成してください。
```

Hypothesis:

```text
Kizashi Skillを使って、`kizashi review` で review 階層を実行してください。
evidence patch を既存仮説に照合し、必要な仮説本文と評価だけを更新してください。
各仮説に continue / narrow / merge / park / split と next_experiment を付けてください。
Pain、ユーザー数、ビジネス規模のいずれかが突き抜けている場合だけ新規仮説を作成してください。
```

Positioning:

```text
Kizashi Skillを使って、`kizashi positioning` で positioning 階層を実行してください。
vendor encroachment、buyer、pricing、adoption unit、外部productとして残る余白を見直してください。
ポジショニングレポートは日本語で作成してください。
```

仮説確認:

```text
Kizashi Skillを使って、現在の仮説一覧を出してください。
その後、agent-workspace-orchestration の説明、批評、改善案を順に出してください。
根拠になった一次情報URLも確認してください。
```

このパターンでは、エージェントが必要に応じて以下を行う。

1. `kizashi/config/sources.yaml` と `tasks.yaml` を読む
2. `kizashi/inputs/` に取得情報を保存する
3. `node bin/kizashi.js signal --target <project>` などの上位コマンドで、ソース棚卸し、signals、run README、AGENT_TASK、manifest、evidence patch雛形、レポート雛形、ログ雛形を作る
4. `<layer>/YYYY-MM-DD.task.md` を読み、階層に応じて evidence patch、仮説・評価・レポートを更新する
5. `hypotheses list/show/critique/improve` 相当の確認を行う
6. 変更内容と残課題をユーザーに報告する

### 17.2 CLI を直接使う補助パターン

ユーザーまたはエージェントが CLI を直接使う場合は、Vercel Skills に同梱された補助スクリプトを使う。npm グローバルインストールを前提にしなくてよい。リポジトリ内では Node.js で直接実行できる。

```bash
node bin/kizashi.js init --target .
node bin/kizashi.js sources list --target .
node bin/kizashi.js sources update --target . --id x_bookmarks --type browser_session --provider kimi-webbridge
node bin/kizashi.js signal --target . --date 2026-05-17
node bin/kizashi.js hypo --target . --slug agent-workspace-orchestration --title "Agent Workspace Orchestration"
# or: node bin/kizashi.js hypothesize --target . --slug agent-workspace-orchestration --title "Agent Workspace Orchestration"
node bin/kizashi.js review --target . --date 2026-05-17
node bin/kizashi.js positioning --target . --date 2026-05-17
node bin/kizashi.js hypotheses list --target .
node bin/kizashi.js hypotheses show agent-workspace-orchestration --target .
node bin/kizashi.js hypotheses critique agent-workspace-orchestration --target .
node bin/kizashi.js hypotheses improve agent-workspace-orchestration --target .
node bin/kizashi.js summarize --target .
```

Vercel Skills として配布・インストールする場合は、次のような形も使える。

```bash
npx skills add hachiware-labs/kizashi-skill
```

インストール済みで `kizashi` コマンドが使える環境では、`node bin/kizashi.js ...` の代わりに `kizashi ...` を使える。

### 17.3 エージェント依頼例

Review 実行例:

```text
Kizashi Skillを使って、`kizashi review` で review 階層を実行してください。
evidence patch を既存仮説に照合し、必要な仮説本文と評価だけを更新してください。
現実性とPainの深さを重視して評価し、`review/` にレビュー出力を作成してください。
ログは短く残してください。
```

Signal 実行例:

```text
Kizashi Skillを使って、`kizashi signal` で signal 階層を実行してください。
今日のXブックマークと wiki-garden の入力から、仮説や評価は書き換えず、evidence patch と短いログだけを作成してください。
```

## 18. 初期MVPの範囲

### 18.1 MVPに含める

- `SKILL.md`
- `references/scoring-rubric.md`
- `references/hypothesis-format.md`
- `references/periodic-review.md`
- `references/daily-log.md`
- `assets/templates/sources.yaml`
- `assets/templates/tasks.yaml`
- `assets/templates/hypothesis.md`
- `assets/templates/evaluation.yaml`
- `assets/templates/periodic-report.md`
- `assets/templates/daily-log.md`
- `kizashi init`
- `kizashi sources`
- `kizashi signal`
- `kizashi hypo`
- `kizashi hypothesize`
- `kizashi review`
- `kizashi positioning`
- `kizashi refine`
- `kizashi evaluate`
- `kizashi log`
- `kizashi report`

### 18.2 MVPでは任意

- `kizashi validate-plan`
- `kizashi route`
- `kizashi archive`
- 実スクリプトによる自動ファイル生成
- GitHub API 連携
- X Bookmark Skill との直接連携
- wiki-garden Skill との直接連携

## 19. 将来拡張

- GitHub Actions による定期実行
- X Bookmark Skill との自動連携
- wiki-garden Skill との自動連携
- GitHub Issues 自動生成
- SNS投稿案の定期生成
- LP文言改善
- 仮説ランキングダッシュボード
- scoring の履歴可視化
- 棄却仮説の再発掘
- Hachiware Labs 製品ロードマップとの接続

## 20. まとめ

Kizashi は、Hachiware Labs の探索・企画・製品開発の最上流に置く Skill である。

その本質は、以下である。

```text
指定された情報ソースから継続的に材料を取得し、
外部シグナルと内部知識を掛け合わせ、
課題仮説を生成・改善・評価し続ける。
```

最重要方針は以下である。

- 情報を集めるだけで終わらせない
- 面白いアイデアではなく、現実的で深い Pain のある課題仮説を作る
- 既存仮説を優先的に育てる
- 評価理由と反証条件を残す
- 実行ログは短くする
- Hypothesis Review で判断と次アクションを整理する
- Market Positioning で外部 product として残る余白を見直す
