# Periodic Review

Use this reference for weekly and monthly Kizashi reviews.

## Workflow

1. Read the requested task from `kizashi/config/tasks.yaml`.
2. Read only the source folders listed by the task.
3. Summarize new signals by source.
4. Match signals to existing hypotheses.
5. Update existing hypotheses before creating new ones.
6. Create new hypotheses only when distinct from existing files and at least one spike is strong: pain depth, user count, or business scale.
7. Limit new hypotheses to 1-3 per review unless the user explicitly asks for broad exploration.
8. Update evaluations with reasons, counter-evidence, source files, and original URLs.
9. Recommend actions: continue, validate, build MVP, write publicly, merge, park, or reject.
10. Write the report in the user's locale to `kizashi/reports/YYYY-MM-DD-kizashi-review.md`.

## Report Sections

- `Summary`
- `Sources Used`
- `New Signals`
- `Updated Hypotheses`
- `New Hypotheses`
- `Evaluation Changes`
- `Hypothesis Control`
- `Spike Assessment`
- `Recommended Actions`
- `Files Changed`

## Review Rules

- Keep the report decision-oriented.
- Do not paste long source excerpts.
- Tie every recommendation to at least one signal or evaluation change.
- Identify uncertainty and the next evidence needed.
- Explain what was created, merged, parked, or deliberately not created.
- State the primary spike type for prioritized hypotheses: `pain`, `user_count`, `business_scale`, `mixed`, or `none`.
