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
    .replace(/<!--[\s\S]*?-->/g, " ")
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
  const reportWithoutComments = report.replace(/<!--[\s\S]*?-->/g, " ");
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
      [/>Verified Source</, "use 確認済みソース instead of Verified Source"],
      [/>Referenced Source</, "use 参照元ソース instead of Referenced Source"],
      [/>Verification Status</, "use 検証ステータス instead of Verification Status"],
      [/>Source Tier</, "use ソース階層 instead of Source Tier"],
      [/>Claim Status</, "use 主張ステータス instead of Claim Status"],
      [/>internal note</, "use 内部メモ instead of internal note"],
      [/Editorial self-review/i, "use 編集レビュー instead of Editorial self-review"],
      [/Decision-log depth review/i, "use 判断ログ深度レビュー instead of Decision-log depth review"],
      [/Social\s*\/\s*secondary source verification/i, "use 社会/二次ソース検証 instead of Social / secondary source verification"],
      [/\b(actionable|supported|observed|unverified)\b/i, "use Japanese status values such as 行動可能 / 根拠あり / 観測 / 未検証"],
      [/\bactionable\s*\/\s*(supported|observed)\b/i, "use Japanese status values such as 行動可能 / 根拠あり"],
      [/\b(supported|observed|unverified)\s*\/\s*(observed|supported|partly-supported)\b/i, "use Japanese claim status values such as 根拠あり / 観測"],
      [/\bofficial\s*\/\s*(social|primary|primary_vendor|social-observed)\b/i, "use Japanese source tier values such as 公式 / 社会的シグナル"],
      [/X posts were browser-visible social signals only/i, "write source verification status in Japanese"],
      [/official source confirmed/i, "write verification status in Japanese"],
      [/claims remain observed/i, "write claim status in Japanese"],
      [/\b(source_tier|claim_status|verified_source|promotion_condition)\b/i, "use Japanese metadata labels in visible report text"],
      [/\bruntime evidence\b/i, "use 実行時証拠 instead of runtime evidence"],
      [/\bloop-readiness matrix\b/i, "use ループ準備度の比較表 instead of loop-readiness matrix"],
      [/\bsource-preserving edit loop\b/i, "use 根拠を保持する編集ループ instead of source-preserving edit loop"],
      [/\binterface preservation\b/i, "use インターフェース保持 instead of interface preservation"],
      [/\bsocial claim promotion gate\b/i, "use 社会的シグナルの昇格ゲート instead of social claim promotion gate"],
      [/\bruntime\s*\/\s*simulation ledger\b/i, "use 実行時/演習記録 instead of runtime / simulation ledger"],
      [/\bAI-interface preservation test\b/i, "use AIインターフェース保持テスト instead of AI-interface preservation test"],
      [/\bsource retention\b/i, "use 根拠保持 instead of source retention"],
      [/\bcontrol clarity\b/i, "use 制御の明確さ instead of control clarity"],
      [/\bhandoff notes\b/i, "use 引き継ぎメモ instead of handoff notes"],
      [/\breviewer\b/i, "use 査読者 instead of reviewer"],
      [/\bfacilitator\b/i, "use 進行役 instead of facilitator"],
      [/\badoption\b/i, "use 採用状況 instead of adoption"],
      [/\bproof\b/i, "use 証拠 instead of proof"],
    ];
    for (const [pattern, message] of forbiddenJapaneseLabels) {
      if (pattern.test(reportWithoutComments)) failures.push(`Japanese report contains English label: ${message}`);
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
  console.log("Note: this validates structure, template fidelity, labels, and minimum depth only. Reading quality, Japanese readability, decision-log depth, and social/secondary source verification must be checked by Daily Report review gates.");
}

const args = parseArgs(process.argv.slice(2));
validateDailyReport(path.resolve(args.file), path.resolve(args.template));
