# Sprint QA Automation Process — Template Spec

Full editable spec (10 sections, Action Center forms, queue schema, assets, test plan): https://claude.ai/code/artifact/ae6e298e-3891-435f-8360-2b8a0589ee94

| # | Section | Source of truth in this repo |
| --- | --- | --- |
| 1 | Template name | Sprint QA Automation Process |
| 2 | Business purpose | Jira sprint tickets → AI-generated Playwright tests → GitHub PR → GitHub Actions CI → failure triage → Jira bug + Bug Sheet → fix verification |
| 3 | Apps / connections | Jira (UIP @ codeninjapk.atlassian.net), GitHub, GitHub Actions, Microsoft Teams, Bug Sheet, UiPath AI Trust Layer |
| 4 | Projects / components | `uipath/bpmn`, `uipath/flow`, `agents/`, `rpa/README.md`, `orchestrator/` |
| 5 | BPMN flow + sticky notes | `uipath/bpmn/*.bpmn` (text annotations), `uipath/flow/*.definition.json` (`stickyNotes`) |
| 6 | Agent responsibilities | `agents/*/system-prompt.md`, `user-prompt.md`, `output-schema.json`, `agent.json` |
| 7 | RPA responsibilities | `rpa/README.md` |
| 8 | Inputs and outputs | `orchestrator/queue-QA_Tickets.schema.json`, `rpa/README.md` (CI contract) |
| 9 | Human-in-the-loop rules | `orchestrator/action-center-forms.json` — no auto-merge, no auto-close; S1/S2 and confidence < 0.7 go to a person |
| 10 | Error / fallback handling | BusinessRuleException → skip + Jira comment; SystemException → retry 3 → Teams escalation |

## Test plan — sample ticket UIP-773

[UIP-773](https://codeninjapk.atlassian.net/browse/UIP-773): checkout on https://www.saucedemo.com, 4 acceptance criteria → `tests/checkout/UIP-773.spec.ts`.

| # | Scenario | Expected |
| --- | --- | --- |
| 1 | Happy path | 4 tests generated, PR opened after approval, CI green, Teams "passed" card |
| 2 | Product bug | ProductBug, confidence ≥ 0.7 → Bug Report Agent → Jira Task labelled `bug` + Bug Sheet row |
| 3 | S1/S2 | Approve S1/S2 Bug task before Jira |
| 4 | Flaky | Jira Task, no bug |
| 5 | Low confidence | Review Low-Confidence Triage |
| 6 | Business rule (no AC) | Item skipped, Jira comment |
| 7 | System error (bad token) | 3 retries → Teams escalation |
| 8 | Rejected PR | Ends at Test PR Rejected |
| 9 | Verify pass | 10/10 runs → Verified → Confirm Ticket Closure |
| 10 | Verify fail | Reopened + Teams card |
