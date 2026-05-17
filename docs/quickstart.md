# Kizashi Quick Start

Kizashi is a Vercel Skills skill. Install it through Vercel Skills, then use it through a coding agent first. Ask Codex or another coding agent to use `$kizashi`; the agent will read the skill, inspect the project, edit files, and use the bundled JavaScript scripts only when deterministic setup or inventory is useful.

## Recommended Agent Workflow

1. Initialize the workspace.

```text
Use $kizashi to initialize this project. Configure X bookmarks through kimi-webbridge and wiki-garden as sources.
```

2. Collect source material.

```text
Use $kizashi with kimi-webbridge connected to Brave. Collect my latest 20 X bookmarks and the latest AI trends from Hatena Bookmark, then save source notes under kizashi/inputs/ with original URLs.
```

3. Run a weekly review.

```text
Use $kizashi to run weekly_kizashi_review end to end. Use the top-level run command to prepare source inventory, a signals file, an agent task, a report seed, and a log seed. Then complete the semantic review: read the current input files, improve existing hypotheses first, create at most three new hypotheses only when pain, user count, or business scale spikes, update evaluations, and write the report in my locale.
```

4. Inspect and improve hypotheses.

```text
Use $kizashi to list the current hypotheses. Then explain, critique, and improve agent-workspace-orchestration using the latest sources and primary evidence URLs.
```

## What The Agent Produces

- `kizashi/inputs/`: source notes with original URLs
- `kizashi/signals/`: deterministic URL, heading, and bullet signal indexes
- `kizashi/runs/`: task run README files and source inventories
- `kizashi/hypotheses/`: testable problem hypotheses
- `kizashi/evaluations/`: scoring, evidence, counter-evidence, and recommendations
- `kizashi/reports/`: periodic reviews
- `kizashi/logs/`: short daily logs

## Helper Commands

The CLI is optional and bundled as a helper inside the skill. Use it when you or the agent need deterministic setup, inventory, or checks. It is not the primary Vercel Skills user interface.

```bash
node bin/kizashi.js init --target .
node bin/kizashi.js sources list --target .
node bin/kizashi.js sources update --target . --id x_bookmarks --type browser_session --provider kimi-webbridge
node bin/kizashi.js run weekly_kizashi_review --target .
node bin/kizashi.js hypotheses list --target .
node bin/kizashi.js hypotheses show <slug> --target .
node bin/kizashi.js hypotheses critique <slug> --target .
node bin/kizashi.js hypotheses improve <slug> --target .
node bin/kizashi.js summarize --target .
```

`node bin/kizashi.js run ...` is the top-level workflow helper. It prepares the deterministic parts of the run and writes `kizashi/runs/<date>-<task>/AGENT_TASK.md` for the coding agent to complete.

## Quality Rules

- Prefer improving existing hypotheses over creating new ones.
- Create a new hypothesis only when the user, trigger, pain, workaround failure, or market wedge is distinct.
- Prioritize hypotheses where pain depth, user count, or business scale clearly spikes.
- Record `Source File` and `Original URL` for primary evidence.
- Write reports, logs, hypotheses, and evaluations in the user's locale.
