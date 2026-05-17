#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const sections = {
  hypotheses: (name) => name.endsWith(".md"),
  evaluations: (name) => name.endsWith(".eval.yaml"),
  validations: (name) => name.endsWith(".plan.md"),
  reports: (name) => name.endsWith(".md"),
};

function parseArgs(argv) {
  const args = { target: "." };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--target") {
      args.target = argv[++i];
    } else if (arg === "-h" || arg === "--help") {
      console.log("Usage: node scripts/summarize-outputs.js [--target <project-root>]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  return args;
}

function listMatchingFiles(dir, predicate) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && predicate(entry.name))
    .map((entry) => path.join(dir, entry.name))
    .sort();
}

function relativeFrom(base, target) {
  return path.relative(base, target).split(path.sep).join("/");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const target = path.resolve(args.target);
  const nestedWorkspace = path.join(target, "kizashi");
  const workspace = fs.existsSync(path.join(target, "config")) ? target : nestedWorkspace;

  if (!fs.existsSync(workspace)) {
    throw new Error(`Kizashi workspace not found: ${workspace}`);
  }

  console.log(`Kizashi workspace: ${workspace}`);
  for (const [section, predicate] of Object.entries(sections)) {
    const files = listMatchingFiles(path.join(workspace, section), predicate);
    console.log(`\n${section}: ${files.length}`);
    for (const file of files.slice(0, 20)) {
      console.log(`- ${relativeFrom(workspace, file)}`);
    }
    if (files.length > 20) {
      console.log(`- ... ${files.length - 20} more`);
    }
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
