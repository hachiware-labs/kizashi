#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const skillRoot = path.resolve(__dirname, "..");
const templatesDir = path.join(skillRoot, "assets", "templates");

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[i + 1];
      if (!next || next.startsWith("--")) {
        args[key] = true;
      } else {
        args[key] = next;
        i += 1;
      }
    } else {
      args._.push(arg);
    }
  }
  return args;
}

function projectRoot(args) {
  return path.resolve(args.target || ".");
}

function workspace(args) {
  return path.join(projectRoot(args), "kizashi");
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function readTemplate(name) {
  return fs.readFileSync(path.join(templatesDir, name), "utf8");
}

function writeIfMissing(file, content) {
  if (fs.existsSync(file)) {
    throw new Error(`File already exists: ${file}`);
  }
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, "utf8");
  console.log(file);
}

function runNode(script, args) {
  const result = spawnSync(process.execPath, [path.join(skillRoot, script), ...args], {
    cwd: process.cwd(),
    stdio: "inherit",
  });
  process.exit(result.status || 0);
}

function replaceAll(content, replacements) {
  let next = content;
  for (const [from, to] of Object.entries(replacements)) {
    next = next.split(from).join(to);
  }
  return next;
}

function createHypothesis(args) {
  const title = args.title || args._[1] || "Untitled Hypothesis";
  const slug = slugify(args.slug || title);
  if (!slug) throw new Error("--slug or --title is required");
  const date = args.date || today();
  const content = replaceAll(readTemplate("hypothesis.md"), {
    "<Hypothesis Title>": title,
    "YYYY-MM-DD": date,
  });
  writeIfMissing(path.join(workspace(args), "hypotheses", `${slug}.md`), content);
}

function createEvaluation(args) {
  const slug = slugify(args.slug || args._[1]);
  if (!slug) throw new Error("--slug is required");
  const date = args.date || today();
  const content = replaceAll(readTemplate("evaluation.yaml"), {
    '"<slug>"': `"${slug}"`,
    '"YYYY-MM-DD"': `"${date}"`,
  });
  writeIfMissing(path.join(workspace(args), "evaluations", `${slug}.eval.yaml`), content);
}

function createLog(args) {
  const date = args.date || today();
  const [year, month] = date.split("-");
  const content = replaceAll(readTemplate("daily-log.md"), {
    "YYYY-MM-DD": date,
  });
  writeIfMissing(path.join(workspace(args), "logs", year, month, `${date}.md`), content);
}

function createReport(args) {
  const date = args.date || today();
  const name = args.name || `${date}-kizashi-review`;
  const content = replaceAll(readTemplate("periodic-report.md"), {
    "YYYY-MM-DD": date,
  });
  writeIfMissing(path.join(workspace(args), "reports", `${name}.md`), content);
}

function refine(args) {
  const target = args.file || args._[1];
  if (!target) throw new Error("Usage: kizashi refine <hypothesis-file>");
  const file = path.resolve(target);
  if (!fs.existsSync(file)) throw new Error(`Hypothesis not found: ${file}`);
  console.log(`Refine ${file} using references/hypothesis-format.md and references/scoring-rubric.md.`);
  console.log("This MVP command validates that the file exists; the Skill agent performs the semantic refinement.");
}

function usage() {
  console.log(`Usage:
  kizashi init [--target <project-root>] [--overwrite]
  kizashi sources <list|show|add|update> [options]
  kizashi hypotheses <list|show|critique|improve> [slug] [--target <project-root>]
  kizashi run <task-id> [--target <project-root>] [--date YYYY-MM-DD]
  kizashi hypothesize --slug <slug> --title <title> [--target <project-root>]
  kizashi refine <hypothesis-file>
  kizashi evaluate --slug <slug> [--target <project-root>]
  kizashi log [--target <project-root>] [--date YYYY-MM-DD]
  kizashi report [--target <project-root>] [--date YYYY-MM-DD]
  kizashi summarize [--target <project-root>]`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._[0];
  const rest = process.argv.slice(3);

  if (!command || command === "help" || command === "--help") {
    usage();
    return;
  }

  if (command === "init") {
    runNode("scripts/init-kizashi-project.js", rest);
  } else if (command === "sources") {
    runNode("scripts/sources.js", rest);
  } else if (command === "hypotheses") {
    runNode("scripts/hypotheses.js", rest);
  } else if (command === "run") {
    const task = args._[1];
    if (!task) throw new Error("Usage: kizashi run <task-id>");
    const runArgs = [task];
    if (args.target) runArgs.push("--target", args.target);
    if (args.date) runArgs.push("--date", args.date);
    runNode("scripts/run-task.js", runArgs);
  } else if (command === "hypothesize") {
    createHypothesis(args);
  } else if (command === "refine") {
    refine(args);
  } else if (command === "evaluate") {
    createEvaluation(args);
  } else if (command === "log") {
    createLog(args);
  } else if (command === "report") {
    createReport(args);
  } else if (command === "summarize") {
    const summarizeArgs = [];
    if (args.target) summarizeArgs.push("--target", args.target);
    runNode("scripts/summarize-outputs.js", summarizeArgs);
  } else {
    throw new Error(`Unknown command: ${command}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
