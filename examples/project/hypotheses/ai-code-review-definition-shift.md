# AI Code Review Definition Shift

Status: active
Last Updated: 2026-05-17

## Rough Hypothesis

AI-generated code makes code review harder because humans stop reading everything.

## Refined Hypothesis

Teams using AI agents for large code changes face a new review failure mode: "tests pass" and "the agent can regenerate the change" start replacing human comprehension, leaving reviewers without a clear standard for when an AI-generated change is actually understood, maintainable, and safe to merge.

## Background Change

AI-assisted rewrites and agentic coding workflows make larger changes feasible in shorter time. The bottleneck shifts from code production to evidence, trust, and review definition.

## Target User

- Maintainers reviewing AI-generated pull requests
- Engineering leads setting review policy
- Developers using agents for broad refactors or migrations

## User / Market Estimate

Primary User:
- Maintainer or senior engineer who reviews AI-generated pull requests.

Buyer:
- Engineering manager, developer productivity team, or repository owner responsible for code quality.

Adoption Unit:
- repository -> team

Estimated User Count:
- large if AI-generated PRs become common across software teams.

Business Scale:
- broad because review quality affects many teams, but budget ownership may be less clear than security readiness.

Spike Type:
- user_count: the pain may become widespread even if each instance is moderate.

## Trigger Moment

An AI agent creates or rewrites a large amount of code, tests pass, but the reviewer cannot reasonably inspect every line before merging.

## Concrete Pain

- Reviewers feel responsible for code they did not fully read.
- Review comments focus on surface issues while architectural risk remains hidden.
- Teams lack a shared threshold for when AI-generated code is acceptable.
- Post-merge failures become harder to explain because the reasoning trail is missing.

## Current Workarounds

- Require smaller pull requests
- Add more tests
- Ask the agent to summarize its own changes
- Trust maintainers' intuition

## Why Workarounds Fail

- Smaller PRs may be impractical for migrations and rewrites.
- Tests rarely capture maintainability, intent, or future debugging cost.
- Agent summaries can be incomplete or self-justifying.
- Intuition does not scale across teams or tools.

## Evidence Signals

- Source File: `kizashi/inputs/hatena/2026-05-17-ai-trends.md`
  Original URL: https://zenn.dev/ashunar0/articles/55a669c10e6a8d
  Signal: Hatena technology hot entry on a Bun rewrite raised discussion about whether review is shifting from reading code to trusting tests and AI reproducibility.
  Supports: Review standards are changing as AI-generated rewrites become plausible.

- Source File: `kizashi/inputs/hatena/2026-05-17-ai-trends.md`
  Original URL: https://blog.lai.so/build-ai-agent-book/
  Signal: Hatena surfaced a book about building AI agents and GitHub-integrated coding workflows.
  Supports: More developers will create and operate agent-authored changes.

- Source File: `kizashi/inputs/x-bookmarks/2026-05-17.md`
  Original URL: https://x.com/hanjuku_yanen/status/2055245373497880856
  Signal: Bookmark focuses on how to delegate tasks to Codex and have it finish work.
  Supports: As task delegation increases, reviewers need evidence about agent-authored work.

- Source File: `kizashi/inputs/x-bookmarks/2026-05-17.md`
  Original URL: https://x.com/d_1d2d/status/2054925448644096086
  Signal: Bookmark cites the idea that one person may do the work of a software development team.
  Supports: Team-scale AI coding increases the review burden on fewer humans.

- Source File: `kizashi/inputs/x-bookmarks/2026-05-17.md`
  Original URL: https://x.com/Codestudiopjbk/status/2055309782639317306
  Signal: Codex Hooks create deeper intervention points in the agent loop.
  Supports: Review may need evidence of agent process and controls, not only final diff.

## Counter-Evidence

- Mature teams may already require strong tests, ownership, and rollout controls.
- This may be a policy and culture issue rather than a product opportunity.
- The strongest pain may appear only in large repositories, limiting market size.

## Falsification Conditions

- Interviews show reviewers are comfortable with existing review processes for AI-generated changes.
- Teams reject large AI-generated PRs categorically, avoiding the ambiguous middle.
- Available code review tools already provide sufficient AI-change evidence.

## Hachiware Labs Fit

This fits Argus and Delta Context: create review evidence packets that connect generated diffs to tests, intent, risk areas, touched ownership, and missing human comprehension. It can also connect to refina as a review workflow improvement.

## Validation Questions

- What makes a reviewer comfortable merging an AI-generated PR?
- Which evidence is more trusted: tests, diff explanation, dependency graph, ownership map, or reproduction log?
- Where do reviewers currently lose time on agent-authored PRs?
- What policies do teams want in `AGENTS.md` or PR templates?

## MVP / Experiment Ideas

- Build a Markdown "AI PR Review Packet" for one generated PR: changed areas, test coverage, risk flags, reviewer questions, and agent reasoning trail.
- Create a PR template section for AI-authored changes and test it on sample repositories.
- Compare human review notes with agent-generated review evidence.

## Message

AI coding agents make code cheap; the scarce resource becomes trustworthy review evidence.

## Change History

- 2026-05-17: Created from Hatena AI trend signals and improved with X bookmark signals collected through Brave and Kimi WebBridge.
