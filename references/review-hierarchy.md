# Review Hierarchy

Kizashi uses role-based layers. Cadence is only an operating hint; user-facing commands should name the layer's job.

## Signal

- Position: evidence intake layer.
- Command: `kizashi signal`.
- Cadence hint: per source batch, often daily.
- Writes: `kizashi/signal/{date}.md` and helper files.
- Does not write: hypothesis files, evaluation YAML, or new hypotheses.
- Output unit: Evidence Patch.

## Review

- Position: hypothesis governance layer.
- Command: `kizashi review`.
- Cadence hint: regular review or threshold-triggered review, often weekly.
- Writes: hypothesis updates, evaluation changes, validation updates, and `kizashi/review/{date}.md`.
- Decision set: `continue`, `narrow`, `merge`, `park`, `split`.
- Output unit: score movement, decision, and next experiment.

Run this layer early when a threshold trips:

- `strength >= 4`
- `novelty >= 4`
- `counter_evidence_strength >= 4`
- `evidence_patch_count >= 10`

## Positioning

- Position: strategy layer.
- Command: `kizashi positioning`.
- Cadence hint: strategic review or market shift, often monthly.
- Writes: `kizashi/positioning/{date}.md`.
- Reviews: vendor encroachment, buyer, pricing, adoption unit, and the remaining wedge for an external product.
- Does not create hypotheses by default.

## Naming Rule

Avoid naming layers `daily`, `weekly`, or `monthly`. Use those words only as cadence hints in prose. In commands, use the layer names above.
