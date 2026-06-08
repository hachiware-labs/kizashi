# Kizashi

Kizashi is a Vercel Skills-compatible coding-agent skill for turning configured source signals into testable problem hypotheses for Hachiware Labs.

It is not primarily a standalone CLI product. Install it as a Vercel Skill, then ask Codex or another coding agent to use `$kizashi`. The bundled JavaScript scripts help the agent with deterministic setup, source inventory, signal indexing, and run handoff.

日本語版: [README_ja.md](README_ja.md)

## Install

```bash
npx skills add hachiware-labs/kizashi
```

For local testing from a checkout:

```bash
npx skills add . --skill kizashi --agent codex -y
```

## Agent-First Usage

Ask your coding agent:

```text
Use $kizashi to initialize this project. Configure X bookmarks through kimi-webbridge and wiki-garden as sources, and keep X collection browser-only.
```

Then run the role-based layers:

```text
Use $kizashi to run the non-X signal layer end to end with `kizashi signal`. Prepare the source inventory, signals file, agent task, evidence patch seed, and log seed. Capture evidence patches only; do not edit hypotheses or evaluations.
```

```text
After browser-based X collection is ready, run `kizashi signal-x` to ingest only X bookmarks and keyword searches.
```

```text
Use $kizashi to create a new hypothesis with `kizashi hypo` or `kizashi hypothesize` when a signal is distinct from existing hypotheses.
```

```text
Use $kizashi to run the review layer end to end with `kizashi review`. Reconcile evidence patches with existing hypotheses, update evaluations, decide continue/narrow/merge/park/split, create at most three new hypotheses only when pain, user count, or business scale spikes, and write the report in my locale.
```

```text
Use $kizashi to run the positioning layer end to end with `kizashi positioning`. Review vendor encroachment, buyer, pricing, adoption unit, and the remaining external product wedge, then write the positioning report in my locale.
```

## What Kizashi Produces

- `kizashi/inputs/`: source notes with original URLs
- `kizashi/signal/`: signal evidence patches and helper files
- `kizashi/review/`: hypothesis review output and helper files
- `kizashi/positioning/`: positioning output and helper files
- `kizashi/hypotheses/`: testable problem hypotheses
- `kizashi/evaluations/`: scores, evidence, counter-evidence, and recommendations

## Helper CLI

The CLI is bundled as a helper inside the skill. It is useful for deterministic setup and run preparation, but the primary interface remains the coding agent invoking `$kizashi`.

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

## Documentation

- [English Quick Start](docs/quickstart.md)
- [Japanese Quick Start](docs/quickstart_ja.md)
- [Requirements and design notes](docs/kizashi_skill_requirements.md)

## Validation

```bash
node scripts/validate-skill.js .
npm run smoke
```
