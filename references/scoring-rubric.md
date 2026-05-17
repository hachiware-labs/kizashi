# Scoring Rubric

Use this reference when creating or updating `kizashi/evaluations/*.eval.yaml`.

## Scale

Use integer scores from 1 to 5.

- `1`: weak, speculative, or no supporting evidence
- `2`: possible but vague or low priority
- `3`: plausible with some signal
- `4`: strong, repeated, and actionable
- `5`: urgent or highly strategic with clear evidence

## Axes

- `realism`: Is this happening or likely to happen soon?
- `pain_depth`: Does it affect time, quality, trust, revenue, or operational risk?
- `frequency`: Does it happen repeatedly?
- `future_growth`: Will the pain grow as tools or behaviors spread?
- `existing_solution_gap`: Are current workarounds manual, brittle, expensive, or incomplete?
- `hachiware_fit`: Does it connect to Hachiware Labs products, strategy, or unfair advantage?
- `mvp_feasibility`: Can it be tested with CLI, Markdown, GitHub, docs, or a small demo?
- `message_clarity`: Can the pain be explained in one sentence?
- `monetization_potential`: Could a team or company plausibly pay to solve it?
- `user_count`: How many people or teams likely experience the pain?
- `business_scale`: How large is the budget, operational impact, or economic value?
- `spike_strength`: Is at least one of pain depth, user count, or business scale unusually strong?

## Priorities

Weight these axes most heavily when recommending action:

1. `realism`
2. `pain_depth`
3. `spike_strength`
4. `future_growth`
5. `hachiware_fit`
6. `mvp_feasibility`

## Spike Rule

A hypothesis can be excellent for different reasons. Do not require every hypothesis to have a huge market. Instead, prioritize hypotheses where at least one dimension is exceptional:

- **Pain spike**: severe pain for a narrow group.
- **User-count spike**: moderate pain for a large population.
- **Business-scale spike**: strong buyer budget or operational stakes, even with limited users.

Park or merge hypotheses where pain, user count, and business scale are all mediocre.

## Evaluation Rules

- Always include reasons, not only numbers.
- Always state the primary spike type: `pain`, `user_count`, `business_scale`, `mixed`, or `none`.
- Record source-backed evidence and counter-evidence.
- When changing a score, append a dated `change_history` entry with the previous score, new score, and reason.
- Prefer conservative scores when evidence is thin.
