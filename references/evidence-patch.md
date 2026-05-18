# Evidence Patch

Use evidence patches for the Signal layer. They are small append-only records, not hypothesis rewrites.

## Rules

- Create one patch per distinct source signal or tightly related source cluster.
- Always include the source file and original URL when available.
- Link the patch to an existing hypothesis when possible.
- Use `related_hypothesis: none` only when no existing hypothesis is close.
- Do not edit hypothesis files or evaluation YAML during Signal.
- Keep `note` source-grounded and short.

## Template

```markdown
# Evidence Patch

- date: YYYY-MM-DD
- source: <source id>
- url: <original URL>
- related_hypothesis: <slug or none>
- direction: support / counter / neutral
- strength: 1-5
- novelty: 1-5
- affected_field:
  - pain
  - target_user
  - workaround
  - counter_evidence
  - mvp
  - falsification
- note: <short source-grounded note>
```
