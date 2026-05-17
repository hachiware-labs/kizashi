#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function exists(root, relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function parseFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (lines[0] !== "---") fail("SKILL.md must start with YAML frontmatter.");
  const end = lines.indexOf("---", 1);
  if (end < 0) fail("SKILL.md frontmatter must end with ---.");

  const fields = {};
  for (const line of lines.slice(1, end)) {
    if (!line.trim()) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) fail(`Unsupported frontmatter line: ${line}`);
    fields[match[1]] = match[2].trim().replace(/^"|"$/g, "");
  }

  return {
    fields,
    body: lines.slice(end + 1).join("\n").trim(),
  };
}

function parseOpenAiYaml(content) {
  const values = {};
  for (const field of ["display_name", "short_description", "default_prompt"]) {
    const match = content.match(new RegExp(`^\\s+${field}:\\s*(.*)$`, "m"));
    if (match) values[field] = match[1].trim().replace(/^"|"$/g, "");
  }
  return values;
}

function validateSkill(root) {
  const skillFile = path.join(root, "SKILL.md");
  if (!fs.existsSync(skillFile)) fail("Missing SKILL.md.");

  const { fields, body } = parseFrontmatter(read(skillFile));
  const keys = Object.keys(fields).sort();
  const expected = ["description", "name"];
  if (keys.join(",") !== expected.join(",")) {
    fail(`SKILL.md frontmatter must contain only name and description. Found: ${keys.join(", ")}`);
  }
  if (!/^[a-z0-9-]{1,63}$/.test(fields.name)) {
    fail("Skill name must use lowercase letters, digits, and hyphens only, max 63 chars.");
  }
  if (path.basename(root) !== fields.name) {
    fail(`Skill folder name must match skill name. Expected folder: ${fields.name}`);
  }
  if (fields.description.length < 40) {
    fail("Skill description is too short to be useful for triggering.");
  }
  if (!body) fail("SKILL.md body must not be empty.");

  for (const relativePath of ["agents/openai.yaml", "assets/templates", "bin/kizashi.js", "references", "scripts"]) {
    if (!exists(root, relativePath)) fail(`Missing required path: ${relativePath}`);
  }

  const openAi = parseOpenAiYaml(read(path.join(root, "agents", "openai.yaml")));
  for (const field of ["display_name", "short_description", "default_prompt"]) {
    if (!openAi[field]) fail(`agents/openai.yaml missing interface.${field}.`);
  }

  const pkgFile = path.join(root, "package.json");
  if (!fs.existsSync(pkgFile)) fail("Missing package.json.");
  const pkg = JSON.parse(read(pkgFile));
  if (!pkg.bin || pkg.bin.kizashi !== "./bin/kizashi.js") {
    fail('package.json must expose bin.kizashi as "./bin/kizashi.js".');
  }
  if (!pkg.scripts || !pkg.scripts.check || !pkg.scripts.smoke) {
    fail("package.json must define check and smoke scripts.");
  }

  console.log(`Skill is valid: ${fields.name}`);
}

const root = path.resolve(process.argv[2] || ".");
validateSkill(root);
