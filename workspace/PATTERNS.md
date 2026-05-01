# PATTERNS.md — Cross-project pattern transfer

**Purpose:** Workspace-level knowledge about which patterns transfer between your projects, which don't, and which kinds of mistakes recur. Consulted on demand, not at session start.

**Loading:** This file sits outside the session-start read order. Triggers in `BOOTSTRAP.md` "On-demand reads" — summarized: starting a new project, "scan [Project] for [X]" requests, or before recommending an architectural choice for a new/stub project.

---

## How to use this file

When a trigger fires, read this file, surface the patterns that might be borrowable, and let the user pick. The goal is *deliberate borrowing*, not bulk copying — surface candidates, name what's similar and what's different, and wait for direction.

When new patterns prove themselves in a project, add them here so the next project can benefit. The validation bar is "this worked, in production, for at least one project" — not "this seems like a good idea."

## Architectural patterns worth surfacing

*(Empty by default. Add patterns as they prove themselves in your projects. For each, include: the pattern, the project where it was validated, the date, and when it might apply elsewhere.)*

## Process discipline that always transfers

These transfer to every project — they're not architectural choices, they're operating discipline. Apply by default in new projects:

- **`RESUMING.md` + `SESSION_NOTES.md` pattern** — Layers 5 + 3 of coFounder. Same conventions across all projects: append-only `SESSION_NOTES.md`, durable letter-to-next-Claude in `RESUMING.md`, both updated same-day not at session ends.
- **Hook setup** — `SessionStart` hook for the layered bootstrap. Optional `Stop` / `SessionEnd` hooks for continuity reminders.
- **Careful diagnosis when something breaks** — find the actual bad token. Don't ban character classes as a substitute for finding the cause. Diagnose first; ban second (if at all).

## Patterns that don't transfer

These are project-specific by design. Don't bulk-copy across projects even when shape looks similar:

- **Business domain** — different products have different domain models.
- **Database schema** — derived from domain, also project-specific.
- **Privacy invariants** — project-specific based on stakeholders and access patterns.
- **UI flows** — derived from audience and use case, project-specific.

[Add other categories that don't transfer between your specific projects.]

## Recurring mistakes to watch for

Patterns of *failure* that have shown up more than once and warrant active vigilance:

- **Pattern-matching diagnosis** — the impulse to ban a character class, file pattern, or syntax category in response to a bug, instead of running real diagnostic moves (parse-check, hex-dump, git-diff, console error + line number). Mitigation: ask for the actual error and line number first, before describing what visually changed.
- **Rule propagation without falsification** — when a rule lands in a file, it propagates to other files before anyone has tested whether it's true. Mitigation: rule-revisability is a first-class principle (see `BOOTSTRAP.md`); any rule should be testable, dated, and revisable.
- **Validation can verify the bash side, not the harness side.** A pre-write validation pipeline can confirm a hook script produces well-formed output of a known size. It cannot verify how Claude Code's harness handles that output — size thresholds, offload behavior, parsing quirks, version-specific changes. Production verification is the only check that surfaces harness-layer failures. When modifying any `settings.json` hook or other harness-touching configuration, treat production verification as load-bearing — don't conflate "pre-write validation passed" with "will work in production."

- **Harness output-capture failures can look like disk-full when the actual disk has plenty of space.** Claude Code's Bash tool captures command stdout/stderr to a file under `/private/tmp/claude-501/<session>/tasks/`. If that capture fails with `ENOSPC: no space left on device`, the obvious read is "disk full — restart to free space." But the actual disk may be fine; the constraint can be transient and specific to the harness's tmp area. **Mitigation:** when `ENOSPC` shows up in tool output, run `df -h /` (and `df -h /tmp`) before treating it as a disk-full event. The path in the error message tells you what was being written — if it's an internal harness path (`/private/tmp/claude-501/...`), the real disk is likely fine and the condition may clear on its own. **Falsification check:** if `df -h /` shows abundant free space, the "restart to free disk" diagnosis is wrong; investigate the harness path instead.

[Add other recurring mistakes you encounter.]

## How this file gets updated

`PATTERNS.md` is updated when:
- A pattern proves itself in a project and is worth surfacing for future projects.
- A pattern of failure recurs and is worth flagging.
- A pattern is falsified or stops being applicable (revise or remove).

When patterns are added, include the project they were validated in and the date. When patterns are removed or revised, note the change in the version history below.

## Version history

- **[YYYY-MM-DD]** — initial fill from coFounder template.
