# Agent Workspace Orchestration

Status: active
Last Updated: 2026-05-17

## Rough Hypothesis

AIエージェントが増えると、開発者は複数のagent sessionを管理できなくなる。

## Refined Hypothesis

Codex、Claude Code、browser agent、local LLM、Obsidian連携などを並行して使うAI-heavy developerは、各agentが何をしているか、どの文脈を持っているか、どの承認や介入が必要か、後でどう再開するかを見失う。terminal tabs、tmux、browser tabs、手書きメモではagent固有の状態・証跡・文脈を横断管理できないため、agent workspaceが必要になる。

## Background Change

Xブックマーク20件とHatena AIトレンドの双方で、Codex workflow、Hooks、real browser agent、tmux for agents、Obsidian memory、local LLM、multi-agent operationへの関心が確認できた。

## Target User

- Codex / Claude Code / browser agentを日常的に使うAI-heavy developer
- 複数agent sessionを運用する個人開発者・小規模チーム
- agent workflowを標準化したいdeveloper productivity team

## User / Market Estimate

Primary User:
- AI-heavy developer。

Buyer:
- 初期は個人または小規模チーム。将来的にはdeveloper productivity team。

Adoption Unit:
- individual -> team

Estimated User Count:
- medium now, large later。現時点では早期ユーザー中心だが、Codex/Claude Code/browser agent/local LLM利用拡大とともに増える。

Business Scale:
- wedge。初期市場は狭いが、team-level agent operationsに拡張できる。

Spike Type:
- mixed。早期ユーザーのpainが深く、将来user_countも伸びる。

## Trigger Moment

複数のagentにタスクを委任し、途中でブラウザ操作・コード生成・ローカル推論・メモ参照・承認判断が混ざったとき。

## Concrete Pain

- agent sessionがterminal、browser、IDE、local model、notesに散らばる。
- どのagentがどの文脈で何を試したか追えない。
- approval、Hooks、browser action、変更ファイルの証跡がまとまらない。
- 後で再開するときにtranscriptを読み直して状態復元する必要がある。

## Current Workarounds

- tmux / terminal tabs
- browser tabs
- ObsidianやMarkdownメモ
- agent自身にsummaryを書かせる

## Why Workarounds Fail

- agent固有の状態、承認、実行ログ、文脈の出どころを構造化できない。
- Codex、Claude Code、Kimi WebBridge、local LLMを横断できない。
- summaryは実ログとずれる。
- handoffやreview時に証跡として弱い。

## Evidence Signals

- Source File: `kizashi/inputs/x-bookmarks/2026-05-17.md`
  Original URL: https://x.com/dingyi/status/2055528179830571472
  Signal: herdr / muxy が "tmux for agents" として言及されている。
  Supports: terminal multiplexerでは足りないagent session orchestration需要。

- Source File: `kizashi/inputs/x-bookmarks/2026-05-17.md`
  Original URL: https://x.com/AI_masaou/status/2055253385851568608
  Signal: Kimi WebBridgeで実際のBrave/Chrome browser sessionをagentが操作できる点に価値が見出されている。
  Supports: agent workspaceはreal browser sessionも管理対象にする必要がある。

- Source File: `kizashi/inputs/x-bookmarks/2026-05-17.md`
  Original URL: https://x.com/Codestudiopjbk/status/2055309782639317306
  Signal: Codex Hooksによりagent loopへ直接介入できる。
  Supports: agent loopの可視化・介入・approval trackingが必要。

- Source File: `kizashi/inputs/x-bookmarks/2026-05-17.md`
  Original URL: https://x.com/Codestudiopjbk/status/2055249501456302385
  Signal: Codex x Obsidian second brainへの関心。
  Supports: agent memory / persistent contextの管理需要。

- Source File: `kizashi/inputs/hatena/2026-05-17-ai-trends.md`
  Original URL: https://zenn.dev/shio_shoppaize/articles/5fee11d03a11a1
  Signal: Claude CodeでAI部下10人を作るmulti-agent運用が注目されている。
  Supports: agent数が増えるほど状態管理・統制のpainが増える。

## Counter-Evidence

- CodexやClaude Codeがnative workspaceを強化すれば独立需要は弱くなる。
- 早期ユーザーは自前のtmux/Obsidian運用を好む可能性がある。
- 一般開発者にはまだ複数agent並行運用の頻度が低い。

## Falsification Conditions

- AI-heavy developerが既存のtmux/browser tabs/notesで十分と答える。
- tool-native workspaceが短期に収束し、横断layerが不要になる。
- agent sessionを後から再開・監査するニーズがない。

## Hachiware Labs Fit

Delta Context / Argusに強く接続する。agent session、文脈、承認、実行証跡、browser actionを横断的に保存・比較・再開するlayerとして展開できる。

## Validation Questions

- AI-heavy developerは同時に何個のagent sessionを走らせているか。
- 再開時に最も失われる情報は何か。
- approval / browser action / changed files / transcript / notes のうち何をworkspaceに残したいか。
- Markdown-firstの `agent-sessions.md` でpainが軽くなるか。

## MVP / Experiment Ideas

- `agent-sessions.md` を生成し、active sessions、context files、approvals、outputs、next actionsを一覧化する。
- Kimi WebBridge操作ログとCodex runを1つのhandoff noteにまとめる。

## Message

Agentがチームメイトになるほど、開発者にはterminal tabではなくagent stateのworkspaceが必要になる。

## Change History

- 2026-05-17: Brave + Kimi WebBridgeで取得したX 20件とHatena AIトレンドから作成。新規仮説は1件に制限。
