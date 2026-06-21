# Kizashi Quick Start

Kizashi is the Skill you ask when you want today's research, remembered notes, answers from past reports, or cleanup of accumulated knowledge. It runs on top of an llm-wiki folder, so you do not need to learn a command workflow. Ask Codex or another agent to use `$kizashi`; after the wiki folder and sources are configured, daily research and knowledge management happen through the agent.

If the save folder or `sources.yaml` is missing, Kizashi setup is not complete yet. Configure the wiki folder and information sources first.

## Try It In 10 Minutes

Start with one small win: choose a storage folder, add one source, and create the first report.

```text
$kizashi set my llm-wiki folder to C:\Users\kitad\Documents\kizashi-wiki
```

```text
$kizashi add hachiware-labs.com as a daily research source
```

```text
$kizashi make today's report
```

The report is saved under `<wiki-root>/reports/daily/`. After that, use `$kizashi remember ...` to add knowledge and `$kizashi research ...` or `$kizashi tell me ...` to answer from past reports and accumulated knowledge.

## 1. Daily Research

### 1. Choose the folder and source sites

First choose the llm-wiki folder where Kizashi stores knowledge, then choose the information sources to watch. Sources can include websites, X bookmarks, technical articles, GitHub, local notes, and pages or apps visible in the user's browser or desktop. If you do not have concrete sources yet, the agent proposes starter sources from your interests and project context, then helps you choose the first set. Sources can always be added, updated, or disabled later.

```text
$kizashi set my llm-wiki folder to C:\Users\kitad\Documents\kizashi-wiki and add hachiware-labs.com plus X bookmarks as daily research sources
```

If you do not have concrete sources yet:

```text
$kizashi propose three daily source candidates from my interests and help me choose the first sources
```

Main locations created:

- `<wiki-root>/SCHEMA.md`
- `<wiki-root>/index.md`
- `<wiki-root>/log.md`
- `<wiki-root>/sources.yaml`
- `<wiki-root>/raw/`
- `<wiki-root>/concepts/`
- `<wiki-root>/entities/`
- `<wiki-root>/queries/`
- `<wiki-root>/reports/daily/`

`<wiki-root>/sources.yaml` is the source registry used by Daily Report, ingress / ingest, query, and lint.

### 2. Use agent automations to create daily reports

Use the automation feature of Codex or another agent to create a Kizashi Daily Report from the day's sources. Kizashi reads the configured sources and existing wiki knowledge, performs surrounding research for important signals, and saves the dated report back into the wiki.

```text
$kizashi make today's Daily Report from configured sources and llm-wiki knowledge. Deep-dive important signals and save the report into the wiki
```

Main locations written:

- Report: `<wiki-root>/reports/daily/YYYY-MM-DD.md`
- Optional HTML report: `<wiki-root>/reports/daily/YYYY-MM-DD.html`
- Computer Use captures from browser/app material: `<wiki-root>/raw/app-captures/`
- Report index entry: `<wiki-root>/index.md`
- Append-only log entry: `<wiki-root>/log.md`

Daily Reports live inside the wiki, so future query and future reports can search and connect them.

## 2. Use It As LLM Wiki

### 3. Add knowledge (ingress / ingest)

Add one-off ideas, URLs, notes, conversation insights, or observations that should become reusable knowledge. Kizashi stores the raw material first, then organizes it into wiki pages under `concepts/`, `entities/`, or `comparisons/` when that makes it easier to reuse.

```text
$kizashi remember that AI review findings should always keep evidence URLs
```

```text
$kizashi remember that Cursor Background Agent should be tracked as a comparison point for async PR work
```

Main locations written:

- Raw notes and URLs: `<wiki-root>/raw/notes/`, `<wiki-root>/raw/sites/`, `<wiki-root>/raw/articles/`
- X bookmarks: `<wiki-root>/raw/x-bookmarks/`
- Synthesized knowledge: `<wiki-root>/concepts/`, `<wiki-root>/entities/`, `<wiki-root>/comparisons/`
- Append-only log entry: `<wiki-root>/log.md`

### 4. Search knowledge (query)

Ask questions over accumulated wiki knowledge, past reports, source URLs, and notes. Kizashi reads `SCHEMA.md`, `index.md`, `sources.yaml`, `log.md`, relevant wiki pages, and relevant daily reports before answering.

```text
$kizashi tell me the evaluation criteria for AI agents from past reports, including related reports and source URLs
```

```text
$kizashi research Cursor Background Agent, prioritizing existing wiki pages and configured sources
```

When the answer should be reused, Kizashi can save it under `<wiki-root>/queries/`.

## 3. Manage

### 5. Organize knowledge (lint)

Ask Kizashi to clean up accumulated knowledge. It can deduplicate weak notes, connect related reports, add missing source URLs, mark stale claims, and sharpen vague ideas into reusable concepts.

```text
$kizashi lint my llm-wiki. Clean up duplicates, weak evidence, disconnected reports, and missing source URLs
```

Main locations written:

- Lint output: `<wiki-root>/outputs/lint/`
- Updated wiki pages: `<wiki-root>/concepts/`, `<wiki-root>/entities/`, `<wiki-root>/comparisons/`
- Append-only log entry: `<wiki-root>/log.md`

### 6. Edit source sites

Add, disable, or update the information sources used by Daily Report and query. Prefer disabling old sources instead of deleting them so source history remains traceable.

```text
$kizashi list my information sources
```

```text
$kizashi add hachiware-labs.com as a Daily Report source and disable the old X bookmark source
```

Locations updated:

- Source registry: `<wiki-root>/sources.yaml`
- Append-only log entry: `<wiki-root>/log.md`

## Minimal Storage Map

- Daily Reports: `<wiki-root>/reports/daily/`
- Computer Use captures: `<wiki-root>/raw/app-captures/`
- One-off knowledge: `<wiki-root>/raw/`
- Synthesized knowledge: `<wiki-root>/concepts/`, `<wiki-root>/entities/`, `<wiki-root>/comparisons/`
- Saved query answers: `<wiki-root>/queries/`
- Lint output: `<wiki-root>/outputs/lint/`
- Source registry: `<wiki-root>/sources.yaml`

Kizashi-specific hypothesis, Signal, Review, and Positioning helper state is saved under `<project-root>/kizashi/` only when needed. The canonical store for Daily Reports and llm-wiki knowledge is `<wiki-root>/`.
