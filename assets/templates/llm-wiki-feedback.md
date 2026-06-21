---
source_url: "internal feedback"
ingested: YYYY-MM-DD
source_type: feedback
feedback_scope: skill | report | source | knowledge | workflow
action: update_skill | record_only | both | needs_review
sha256: "{{sha256}}"
---

# Kizashi Feedback: {{title}}

## Feedback

{{feedback_text}}

## Interpretation

{{interpretation}}

## Handling Decision

- Scope: {{feedback_scope}}
- Action: {{action}}
- Affected files or wiki pages: {{affected_paths}}

## Result

{{result_summary}}

## Follow-up

{{follow_up}}
