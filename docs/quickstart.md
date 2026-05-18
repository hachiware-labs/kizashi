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

3. Run Signal.

```text
Use $kizashi to run the signal layer end to end with `kizashi signal`. Prepare source inventory, a signals file, an agent task, an evidence patch seed, and a log seed. Then capture source-grounded evidence patches only; do not edit hypotheses or evaluations.
```

4. Create Hypothesis when needed.

```text
Use $kizashi to create a new hypothesis with `kizashi hypo` or `kizashi hypothesize` only when the signal is distinct from existing hypotheses.
```

5. Run Review.

```text
Use $kizashi to run the review layer end to end with `kizashi review`. Reconcile evidence patches with existing hypotheses, update evaluations, decide continue/narrow/merge/park/split, create at most three new hypotheses only when pain, user count, or business scale spikes, and write the report in my locale.
```

6. Run Positioning when strategy needs review.

```text
Use $kizashi to run the positioning layer end to end with `kizashi positioning`. Review vendor encroachment, buyer, pricing, adoption unit, and the remaining external product wedge, then write the positioning report in my locale.
```

7. Inspect and improve hypotheses.

```text
Use $kizashi to list the current hypotheses. Then explain, critique, and improve agent-workspace-orchestration using the latest sources and primary evidence URLs.
```

## What The Agent Produces

- `kizashi/inputs/`: source notes with original URLs
- `kizashi/signal/`: signal evidence patches and helper files
- `kizashi/review/`: hypothesis review output and helper files
- `kizashi/positioning/`: positioning output and helper files
- `kizashi/hypotheses/`: testable problem hypotheses
- `kizashi/evaluations/`: scoring, evidence, counter-evidence, and recommendations

## Helper Commands

The CLI is optional and bundled as a helper inside the skill. Use it when you or the agent need deterministic setup, inventory, or checks. It is not the primary Vercel Skills user interface.

```bash
node bin/kizashi.js init --target .
node bin/kizashi.js sources list --target .
node bin/kizashi.js sources update --target . --id x_bookmarks --type browser_session --provider kimi-webbridge
node bin/kizashi.js signal --target .
node bin/kizashi.js hypo --target . --slug <slug> --title "<title>"
# or: node bin/kizashi.js hypothesize --target . --slug <slug> --title "<title>"
node bin/kizashi.js review --target .
node bin/kizashi.js positioning --target .
node bin/kizashi.js hypotheses list --target .
node bin/kizashi.js hypotheses show <slug> --target .
node bin/kizashi.js hypotheses critique <slug> --target .
node bin/kizashi.js hypotheses improve <slug> --target .
node bin/kizashi.js summarize --target .
```

`node bin/kizashi.js signal|review|positioning ...` prepares layer runs and writes `kizashi/<layer>/<date>.task.md` for the coding agent to complete. `node bin/kizashi.js hypo` and `node bin/kizashi.js hypothesize` create new files under `kizashi/hypotheses/`.

## Quality Rules

- Prefer improving existing hypotheses over creating new ones.
- Create a new hypothesis only when the user, trigger, pain, workaround failure, or market wedge is distinct.
- Prioritize hypotheses where pain depth, user count, or business scale clearly spikes.
- Record `Source File` and `Original URL` for primary evidence.
- Write reports, logs, hypotheses, and evaluations in the user's locale.
