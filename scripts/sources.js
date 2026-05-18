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
  const args = { target: ".", command: null, values: {} };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--target") {
      args.target = argv[++i];
    } else if (arg.startsWith("--")) {
      args.values[arg.slice(2)] = argv[++i];
    } else if (!args.command) {
      args.command = arg;
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
  node scripts/sources.js list [--target <project-root>]
  node scripts/sources.js show --id <source-id> [--target <project-root>]
  node scripts/sources.js add --id <source-id> --name <name> --type <type> --input-path <path> --role <role> [options]
  node scripts/sources.js update --id <source-id> [fields...] [--target <project-root>]

Options for add/update:
  --name <name>
  --type <type>
  --description <text>
  --provider <provider>
  --input-path <path>
  --expected-format <format>
  --cadence <cadence-hint>
  --role <role>`);
}

function sourcesPath(target) {
  return path.join(path.resolve(target), "kizashi", "config", "sources.yaml");
}

function readSourcesFile(file) {
  if (!fs.existsSync(file)) {
    throw new Error(`sources.yaml not found: ${file}`);
  }
  return fs.readFileSync(file, "utf8");
}

function parseYamlSources(content) {
  if (!yaml) return null;
  const doc = yaml.parse(content);
  if (!doc || !Array.isArray(doc.sources)) return { sources: [] };
  return doc;
}

function writeYamlSources(file, doc) {
  fs.writeFileSync(file, yaml.stringify(doc), "utf8");
}

function splitSourceBlocks(content) {
  return content
    .split(/\n(?=  - id: )/g)
    .filter((block) => block.includes("id:"));
}

function getField(block, field) {
  const match = block.match(new RegExp(`^\\s+(?:-\\s+)?${field}:\\s*(.*)$`, "m"));
  return match ? match[1].trim().replace(/^"|"$/g, "") : "";
}

function listSources(content) {
  const doc = parseYamlSources(content);
  if (doc) {
    for (const source of doc.sources || []) {
      console.log(`${source.id || ""}\t${source.name || ""}\t${source.role || ""}\t${source.input_path || ""}`);
    }
    return;
  }
  const blocks = splitSourceBlocks(content);
  for (const block of blocks) {
    const id = getField(block, "id");
    const name = getField(block, "name");
    const role = getField(block, "role");
    const inputPath = getField(block, "input_path");
    console.log(`${id}\t${name}\t${role}\t${inputPath}`);
  }
}

function showSource(content, id) {
  const doc = parseYamlSources(content);
  if (doc) {
    const source = (doc.sources || []).find((candidate) => candidate.id === id);
    if (!source) throw new Error(`Source not found: ${id}`);
    console.log(yaml.stringify({ sources: [source] }).trimEnd());
    return;
  }
  const block = splitSourceBlocks(content).find((candidate) => getField(candidate, "id") === id);
  if (!block) throw new Error(`Source not found: ${id}`);
  console.log(block.trimEnd());
}

function quote(value) {
  return String(value).replace(/"/g, '\\"');
}

function appendSource(file, content, values) {
  const required = ["id", "name", "type", "input-path", "role"];
  for (const key of required) {
    if (!values[key]) throw new Error(`--${key} is required`);
  }

  const id = values.id;
  if (!/^[a-z0-9_][a-z0-9_-]*$/.test(id)) {
    throw new Error("--id must use lowercase letters, digits, underscores, or hyphens");
  }

  const doc = parseYamlSources(content);
  if (doc) {
    doc.sources = doc.sources || [];
    if (doc.sources.some((source) => source.id === id)) {
      throw new Error(`Source already exists: ${id}`);
    }
    const source = {
      id,
      name: values.name,
      type: values.type,
    };
    if (values.description) source.description = values.description;
    if (values.provider) source.provider = values.provider;
    source.input_path = values["input-path"];
    if (values["expected-format"]) source.expected_format = values["expected-format"];
    if (values.cadence) source.cadence = values.cadence;
    source.role = values.role;
    doc.sources.push(source);
    writeYamlSources(file, doc);
    console.log(`Added source: ${id}`);
    return;
  }

  if (splitSourceBlocks(content).some((block) => getField(block, "id") === id)) {
    throw new Error(`Source already exists: ${id}`);
  }

  const lines = [
    `  - id: ${id}`,
    `    name: ${quote(values.name)}`,
    `    type: ${quote(values.type)}`,
  ];
  if (values.description) lines.push(`    description: ${quote(values.description)}`);
  if (values.provider) lines.push(`    provider: ${quote(values.provider)}`);
  lines.push(`    input_path: ${quote(values["input-path"])}`);
  if (values["expected-format"]) lines.push(`    expected_format: ${quote(values["expected-format"])}`);
  if (values.cadence) lines.push(`    cadence: ${quote(values.cadence)}`);
  lines.push(`    role: ${quote(values.role)}`);

  const nextContent = `${content.trimEnd()}\n\n${lines.join("\n")}\n`;
  fs.writeFileSync(file, nextContent, "utf8");
  console.log(`Added source: ${id}`);
}

function normalizeUpdateValues(values) {
  const mapping = {
    "input-path": "input_path",
    "expected-format": "expected_format",
  };
  const allowed = new Set([
    "name",
    "type",
    "description",
    "provider",
    "input-path",
    "expected-format",
    "cadence",
    "role",
  ]);
  const next = {};
  for (const [key, value] of Object.entries(values)) {
    if (key === "id") continue;
    if (!allowed.has(key)) throw new Error(`Unknown update field: --${key}`);
    next[mapping[key] || key] = value;
  }
  return next;
}

function updateSource(file, content, values) {
  if (!values.id) throw new Error("--id is required");
  const updates = normalizeUpdateValues(values);
  if (Object.keys(updates).length === 0) throw new Error("No fields to update");

  const doc = parseYamlSources(content);
  if (doc) {
    doc.sources = doc.sources || [];
    const source = doc.sources.find((candidate) => candidate.id === values.id);
    if (!source) throw new Error(`Source not found: ${values.id}`);
    Object.assign(source, updates);
    writeYamlSources(file, doc);
    console.log(`Updated source: ${values.id}`);
    return;
  }

  const blocks = splitSourceBlocks(content);
  const index = blocks.findIndex((candidate) => getField(candidate, "id") === values.id);
  if (index === -1) throw new Error(`Source not found: ${values.id}`);
  const lines = blocks[index].split("\n");
  for (const [field, value] of Object.entries(updates)) {
    const pattern = new RegExp(`^(\\s+)${field}:`);
    const lineIndex = lines.findIndex((line) => pattern.test(line));
    if (lineIndex >= 0) {
      const indent = lines[lineIndex].match(pattern)[1];
      lines[lineIndex] = `${indent}${field}: ${quote(value)}`;
    } else {
      lines.push(`    ${field}: ${quote(value)}`);
    }
  }
  blocks[index] = lines.join("\n");
  const prefix = content.startsWith("sources:\n") ? "sources:\n" : "";
  fs.writeFileSync(file, `${prefix}${blocks.map((block) => block.trimEnd()).join("\n")}\n`, "utf8");
  console.log(`Updated source: ${values.id}`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const file = sourcesPath(args.target);
  const content = readSourcesFile(file);

  if (args.command === "list") {
    listSources(content);
  } else if (args.command === "show") {
    if (!args.values.id) throw new Error("--id is required");
    showSource(content, args.values.id);
  } else if (args.command === "add") {
    appendSource(file, content, args.values);
  } else if (args.command === "update") {
    updateSource(file, content, args.values);
  } else {
    throw new Error(`Unknown command: ${args.command}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
