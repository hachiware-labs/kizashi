# Short Log

Use this reference for `kizashi/<layer>/YYYY-MM-DD.log.md`.

## Rules

- Keep logs to roughly 10-30 lines.
- Write only the change summary and next step.
- Do not put long analysis in the log.
- Link or name changed hypothesis, evaluation, validation, or report files.
- For Signal, link evidence patches and do not update hypotheses or evaluations.
- For Hypothesis, summarize score and decision changes briefly.
- Write in the user's locale.
- If no new hypotheses were created because evidence was merged, say so briefly.

## Template

```markdown
# Kizashi Log: YYYY-MM-DD

Sources: X bookmarks, wiki-garden

Added:
- `kizashi/hypotheses/<slug>.md`

Updated:
- `kizashi/hypotheses/<slug>.md`: <short reason>

Scores:
- `<slug>`: realism 3 -> 4 because <reason>

Next:
- <next evidence or action>
```
