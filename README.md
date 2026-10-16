# QA Automation Agent — powered by UiPath Maestro

**Sprint QA Automation Process**: Jira sprint tickets → AI-generated Playwright tests → GitHub PR → GitHub Actions CI → failure triage → Jira bug + Bug Sheet → fix verification.

QA SOP stages: **Design → Automate → Review → Run in CI → Triage → Report → Verify**. Nothing is merged or closed automatically; people approve test PRs, S1/S2 bugs, low-confidence triage and ticket closure.

## Two versions

| Version | Studio Web solution | Source in this repo |
| --- | --- | --- |
| Agentic Process (BPMN) | `Sprint QA Automation Process` | `uipath/bpmn/SprintQAAutomationProcess.bpmn`, `uipath/bpmn/VerifyFixedBugs.bpmn` |
| Maestro Flow (inline agents) | `Sprint QA Automation Process 1` | `uipath/flow/Main.flow.definition.json`, `uipath/flow/VerifyFixedBugs.flow.definition.json` |

Import the `.bpmn` files with Studio Web → BPMN → *upload*. The flow definitions list every node, port, branch expression and prompt reference used in Studio Web.

## Repository layout

```
agents/                    3 agents: system/user prompts, output schemas, config
  test-design-scaffold-agent/   Design → Automate → Review
  failure-triage-agent/         Triage mode + Verify mode
  bug-report-agent/             Report
uipath/bpmn/               Agentic Process (BPMN) diagrams
uipath/flow/               Maestro Flow definitions
orchestrator/              Assets, queue schema, Action Center forms, triggers
rpa/                       RPA workflow specs (REFramework performers)
pages/ tests/              Playwright TypeScript suite (Page Object Model)
.github/workflows/qa-e2e.yml   CI called by the "Trigger and Monitor CI" step
docs/template-spec.md      Full template spec (10 sections + test plan)
```

## Run the tests

```bash
npm install
npx playwright install chromium
npm test                     # full suite
npx playwright test --grep @checkout --repeat-each=10 --retries=0   # fix-verification style
```

`BASE_URL` defaults to the public demo app https://www.saucedemo.com (sample ticket **UIP-773**).

## Trigger CI the way Maestro does

```bash
curl -X POST -H "Authorization: Bearer $GITHUB_TOKEN" -H "Accept: application/vnd.github+json" \
  https://api.github.com/repos/asadkhan4567/QA-automation-Agent-Powered-by-UI-path-/actions/workflows/qa-e2e.yml/dispatches \
  -d '{"ref":"main","inputs":{"grep":"@UIP-773","repeat_each":"1","base_url":"https://www.saucedemo.com","run_ref":"UIP-773"}}'
```

The run uploads artifact **`results`** (`results.json`), which the Failure Triage Agent reads.

## Setup checklist (UiPath)

1. Integration Service connections: Jira, GitHub, Microsoft Teams.
2. Orchestrator assets and queue: see `orchestrator/assets.json`, `orchestrator/queue-QA_Tickets.schema.json`.
3. Time triggers: main every 2 h, verification daily (`orchestrator/triggers.json`).
4. Secrets (`GitHub_Token`, `Jira_Credential`, `Anthropic_Key`) are set in Orchestrator only, never committed.
