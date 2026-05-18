---
name: kizashi
description: Vercel Skills-compatible coding-agent skill for generating, refining, evaluating, and reviewing Hachiware Labs problem hypotheses from configured information sources such as X bookmarks, wiki-garden notes, release notes, GitHub issues, technical articles, and competitive signals. Use when Codex needs to initialize a Kizashi workspace, run signal capture, hypothesis review, or market positioning review, convert raw signals into evidence patches, update evaluations, create concise logs, or produce Kizashi reports.
---

# Kizashi

Kizashi turns configured information sources into testable problem hypotheses for Hachiware Labs. Prefer improving existing hypotheses over creating new ones, and always preserve evaluation reasons, counter-evidence, and short change logs.

Kizashi is packaged as a Vercel Skills skill. After installation, the primary interface is the coding agent invoking `$kizashi`; bundled JavaScript scripts are helper tools inside the skill, not the product surface the user must operate directly.

## Workflow

1. Locate or initialize the project workspace at `kizashi/`.
2. Read `kizashi/config/sources.yaml` and `kizashi/config/tasks.yaml`.
3. Consume only the sources named by the task or user request.
4. Extract concrete signals: observed behavior, tool changes, complaints, workarounds, repeated patterns, and missing capabilities.
5. Match signals against existing files in `kizashi/hypotheses/`.
6. Improve existing hypotheses first. Create a new hypothesis only when the pain, user, timing, or workaround is clearly distinct.
7. Gate new hypotheses by spike strength: at least one of user pain, user count, or business scale must be unusually strong.
8. Update evaluation YAML when evidence changes the score or confidence.
9. Write the requested output in the user's locale: evidence patch, hypothesis, evaluation, log, validation plan, review report, or positioning report.

## User Operation Patterns

Prefer a Vercel Skills coding-agent workflow for normal use. The user installs the skill through Vercel Skills, then asks Codex or another coding agent to use `$kizashi`; the agent reads this skill, edits project files directly, and uses the bundled JavaScript scripts only when deterministic setup, inventory, or checks are useful. Do not require the user to treat Kizashi as a standalone npm CLI before it can be useful.

Typical agent-first requests:

```text
Use $kizashi to initialize this project. Configure X bookmarks through kimi-webbridge and wiki-garden as sources.
```

```text
Use $kizashi to run the review layer end to end with `kizashi review`. Prepare the source inventory, signals file, agent task, report seed, and log seed, then complete the semantic review: reconcile evidence patches with existing hypotheses, create at most three new hypotheses only if pain, user count, or business scale spikes, update evaluations, decide continue/narrow/merge/park/split, and write the report in Japanese.
```

```text
Use $kizashi to show the current hypotheses, explain agent-workspace-orchestration, then critique and improve it using the latest sources.
```

When the CLI is not globally installed, run the bundled scripts directly from the skill or repository, for example `node bin/kizashi.js review --target <project>`. Use `npm` only as an optional packaging, install, or test convenience.

## Modes

- **Init**: create the `kizashi/` workspace structure and seed config/templates. Use `node scripts/init-kizashi-project.js`.
- **Signal**: capture source signals as append-only evidence patches under `kizashi/signal/`. Do not edit hypotheses or evaluations in this layer.
- **Review**: synthesize evidence patches, update hypotheses and evaluations, decide continue/narrow/merge/park/split, and write review output under `kizashi/review/`.
- **Positioning**: reassess market room, vendor encroachment, buyer, pricing, adoption unit, and external product wedge; write positioning output under `kizashi/positioning/`.
- **Hypothesis Generation**: create `kizashi/hypotheses/<slug>.md` only when the idea is not a near-duplicate.
- **Hypothesis Refinement**: sharpen who has the pain, when it occurs, why current workarounds fail, what would falsify it, and how to test it.
- **Evaluation**: create or update `kizashi/evaluations/<slug>.eval.yaml`; include score reasons, evidence, counter-evidence, and change history.
- **Validation Planning**: create `kizashi/validations/<slug>.plan.md` when the next step is research, interviews, search queries, or an MVP experiment.

## Hypothesis Control

- Use the user's locale for reports, logs, hypotheses, evaluations, and validation plans. Infer locale from the conversation, project documents, and existing artifacts when not specified.
- Do not grow hypotheses by default. First try to merge new signals into existing hypotheses as evidence, variants, or sub-pains.
- Create a new hypothesis only when it has a distinct user, trigger moment, pain, workaround failure, or market wedge.
- In each review, create at most 1-3 new hypotheses unless the user explicitly asks for broad exploration.
- Prefer hypotheses where one of these spikes is clear:
  - **Pain spike**: a smaller group has severe, urgent, expensive, or trust-breaking pain.
  - **User-count spike**: many users experience a moderate repeated pain.
  - **Business-scale spike**: the buyer, budget, or operational impact is large even if the user count is limited.
- Park, merge, or reject hypotheses that are broad, duplicate, weakly evidenced, or only "interesting."

## Commands

Use the `kizashi` CLI or `node bin/kizashi.js` when useful. For semantic work such as refining or reviewing hypotheses, the coding agent performs the reasoning; the CLI creates, inventories, and checks artifacts.

```bash
kizashi init
kizashi sources list
kizashi sources show x_bookmarks
kizashi sources add --id articles --name "Technical Articles" --type web_or_manual --input-path kizashi/inputs/articles/ --role external_signal
kizashi sources update --id x_bookmarks --type browser_session --provider kimi-webbridge
kizashi hypotheses list
kizashi hypotheses show agent-workspace-orchestration
kizashi hypotheses critique agent-workspace-orchestration
kizashi hypotheses improve agent-workspace-orchestration
kizashi signal
kizashi hypo --slug agent-workspace-orchestration --title "Agent Workspace Orchestration"
kizashi hypothesize --slug agent-workspace-orchestration --title "Agent Workspace Orchestration"
kizashi review
kizashi positioning
kizashi refine kizashi/hypotheses/<slug>.md
kizashi evaluate kizashi/hypotheses/<slug>.md
kizashi log today
kizashi report --name YYYY-MM-DD-hypothesis-review
```

## Output Rules

- Treat Kizashi as source-driven. Name the source files used in every evidence patch, report, or log.
- Do not name review layers `daily`, `weekly`, or `monthly`; use those words only as cadence hints. The canonical workflow commands are `signal`, `hypo`/`hypothesize`, `review`, and `positioning`.
- Signal Capture is append-only: write evidence patches and do not rewrite hypotheses or evaluations.
- In each hypothesis, record primary evidence with both `Source File` and `Original URL` so claims are traceable without opening the input file first.
- Do not treat one interesting post as proof. Record it as a signal and note what would confirm or falsify it.
- Do not create broad "AI agents are hard" hypotheses. Specify user, timing, concrete pain, workaround, and failure mode.
- Explain whether the hypothesis is strong because of pain depth, user count, business scale, or a combination.
- Keep logs short. Put analysis in evidence patches, hypotheses, evaluations, validations, or reports.
- Keep reports decision-oriented: important changes, score movements, recommended actions, and files changed.
- Connect hypotheses to Hachiware Labs when possible: Nagomi, refina, Argus, Delta Context, agent memory, AI PR review, approval policies, long-running agents, and developer workflow reliability.

## References

Load these files only when needed:

- `references/hypothesis-format.md`: required sections and quality checks for hypothesis files.
- `references/scoring-rubric.md`: scoring axes, weights, and evaluation YAML guidance.
- `references/review-hierarchy.md`: role-based layer names, positions, commands, and cadence hints.
- `references/evidence-patch.md`: append-only evidence patch rules and template.
- `references/periodic-review.md`: review and positioning report workflow and report structure.
- `references/daily-log.md`: short log rules and template.

## Templates And Scripts

- Use `assets/templates/` when creating config, hypotheses, evaluations, reports, and logs.
- Prefer asking the coding agent to use `$kizashi` for end-to-end work; the agent may run the bundled JavaScript scripts as helpers.
- Run `node bin/kizashi.js init --target <project>` or `kizashi init --target <project>` to initialize a project workspace.
- Run `kizashi signal`, `kizashi review`, or `kizashi positioning` as the layer workflow command. Each reads task/source config, inventories source inputs, extracts URL/heading/bullet signal candidates, writes layer-local signals, creates task and manifest files, seeds output/log files, and tells the coding agent what semantic work remains.
- Run `kizashi hypo` or `kizashi hypothesize` to create a new `kizashi/hypotheses/<slug>.md` file.
- Run `kizashi hypotheses list --target <project>` to inspect active hypotheses with scores and recommendations.
- Run `kizashi hypotheses show <slug> --target <project>` to view one hypothesis summary and evidence URLs.
- Run `kizashi hypotheses critique <slug> --target <project>` before improving a hypothesis.
- Run `kizashi hypotheses improve <slug> --target <project>` to prepare files and criteria for a semantic improvement pass.
- Run `node scripts/init-kizashi-project.js --target <project>` to initialize a project workspace.
- Run `node scripts/sources.js list --target <project>` to inspect configured sources.
- Run `node scripts/sources.js add --target <project> --id <id> --name <name> --type <type> --input-path <path> --role <role>` to append a source.
- Run `node scripts/sources.js update --target <project> --id <id> --type <type> --provider <provider>` to update an existing source.
- Run `node scripts/create-run.js --target <project> --task <task-id>` to create a timestamped run directory.
- Run `node bin/kizashi.js signal|review|positioning --target <project>` to execute the same layer workflow commands without a global CLI install.
- Run `node scripts/summarize-outputs.js --target <project>` to inspect current Kizashi artifacts.
- Run `node scripts/validate-skill.js .` and `node --check <script>` for JavaScript-only validation; npm scripts are optional shortcuts for package maintainers.
