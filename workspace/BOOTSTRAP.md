# BOOTSTRAP.md — coFounder read protocol

**Purpose:** When a Claude Code session starts in any project under your coFounder workspace, this file documents what to read, in what order, to reach working context. It also documents the architecture decisions that make this protocol coherent.

**Audience:** Any Claude Code session launched inside the workspace. The workspace `CLAUDE.md` forwards here.

---

## Preconditions

**Launch from inside a specific project, not from the workspace root.** The workspace is a parent of all projects, not a project itself. Auto-memory is keyed to launch cwd, and starting from a parent directory scopes you away from project memories. Examples:

- Correct: `cd <WORKSPACE_DIR>/my-project && claude`
- Wrong: `cd <WORKSPACE_DIR> && claude`
- Wrong: `cd ~ && claude`

If a session has started at the wrong cwd, ask the user which project they intend and recommend relaunching from there before doing substantive work.

## The six-layer architecture

coFounder is a set of markdown files. Any Claude Code session in a coFounder project reads them at startup. Each layer serves a distinct persistence purpose.

| # | Layer | File | Scope | Purpose |
|---|-------|------|-------|---------|
| 1 | Identity / Personality | `PERSONALITY.md` | Workspace | User's working style — communication preferences, register, things to do and avoid, instance-naming convention. Project-agnostic. |
| 2 | Project Context | `PROJECT_CONTEXT.md` | Per project | Current state — what's built, what's decided, what's in scope, key terminology, audience, build stack. |
| 3 | Recent History | `SESSION_NOTES.md` | Per project | Append-only, absolute-dated rolling log of what was done, blocked, planned next. |
| 4 | Decision History | `DECISIONS.md` | Per project | Append-only log of meaningful decisions with reasoning. |
| 5 | Working Memory | `RESUMING.md` | Per project | What the previous session was actively in the middle of when it ended. Highest-priority file for resuming work. |
| 6 | Cross-Claude Protocol | `CROSS_CLAUDE_PROTOCOL.md` | Workspace | Standard format for communication between Claude instances when you relay decisions, context, or directives between them. Loaded automatically alongside `PERSONALITY.md`. |

## Read order at session start

The `SessionStart` hook in `~/.claude/settings.json` surfaces a directive listing files in this order:

1. `<project>/RESUMING.md` (Layer 5 — most current, read first)
2. `<WORKSPACE_DIR>/BOOTSTRAP.md` (this file)
3. `<WORKSPACE_DIR>/PERSONALITY.md` (Layer 1)
4. `<WORKSPACE_DIR>/CROSS_CLAUDE_PROTOCOL.md` (Layer 6, cross-Claude communication format)
5. `<WORKSPACE_DIR>/OPERATIONS.md` (workspace-level operations reference — machines, storage, backup posture, runbooks; **not a layer**)
6. `<WORKSPACE_DIR>/INCIDENT_LEARNINGS.md` (workspace-level reference — active workflow disciplines from past incidents; **not a layer**)
7. `<project>/PROJECT_CONTEXT.md` (Layer 2)
8. `<project>/SESSION_NOTES.md` (Layer 3 — paged Read for last 2–3 entries if file is long)
9. `<project>/DECISIONS.md` (Layer 4)

If a layer file doesn't exist for the current project, note its absence rather than skipping silently — the user may want to bootstrap that layer before work continues.

### Cross-instance relay inbox (optional convention)

If you adopt a multi-instance setup (e.g., a persistent Claude Desktop conversation alongside one or more Claude Code sessions), consider creating an `inbox/` directory at one of your project roots as a cross-instance asynchronous relay. Each relay file's header documents what it carries; archive acted-on relays to `inbox/archive/`. Useful when paste-relay isn't possible (the sending instance closes terminal before the receiving instance launches; or you need the relay to persist in version-controlled form). After the layer reads, a session can check the inbox for any pending relays before starting substantive work.

Lightweight convention, not a feature — adopt if useful, skip if you only use one instance.

### Session close-out: `/close` slash command (recommended)

When a session is wrapping up, Claude tends to default to "iterative close" — declares done, user asks "anything else?", Claude finds something, repeat. To make close-out deterministic, add a `/close` slash command at `~/.claude/commands/close.md` that instructs Claude to run a single comprehensive scan in parallel rather than iterating.

A reasonable starting prompt for the slash command:

> Re-read `INCIDENT_LEARNINGS.md` first (in case rules were added or refined this session).
>
> **Step 0 — Apply Session Integrity Protocols throughout the scan.** Spirit: proactive surfacing (notice cross-pollination opportunities); comprehensive close ("here's everything I found," not iterative); recognize failure modes by name; meta-test ("is the user doing work I should be doing?"); retrospective surfacing (items raised in conversation but not resolved).
>
> **Step 1 — Build a change-list (mandatory pre-scan).** Without an explicit list, the subsequent checks become memory-driven spot-checks that miss things. Enumerate:
>
> - **A. New artifacts created** — full paths of new files (decisions, ideas, questions, risks, reasoning, slash commands, scripts, docs, inbox relays, memory files).
> - **B. Existing artifacts substantively updated** — full paths of files with material content changes (not typo fixes).
> - **C. Values that changed** — numbers, identifiers, commit hashes, counts, paths, status markers that took new values. Each entry is a **literal search string** to grep for (e.g., "8-category" if a rule count went 8 → 9; "<old-commit-hash>" if a repo moved past; "<RC-id> active" if status became resolved).
> - **D. Status transitions** — items whose status changed; each lists old-status phrase + new-status phrase.
>
> **Step 2 — Run categories in PARALLEL, using the change-list as input.** In one message with parallel tool calls (do NOT serialize):
>
> 1. Git state — working tree clean, commits made, pushed to origin.
> 2. **Cross-file consistency (PRESCRIPTIVE)** — for each value in change-list C and each old-status phrase in D, run literal `grep -rn "<value>"` across the workspace. Fix stale references. No memory-driven spot-checks.
> 3. Any "in flight: X" notes in `RESUMING.md` un-removed.
> 4. Conversation-only artifacts + persistent-but-unprocessed (`inbox/` files acted-on but not archived).
> 5. Background processes Claude started — cleaned up.
> 6. Unanswered questions Claude asked — pending response.
> 7. Cross-project directives in other projects' `RESUMING.md` / recent `SESSION_NOTES.md`.
> 8. Memory-write evaluation — did the user correct your approach in a way applicable to future sessions?
> 9. **Cross-reference integrity (PRESCRIPTIVE)** — for each artifact in change-list A and B, check (a) forward refs exist + canonical, (b) reciprocal back-references on referenced artifacts, (c) hub/index page inclusion, (d) status-section-header sync, (e) status-snapshot drift.
>
> **Step 3 — Report as a table** (rows = change-list items, columns = categories, cells = "checked clean ✓" or "found stale, fixed: <details>"). **Don't claim "clean" until every row × relevant column has been processed** — the table is the mechanical guard against FM-02 (confident assurance based on incomplete check). Don't add new rules during `/close`.

Build the command, commit it to your `~/.claude/commands/` directory, and use `/close` instead of asking "what's left?" verbally. The slash command makes the close-out checklist mechanical rather than dependent on Claude remembering to apply it. The Step 0 section above adds Session Integrity Protocols on top of the mechanical scan — the categories cover *what* to check; Step 0 covers *how* to check (proactive, comprehensive, self-aware, absorbing-not-deferring).

### Adversarial code review: persona-based slash commands (optional)

For projects with substantial code changes worth a thorough review before commit, build a persona-based adversarial reviewer slash command at `~/.claude/commands/<reviewer-name>-review.md`. The persona acts as a senior engineer with a specific lens (correctness, security, performance, accessibility, API design) and produces structured output (severity-tiered findings, refactored code, scored verdict). The friendly-default review pattern misses things the adversarial persona catches.

A reasonable starting prompt for an adversarial reviewer slash command:

> You are a Principal Staff Software Engineer with 20+ years of experience. You're reviewing the changes I'm about to share. Your standards are high; you don't sugarcoat. Output structure (required headings):
>
> - **Summary** — one-paragraph diagnosis
> - **Critical** — must-fix before merge (correctness, security, data integrity)
> - **Important** — should-fix soon (robustness, maintainability, performance)
> - **Polish** — nice-to-have (style, naming, micro-clarity)
> - **Refactored** — show the code as you would write it
> - **Final Score (/10)** — calibrated; 7+ is shippable, 5–6 is "fix before ship," <5 is "rework"
>
> Don't soften severity. If the code is wrong, say so. If it's good, say that too.

Build per lens — one slash command per persona. Common lenses to consider as the family grows: general code quality, security review, performance review, accessibility review, API design review. Each lives at `~/.claude/commands/<name>-review.md` and is invoked as `/<name>-review` from any session.

Pairs with the `/close` pattern above (deterministic protocol enforcement at session boundaries) — both are slash-commands-as-discipline. The pattern composes: project-specific tool slash commands + `/close` for end-of-session integrity + adversarial reviewers for change-quality gates.

### Workspace-level files: layer vs reference

Workspace-level files split into two kinds:

- **Layers** — `PERSONALITY.md` (Layer 1) and `CROSS_CLAUDE_PROTOCOL.md` (Layer 6). Each occupies one of the six conceptual roles in the architecture table above.
- **References** — `PATTERNS.md`, `TOOLBOX.md`, `OPERATIONS.md`, and `INCIDENT_LEARNINGS.md`. Each catalogs information the layers draw on (cross-project patterns, non-Claude tools, operational context, post-incident workflow disciplines).

**Placement rule:** A file is a **layer** if it occupies one of the six conceptual roles. A file is a **reference** if it catalogs information the layers draw on. Load mechanism (session-start vs on-demand) is configured per-file based on access patterns, and is **independent** of layer/reference status. OPERATIONS and INCIDENT_LEARNINGS are session-start because their content shapes how every session reasons (operational context for the former; active workflow disciplines for the latter); PATTERNS and TOOLBOX are on-demand because their value is bursty (consulted when a specific trigger fires) and pre-loading would dilute the session-start cost/benefit. Future additions choose load mechanism on the same access-pattern basis without changing layer/reference status.

## On-demand reads

Some files at workspace root sit outside the session-start read order but should be consulted when specific triggers fire:

- **`PATTERNS.md`** — cross-project pattern transfer wisdom (architectural patterns worth surfacing, process discipline that transfers, things that don't, recurring mistakes). Consult when:
  - User starts work on a new project under the workspace
  - User asks "scan [Project] for [X]" or otherwise asks for transfer candidates between projects
  - You're about to recommend an architectural choice for a new or stub project and want to check what patterns have already been validated elsewhere
  - **Do not read at session start** — pre-loading on every session would dilute the cost/benefit of the layered reads.

- **`TOOLBOX.md`** — non-Claude AI tools catalog (image gen, video gen, voice/music, real-time data, other capabilities outside Claude's strength). Consult when:
  - User requests a capability another AI serves better
  - You'd otherwise say "I can't do that" or "this isn't something I'm good at" as a first move — check `TOOLBOX.md` first to see if there's a pointer to a tool that can
  - **Do not read at session start** — same rationale as `PATTERNS.md`.

## Architecture decision: thin `CLAUDE.md`, named-layer files hold substance

Claude Code's hardcoded convention is that `CLAUDE.md` files in the cwd cascade auto-load at session start. coFounder uses this convention as the *trigger* for the bootstrap protocol, not as a parallel home for project state:

- **Workspace-level `<WORKSPACE_DIR>/CLAUDE.md`** — thin forwarder. Points at this file and `PERSONALITY.md`.
- **Per-project `CLAUDE.md`** — thin forwarder. Points at this file and the project's `PROJECT_CONTEXT.md`.
- **`PERSONALITY.md`, `PROJECT_CONTEXT.md`, `DECISIONS.md`, `SESSION_NOTES.md`, `RESUMING.md`** — substantive content, owned by their respective layer.

**Why:** rule-revisability. If working-style content lives in two homes (`PERSONALITY.md` and umbrella `CLAUDE.md`), every rule has to be edited in two places, and the files drift. One home per rule.

## Update protocols per layer

- **`PERSONALITY.md`** — updated rarely. Only when working-relationship patterns meaningfully shift.
- **`PROJECT_CONTEXT.md`** — updated when project state changes meaningfully (major decisions, phase transitions, scope changes).
- **`SESSION_NOTES.md`** — append-only. Same-day saves. Absolute dates. Written before context pressure ends a session.
- **`DECISIONS.md`** — append-only. Written when meaningful decisions are made.
- **`RESUMING.md`** — updated at the end of each session or when work shifts mid-session. Should answer: "If a new session starts right now, what should it know to continue this work?"
- **`CROSS_CLAUDE_PROTOCOL.md`** — living document. Updated when you (or Claude) identify gaps or refinements in the cross-instance communication format.

## Rule-revisability is first-class

Rules in any layer must be **revisable, not just additive.** A persistence system that only accumulates rules will calcify wrong rules alongside right ones. Every rule should be:

- **Testable** — what evidence would falsify this?
- **Dated** — so age is visible
- **Revisable** by any session, not just a privileged authoring path

If a rule doesn't survive contact with reality, kill it. Don't just add a new one alongside it.

## SessionStart hook (active)

The hook script at `~/.claude/cofounder-session-start.sh` (registered in `~/.claude/settings.json`) auto-fires on every Claude Code session launched inside the workspace. Its output is a small directive (~1.5KB for the current 9-read directive) injected silently into the model's `additionalContext` block — not rendered as user-visible text. The hook surfaces a directive listing the workspace + project reads; Claude reads each via the Read tool before substantive work.

**Why a directive, not inlined content:** Claude Code offloads `additionalContext` payloads above ~10K characters to a file rather than inlining them. Inlining all the layer files would exceed that threshold. The pure-pointer design (~1.5KB at 9 reads, scales with reference count not file size) stays well under and shifts the read cost onto explicit Read tool calls at session start.

**Outside the workspace:** the hook falls back to inlining `RESUMING.md` if it exists at the launched cwd, silent otherwise. Preserves expected hook behavior for any non-workspace projects.
