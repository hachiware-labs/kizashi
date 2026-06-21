# Kizashi

Kizashi is a Skill that researches what you care about, writes the findings into daily reports, and turns those reports into a growing knowledge base.

Andrew Karpathy popularized the llm-wiki idea: keep knowledge as plain, structured text so an LLM can reread it, extend it, reorganize it, and use it when answering later questions. Kizashi connects that memory style to daily research.

It watches the sources you choose, finds signals that matter to you, writes a Daily Report, and saves the report back into the wiki. Daily research, one-off notes, past reports, query, and cleanup all flow into the same knowledge base, so your understanding gets sharper each day instead of disappearing into chat history.

日本語版: [README_ja.md](README_ja.md)

## Try These First

```text
$kizashi make today's report
```

```text
$kizashi remember that AI review findings should always keep evidence URLs
```

```text
$kizashi research Cursor Background Agent
```

Sample report: [kizashi-daily-2026-06-20.html](examples/daily-report-sample/kizashi-daily-2026-06-20.html)

## What It Does

- Researches the sources that matter to your work
- Writes Daily Reports for your context, not generic ready-made summaries
- Saves each report inside the wiki so future answers can search it
- Adds one-off knowledge from requests like `$kizashi remember that AI review findings should always keep evidence URLs`
- Answers query requests like `$kizashi tell me the evaluation criteria for AI agents from past reports`
- Cleans up accumulated knowledge by reducing duplicates, weak claims, and missing source links
- Lists, adds, updates, or disables information sources

## Install

Install through Vercel Skills as a skill available to your coding agent, such as Codex. The recommended setup is agent-wide rather than project-only. That way, requests like `$kizashi remember that AI review findings should always keep evidence URLs` work from any conversation or project.

```bash
npx skills add hachiware-labs/kizashi
```

For local testing from this repository, install it for Codex:

```bash
npx skills add . --skill kizashi --agent codex -y
```

After installation, ask Codex or another agent to use `$kizashi`. On first use, choose a shared llm-wiki folder. Then `$kizashi remember ...`, `$kizashi research ...`, and `$kizashi tell me ...` from different projects all connect to the same memory.

## How It Feels To Use

The everyday interface is just natural requests. Kizashi maps them to llm-wiki operations behind the scenes.

```text
$kizashi add hachiware-labs.com as a daily research source
```

This opens source list / source edit behavior. The source registry lives at `<wiki-root>/sources.yaml`.

```text
$kizashi remember that AI review findings should always keep evidence URLs
```

This is ingress / ingest. Raw knowledge is saved under `<wiki-root>/raw/`, then organized into `<wiki-root>/concepts/` or `<wiki-root>/entities/` when useful.

```text
$kizashi make today's report
```

This creates a Daily Report from configured sources and existing knowledge. Reports live under `<wiki-root>/reports/daily/`.

```text
$kizashi tell me the evaluation criteria for AI agents from past reports
```

This is query. Kizashi reads past reports, notes, source URLs, and wiki pages before answering.

```text
$kizashi research Cursor Background Agent
```

This is also query. Kizashi uses the existing wiki, past reports, and configured sources as evidence before answering.

## Start Here

First choose only two things:

1. The folder for your llm-wiki
2. The information sources to watch

If you do not have concrete sources yet, the agent proposes starter sources from your interests and project context, then helps you choose the first set. Sources can always be added, updated, or disabled later.

The rest of the workflow is in Quick Start.

- [English Quick Start](docs/quickstart.md)
- [Japanese Quick Start](docs/quickstart_ja.md)

## Storage Model

Daily Reports and canonical knowledge live under `<wiki-root>/`. Reports are stored inside the wiki so future query can search and connect them.

Kizashi-specific hypothesis, Signal, Review, and Positioning helper state is saved under `<project-root>/kizashi/` only when needed.

## Validation

```bash
npm run check
```
