# Validation Plan: AI Code Review Definition Shift

Hypothesis: `kizashi/hypotheses/ai-code-review-definition-shift.md`
Last Updated: 2026-05-17

## Questions To Validate

- What evidence makes reviewers comfortable merging AI-generated changes?
- How large can an AI-authored PR be before review standards break down?
- Which risks are not covered by tests or agent summaries?

## Evidence To Collect

- 5 public examples of AI-authored large PRs or rewrites.
- Review comments from PRs where AI generation is disclosed.
- Interviews with maintainers who reviewed AI-generated changes.

## Search Queries

- `AI generated pull request review policy`
- `AI coding agent large refactor review`
- `tests pass but code review AI generated`
- `AGENTS.md PR review AI generated code`

## Interview Questions

- Do you read AI-generated PRs differently?
- What do you ask the agent or author to provide?
- Where do tests fail to give enough confidence?
- Would a generated review packet reduce review time?

## Adoption Criteria

- Reviewers say they need structured evidence beyond test results.
- A review packet changes at least one reviewer's merge confidence.

## Rejection Criteria

- Reviewers treat AI-generated and human-generated PRs identically without added friction.
- Existing tools already provide enough evidence.

## MVP Experiment

Create an AI PR Review Packet for one sample PR: change intent, risk areas, changed ownership, tests run, missing tests, and reviewer questions.
