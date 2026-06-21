# Kizashi Skill 要件定義

## 1. 概要

Kizashi は、指定された情報ソースから材料を取得し、Hachiware Labs 向けの課題仮説を生成・改善・評価するための Vercel Skills 対応 Skill である。

単なる情報収集ツールではなく、外部シグナルと内部知識を掛け合わせて、検証可能な課題仮説へ変換することを目的とする。

また、単なる llm-wiki リーダーではなく、Karpathy 型の llm-wiki 構造を知識管理の中核に置き、日々のソース指定、情報ソース一覧・編集、Kizashi へのフィードバック反映、単発知識の ingest、知識 query、automation による Daily Report 作成、レポートの知識化、知識 lint/refinement を通じて、探索と仮説更新を加速する仕組みである。

Daily Report のソース取得には Computer Use を使う。ブラウザ、X、ローカルアプリ、資料ビューアなど、ユーザーが表示している情報を読み取り専用で確認し、`raw/app-captures/` に保存してから llm-wiki と統合する。

## 2. コンセプト

Kizashi は、以下の流れを支援する。

```text
llm-wiki の保存フォルダと情報ソースを定義する
  ↓
SCHEMA.md と sources.yaml を作る
  ↓
取得方法を決める
  ↓
調査を実行する
  ↓
Computer Use で当日の表示中ソースを取得する
  ↓
取得情報をシグナル化する
  ↓
重要シグナルは元ソースだけでなく周辺ソース・過去レポート・既存知識・反証候補まで深堀調査する
  ↓
Daily Report として詳細に統合する
  ↓
レポート自体を llm-wiki の `reports/daily/` に保存する
  ↓
Kizashi へのフィードバックをスキル改善または知識として反映する
  ↓
既存仮説と照合する
  ↓
課題仮説を新規生成 / 改善する
  ↓
現実性・Painの深さで評価する
  ↓
検証計画・MVP案・発信案へ接続する
  ↓
日々の変更ログ、定期レビュー、知識 refinement を残す
```

## 3. Kizashi の位置づけ

| 項目 | 内容 |
|---|---|
| ツール名 | Kizashi |
| 形式 | Vercel Skills でインストールできる Skill |
| 主目的 | 情報ソース指定型の課題仮説生成・改善、および Daily Report による知識加速 |
| 主入力 | Xブックマーク、wiki-garden、リリースノート、GitHub、技術記事など |
| 主出力 | evidence patch、Daily Report、保存済み知識、課題仮説、評価、検証計画、短い実行ログ |
| 実行形態 | 手動実行 / 定期実行タスク |
| 重要方針 | 新規仮説を乱造せず、既存仮説を育てる |

### 3.1 出力言語・ロケール方針

Kizashi は、レポート、ログ、課題仮説、評価、検証計画、query 回答、フィードバック記録を、ユーザーの使用言語・ロケールに合わせて作成する。

言語指定が明示されていない場合は、会話の言語、既存文書の言語、対象 wiki の既存ページ、プロジェクト内の既存成果物から推定する。複数言語が混在する場合は、ユーザーへの確認が必要な場合を除き、直近のユーザー発話の言語を優先する。

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

### 4.4 Daily Report と知識加速

- 最初に wiki フォルダ、対象ドメイン、情報ソースを決め、`SCHEMA.md`、`index.md`、`log.md`、`sources.yaml`、`raw/`、`concepts/`、`queries/`、`reports/daily/` を作る
- 初期化時に具体的な情報ソースがない場合は、Agent がユーザーの関心、プロジェクト文脈、想定ソース種別から少数の候補を提案し、対話しながら有効化するソースを決める。後から source edit で追加・無効化できることも伝える
- 保存フォルダまたは `sources.yaml` がない場合は init 未完了として扱う
- 情報ソース一覧として、`sources.yaml` の id、type、role、cadence、enabled、input_path、provider を確認できる
- 情報ソース編集として、継続ソース、単発ソース、Computer Use capture、Xブックマークなどを追加・更新・無効化できる
- 「Kizashi に xxx をフィードバックして」と依頼された場合、内容に応じてスキル・テンプレート・情報ソース設定を見直すか、`raw/feedback/` に記録する
- ユーザーが、その日のソースとしてサイト、Xブックマーク、記事、ローカルメモ、過去レポートなどを指定する
- Daily Report のソース取得では Computer Use を使い、表示中のブラウザ・アプリから読み取り専用で材料を取得して `raw/app-captures/` に保存する
- Kizashi は蓄積知識と当日のソースを組み合わせ、`assets/templates/daily-signal-report.md` と、記事本文を抜いたHTMLシェル `assets/templates/daily-signal-report.html` に沿って Daily Report を作る
- レポートには、本日のテーマ、シグナル、変化の兆し、過去レポート・既存知識との接続、課題の深化、仮説の更新、次へのアイデア、編集後記、Feedback を含める
- 重要シグナルは、元ソースの記述だけで判断せず、関連URL、周辺記事、公式ドキュメント、過去レポート、既存wikiページ、反証候補を確認し、何が確認できたか・何が未確定かを残す
- URLがあるシグナルは `Original URL` を必ず残す
- automation または手動依頼で作成した Daily Report は、次回以降の query / refinement に使えるよう必ず llm-wiki の `reports/daily/` に保存し、`index.md` と `log.md` に反映する
- `$kizashi AIレビューでは根拠URLを必ず残す、と覚えて` や `$kizashi Cursor Background Agentは非同期PR作業の比較対象として追跡する、と覚えて` のような具体的な依頼は ingest として扱い、すぐレポート化しない場合でも llm-wiki の `raw/` に保存し、必要に応じて `concepts/` や `queries/` に統合する
- llm-wiki の lint に相当する知識 refinement として、重複、弱い主張、古い見立て、URL不足、過去レポート未接続を整理する

### 4.5 llm-wiki 標準操作

- setup: ユーザーに wiki フォルダ、対象ドメイン、情報ソースを確認し、具体的な情報ソースが未定なら候補を提案して対話で決め、構造を初期化する
- source list: `<wiki>/sources.yaml` を読み、登録済み情報ソースと有効/無効状態を一覧する
- source edit: `<wiki>/sources.yaml` に情報ソースを追加・更新・無効化し、`log.md` に記録する
- feedback: Kizashi へのフィードバックを、一般的な挙動改善なら Skill パッケージへ反映し、ユーザー固有の好みや知識なら `<wiki>/raw/feedback/` に記録する
- ingest: `$kizashi AIレビューでは根拠URLを必ず残す、と覚えて`、`$kizashi remember that AI review findings should always keep evidence URLs` のような具体的な記憶依頼をトリガーとして、`raw/` に immutable な一次ソースを保存し、関連する wiki ページを作成・更新する
- query: `$kizashi CursorのBackground Agentについて調べて`、`$kizashi 過去レポートからAIエージェントの評価観点を教えて`、`$kizashi research Cursor Background Agent`、`$kizashi tell me the evaluation criteria for AI agents from past reports` のような具体的な調査・質問依頼をトリガーとして、`SCHEMA.md`、`index.md`、最近の `log.md`、関連ページを読んで回答し、残す価値がある回答は `queries/` に保存する
- daily report: ソースと既存 wiki をもとに `<wiki>/reports/daily/YYYY-MM-DD.md` と必要に応じて `.html` を生成し、wiki query の検索対象にする
- lint/refinement: stale、重複、低 confidence、source URL 不足、孤立ページ、矛盾を確認し、`outputs/lint/` に結果を残す

## 5. 情報ソース

Kizashi は、llm-wiki の情報ソースを `<wiki>/sources.yaml` で定義する。これが Daily Report、ingest、query、lint/refinement の正本である。`kizashi/config/sources.yaml` は Signal / Review / Positioning 補助コマンド用のプロジェクト設定として残す。

### 5.1 想定する情報ソース

| ソース | 役割 | 取得担当 |
|---|---|---|
| Xブックマーク | 外部シグナル | X Bookmark Skill |
| wiki-garden | 内部知識・過去メモ | wiki-garden Skill |
| 表示中ブラウザ / アプリ | Daily Report 用の当日ソース取得 | Computer Use |
| ユーザーフィードバック | スキル改善・レポート改善・ユーザー固有の好み | Kizashi |
| リリースノート | 新ツール・新機能の変化 | Kizashi または別 Skill |
| GitHub Issues / Discussions | 実際の困りごと・回避策 | GitHub Skill / API |
| 技術記事 | 実践例・利用者の工夫 | Web検索 / RSS |
| 競合ツール情報 | 既存手段と限界 | Web検索 |

### 5.2 `<wiki>/sources.yaml` 例

```yaml
sources:
  - id: manual_notes
    name: Manual Notes
    type: manual_note
    description: One-off ideas, pasted notes, and user-provided material remembered for future reports and queries.
    input_path: raw/notes/
    expected_format: markdown
    cadence: ad_hoc
    role: internal_context
    enabled: true

  - id: daily_app_captures
    name: Daily App Captures
    type: computer_use
    description: Read-only captures from visible browser tabs, X sessions, desktop apps, and document viewers.
    input_path: raw/app-captures/
    expected_format: markdown
    cadence: daily_or_requested
    role: daily_source
    enabled: true

  - id: user_feedback
    name: User Feedback
    type: feedback
    description: User instructions and corrections addressed to Kizashi.
    input_path: raw/feedback/
    expected_format: markdown
    cadence: ad_hoc
    role: refinement_signal
    enabled: true

  - id: x_bookmarks
    name: X Bookmarks
    type: browser_session
    description: X bookmarks and keyword search results collected through browser automation when authorized by the user.
    provider: kimi-webbridge
    input_path: raw/x-bookmarks/
    expected_format: markdown_or_yaml
    cadence: daily_or_requested
    role: external_signal
    enabled: false

  - id: user_sites
    name: User-Specified Sites
    type: web_or_manual
    description: Sites, product pages, documentation, release notes, and articles selected by the user.
    input_path: raw/sites/
    expected_format: markdown
    cadence: requested_or_monitor
    role: external_signal
    enabled: true

  - id: past_daily_reports
    name: Past Daily Reports
    type: internal_report
    description: Prior Kizashi Daily Reports used as memory, contrast, and change-sign context.
    input_path: reports/daily/
    expected_format: markdown_or_html
    cadence: every_report
    role: accumulated_knowledge
    enabled: true
```

### 5.3 情報ソース一覧・編集

情報ソース一覧は `<wiki>/sources.yaml` を読み、各ソースの `id`、`name`、`type`、`role`、`cadence`、`enabled`、`input_path`、`provider` を表示する。Daily Report や automation は、原則として `enabled: true` のソースを候補にする。

情報ソース編集は、ソースの追加、説明・取得方法・cadence の更新、有効/無効切り替えを行う。削除は履歴が失われやすいため基本は `enabled: false` にする。編集後は `log.md` に、誰が何を変更したかを短く追記する。

## 6. 調査タスク

調査タスクは `kizashi/config/tasks.yaml` に定義する。

### 6.1 タスクの考え方

`daily` / `weekly` / `monthly` は階層名にしない。階層は役割名で定義し、頻度は運用上の目安としてだけ扱う。

| 階層 | 位置づけ | 対応コマンド | 頻度の目安 | 目的 |
|---|---|---|---|---|
| Signal | evidence intake layer | `kizashi signal`（非X）/`kizashi signal-x`（X） | source batch ごと | 取得情報を evidence patch として追記する。仮説・評価は触らない |
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
      - wiki_garden
      - release_notes
      - github_signals
      - articles

    actions:
      - consume_inputs
      - extract_signals
      - deep_dive_important_signals
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

  - id: signal_capture_x
    name: X Signal Capture
    layer: signal
    position: evidence_intake_layer
    mode: evidence_capture
    cadence: per_source_batch

    sources:
      - x_bookmarks

    actions:
      - consume_inputs
      - extract_signals
      - deep_dive_important_signals
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

Kizashi Skill は、まずユーザーが指定した llm-wiki ルートに以下の構成を作る。そのうえで、Kizashi 固有の補助ファイルが必要な場合だけ `kizashi/` を使う。

```text
wiki/
  SCHEMA.md
  index.md
  log.md
  sources.yaml
  raw/
    articles/
    sites/
    x-bookmarks/
    app-captures/
    feedback/
    notes/
    transcripts/
    assets/
  entities/
  concepts/
  comparisons/
  queries/
  reports/
    daily/
      YYYY-MM-DD.md
      YYYY-MM-DD.html
  outputs/
    lint/

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

### 8.0 llm-wiki root

Karpathy 型の llm-wiki 構造。Kizashi の知識管理の正本。

- `SCHEMA.md`: ドメイン、構造、タグ、frontmatter、運用ルール
- `index.md`: wiki ページのカタログと一行要約
- `log.md`: ingest / query / daily report / lint の追記ログ
- `sources.yaml`: 情報ソース登録簿。source list / source edit の正本
- `raw/`: immutable な一次ソース
- `raw/app-captures/`: Computer Use で取得した表示中ブラウザ・アプリ由来の当日ソース
- `raw/feedback/`: Kizashi へのフィードバック記録
- `entities/`, `concepts/`, `comparisons/`: LLM が維持する合成ページ
- `queries/`: 保存する価値のある query 結果
- `reports/daily/`: Kizashi Daily Report
- `outputs/lint/`: lint/refinement 結果

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

これは Daily Report の正本ではない。Daily Report は wiki query で検索・接続される知識なので、必ず `<wiki>/reports/daily/` に保存する。

### 8.7 `<wiki>/reports/daily/YYYY-MM-DD.md` / `<wiki>/reports/daily/YYYY-MM-DD.html`

Kizashi Daily Report。ユーザー自身の判断に影響するソース固有の情報を、軽いニュース要約ではなく詳細なレポートとして残す。

Daily Report は llm-wiki の知識であり、`<wiki>/reports/daily/` が正本である。`kizashi/review/`、`kizashi/positioning/`、`kizashi/outputs/` のみに保存してはいけない。保存後は `index.md` に追加し、`log.md` に追記する。

標準テンプレート:

- `assets/templates/daily-signal-report.md`
- `assets/templates/daily-signal-report.html`（記事本文を抜いた安定出力用HTMLシェル）

含める内容:

- `YYYY/M/Dのテーマ`
- 今日の3行要約
- 本日のレポート
- シグナル
- 課題の深化
- 仮説の更新
- 次へのアイデア
- 編集後記：今後の展望
- Feedback

Feedback では、ユーザーが「Kizashi Skill に xxx をフィードバックして」と依頼できることを明記する。Kizashi は内容に応じて、スキル・テンプレート・情報ソース設定を見直すか、llm-wiki の `raw/feedback/` に記録する。

シグナルごとに含める内容:

- 詳細な本文
- 変化の兆し
- 重要シグナルの場合は周辺調査の結果、確認できたこと、未確定事項、反証候補
- 過去レポート・既存知識との接続
- 1〜2個のペインポイント
- `Source File`
- `Original URL`
- `Related Report`
- `Related Knowledge`

### 8.8 `<wiki>/raw/feedback/YYYY-MM-DD-<slug>.md`

Kizashi へのフィードバック記録。ユーザーが「Kizashi に xxx をフィードバックして」と依頼した内容を、次回以降の Daily Report、query、lint/refinement、または Skill 改善に使う。

標準テンプレート:

- `assets/templates/llm-wiki-feedback.md`

判定:

- report format、source handling、workflow、output rules、template、script の改善なら Skill パッケージを更新する
- ユーザー固有の好み、観点、テーマ、レポートの読み方なら `raw/feedback/` に記録する
- 両方に効く場合は、Skill パッケージ更新と `raw/feedback/` 記録を両方行う
- 曖昧で誤適用のリスクが高い場合だけ確認する
- 「了解しました」だけで終わらせず、必ず durable な変更または記録を残す

## 9. コマンド一覧

Kizashi Skill が提供する概念コマンドは以下とする。

| コマンド | 役割 | 主な出力 |
|---|---|---|
| `kizashi init` | プロジェクト初期化 | `config/*` |
| `kizashi sources` | 情報ソース定義の確認・編集。`--wiki` 指定時は llm-wiki の正本を扱う | `<wiki>/sources.yaml` または `config/sources.yaml` |
| `kizashi task` | 定期タスク定義の確認・編集 | `config/tasks.yaml` |
| `kizashi signal` | Signal 階層（非X）を実行 | `signal/*` |
| `kizashi signal-x` | Signal 階層（X）を実行 | `signal/*` |
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
| `kizashi report` | Review / Positioning 用レポート雛形作成。Daily Report の正本ではない | `review/*.md` |
| `kizashi log` | 短い実行ログ作成・追記 | `<layer>/YYYY-MM-DD.log.md` |
| `kizashi archive` | 保留・棄却・統合済み仮説の整理 | `archive/*` |

## 10. MVPコマンド

初期版では以下を必須とする。

| コマンド | 必須度 | 理由 |
|---|---:|---|
| `kizashi init` | 必須 | プロジェクト構造を作る |
| `kizashi sources` | 必須 | 情報ソースの一覧・編集が Kizashi の起点になる |
| `kizashi signal` / `kizashi signal-x` / `kizashi review` / `kizashi positioning` | 必須 | 3階層タスクの本体 |
| `kizashi hypo/hypothesize` | 必須 | 新規仮説生成 |
| `kizashi hypotheses list/show` | 必須 | 仮説を育てるための確認導線 |
| `kizashi hypotheses critique/improve` | 必須 | 仮説の批評と改善を標準ワークフローにする |
| `kizashi refine` | 必須 | 仮説改善 |
| `kizashi evaluate` | 必須 | 現実性・Pain深さの評価 |
| `kizashi log` | 必須 | 日々の変更履歴 |
| `kizashi report` | 必須 | 定期レビュー用。Daily Report は `<wiki>/reports/daily/` に保存する |

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

### 11.1.1 `kizashi sources`

情報ソース一覧・編集を行う。llm-wiki の正本を扱う場合は `--wiki <wiki-root>` を指定する。

例:

```bash
kizashi sources list --wiki C:\path\to\llm-wiki
kizashi sources show --wiki C:\path\to\llm-wiki --id x_bookmarks
kizashi sources add --wiki C:\path\to\llm-wiki --id product_site --name "Product Site" --type web_or_manual --input-path raw/sites/ --role external_signal --cadence daily_or_requested
kizashi sources update --wiki C:\path\to\llm-wiki --id x_bookmarks --enabled false
```

処理:

1. `<wiki>/sources.yaml` を読む
2. 一覧では id、name、type、role、cadence、enabled、input_path を表示する
3. 編集ではソースを追加・更新・無効化する
4. source id は過去レポートや raw source から参照されるため、安易に変更しない
5. 変更後は `log.md` に短く記録する

### 11.2 `kizashi signal` / `kizashi signal-x` / `kizashi review` / `kizashi positioning`

指定タスクの上位ワークフローを実行する。

例:

```bash
kizashi signal
kizashi signal-x
kizashi review
kizashi positioning
```

処理:

1. `config/sources.yaml` を読む
2. `config/tasks.yaml` を読む
3. 対象ソースの `inputs/` を棚卸しする
4. URL、見出し、箇条書き候補を機械的に抽出し、`<layer>/YYYY-MM-DD.signals.md` に保存する
5. 重要度が高い候補は、元ソースだけでなく関連URL、過去レポート、既存wiki、周辺ドキュメント、反証候補を深堀調査する
6. 既存仮説と評価ファイルを一覧化する
7. `<layer>/YYYY-MM-DD.run.md`、`<layer>/YYYY-MM-DD.task.md`、`<layer>/YYYY-MM-DD.manifest.json` を作成する
8. task の output 定義に応じて evidence patch、ログ、レポートの雛形を作成する
9. コーディングエージェントが `AGENT_TASK.md` に沿って、階層に応じた evidence patch 作成、仮説調整、評価更新、またはポジショニング見直しを行う

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

Review / Positioning 用のレポート雛形を作成する。通常の階層実行では `kizashi review` または `kizashi positioning` を使う。これは Daily Report の作成先ではない。日ごろの Daily Report は wiki query で検索される知識なので `<wiki>/reports/daily/` に保存する。

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
      llm-wiki-schema.md
      llm-wiki-sources.yaml
      llm-wiki-feedback.md
      daily-signal-report.md
      daily-signal-report.html
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
Xブックマークは kimi-webbridge として browser 経由で設定し、wiki-garden は内部知識ソースとして設定してください。
```

入力収集:

```text
Kizashi Skillを使うために、kimi-webbridgeでBraveに接続してください。
Xで直近ブックマーク20件を取得し、はてなブックマークのAI系最新トレンドも調べて、
Xキーワード検索結果も browser（kimi-webbridge）で取得し、kizashi/inputs/ 以下に一次情報URLつきで保存してください。
```

Signal（非X）:

```text
Kizashi Skillを使って、`kizashi signal` で signal 階層（非X）を実行してください。
wiki-garden、リリースノート、GitHub、記事の入力を読み、
仮説や評価は書き換えず、一次情報URLつきの evidence patch だけを残してください。
ログは短く日本語で作成してください。
```

```text
Signal（X）:
Kizashi Skillを使って、`kizashi signal-x` で X ブックマークとXキーワード検索系 source を実行してください。
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
3. `node bin/kizashi.js signal --target <project>`（非X）または `node bin/kizashi.js signal-x --target <project>`（X）で、ソース棚卸し、signals、run README、AGENT_TASK、manifest、evidence patch雛形、レポート雛形、ログ雛形を作る
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
node bin/kizashi.js signal-x --target . --date 2026-05-17
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
Kizashi Skillを使って、`kizashi signal` で非Xの signal 階層を実行してください。
今日の wiki-garden / リリースノート / GitHub / 記事の入力から、仮説や評価は書き換えず、evidence patch と短いログだけを作成してください。
```

```text
Kizashi Skillを使って、`kizashi signal-x` で X ブックマークと検索結果入力を実行してください。
仮説や評価は書き換えず、evidence patch と短いログだけを作成してください。
```

## 18. 初期MVPの範囲

### 18.1 MVPに含める

- `SKILL.md`
- `references/scoring-rubric.md`
- `references/hypothesis-format.md`
- `references/periodic-review.md`
- `references/daily-log.md`
- `assets/templates/llm-wiki-schema.md`
- `assets/templates/llm-wiki-sources.yaml`
- `assets/templates/llm-wiki-feedback.md`
- `assets/templates/daily-signal-report.md`
- `assets/templates/daily-signal-report.html`
- `assets/templates/sources.yaml`
- `assets/templates/tasks.yaml`
- `assets/templates/hypothesis.md`
- `assets/templates/evaluation.yaml`
- `assets/templates/periodic-report.md`
- `assets/templates/daily-log.md`
- `kizashi init`
- `kizashi sources`
- `kizashi signal`
- `kizashi signal-x`
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
- X 収集の browser ベース運用
- wiki-garden Skill との直接連携

## 19. 将来拡張

- GitHub Actions による定期実行
- X ブラウザ収集（キーワード／ブックマーク）の自動化
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
