#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const skillRoot = path.resolve(__dirname, "..");
const templates = path.join(skillRoot, "assets", "templates");

const dirs = [
  "config",
  "inputs/x-bookmarks",
  "inputs/wiki-garden",
  "inputs/release-notes",
  "inputs/github",
  "inputs/articles",
  "runs",
  "signals",
  "hypotheses",
  "evaluations",
  "validations",
  "logs",
  "reports",
  "outputs/issues",
  "outputs/mvp",
  "outputs/sns",
  "outputs/lp",
  "outputs/demo",
  "outputs/interview",
  "archive/parked",
  "archive/rejected",
  "archive/superseded",
];

const configFiles = {
  "sources.yaml": "config/sources.yaml",
  "tasks.yaml": "config/tasks.yaml",
  "themes.yaml": "config/themes.yaml",
  "scoring-rubric.yaml": "config/scoring-rubric.yaml",
};

function parseArgs(argv) {
  const args = { target: ".", overwrite: false };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--target") {
      args.target = argv[++i];
    } else if (arg === "--overwrite") {
      args.overwrite = true;
    } else if (arg === "-h" || arg === "--help") {
      console.log("Usage: node scripts/init-kizashi-project.js [--target <project-root>] [--overwrite]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function relativeFrom(base, target) {
  return path.relative(base, target).split(path.sep).join("/");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const projectRoot = path.resolve(args.target);
  const workspace = path.join(projectRoot, "kizashi");
  const created = [];
  const written = [];
  const skipped = [];

  for (const rel of dirs) {
    const dir = path.join(workspace, rel);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      created.push(dir);
    }
  }

  for (const [templateName, relDest] of Object.entries(configFiles)) {
    const src = path.join(templates, templateName);
    const dest = path.join(workspace, relDest);
    fs.mkdirSync(path.dirname(dest), { recursive: true });

    if (args.overwrite || !fs.existsSync(dest)) {
      fs.copyFileSync(src, dest);
      written.push(dest);
    } else {
      skipped.push(dest);
    }
  }

  console.log(`Initialized Kizashi workspace: ${workspace}`);
  if (created.length > 0) console.log(`Created directories: ${created.length}`);
  if (written.length > 0) {
    console.log("Written files:");
    for (const file of written) console.log(`- ${relativeFrom(projectRoot, file)}`);
  }
  if (skipped.length > 0) {
    console.log("Skipped existing files:");
    for (const file of skipped) console.log(`- ${relativeFrom(projectRoot, file)}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
