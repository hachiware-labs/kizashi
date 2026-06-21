#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

function fail(message) {
  console.error(message);
  process.exit(1);
}

function read(file) {
  if (!fs.existsSync(file)) fail(`Missing file: ${file}`);
  return fs.readFileSync(file, "utf8");
}

function extractStyle(content) {
  const match = content.match(/<style>([\s\S]*?)<\/style>/i);
  return match ? match[1].trim() : "";
}

function stripTags(content) {
  return content
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function countMatches(content, pattern) {
  return (content.match(pattern) || []).length;
}

function parseArgs(argv) {
  const args = { file: null, template: path.join("assets", "templates", "daily-signal-report.html") };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--template") {
      args.template = argv[++i];
    } else if (!args.file) {
      args.file = arg;
    } else {
      fail(`Unknown argument: ${arg}`);
    }
  }
  if (!args.file) {
    fail("Usage: node scripts/validate-daily-report.js <report.html> [--template assets/templates/daily-signal-report.html]");
  }
  return args;
}

function validateDailyReport(file, templateFile) {
  const report = read(file);
  const template = read(templateFile);
  const reportText = stripTags(report);
  const failures = [];

  if (!/<!doctype html>/i.test(report)) failures.push("report must be a full HTML document");
  if (report.includes("{{")) failures.push("report must not contain unresolved placeholders");
  if (extractStyle(report) !== extractStyle(template)) {
    failures.push("report must use the exact Kizashi Daily HTML template style block");
  }
  if (!report.includes("https://hachiware-labs.com/images/hero/lab-building-with-sign.png")) {
    failures.push("hero background image must be present");
  }
  if (!report.includes("https://hachiware-labs.com/images/hero/hachiware-character.png")) {
    failures.push("brand image must be present");
  }

  const requiredText = [
    "KIZASHI",
    "レポート索引",
    "本日のレポート",
    "シグナル",
    "課題の深化",
    "仮説の更新",
    "次へのアイデア",
    "編集後記",
    "フィードバック",
    "ソースファイル",
    "元URL",
    "変化の兆し",
  ];
  for (const text of requiredText) {
    if (!reportText.includes(text)) failures.push(`missing required text: ${text}`);
  }

  if (/<html[^>]+lang="ja"/i.test(report)) {
    const forbiddenJapaneseLabels = [
      [/>Signal\s+\d+</, "use シグナル N instead of Signal N"],
      [/>Updated Hypothesis\b/, "use 更新仮説 instead of Updated Hypothesis"],
      [/>Idea</, "use アイデア instead of Idea"],
      [/>Why(?: It)? Matters</, "use 重要性 instead of Why Matters"],
      [/>Change</, "use 変更 instead of Change"],
      [/>Evidence</, "use 根拠 instead of Evidence"],
      [/>Decision</, "use 判断 instead of Decision"],
      [/>Source File</, "use ソースファイル instead of Source File"],
      [/>Original URL</, "use 元URL instead of Original URL"],
      [/>Related Report</, "use 関連レポート instead of Related Report"],
      [/>Related Knowledge</, "use 関連知識 instead of Related Knowledge"],
      [/>Strength</, "use 強度 instead of Strength"],
      [/Novelty:/, "use 新規性 instead of Novelty"],
      [/>internal note</, "use 内部メモ instead of internal note"],
    ];
    for (const [pattern, message] of forbiddenJapaneseLabels) {
      if (pattern.test(report)) failures.push(`Japanese report contains English label: ${message}`);
    }
  }

  const signalCards = countMatches(report, /class="signal-card"/g);
  if (signalCards < 1) failures.push("report must include at least one signal card");
  if (countMatches(report, /class="pain-point"/g) < signalCards * 2) {
    failures.push("each signal should include two pain points");
  }
  if (countMatches(report, /class="context-note"/g) < signalCards * 2) {
    failures.push("each signal should include change sign and knowledge connection notes");
  }

  const paragraphs = [...report.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((match) => stripTags(match[1]));
  const longParagraphs = paragraphs.filter((paragraph) => paragraph.length >= 80).length;
  if (longParagraphs < 8) {
    failures.push("report body is too thin: expected at least 8 substantial paragraphs");
  }

  const editorNoteMatch = report.match(/<h2>編集後記：今後の展望<\/h2>[\s\S]*?<article class="draft">([\s\S]*?)<\/article>/);
  if (!editorNoteMatch) {
    failures.push("missing editor note article");
  } else {
    const editorParagraphs = countMatches(editorNoteMatch[1], /<p>/g);
    if (editorParagraphs < 5) failures.push("editor note must contain at least 5 paragraphs");
  }

  if (failures.length > 0) {
    fail(`Daily report validation failed for ${file}:\n- ${failures.join("\n- ")}`);
  }

  console.log(`Daily report structural validation passed: ${file}`);
  console.log("Note: this validates structure, template fidelity, labels, and minimum depth only. Reading quality must be checked by Daily Report editorial review.");
}

const args = parseArgs(process.argv.slice(2));
validateDailyReport(path.resolve(args.file), path.resolve(args.template));
