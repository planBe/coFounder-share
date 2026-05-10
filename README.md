# coFounder — public share (persistence layer)

This is the **persistence-layer half** of coFounder — a layered-context filesystem architecture for Claude Code, designed so working-style, project state, and cross-instance relay context survive crashes, session boundaries, and instance switches. Originally built for one solo founder's workflow, now shared with anyone who'd find it useful.

(coFounder also has a productized "agentic OS" half — apps, personas, vision, community — which lives elsewhere and isn't included in this share. This repo is the foundation that productized half builds on.)

## What it is

A set of markdown files at your workspace root and inside each project directory. A `SessionStart` hook in `~/.claude/settings.json` surfaces a directive at every session start listing the layer files in read order; Claude reads each via the Read tool before substantive work. The result: every Claude Code session you launch in a project under your coFounder workspace starts with full context (your working style, the project's current state, recent work, decisions, where you left off, plus active workflow disciplines and operational context) without you having to manually re-prime.

## What you get

- A **workspace template** (`workspace/`) with eight workspace-level files: `PERSONALITY.md` (Layer 1), `CROSS_CLAUDE_PROTOCOL.md` (Layer 6), `BOOTSTRAP.md` (read protocol), `PATTERNS.md`, `TOOLBOX.md`, `OPERATIONS.md`, `INCIDENT_LEARNINGS.md`, and a thin `CLAUDE.md` cascade entry.
- **Project-level templates** (`project-templates/`) for the per-project layer files: `PROJECT_CONTEXT.md` (Layer 2), `SESSION_NOTES.md` (Layer 3), `DECISIONS.md` (Layer 4), `RESUMING.md` (Layer 5), and a thin `CLAUDE.md`.
- A **home stub template** (`home-stub-CLAUDE.md`) to drop at `~/CLAUDE.md` if you want a wrong-place-to-launch guardrail.
- The **`SessionStart` hook script** (`cofounder-session-start.sh`) that surfaces the bootstrap directive at session start (~1.5KB, well under Claude Code's ~10K offload threshold).
- `SETUP.md` walking you through manual installation (~20–30 minutes if you're already a Claude Code user).

## Two things this system asks Claude to do

- **Verify its own work.** Before non-trivial work, Claude describes how it would check the output; after, it runs the check. You can disable this if you want (edit `PERSONALITY.md` and remove "Verification discipline"), but it makes Claude noticeably more reliable.
- **Don't fake capabilities.** The cross-Claude protocol explicitly forbids Claude Desktop from claiming to have written files (it can't) — drafts go through you to a Code Claude that can. Adopters with multi-instance setups especially benefit from this rule; single-instance users still benefit from the broader principle ("don't pretend to capabilities you don't have").

## What it's not

- **Not a product.** No support, no feature requests, no shipped updates. Repo is maintained as the source workspace evolves; you're welcome to clone, fork, or ignore.
- **Not an onboarding for Claude Code itself.** This share is for someone who already uses Claude Code.
- **Not the productized "agentic OS" half of coFounder.** That's a separate (mid-design) effort with apps, personas, vision, community. This share is the persistence-layer foundation it builds on.
- **Not customized for you.** Templates have placeholders. Fill in your bio, working style, project list, conventions — make it yours.

## Make it yours

If you want something different — different file structure, different read order, different conventions — **fork it**. Don't ask me to change the repo. Forking is the right path; I want you to make it your own, not get stuck waiting on me. If you've got a way to generically improve it for everyone, drop me a note: `michael@planbecreative.com`.

## Context for Claude Code users

This relies on Claude Code's `SessionStart` hook + `additionalContext` mechanism. The hook surfaces a small directive (~1.5KB at the current 9-read count); it does **not** auto-load the layer files inline because Claude Code has a ~10K-character offload threshold I hit while building it. The pattern that works is "directive + Read tool calls" — Claude reads each file at session start instead of getting them inline. If you're new to Claude Code hooks, `SETUP.md` walks through the install.

## License

MIT. See `LICENSE`. Use it however you want.

---

*Built by Michael Wild · planBe Creative · 2026. Sharing because someone might find it useful, and because the validation + cross-pollination from other builders' adaptations is itself worth the maintenance overhead.*
