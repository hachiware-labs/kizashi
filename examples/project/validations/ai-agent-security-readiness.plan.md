# Validation Plan: AI Agent Security Readiness

Hypothesis: `kizashi/hypotheses/ai-agent-security-readiness.md`
Last Updated: 2026-05-17

## Questions To Validate

- What specific evidence do security teams require before enabling AI coding agents?
- Are approval policies reviewed per tool, per repository, or per organization?
- Which current artifacts are missing: permission matrix, run logs, data flow, command allowlist, or audit trail?

## Evidence To Collect

- 5-10 public examples of Claude Code, Codex, or Copilot coding agent security guidance.
- Interviews with 3 engineering managers or security reviewers.
- Sample `AGENTS.md`, approval settings, and run logs from one real repository.

## Search Queries

- `Claude Code security policy enterprise rollout`
- `AI coding agent security approval checklist`
- `Codex approval policy agent security`
- `GitHub Copilot coding agent enterprise security`

## Interview Questions

- What would stop you from enabling an AI coding agent in a production repository?
- What proof would make approval easier?
- What did vendor documentation fail to answer?
- How do you audit what the agent read, ran, or changed?

## Adoption Criteria

- At least 3 interviewees report repeated security review friction.
- A Markdown readiness pack is judged useful by at least 2 reviewers.

## Rejection Criteria

- Teams approve agents using vendor documentation alone.
- The main blocker is cost or model quality, not security or auditability.

## MVP Experiment

Generate an Agent Security Readiness Pack for one repository from config files, agent instructions, approval settings, and a sample run transcript.
