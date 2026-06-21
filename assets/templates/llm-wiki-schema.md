# Wiki Schema

## Domain

{{domain}}

## Wiki Root

`{{wiki_path}}`

## Source Policy

The human decides what sources are worth adding. The agent ingests, summarizes, cross-links, updates indexes, and logs every action.

Configured sources:

{{configured_sources}}

## Directory Structure

```text
{{wiki_path}}/
  SCHEMA.md
  index.md
  log.md
  sources.yaml
  raw/
    articles/
    sites/
    x-bookmarks/
    app-captures/
    feedback/
    notes/
    transcripts/
    assets/
  entities/
  concepts/
  comparisons/
  queries/
  reports/
    daily/
  outputs/
    lint/
```

## Conventions

- Raw source files under `raw/` are immutable after ingestion.
- `sources.yaml` is the canonical source registry for this wiki. If it is missing, setup is incomplete.
- Source list and source edit operations read and update `sources.yaml`, then append the action to `log.md`.
- Agent-authored wiki pages live under `entities/`, `concepts/`, `comparisons/`, `queries/`, and `reports/daily/`.
- Every wiki page should have YAML frontmatter with `title`, `created`, `updated`, `type`, `tags`, `sources`, and `confidence`.
- Use `[[wikilinks]]` to connect related concepts, entities, reports, and queries.
- Add every durable page to `index.md` with a one-line summary.
- Append every ingest, query, report generation, or lint action to `log.md`.
- Preserve `source_url` on raw files whenever an external URL exists.
- Daily report source capture can use Computer Use for user-visible apps and browser sessions. Store those read-only captures under `raw/app-captures/`.
- User feedback addressed to Kizashi is stored under `raw/feedback/` unless it directly changes the skill, templates, docs, or source registry.
- Daily reports are generated with `assets/templates/daily-signal-report.md` and, when HTML is requested, `assets/templates/daily-signal-report.html`.

## Page Frontmatter

```yaml
---
title: "{{title}}"
created: YYYY-MM-DD
updated: YYYY-MM-DD
type: entity | concept | comparison | query | daily-report
tags: []
sources: []
confidence: high | medium | low
contested: false
---
```

## Raw Source Frontmatter

```yaml
---
source_url: "{{source_url_or_internal_note}}"
ingested: YYYY-MM-DD
source_type: article | site | x-bookmark | app-capture | feedback | note | transcript | asset
sha256: "{{sha256}}"
---
```

## Operations

- **ingest**: place source material in `raw/`, create or update wiki pages, update `index.md`, append `log.md`.
- **query**: answer from `SCHEMA.md`, `index.md`, `log.md`, and relevant pages; save durable answers under `queries/` when useful.
- **daily report**: synthesize selected sources and existing wiki pages, write `<wiki>/reports/daily/YYYY-MM-DD.md` and optional `.html`, update `index.md`, append `log.md`.
- **lint**: check stale claims, weak confidence, missing source URLs, orphan pages, duplicate concepts, and unresolved contradictions; save results under `outputs/lint/`.
- **source list**: read `sources.yaml` and show each source's id, type, role, cadence, enabled state, and input path.
- **source edit**: add, update, disable, or re-enable entries in `sources.yaml`; preserve ids as stable references and append `log.md`.
- **feedback**: when the user asks to "feedback this to Kizashi", classify whether it changes the skill/templates/docs/source registry or should be recorded as user knowledge; make the concrete update or store a feedback record under `raw/feedback/`, then append `log.md`.
