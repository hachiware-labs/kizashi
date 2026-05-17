# Validation Plan: Agent Workspace Orchestration

Hypothesis: `kizashi/hypotheses/agent-workspace-orchestration.md`
Last Updated: 2026-05-17

## Questions To Validate

- How many agent sessions do heavy users run concurrently?
- What state do users need before resuming or trusting an agent session?
- Is the pain strongest in terminal agents, browser agents, or cross-tool handoff?

## Evidence To Collect

- Screenshots or notes from 5 real agent-heavy workflows.
- Examples of users combining Codex, Claude Code, browser agents, tmux, Obsidian, and local LLMs.
- Current workarounds for session tracking and handoff.

## Search Queries

- `tmux for agents AI coding`
- `Codex Hooks agent workflow`
- `Claude Code multiple agents tmux`
- `Codex Obsidian second brain`

## Interview Questions

- What do you lose track of when several agents are running?
- What do you check before accepting or resuming an agent's work?
- Where do you keep agent memory and task state today?
- Would a Markdown-first session index be useful?

## Adoption Criteria

- At least 3 heavy users report repeated session-state pain.
- A simple session index reduces resume time or missed context in a real workflow.

## Rejection Criteria

- Users say existing terminal/browser/IDE tools are enough.
- The pain disappears when users run only one agent at a time.

## MVP Experiment

Create a local `agent-sessions.md` index generated from Kizashi runs, Codex transcripts, and Kimi WebBridge browser actions.
