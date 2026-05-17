#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

let yaml = null;
try {
  yaml = require("yaml");
} catch {
  yaml = null;
}

function parseArgs(argv) {
  const args = { target: ".", command: null, slug: null };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--target") {
      args.target = argv[++i];
    } else if (arg.startsWith("--")) {
      args[arg.slice(2)] = argv[++i] || true;
    } else if (!args.command) {
      args.command = arg;
    } else if (!args.slug) {
      args.slug = arg;
    } else {
      throw new Error(`Unknown argument: ${arg}`);
    }
  }
  if (!args.command || args.command === "help") {
    printHelp();
    process.exit(args.command === "help" ? 0 : 1);
  }
  return args;
}

function printHelp() {
  console.log(`Usage:
  node scripts/hypotheses.js list [--target <project-root-or-workspace>]
  node scripts/hypotheses.js show <slug> [--target <project-root-or-workspace>]
  node scripts/hypotheses.js critique <slug> [--target <project-root-or-workspace>]
  node scripts/hypotheses.js improve <slug> [--target <project-root-or-workspace>]`);
}

function workspace(target) {
  const resolved = path.resolve(target);
  if (fs.existsSync(path.join(resolved, "hypotheses"))) return resolved;
  return path.join(resolved, "kizashi");
}

function slugFromFile(file) {
  return path.basename(file, ".md");
}

function readFileIfExists(file) {
  return fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
}

function section(content, heading) {
  const pattern = new RegExp(`^## ${escapeRegExp(heading)}\\s*\\n([\\s\\S]*?)(?=^## |\\z)`, "m");
  const match = content.match(pattern);
  return match ? match[1].trim() : "";
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function field(content, name) {
  const match = content.match(new RegExp(`^${escapeRegExp(name)}:\\s*(.*)$`, "m"));
  return match ? match[1].trim() : "";
}

function firstBullet(block) {
  const match = block.match(/^- (.*)$/m);
  return match ? match[1].trim() : "";
}

function extractEvidenceUrls(content) {
  return [...content.matchAll(/Original URL:\s*(\S+)/g)]
    .map((match) => match[1])
    .filter((url) => /^https?:\/\//.test(url));
}

function parseEvaluation(file) {
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  if (yaml) {
    try {
      return yaml.parse(raw);
    } catch {
      return null;
    }
  }
  const score = (axis) => {
    const pattern = new RegExp(`^\\s*${axis}:\\s*\\n\\s*score:\\s*(\\d+)`, "m");
    const match = raw.match(pattern);
    return match ? Number(match[1]) : "";
  };
  const spikeType = raw.match(/^\s*type:\s*"?([^"\n]+)"?/m);
  return {
    scores: {
      realism: { score: score("realism") },
      pain_depth: { score: score("pain_depth") },
      hachiware_fit: { score: score("hachiware_fit") },
      spike_strength: { score: score("spike_strength"), type: spikeType ? spikeType[1].trim() : "" },
    },
    recommendation: (raw.match(/^recommendation:\s*"?([^"\n]+)"?/m) || [null, ""])[1],
  };
}

function summarizeHypothesis(workspaceDir, file) {
  const content = fs.readFileSync(file, "utf8");
  const slug = slugFromFile(file);
  const evaluation = parseEvaluation(path.join(workspaceDir, "evaluations", `${slug}.eval.yaml`));
  const scores = evaluation?.scores || {};
  return {
    slug,
    title: content.match(/^#\s+(.+)$/m)?.[1] || slug,
    status: field(content, "Status") || "",
    spike: scores.spike_strength?.type || firstBullet(section(content, "User / Market Estimate")).match(/Spike Type:\s*(.*)/)?.[1] || "",
    realism: scores.realism?.score || "",
    pain: scores.pain_depth?.score || "",
    fit: scores.hachiware_fit?.score || "",
    recommendation: evaluation?.recommendation || "",
  };
}

function list(args) {
  const ws = workspace(args.target);
  const dir = path.join(ws, "hypotheses");
  if (!fs.existsSync(dir)) throw new Error(`Hypotheses directory not found: ${dir}`);
  const files = fs.readdirSync(dir).filter((name) => name.endsWith(".md")).sort();
  const rows = files.map((name) => summarizeHypothesis(ws, path.join(dir, name)));
  console.log(["slug", "status", "spike", "realism", "pain", "fit", "recommendation"].join("\t"));
  for (const row of rows) {
    console.log([row.slug, row.status, row.spike, row.realism, row.pain, row.fit, row.recommendation].join("\t"));
  }
}

function resolveHypothesisFile(args) {
  if (!args.slug) throw new Error("Hypothesis slug is required");
  const ws = workspace(args.target);
  const slug = slugFromFile(args.slug);
  const file = path.join(ws, "hypotheses", `${slug}.md`);
  if (!fs.existsSync(file)) throw new Error(`Hypothesis not found: ${file}`);
  return { ws, slug, file };
}

function show(args) {
  const { ws, slug, file } = resolveHypothesisFile(args);
  const content = fs.readFileSync(file, "utf8");
  const evaluation = parseEvaluation(path.join(ws, "evaluations", `${slug}.eval.yaml`));
  const scores = evaluation?.scores || {};
  console.log(`# ${content.match(/^#\s+(.+)$/m)?.[1] || slug}`);
  console.log("");
  console.log(`Status: ${field(content, "Status") || "unknown"}`);
  console.log(`Spike: ${scores.spike_strength?.type || "unknown"} (${scores.spike_strength?.score || "-"})`);
  console.log(`Recommendation: ${evaluation?.recommendation || "unknown"}`);
  console.log("");
  console.log("Refined Hypothesis:");
  console.log(section(content, "Refined Hypothesis") || "(none)");
  console.log("");
  console.log("Target User:");
  console.log(section(content, "Target User") || "(none)");
  console.log("");
  console.log("Concrete Pain:");
  console.log(section(content, "Concrete Pain") || "(none)");
  console.log("");
  console.log("Evidence URLs:");
  const urls = extractEvidenceUrls(content);
  if (urls.length === 0) console.log("- none");
  for (const url of urls) console.log(`- ${url}`);
}

function critique(args) {
  const { ws, slug, file } = resolveHypothesisFile(args);
  const evaluationFile = path.join(ws, "evaluations", `${slug}.eval.yaml`);
  console.log(`# Critique Request: ${slug}`);
  console.log("");
  console.log("Use $kizashi to critique this hypothesis. Focus on:");
  console.log("- user specificity");
  console.log("- pain depth");
  console.log("- user_count / business_scale / spike_strength");
  console.log("- evidence quality and original URL traceability");
  console.log("- overlap with existing hypotheses");
  console.log("- falsification quality");
  console.log("- MVP feasibility");
  console.log("- Hachiware Labs fit");
  console.log("");
  console.log(`Hypothesis: ${file}`);
  console.log(`Evaluation: ${fs.existsSync(evaluationFile) ? evaluationFile : "(missing)"}`);
  console.log("");
  console.log("Current Summary:");
  show({ ...args, target: ws, slug });
}

function improve(args) {
  const { ws, slug, file } = resolveHypothesisFile(args);
  const evaluationFile = path.join(ws, "evaluations", `${slug}.eval.yaml`);
  const validationFile = path.join(ws, "validations", `${slug}.plan.md`);
  console.log(`# Improve Request: ${slug}`);
  console.log("");
  console.log("Use $kizashi to improve this hypothesis. Update files directly where appropriate:");
  console.log(`- ${file}`);
  console.log(`- ${fs.existsSync(evaluationFile) ? evaluationFile : `${evaluationFile} (create if needed)`}`);
  console.log(`- ${fs.existsSync(validationFile) ? validationFile : `${validationFile} (create if needed)`}`);
  console.log("");
  console.log("Improvement goals:");
  console.log("- sharpen target user, buyer, and trigger moment");
  console.log("- make the pain concrete and falsifiable");
  console.log("- merge duplicate or weak sub-pains instead of creating new hypotheses");
  console.log("- ensure Source File + Original URL evidence is present");
  console.log("- update spike_strength and recommendation");
  console.log("- produce the smallest next MVP or validation step");
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.command === "list") list(args);
  else if (args.command === "show") show(args);
  else if (args.command === "critique") critique(args);
  else if (args.command === "improve") improve(args);
  else throw new Error(`Unknown command: ${args.command}`);
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
