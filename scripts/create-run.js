#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function parseArgs(argv) {
  const args = { target: ".", date: null, task: null, layer: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--target") {
      args.target = argv[++i];
    } else if (arg === "--task") {
      args.task = argv[++i];
    } else if (arg === "--date") {
      args.date = argv[++i];
    } else if (arg === "--layer") {
      args.layer = argv[++i];
    } else if (arg === "-h" || arg === "--help") {
      console.log("Usage: node scripts/create-run.js --task <task-id> [--target <project-root>] [--date YYYY-MM-DD] [--layer <layer>]");
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.task) throw new Error("--task is required");
  return args;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function slug(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function layerForTask(task, explicitLayer) {
  if (explicitLayer) return slug(explicitLayer);
  if (task === "signal_capture" || task === "signal") return "signal";
  if (task === "market_positioning" || task === "positioning") return "positioning";
  if (task === "hypothesis_review" || task === "hypothesis_calibration" || task === "review") return "review";
  return "review";
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const date = args.date || today();
  const projectRoot = path.resolve(args.target);
  const layer = layerForTask(args.task, args.layer);
  const runDir = path.join(projectRoot, "kizashi", layer);
  const runFile = path.join(runDir, `${date}.run.md`);

  if (fs.existsSync(runFile)) {
    throw new Error(`Run file already exists: ${runFile}`);
  }

  fs.mkdirSync(runDir, { recursive: true });
  fs.writeFileSync(
    runFile,
    `# Kizashi Run: ${date} ${args.task}\n\n## Sources\n\n- \n\n## Actions\n\n- \n\n## Outputs\n\n- \n`,
    "utf8",
  );
  console.log(runFile);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
