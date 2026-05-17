# Hypothesis Format

Use this reference when creating or refining `kizashi/hypotheses/*.md`.

## Required Sections

- `# <Hypothesis Title>`
- `Status`: active, parked, rejected, superseded
- `Last Updated`: ISO date
- `Rough Hypothesis`: the original rough idea
- `Refined Hypothesis`: one specific, testable pain hypothesis
- `Background Change`: what changed in tools, behavior, market, or workflow
- `Target User`: who feels the pain
- `User / Market Estimate`: primary user, buyer, adoption unit, estimated user count, business scale, and spike type
- `Trigger Moment`: when the pain appears
- `Concrete Pain`: time, quality, trust, coordination, cost, or revenue impact
- `Current Workarounds`: how people solve it today
- `Why Workarounds Fail`: brittleness, manual effort, review risk, hidden context, lack of traceability
- `Evidence Signals`: structured bullets with source file, original URL, observed signal, and supported claim
- `Counter-Evidence`: reasons it may be weak or already solved
- `Falsification Conditions`: what would make the hypothesis wrong
- `Hachiware Labs Fit`: connection to Nagomi, refina, Argus, Delta Context, or Hachiware strategy
- `Validation Questions`: research or interview questions
- `MVP / Experiment Ideas`: smallest testable artifact
- `Message`: one sentence that makes the pain legible
- `Change History`: dated changes and reason

## Quality Checks

A strong hypothesis must answer:

- Who has the pain?
- Is the hypothesis strong because of pain depth, user count, business scale, or a combination?
- When does it occur?
- What exactly breaks or becomes expensive?
- What workaround exists today?
- Why is that workaround insufficient?
- What signal supports it?
- Which original URL is the primary evidence?
- What evidence would disprove it?
- How could Hachiware Labs test it cheaply?

Reject, merge, or park hypotheses that are only technical ideas, too broad, unsupported by signals, impossible to validate in a small experiment, or mediocre across pain depth, user count, and business scale.

## Evidence Signal Format

Each evidence item must be traceable without opening another file first:

```markdown
- Source File: `kizashi/inputs/x-bookmarks/YYYY-MM-DD.md`
  Original URL: https://x.com/...
  Signal: <what was observed>
  Supports: <which part of the hypothesis this supports>
```

Use `Original URL: unavailable` only when the source is a private note or the original URL was not captured. In that case, explain why in `Signal`.
