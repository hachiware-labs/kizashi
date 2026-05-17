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
Use $kizashi to initialize this project. Configure X bookmarks through kimi-webbridge and wiki-garden as sources.
```

Then run a review:

```text
Use $kizashi to run weekly_kizashi_review end to end. Prepare the source inventory, signals file, agent task, report seed, and log seed, then complete the semantic review. Improve existing hypotheses first, create at most three new hypotheses only when pain, user count, or business scale spikes, update evaluations, and write the report in my locale.
```

## What Kizashi Produces

- `kizashi/inputs/`: source notes with original URLs
- `kizashi/signals/`: deterministic URL, heading, and bullet signal indexes
- `kizashi/runs/`: run README, `AGENT_TASK.md`, and manifest files
- `kizashi/hypotheses/`: testable problem hypotheses
- `kizashi/evaluations/`: scores, evidence, counter-evidence, and recommendations
- `kizashi/reports/`: periodic reviews
- `kizashi/logs/`: short daily logs

## Helper CLI

The CLI is bundled as a helper inside the skill. It is useful for deterministic setup and run preparation, but the primary interface remains the coding agent invoking `$kizashi`.

```bash
node bin/kizashi.js init --target .
node bin/kizashi.js run weekly_kizashi_review --target .
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
