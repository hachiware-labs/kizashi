# Kizashi Daily - {{date}}

## {{date_display}}のテーマ

{{theme}}

{{project_name}} / Daily Signal Report

## 1. 今日の3行要約

- {{summary_1}}
- {{summary_2}}
- {{summary_3}}

## 2. 本日のレポート

| 項目 | 件数 | 概要 |
|---|---:|---|
| シグナル | {{signals_count}} | {{signals_note}} |
| 課題の深化 | {{deepening_count}} | {{deepening_note}} |
| 仮説の更新 | {{hypothesis_updates_count}} | {{hypothesis_updates_note}} |
| 次へのアイデア | {{next_ideas_count}} | {{next_ideas_note}} |

## 3. シグナル

### シグナル {{signal_number}}: {{signal_title}}

{{signal_context}}

{{signal_structure}}

**変化の兆し**

{{change_sign}}

**周辺調査**

{{surrounding_investigation}}

**確認できたこと**

{{confirmed_points}}

**未確定・反証候補**

{{uncertainty_or_counter_signals}}

**過去レポート・既存知識との接続**

{{knowledge_connection}}

**ペインポイント 1: {{pain_point_1_title}}**

{{pain_point_1_body}}

**ペインポイント 2: {{pain_point_2_title}}**

{{pain_point_2_body}}

- Source File: `{{source_file}}`
- Original URL: {{original_url_or_internal_note}}
- Related Report: `{{related_report_path_or_none}}`
- Related Knowledge: `{{related_knowledge_path_or_none}}`
- Strength: {{strength}}
- Novelty: {{novelty}}

## 4. 課題の深化

### {{deepening_lens_1}}: {{deepening_title_1}}

{{deepening_body_1}}

### {{deepening_lens_2}}: {{deepening_title_2}}

{{deepening_body_2}}

### {{deepening_lens_3}}: {{deepening_title_3}}

{{deepening_body_3}}

### {{deepening_lens_4}}: {{deepening_title_4}}

{{deepening_body_4}}

## 5. 仮説の更新

### 更新仮説 {{hypothesis_id}}: {{hypothesis_title}}

{{hypothesis_update_body}}

- 変更: {{hypothesis_change}}
- 根拠: {{hypothesis_evidence}}
- 反証: {{hypothesis_counter_evidence}}
- 判断: {{hypothesis_decision}}
- 次に集める証拠: {{next_evidence}}

## 6. 次へのアイデア

| アイデア | Why Matters |
|---|---|
| {{idea_1}} | {{why_it_matters_1}} |
| {{idea_2}} | {{why_it_matters_2}} |
| {{idea_3}} | {{why_it_matters_3}} |

## 7. 編集後記：今後の展望

{{editor_note_body}}

Observed by Kizashi

## 8. Feedback

フィードバックがある場合は、このレポートの観点、取り上げるシグナル、仮説の方向性、次へのアイデアに修正したい点を、Codex に「Kizashi Skill に {{feedback_text}} をフィードバックして」と依頼してください。

Kizashi は内容に応じて、スキル・テンプレート・情報ソース設定を見直すか、llm-wiki の `raw/feedback/` に記録し、次回以降の Kizashi Daily や query / refinement に反映します。

<!--
Kizashi Agent Notes:
- Save this report under <wiki>/reports/daily/ so wiki query can retrieve it later. Do not leave a Daily Report only under kizashi/review/ or another project workflow folder.
- Use assets/templates/daily-signal-report.html when the final deliverable should be a polished visual report.
- Preserve source URLs whenever available.
- For important signals, perform scoped surrounding investigation before synthesis: related URLs, adjacent sources, official docs, past reports, existing wiki pages, and counter-signals.
- Use "internal note" only when no external URL exists.
- Connect signals to past reports and existing knowledge when relevant, but do not force a connection.
- Store one-off user-provided ideas through the LLM Wiki ingest flow before using them in later reports.
- Handle "feedback this to Kizashi" requests through the Kizashi Feedback flow: update skill/templates/docs/source registry when the feedback changes behavior, or record it under <wiki>/raw/feedback/ when it is user-specific knowledge or preference.
-->
