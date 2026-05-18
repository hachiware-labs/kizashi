# Review And Positioning

Use this reference for Hypothesis and Positioning reviews. Cadence can be regular or trigger-based; the review layer is named by its job, not by `daily`, `weekly`, or `monthly`.

## Hypothesis Workflow

1. Read the requested task from `kizashi/config/tasks.yaml`.
2. Read only the source folders listed by the task.
3. Summarize evidence patches and new signals by source.
4. Match signals to existing hypotheses.
5. Update existing hypotheses before creating new ones.
6. Create new hypotheses only when distinct from existing files and at least one spike is strong: pain depth, user count, or business scale.
7. Limit new hypotheses to 1-3 per review unless the user explicitly asks for broad exploration.
8. Update evaluations with reasons, counter-evidence, source files, and original URLs.
9. Decide for each reviewed hypothesis: continue, narrow, merge, park, or split.
10. Recommend the next experiment.
11. Write the output in the user's locale to `kizashi/review/YYYY-MM-DD.md`.

## Positioning Workflow

1. Read evidence patches and market sources listed by the task.
2. Review vendor encroachment and competitive counter-evidence.
3. Reassess buyer, pricing, adoption unit, and budget owner.
4. Identify whether an external product wedge still remains.
5. Recommend continue, narrow, reposition, partner, park, or reject.
6. Write the output in the user's locale to `kizashi/positioning/YYYY-MM-DD.md`.

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

For Positioning reports, add:

- `Vendor Encroachment`
- `Buyer And Pricing`
- `Adoption Unit`
- `External Product Wedge`

## Review Rules

- Keep the report decision-oriented.
- Do not paste long source excerpts.
- Tie every recommendation to at least one signal or evaluation change.
- Identify uncertainty and the next evidence needed.
- Explain what was created, merged, parked, or deliberately not created.
- State the primary spike type for prioritized hypotheses: `pain`, `user_count`, `business_scale`, `mixed`, or `none`.
