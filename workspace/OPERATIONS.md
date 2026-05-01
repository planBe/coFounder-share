# OPERATIONS.md — Solo-founder IT, captured as it surfaces

**Purpose:** Workspace-level record of personal-operations context — machines, storage volumes, backup posture, runbooks built from real incidents. Not project-scoped. Sibling to `PERSONALITY.md`, `BOOTSTRAP.md`, `PATTERNS.md`, `CROSS_CLAUDE_PROTOCOL.md`.

**Loading:** Session-start. Surfaced by the SessionStart hook directive at position 5, between `CROSS_CLAUDE_PROTOCOL.md` and the project's `PROJECT_CONTEXT.md`. Workspace-level reads stay grouped before per-project reads.

**Note on architecture:** `OPERATIONS.md` is hooked at session-start but **is not formally Layer 7** in the current six-layer architecture. It's a workspace-level reference — same shape as `PATTERNS.md` and `TOOLBOX.md` — that happens to be session-start rather than on-demand. Whether to formalize as Layer 7 is a deferred architectural call.

**This file is incident-driven and append-only** — same shape as `DECISIONS.md`. Don't preemptively outline categories. Don't sketch what a "comprehensive" version should contain. Each addition should be earned by something that actually happened.

---

## Current state

Updated when state actually changes; not a comprehensive system inventory.

**Machines**

*(empty — populate as you inventory machines that matter for your work, and only when their state becomes load-bearing for a decision or incident)*

**Storage volumes**

*(empty — populate when storage layout becomes load-bearing)*

**Backup strategy**

*(empty — populate when you assess your backup posture, ideally driven by an incident or audit you did)*

## Runbooks

*(empty — add runbooks earned by real incidents. For each: what happened, what was tried, what worked, what to do next time.)*

## Incident log

*(empty — append incidents with absolute dates as they occur. For each: date, what failed, root cause, resolution, what was learned.)*

## How this file gets updated

`OPERATIONS.md` is updated when:

- An incident reveals operational state you didn't have written down (machine inventory gap, backup hole, surprise dependency).
- A runbook proves itself by working through a recurring kind of problem.
- Operational state changes meaningfully (new machine, retired hardware, storage layout shift).

Don't preemptively populate sections — the file's value is in incident-captured content, not pre-planned categories. Empty is meaningful: it means nothing has happened yet that warranted writing down.

## Version history

- **[YYYY-MM-DD]** — initial fill from coFounder template.
