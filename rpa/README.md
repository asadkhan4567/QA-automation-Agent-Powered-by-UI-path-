# RPA workflows

All performers follow REFramework (Init → Get Transaction → Process → End). Config comes only from Orchestrator Assets (`orchestrator/assets.json`). Each workflow exposes `in_Action`, `in_Payload` (JSON), `out_Result` (JSON) and `out_Status`.

| Workflow | Key activities | In | Out (`out_Result`) |
| --- | --- | --- | --- |
| RPA Workflow to Fetch Sprint QA Tickets | Jira Search by JQL (`project = UIP AND sprint in openSprints() AND labels = QA`, or `status = Fixed AND labels = qa-auto` in verify mode); validate acceptance criteria + repo mapping; Add Queue Item `QA_Tickets` (Reference = issue key) | `in_Mode`, `in_Jql` | `{ tickets[], skipped_keys[] }` |
| RPA Workflow to Commit Tests and Open PR | GitHub REST: `GET /git/ref/heads/main` → `POST /git/refs` (`qa/<KEY>`) → `PUT /contents/{spec_path}` (base64) → `POST /pulls` (never merged automatically) | `in_TicketKey`, `in_SpecPath`, `in_SpecFile` | `{ pr_url, pr_number, branch, commit_sha }` |
| RPA Workflow to Trigger and Monitor CI | `POST /actions/workflows/qa-e2e.yml/dispatches` with `grep`, `repeat_each`, `retries`, `base_url`, `run_ref`; poll `/actions/runs` every 30 s (timeout 30 min); download artifact `results`; parse `results.json` | `in_Branch`, `in_Grep`, `in_RepeatEach`, `in_Retries`, `in_BaseUrl`, `in_RunRef` | `{ passed, run_id, run_url, stats, failures[] }` |
| RPA Workflow to Create Jira Bug and Update Bug Sheet | Create issue (UIP has no Bug type → Task + label `bug`); link to story; add evidence URLs; transition (Verified / Reopened) in verify mode; append Bug Sheet row | `in_Mode`, `in_IssueType`, `in_Bugs`, `in_Transition` | `{ created_keys[], sheet_rows[] }` |
| RPA Workflow to Send Teams Notification | Post Adaptive Card to `Teams_Channel`; escalation card on SystemException | `in_Type`, `in_Payload` | `{ message_id }` |

## Exceptions

- **BusinessRuleException**: ticket has no acceptance criteria, or no repo mapping → skip the item, queue status Failed (Business), Jira comment explaining what is missing.
- **SystemException**: Jira / GitHub API error, CI timeout, LLM error or invalid JSON → retry 3 (queue retry, 30 s backoff), then a Teams escalation card.

## CI contract

`results.json` is Playwright's JSON reporter output (`test-results/results.json`), uploaded as artifact `results` by `.github/workflows/qa-e2e.yml`. `passed` = `stats.unexpected == 0`.
