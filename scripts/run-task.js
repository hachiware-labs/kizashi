#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

let yaml = null;
try {
  yaml = require("yaml");
} catch {
  yaml = null;
}

const skillRoot = path.resolve(__dirname, "..");
const templatesDir = path.join(skillRoot, "assets", "templates");

function parseArgs(argv) {
  const args = { target: ".", date: null, task: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--target") {
      args.target = argv[++i];
    } else if (arg === "--date") {
      args.date = argv[++i];
    } else if (arg === "--task") {
      args.task = argv[++i];
    } else if (arg === "-h" || arg === "--help") {
      printHelp();
      process.exit(0);
    } else if (!args.task) {
      args.task = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.task) throw new Error("Task id is required");
  return args;
}

function printHelp() {
  console.log("Usage: node scripts/run-task.js <task-id> [--target <project-root>] [--date YYYY-MM-DD]");
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function slug(value) {
  return String(value).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function unquote(value) {
  return String(value || "").trim().replace(/^"|"$/g, "");
}

function splitRootArrayBlocks(content) {
  return content
    .split(/\n(?=  - id: )/g)
    .filter((block) => block.includes("id:"));
}

function getScalar(block, field) {
  const match = block.match(new RegExp(`^\\s+(?:-\\s+)?${field}:\\s*(.*)$`, "m"));
  return match ? unquote(match[1]) : "";
}

function getList(block, field) {
  const lines = block.split(/\r?\n/);
  const out = [];
  let inField = false;
  for (const line of lines) {
    if (new RegExp(`^\\s{4}${field}:\\s*$`).test(line)) {
      inField = true;
      continue;
    }
    if (inField) {
      const item = line.match(/^\s{6}-\s+(.*)$/);
      if (item) {
        out.push(unquote(item[1]));
        continue;
      }
      if (/^\s{4}\S/.test(line)) break;
    }
  }
  return out;
}

function getNestedScalar(block, parent, field) {
  const lines = block.split(/\r?\n/);
  let inParent = false;
  for (const line of lines) {
    if (new RegExp(`^\\s{4}${parent}:\\s*$`).test(line)) {
      inParent = true;
      continue;
    }
    if (inParent) {
      const match = line.match(new RegExp(`^\\s{6}${field}:\\s*(.*)$`));
      if (match) return unquote(match[1]);
      if (/^\s{4}\S/.test(line)) break;
    }
  }
  return "";
}

function getNestedBlockScalar(block, parent, field) {
  const lines = block.split(/\r?\n/);
  let inParent = false;
  for (const line of lines) {
    if (new RegExp(`^\\s{4}${parent}:\\s*$`).test(line)) {
      inParent = true;
      continue;
    }
    if (inParent) {
      const match = line.match(new RegExp(`^\\s{6}${field}:\\s*(.*)$`));
      if (match) return unquote(match[1]);
      if (/^\s{4}\S/.test(line)) break;
    }
  }
  return "";
}

function parseSourcesFallback(content) {
  return {
    sources: splitRootArrayBlocks(content).map((block) => {
      const source = {};
      for (const field of [
        "id",
        "name",
        "type",
        "description",
        "provider",
        "input_path",
        "expected_format",
        "cadence",
        "role",
      ]) {
        const value = getScalar(block, field);
        if (value) source[field] = value;
      }
      return source;
    }),
  };
}

function parseTasksFallback(content) {
  return {
    tasks: splitRootArrayBlocks(content).map((block) => {
      const task = {};
      for (const field of ["id", "name", "layer", "position", "mode", "cadence", "command", "purpose"]) {
        const value = getScalar(block, field);
        if (value) task[field] = value;
      }
      for (const field of ["sources", "actions", "themes"]) {
        const values = getList(block, field);
        if (values.length > 0) task[field] = values;
      }
      const output = {};
      for (const field of ["report_path", "log_path", "evidence_patch_path"]) {
        const value = getNestedBlockScalar(block, "output", field);
        if (value) output[field] = value;
      }
      if (Object.keys(output).length > 0) task.output = output;
      const policy = {};
      for (const field of [
        "prefer_existing_hypotheses",
        "create_new_hypothesis_only_if_distinct",
        "append_only_evidence",
        "do_not_edit_hypotheses",
        "do_not_update_evaluations",
        "create_new_hypotheses",
        "do_not_create_hypotheses_by_default",
        "require_external_product_wedge",
        "require_competitive_counter_evidence",
        "require_evaluation_reason",
        "require_counter_evidence",
        "avoid_hypothesis_sprawl",
        "max_new_hypotheses",
        "output_locale",
        "require_original_url",
        "require_spike_for_new_hypothesis",
        "merge_or_park_weak_hypotheses",
      ]) {
        const value = getNestedScalar(block, "policy", field);
        if (value) policy[field] = value;
      }
      if (Object.keys(policy).length > 0) task.policy = policy;
      return task;
    }),
  };
}

function readYaml(file) {
  if (!fs.existsSync(file)) return null;
  const content = fs.readFileSync(file, "utf8");
  if (yaml) return yaml.parse(content);
  if (path.basename(file) === "sources.yaml") return parseSourcesFallback(content);
  if (path.basename(file) === "tasks.yaml") return parseTasksFallback(content);
  return {};
}

function readTemplate(name) {
  return fs.readFileSync(path.join(templatesDir, name), "utf8");
}

function replaceAll(content, replacements) {
  let next = content;
  for (const [from, to] of Object.entries(replacements)) {
    next = next.split(from).join(to);
  }
  return next;
}

function renderOutputPath(pattern, date, taskId, layer) {
  return replaceAll(pattern, {
    "{date}": date,
    "{year}": date.slice(0, 4),
    "{month}": date.slice(5, 7),
    "{task}": slug(taskId),
    "{layer}": slug(layer),
  });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFile(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, "utf8");
}

function appendOrCreate(file, content) {
  ensureDir(path.dirname(file));
  if (fs.existsSync(file)) {
    fs.appendFileSync(file, `\n${content}`, "utf8");
  } else {
    fs.writeFileSync(file, content, "utf8");
  }
}

function readText(file) {
  return fs.readFileSync(file, "utf8");
}

function isTextLike(file) {
  return [".md", ".txt", ".yaml", ".yml", ".json", ".csv", ".tsv"].includes(path.extname(file).toLowerCase());
}

function listFilesRecursive(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listFilesRecursive(full));
    else out.push(full);
  }
  return out.sort();
}

function relative(base, file) {
  return path.relative(base, file).split(path.sep).join("/");
}

function section(title, items) {
  if (!items || items.length === 0) return `## ${title}\n\n- none\n`;
  return `## ${title}\n\n${items.map((item) => `- ${item}`).join("\n")}\n`;
}

function listBlock(items, transform = (item) => item, limit = 20) {
  if (!items || items.length === 0) return "- none";
  const visible = items.slice(0, limit).map((item) => `- ${transform(item)}`);
  if (items.length > limit) visible.push(`- ... ${items.length - limit} more`);
  return visible.join("\n");
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function taskLayer(task) {
  if (task.layer) return slug(task.layer);
  if (task.mode === "evidence_capture") return "signal";
  if (task.mode === "market_positioning") return "positioning";
  return "review";
}

function requiredWorkLines(task, maxNew) {
  if (task.mode === "evidence_capture") {
    return [
      "1. Read the signals file and the original input files.",
      "2. Extract concrete problem signals: observed behavior, complaints, workarounds, repeated patterns, missing capabilities, and tool changes.",
      "3. Match each signal to an existing hypothesis when possible.",
      "4. Write small evidence patches only; keep them source-grounded and include original URLs.",
      "5. Do not edit hypothesis files, evaluation YAML, validation plans, or create new hypotheses in this layer.",
      "6. Write a short log in the user's locale.",
    ];
  }
  if (task.mode === "market_positioning") {
    return [
      "1. Read the signals file, evidence patches, and original market or competitive inputs.",
      "2. Review vendor encroachment, buyer, pricing, adoption unit, and competitive counter-evidence.",
      "3. Identify whether an external product wedge still remains for each prioritized hypothesis.",
      "4. Update positioning recommendations and strategic next actions.",
      "5. Do not create new hypotheses by default; request a hypothesis review pass if a new wedge appears.",
      "6. Write the positioning report in the user's locale.",
    ];
  }
  return [
    "1. Read the signals file, evidence patches, and the original input files.",
    "2. Extract concrete problem signals: observed behavior, complaints, workarounds, repeated patterns, missing capabilities, and tool changes.",
    "3. Match every signal to existing hypotheses before creating new ones.",
    "4. Improve existing hypotheses directly when the evidence strengthens, weakens, narrows, or falsifies them.",
    `5. Create at most ${maxNew} new hypotheses, and only when pain depth, user count, or business scale clearly spikes.`,
    "6. Update evaluations with reasons, counter-evidence, evidence URLs, score changes, and recommendations.",
    "7. Decide for each reviewed hypothesis: continue, narrow, merge, park, or split.",
    "8. Write or update validation plans only when the next step is research, interviews, queries, or an MVP experiment.",
    "9. Write the review report and short log in the user's locale.",
  ];
}

function qualityGateLines(task) {
  const common = [
    "- Record primary evidence with both `Source File` and `Original URL`.",
    "- Explain uncertainty and the next evidence needed.",
  ];
  if (task.mode === "evidence_capture") {
    return [
      "- Keep Signal Capture append-only.",
      "- Do not rewrite hypothesis or evaluation files.",
      "- Use `related_hypothesis: none` only when no existing hypothesis is close.",
      ...common,
    ];
  }
  if (task.mode === "market_positioning") {
    return [
      "- Assess vendor encroachment explicitly.",
      "- State buyer, pricing, adoption unit, and external product wedge.",
      "- Do not create hypotheses by default.",
      ...common,
    ];
  }
  return [
    "- Do not create broad hypotheses such as \"AI agents are hard\".",
    "- Specify target user, trigger moment, concrete pain, workaround, and workaround failure.",
    "- Explain whether each prioritized hypothesis is strong because of pain, user count, business scale, or a mix.",
    "- Merge, park, or reject weak and duplicate hypotheses instead of letting the list grow.",
    ...common,
  ];
}

function cleanUrl(url) {
  return url.replace(/[),.;\]]+$/g, "");
}

function extractUrls(content) {
  return unique([...content.matchAll(/https?:\/\/[^\s<>"')\]]+/g)].map((match) => cleanUrl(match[0])));
}

function extractHeadings(content) {
  return unique(
    content
      .split(/\r?\n/)
      .map((line) => line.match(/^#{1,4}\s+(.+)$/)?.[1]?.trim())
      .filter(Boolean),
  );
}

function extractBullets(content) {
  return unique(
    content
      .split(/\r?\n/)
      .map((line) => line.match(/^\s*[-*]\s+(.+)$/)?.[1]?.trim())
      .filter((line) => line && line.length >= 12)
      .map((line) => (line.length > 220 ? `${line.slice(0, 217)}...` : line)),
  );
}

function findTask(workspace, taskId) {
  const aliases = {
    hypothesis_calibration: "hypothesis_review",
    review: "hypothesis_review",
  };
  const normalizedTaskId = aliases[taskId] || taskId;
  const tasksConfig = readYaml(path.join(workspace, "config", "tasks.yaml"));
  const tasks = tasksConfig?.tasks || [];
  return tasks.find((task) => task.id === normalizedTaskId) || { id: normalizedTaskId, sources: [], actions: [] };
}

function sourceById(workspace) {
  const sourcesConfig = readYaml(path.join(workspace, "config", "sources.yaml"));
  const sources = sourcesConfig?.sources || [];
  return Object.fromEntries(sources.map((source) => [source.id, source]));
}

function runTask(args) {
  const projectRoot = path.resolve(args.target);
  const workspace = path.join(projectRoot, "kizashi");
  if (!fs.existsSync(workspace)) throw new Error(`Kizashi workspace not found: ${workspace}`);

  const date = args.date || today();
  const task = findTask(workspace, args.task);
  const layer = taskLayer(task);
  const layerDir = path.join(workspace, layer);
  const sources = sourceById(workspace);
  ensureDir(layerDir);

  const selectedSources = (task.sources || []).map((id) => sources[id] || { id, input_path: "" });
  const sourceLines = selectedSources.map((source) => {
    const inputDir = source.input_path ? path.join(projectRoot, source.input_path) : "";
    const absoluteFiles = inputDir ? listFilesRecursive(inputDir).filter(isTextLike) : [];
    const files = absoluteFiles.map((file) => relative(projectRoot, file));
    return {
      source,
      absoluteFiles,
      files,
    };
  });

  const inputSummaries = sourceLines.flatMap(({ source, absoluteFiles }) =>
    absoluteFiles.map((file) => {
      let content = "";
      try {
        content = readText(file);
      } catch {
        content = "";
      }
      return {
        sourceId: source.id,
        path: relative(projectRoot, file),
        bytes: Buffer.byteLength(content, "utf8"),
        urls: extractUrls(content),
        headings: extractHeadings(content),
        bullets: extractBullets(content),
      };
    }),
  );
  const urlIndex = inputSummaries.flatMap((summary) =>
    summary.urls.map((url) => ({
      url,
      file: summary.path,
      sourceId: summary.sourceId,
    })),
  );

  const hypotheses = listFilesRecursive(path.join(workspace, "hypotheses"))
    .filter((file) => file.endsWith(".md"))
    .map((file) => relative(projectRoot, file));
  const evaluations = listFilesRecursive(path.join(workspace, "evaluations"))
    .filter((file) => file.endsWith(".eval.yaml"))
    .map((file) => relative(projectRoot, file));

  const defaultReportPath =
    task.mode === "evidence_capture"
      ? ""
      : task.mode === "market_positioning"
        ? "kizashi/positioning/{date}.md"
        : "kizashi/review/{date}.md";
  const reportPattern = task.output?.report_path || defaultReportPath;
  const reportFile = reportPattern ? path.join(projectRoot, renderOutputPath(reportPattern, date, task.id, layer)) : null;
  const logPattern = task.output?.log_path || "kizashi/{layer}/{date}.log.md";
  const logFile = logPattern ? path.join(projectRoot, renderOutputPath(logPattern, date, task.id, layer)) : null;
  const evidencePatchPattern =
    task.output?.evidence_patch_path || (task.mode === "evidence_capture" ? "kizashi/signal/{date}.md" : "");
  const evidencePatchFile = evidencePatchPattern ? path.join(projectRoot, renderOutputPath(evidencePatchPattern, date, task.id, layer)) : null;
  const signalsFile = path.join(layerDir, `${date}.signals.md`);
  const agentTaskFile = path.join(layerDir, `${date}.task.md`);
  const manifestFile = path.join(layerDir, `${date}.manifest.json`);
  const runReadmeFile = path.join(layerDir, `${date}.run.md`);

  const sourceSummaryLines = sourceLines.map(
    ({ source, files }) => `${source.id}: ${source.input_path || "(no input_path)"} (${files.length} files)`,
  );
  const generatedArtifacts = [signalsFile, agentTaskFile, manifestFile, runReadmeFile, evidencePatchFile, reportFile, logFile]
    .filter(Boolean)
    .map((file) => relative(projectRoot, file));

  const signalsContent = [
    `# Kizashi Signals: ${date} ${task.id}`,
    "",
    "This file is generated by a Kizashi layer command. It is a deterministic source index, not a semantic conclusion.",
    `Layer command: \`${task.command || `kizashi ${layer}`}\``,
    "",
    section("Sources", sourceSummaryLines),
    section("Existing Hypotheses", hypotheses),
    section("Existing Evaluations", evaluations),
    "## Input File Summaries",
    "",
    inputSummaries.length === 0
      ? "- none"
      : inputSummaries
          .map((summary) =>
            [
              `### ${summary.path}`,
              "",
              `- Source: ${summary.sourceId}`,
              `- Bytes: ${summary.bytes}`,
              "",
              "URLs:",
              listBlock(summary.urls, (url) => url),
              "",
              "Candidate Headings:",
              listBlock(summary.headings, (heading) => heading, 12),
              "",
              "Candidate Bullets:",
              listBlock(summary.bullets, (bullet) => bullet, 12),
            ].join("\n"),
          )
          .join("\n\n"),
    "",
    "## URL Index",
    "",
    listBlock(urlIndex, (entry) => `${entry.url} (${entry.file})`, 100),
    "",
    "## Interpretation Rules",
    "",
    "- Treat extracted URLs, headings, and bullets as raw signals only.",
    "- Re-open original input files before making claims.",
    "- Preserve `Source File` and `Original URL` in every hypothesis evidence entry.",
    "- Merge signals into existing hypotheses before creating new ones.",
    "",
  ].join("\n");

  writeFile(signalsFile, signalsContent);

  const maxNew = task.policy?.max_new_hypotheses || "3";
  const agentTaskContent = [
    `# Kizashi Agent Task: ${date} ${task.id}`,
    "",
    "Complete this Kizashi run end to end. The CLI has already prepared deterministic inputs; the coding agent must perform the semantic review and edit the project files.",
    "",
    section("Prepared Files", generatedArtifacts),
    section("Sources", sourceSummaryLines),
    section("Input Files", inputSummaries.map((summary) => summary.path)),
    section("Existing Hypotheses", hypotheses),
    section("Existing Evaluations", evaluations),
    "## Required Work",
    "",
    ...requiredWorkLines(task, maxNew),
    "",
    "## Output Contract",
    "",
    evidencePatchFile ? `- Evidence patch: \`${relative(projectRoot, evidencePatchFile)}\`` : "",
    reportFile ? `- Report: \`${relative(projectRoot, reportFile)}\`` : "",
    logFile ? `- Log: \`${relative(projectRoot, logFile)}\`` : "",
    "- Hypotheses: `kizashi/hypotheses/*.md`",
    "- Evaluations: `kizashi/evaluations/*.eval.yaml`",
    "- Validations when needed: `kizashi/validations/*.plan.md`",
    "",
    "## Quality Gates",
    "",
    ...qualityGateLines(task),
    "",
  ].filter((line) => line !== "").join("\n");

  writeFile(agentTaskFile, agentTaskContent);

  writeFile(
    manifestFile,
    `${JSON.stringify(
      {
        date,
        task: {
          id: task.id,
          name: task.name || task.id,
          layer,
          mode: task.mode || null,
          actions: task.actions || [],
          policy: task.policy || {},
        },
        sources: sourceLines.map(({ source, files }) => ({
          id: source.id,
          input_path: source.input_path || "",
          files,
        })),
        inputs: inputSummaries.map((summary) => ({
          source_id: summary.sourceId,
          path: summary.path,
          bytes: summary.bytes,
          url_count: summary.urls.length,
          heading_count: summary.headings.length,
          bullet_count: summary.bullets.length,
        })),
        existing_hypotheses: hypotheses,
        existing_evaluations: evaluations,
        generated_artifacts: generatedArtifacts,
      },
      null,
      2,
    )}\n`,
  );

  if (evidencePatchFile && !fs.existsSync(evidencePatchFile)) {
    writeFile(
      evidencePatchFile,
      replaceAll(readTemplate("evidence-patch.md"), {
        "YYYY-MM-DD": date,
        "<source id>": sourceLines.map(({ source }) => source.id).join(", ") || "none",
        "<original URL>": "pending",
        "<slug or none>": "pending",
        "<short source-grounded note>": "Pending semantic extraction by the coding agent.",
      }),
    );
  }

  if (reportFile && !fs.existsSync(reportFile)) {
    const isMarketPositioning = task.mode === "market_positioning";
    writeFile(
      reportFile,
      [
        `# ${isMarketPositioning ? "Kizashi Market Positioning" : "Kizashi Hypothesis Review"}: ${date}`,
        "",
        "Output Locale: user",
        "",
        "## Summary",
        "",
        "Review pending. Start from the prepared run task and signals file.",
        "",
        "## Prepared Run",
        "",
        `- Run: \`${relative(projectRoot, runReadmeFile)}\``,
        `- Agent task: \`${relative(projectRoot, agentTaskFile)}\``,
        `- Signals: \`${relative(projectRoot, signalsFile)}\``,
        "",
        section("Sources Used", sourceSummaryLines),
        section("Input Files", inputSummaries.map((summary) => summary.path)),
        ...(isMarketPositioning
          ? [
              "## Vendor Encroachment",
              "",
              "- Pending",
              "",
              "## Buyer And Pricing",
              "",
              "- Pending",
              "",
              "## Adoption Unit",
              "",
              "- Pending",
              "",
              "## External Product Wedge",
              "",
              "- Pending",
              "",
            ]
          : [
              "## New Signals",
              "",
              "- Pending semantic extraction by the coding agent.",
              "",
              "## Updated Hypotheses",
              "",
              "- Pending",
              "",
              "## New Hypotheses",
              "",
              "- Pending",
              "",
              "## Evaluation Changes",
              "",
              "- Pending",
              "",
              "## Hypothesis Control",
              "",
              "- Created:",
              "- Merged:",
              "- Parked:",
              "- Primary spike:",
              "",
              "## Spike Assessment",
              "",
              "- Pending",
              "",
            ]),
        "## Recommended Actions",
        "",
        "- Complete `AGENT_TASK.md`.",
        "",
        "## Files Changed",
        "",
        listBlock(generatedArtifacts, (artifact) => `\`${artifact}\``),
        "",
      ].join("\n"),
    );
  }

  if (logFile && !fs.existsSync(logFile)) {
    writeFile(
      logFile,
      [
        `# Kizashi Log: ${date}`,
        "",
        "Output Locale: user",
        "",
        `Sources: ${sourceLines.map(({ source }) => source.id).join(", ") || "none"}`,
        "",
        "Prepared:",
        `- Run task: \`${relative(projectRoot, agentTaskFile)}\``,
        `- Signals: \`${relative(projectRoot, signalsFile)}\``,
        "",
        "Added:",
        "- <none yet>",
        "",
        "Updated:",
        "- <none yet>",
        "",
        "Merged:",
        "- <none yet>",
        "",
        "Scores:",
        "- <none yet>",
        "",
        "Next:",
        "- Complete semantic review and update this log with concise changes.",
        "",
      ].join("\n"),
    );
  }

  const runReadme = [
    `# Kizashi Run: ${date} ${task.id}`,
    "",
    section("Task", [
      `Name: ${task.name || task.id}`,
      `Position: ${task.position || "unknown"}`,
      `Mode: ${task.mode || "unknown"}`,
      `Command: ${task.command || `kizashi ${layer}`}`,
      `Actions: ${(task.actions || []).join(", ") || "none"}`,
    ]),
    section("Sources", sourceSummaryLines),
    section("Input Files", inputSummaries.map((summary) => summary.path)),
    section("Existing Hypotheses", hypotheses),
    section("Existing Evaluations", evaluations),
    section("Generated Artifacts", generatedArtifacts),
    "## Completed By CLI",
    "",
    "- Read task and source configuration.",
    "- Inventoried selected source folders.",
    "- Extracted URL, heading, and bullet candidates into the signals file.",
    "- Created run manifest, agent task, report seed, and log seed.",
    "",
    "## Remaining Agent Instructions",
    "",
    `- Start from \`${relative(projectRoot, agentTaskFile)}\`.`,
    ...qualityGateLines(task),
    "",
  ].join("\n");

  writeFile(runReadmeFile, runReadme);
  console.log(runReadmeFile);
  console.log(signalsFile);
  console.log(agentTaskFile);
  if (evidencePatchFile) console.log(evidencePatchFile);
  if (reportFile) console.log(reportFile);
  if (logFile) console.log(logFile);
}

try {
  runTask(parseArgs(process.argv.slice(2)));
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
