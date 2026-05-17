# Agent Workspace Orchestration

Status: active
Last Updated: 2026-05-17

## Rough Hypothesis

As developers use more AI agents, they need a better way to manage sessions.

## Refined Hypothesis

Developers running Codex, Claude Code, browser agents, local LLMs, and tool-specific agents need a persistent workspace that shows what each agent is doing, what context it has, what approvals it needs, and how to resume or hand off work, because terminal tabs, tmux, and scattered browser sessions do not provide enough visibility or control.

## Background Change

Bookmarked X items show interest in "tmux for agents", Codex visual workflows, Kimi WebBridge using real Brave/Chrome sessions, Codex Hooks, Codex desktop responsive feedback, and Obsidian-based context.

## Target User

- AI-heavy developers who run multiple agent sessions per day
- Engineering leads standardizing agent workflows
- Solo builders using Codex and browser agents as a small team substitute

## User / Market Estimate

Primary User:
- AI-heavy developer and solo builder who uses Codex, Claude Code, browser agents, and local LLM tools daily.

Buyer:
- Individual power user at first; later developer productivity team or engineering manager.

Adoption Unit:
- individual -> team

Estimated User Count:
- medium now, large later because agent-heavy workflows are still early but visible across Codex, Claude Code, browser agents, and local LLM communities.

Business Scale:
- wedge because the first market may be narrow, but the workflow layer could expand into team-level agent operations.

Spike Type:
- mixed: strong user pain for early adopters plus future user-count growth.

## Trigger Moment

A user delegates multiple tasks to agents, leaves them running, switches tools, or needs to resume work later with confidence about state, context, and next action.

## Concrete Pain

- Agents run in scattered places: terminals, browser tabs, IDEs, local model servers, and notes.
- The user loses track of which agent has which context and what it already tried.
- Approval prompts and tool permissions are hard to inspect across sessions.
- Resuming work requires rereading transcripts and reconstructing state.

## Current Workarounds

- tmux, terminal tabs, and shell history
- Manual notes in Obsidian or Markdown
- Browser tabs for each agent
- Asking agents to summarize their own state

## Why Workarounds Fail

- They do not expose agent-specific state, pending approvals, or context provenance.
- They cannot compare sessions across Codex, Claude Code, browser agents, and local LLMs.
- Summaries drift from actual logs and can omit failed attempts.
- They make handoff and review difficult.

## Evidence Signals

- Source File: `kizashi/inputs/x-bookmarks/2026-05-17.md`
  Original URL: https://x.com/dingyi/status/2055528179830571472
  Signal: Bookmark references herdr and muxy as easier alternatives to tmux for agent workflows.
  Supports: Developers need agent-specific session orchestration beyond terminal multiplexers.

- Source File: `kizashi/inputs/x-bookmarks/2026-05-17.md`
  Original URL: https://x.com/AI_masaou/status/2055253385851568608
  Signal: Bookmark highlights Kimi WebBridge controlling the user's real Brave/Chrome browser session instead of a test browser.
  Supports: Agent workspaces need to manage real browser sessions and user-context actions.

- Source File: `kizashi/inputs/x-bookmarks/2026-05-17.md`
  Original URL: https://x.com/Codestudiopjbk/status/2055309782639317306
  Signal: Bookmark describes Codex Hooks as a way to intervene directly in the Codex task loop.
  Supports: Users need visibility and control over agent loops, approvals, and interventions.

- Source File: `kizashi/inputs/x-bookmarks/2026-05-17.md`
  Original URL: https://x.com/Codestudiopjbk/status/2055249501456302385
  Signal: Bookmark points to Codex + Obsidian as a "second brain" workflow.
  Supports: Persistent context and memory are part of the agent workspace pain.

- Source File: `kizashi/inputs/x-bookmarks/2026-05-17.md`
  Original URL: https://x.com/taiyo_ai_gakuse/status/2054929095696490952
  Signal: Bookmark notes Codex desktop responsive adjustment as useful.
  Supports: Agent workspaces need fast feedback loops for frontend and visual work.

## Counter-Evidence

- Power users may prefer composing existing tools rather than adopting a new workspace.
- Codex, Claude Code, and IDEs may add native session management.
- The problem may be intense for early adopters but less common for typical teams.

## Falsification Conditions

- Users with multiple agent sessions say tmux, browser tabs, and notes are sufficient.
- Tool-native workspaces converge quickly and remove the need for a cross-agent layer.
- Users do not need to resume or audit old agent sessions.

## Hachiware Labs Fit

This fits Delta Context and Argus: capture agent sessions, context, approvals, and evidence across tools. It can become the operational layer above Codex, Claude Code, Kimi WebBridge, and local LLM workflows.

## Validation Questions

- How many agent sessions do heavy users run at the same time?
- What state do users need to see before trusting or resuming an agent?
- Which session artifacts should be durable: transcript, files changed, commands, approvals, browser actions, or notes?
- Would users adopt a Markdown-first workspace before a full UI?

## MVP / Experiment Ideas

- Create a Markdown session index that tracks active agent sessions, context files, approvals, outputs, and next actions.
- Build a small local dashboard over `runs/`, transcripts, and browser-agent logs.
- Generate handoff notes from Codex and Kimi WebBridge sessions.

## Message

When agents become teammates, developers need a workspace for agent state, not just more terminal tabs.

## Change History

- 2026-05-17: Created from X bookmark signals collected via Brave and Kimi WebBridge.
