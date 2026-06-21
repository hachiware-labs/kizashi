# Kizashi Daily - {{date}}

## {{date_display}}のテーマ

{{theme}}

{{project_name}} / 日次シグナルレポート

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

**周辺調査・比較**

{{surrounding_investigation}}

**確認できたこと**

{{confirmed_points}}

**未確定・反証条件**

{{uncertainty_or_counter_signals}}

**過去レポート・既存知識との接続**

{{knowledge_connection}}

**ペインポイント 1: {{pain_point_1_title}}**

{{pain_point_1_body}}

**ペインポイント 2: {{pain_point_2_title}}**

{{pain_point_2_body}}

- ソースファイル: `{{source_file}}`
- 元URL: {{original_url_or_internal_note}}
- 確認済みソース: {{verified_source_or_none}}
- 参照元ソース: {{referenced_source_or_none}}
- 検証ステータス: {{verification_status}}
- ソース階層: {{source_tier}}
- 主張ステータス: {{claim_status}}
- 関連レポート: `{{related_report_path_or_none}}`
- 関連知識: `{{related_knowledge_path_or_none}}`
- 強度: {{strength}}
- 新規性: {{novelty}}

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
- 反証条件: {{hypothesis_counter_evidence}}
- 判断: {{hypothesis_decision}}
- 次に集める証拠: {{next_evidence}}

## 6. 次へのアイデア

| アイデア | 重要性 | 最小検証・成否条件 |
|---|---|---|
| {{idea_1}} | {{why_it_matters_1}} | {{validation_conditions_1}} |
| {{idea_2}} | {{why_it_matters_2}} | {{validation_conditions_2}} |
| {{idea_3}} | {{why_it_matters_3}} | {{validation_conditions_3}} |

## 7. 編集後記：今後の展望

{{editor_note_body}}

Kizashi による観測

## 8. フィードバック

フィードバックがある場合は、このレポートの観点、取り上げるシグナル、仮説の方向性、次へのアイデアに修正したい点を、Codex に「Kizashi Skill に {{feedback_text}} をフィードバックして」と依頼してください。

Kizashi は内容に応じて、スキル・テンプレート・情報ソース設定を見直すか、llm-wiki の `raw/feedback/` に記録し、次回以降の Kizashi Daily や query / refinement に反映します。

<!--
Kizashi Agent Notes:
- Save this report under <wiki>/reports/daily/ so wiki query can retrieve it later. Do not leave a Daily Report only under kizashi/review/ or another project workflow folder.
- Use assets/templates/daily-signal-report.html when the final deliverable should be a polished visual report.
- Treat each section as an editorial question, not a required slot:
  - シグナル: 今日何が不可逆に変わりつつあるのか。source summary ではなく、変化と判断への影響から書く。
  - 課題の深化: 抽象カテゴリではなく、現場で詰まる具体場面、失敗、判断から始める。
  - 仮説の更新: 作成、継続、絞り込み、強化、弱化、統合、保留など、今日の evidence による判断差分を書く。
  - 次へのアイデア: artifact 名だけで終わらせず、最小検証、成功/失敗の見方、なぜ今やるかを書く。
  - 編集後記: 全体の読み筋を回収し、次回観測する問いで終える。
- Do not change the fixed template headings: 今日の3行要約, 本日のレポート, シグナル, 課題の深化, 仮説の更新, 次へのアイデア, 編集後記：今後の展望, フィードバック.
- Keep the hero background image in HTML reports: https://hachiware-labs.com/images/hero/lab-building-with-sign.png.
- Keep the brand image in HTML reports: https://hachiware-labs.com/images/hero/hachiware-character.png.
- Theme: include a dated theme in the form YYYY/M/Dのテーマ and explain the day's focus in the lead.
- Summary: write exactly three useful summary bullets; do not leave generic filler.
- Signals: normally include at least 3 signal cards. Each signal needs a Japanese title, 2 detailed context paragraphs, 2 pain points, change sign, past-report/knowledge connection, ソースファイル, 元URL, 確認済みソース, 参照元ソース, 検証ステータス, ソース階層, 主張ステータス, 関連レポート, 関連知識, 強度, and 新規性.
- Signal surrounding investigation: for important signals, compare related sources instead of listing them. Name source-to-source differences, complementarity, contradictions, and remaining uncertainty; if no source supports deeper comparison, write the next source or condition to check.
- Social / secondary source verification: treat X, Reddit, Hatena, personal blogs, roundup posts, bookmarks, and secondary introductions as pain seeds or social signals by default. For important signals, verify the original post URL, linked article, release note, official docs, issue, or related primary source when possible. If login, deletion, private visibility, or access limits block verification, state the constraint and keep claim_status as observed or unverified.
- Problem deepening: include at least 4 cards or equivalent sections, each with enough detail to explain the current problem, structure, failed workaround, or deeper question.
- Hypothesis updates: include at least 2 updates unless no hypothesis changed; each hypothesis label, name, Change, Evidence, and Decision must be written in Japanese. 反証条件 must say which condition would weaken the hypothesis or make an external artifact, ledger, skill, or pipeline unnecessary.
- Next ideas: include at least 3 ideas. Idea names and 重要性 paragraphs must be written in Japanese; do not leave English labels such as Idea or Why Matters. Each idea must name one concrete PR, skill candidate, UI artifact, source set, or user task for the smallest validation, with success conditions, failure conditions, and observed metrics.
- Editor's note: include at least 5 paragraphs, roughly 15-20 lines of reading depth.
- フィードバック: keep the fixed feedback section and explain how to send feedback to Kizashi.
- No unresolved {{placeholders}} may remain in the final report.
- Run node scripts/validate-daily-report.js <report.html> before saying an HTML report is complete.
- Validator success is structural only. After validation, run editorial self-review before completion.
- Editorial self-review:
  - 読み筋: 今日のテーマから次アクションまで自然につながっているか。
  - 具体性: 抽象概念が現場の場面、失敗、判断に接続されているか。
  - 差分: 今日の source で何が新しく分かったかが明確か。
  - 判断可能性: 読者が次に何を見る/作る/検証するべきか分かるか。
  - 文章密度: 必須項目を埋めただけの説明になっていないか。
- If editorial self-review is weak, revise once, then run structural validation again.
- Japanese readability review:
  - 自然さ: 英語の計画文を直訳したような硬さがなく、ユーザー向けレポートとして読めるか。
  - 文の形: 1文が長すぎず、主張、根拠、含意が追いやすいか。
  - 具体語: 抽象語だけで進まず、場面、行為者、成果物、判断に接続しているか。
  - 接続: ただし、一方で、そのため、次に見るべきなのは、などの接続が自然か。
  - 表面品質: 助詞、同じ文末の連続、不自然なカタカナ語、名詞句の連結を整えているか。
  - If Japanese prose is stiff, machine-translated, too abstract, or hard to follow, revise wording once without weakening evidence or structure.
- Decision-log depth review after editorial self-review:
  - 周辺調査の厚み: 重要シグナルで source を列挙するだけでなく、公式 source 同士の差分、補完関係、矛盾、残る不確実性を書いているか。
  - 反証候補の具体性: どの条件なら仮説が弱まるか、または外部 artifact / ledger / skill / pipeline が不要になるかが次の観測に使える粒度か。
  - 次の検証の小ささ: artifact 名だけでなく、どの1 PR、どの1 skill candidate、どの1 UI artifact、どの1 source set、どの1 user task で試し、何を成功/失敗/指標として見るか。
  - If weak, do not rewrite the whole report. Augment only surrounding investigation, falsification conditions, and next validation conditions once, then run structural validation again.
- Social / secondary source review:
  - X / Reddit / Hatena / personal blog / roundup / bookmark / secondary introduction が重要シグナルになっている場合、元投稿またはリンク先、公式情報、関連一次情報を確認したか。
  - 二次情報を一次情報のように扱っていないか。
  - 確認できなかった場合、ログイン、削除、非公開、アクセス制限などの制約を明記したか。
  - ソース階層と主張ステータスが適切か。未確認 social source は observed または unverified として扱い、actionable claim にしない。
- Preserve source URLs whenever available.
- For important signals, perform scoped surrounding investigation before synthesis: related URLs, adjacent sources, official docs, past reports, existing wiki pages, and counter-signals.
- For Japanese reports, use "内部メモ" only when no external URL exists.
- Connect signals to past reports and existing knowledge when relevant, but do not force a connection.
- Store one-off user-provided ideas through the LLM Wiki ingest flow before using them in later reports.
- Handle "feedback this to Kizashi" requests through the Kizashi Feedback flow: update skill/templates/docs/source registry when the feedback changes behavior, or record it under <wiki>/raw/feedback/ when it is user-specific knowledge or preference.
-->
